const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const models = require("../../models");
const { 
  createError, 
  requireAuth, 
  requireRole, 
  handleDatabaseError 
} = require("../../lib/errors");

// JWT Secret 설정 - index.js와 동일하게 설정
const JWT_SECRET = process.env.JWT_SECRET || "lngw2025_super_secret_key_for_jwt_tokens_2024";

// ====================
// 유효성 검사 헬퍼 함수
// ====================
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const authResolvers = {
  User: {
    experiences: async (parent) => {
      return await models.Experience.findAll({
        where: { userId: parent.id },
        order: [["createdAt", "DESC"]],
      });
    },
    // parent.joinDate가 문자열(예: "2025-06-04")로 올 때, Date 객체로 변환하여 반환
    joinDate: (parent) => {
      // null 혹은 undefined 체크
      if (!parent.joinDate) return null;
      return new Date(parent.joinDate);
    },

    // parent.birthDate가 문자열(예: "1990-01-15")로 올 때, Date 객체로 변환하여 반환
    birthDate: (parent) => {
      if (!parent.birthDate) return null;
      return new Date(parent.birthDate);
    },
  },

  Query: {
    me: async (_, __, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const userData = await models.User.findByPk(user.id, {
          include: [
            {
              model: models.EmergencyContact,
              as: "emergencyContact",
            },
            {
              model: models.Skill,
              as: "skills",
            },
            {
              model: models.Experience,
              as: "experiences",
            },
          ],
        });

        if (!userData) {
          throw createError("USER_NOT_FOUND", lang);
        }

        return userData;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "USER_NOT_FOUND");
      }
    },

    employees: async (_, { filter }, { user, lang }) => {
      requireAuth(user, lang);
      
      try {
        const where = {};
        
        if (filter?.search) {
          where[models.Sequelize.Op.or] = [
            { name: { [models.Sequelize.Op.like]: `%${filter.search}%` } },
            { email: { [models.Sequelize.Op.like]: `%${filter.search}%` } },
            { department: { [models.Sequelize.Op.like]: `%${filter.search}%` } },
          ];
        }

        if (filter?.role) {
          // SALES 역할 필터링 시 department가 'Sales'인 사용자 찾기
          if (filter.role === 'SALES') {
            where.department = 'Sales';
          } else {
            where.role = filter.role;
          }
        }

        if (filter?.department) {
          where.department = filter.department;
        }

        const employees = await models.User.findAll({
          where,
          include: [
            {
              model: models.Experience,
              as: "experiences",
              order: [["createdAt", "DESC"]],
            },
          ],
          order: [["name", "ASC"]],
        });

        return employees;
      } catch (error) {
        handleDatabaseError(error, lang, "EMPLOYEES_FETCH_FAILED");
      }
    },
  },

  Mutation: {
    register: async (_, { input }, { lang }) => {
      try {
        const {
          email,
          password,
          confirmPassword,
          phoneCountry,
          emergencyContact = [],
          skills = [],
          experiences: experienceData = [],
          ...userData
        } = input;

        // 이메일 유효성 검사
        if (!validateEmail(email)) {
          throw createError("INVALID_EMAIL", lang);
        }

        // 비밀번호 유효성 검사
        if (!validatePassword(password)) {
          throw createError("WEAK_PASSWORD", lang);
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
          throw createError("PASSWORD_MISMATCH", lang);
        }

        // 기존 사용자 확인
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
          throw createError("USER_ALREADY_EXISTS", lang);
        }

        // 비밀번호 해시
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 데이터 정리
        const cleanUserData = {
          email,
          password: hashedPassword,
          name: userData?.name,
          department:
            userData?.department === "other"
              ? userData?.otherDepartment
              : userData?.department,
          position: userData?.position,
          employeeId: userData?.employeeId,
          joinDate: userData?.joinDate,
          phoneNumber: userData?.phoneNumber,
          address: userData?.address,
          nationality: userData?.nationality,
          birthDate: userData?.birthDate,
          visaStatus: userData?.visaStatus,
          role: "editor", // 기본 역할
        };

        // 새 사용자 생성
        const user = await models.User.create(cleanUserData);

        // 관련 데이터 생성
        if (emergencyContact && emergencyContact.length > 0) {
          await models.EmergencyContact.bulkCreate(
            emergencyContact.map((contact) => ({
              ...contact,
              userId: user.id,
            })),
          );
        }

        if (skills && skills.length > 0) {
          await models.Skill.bulkCreate(
            skills.map((skill) => ({
              ...skill,
              userId: user.id,
            })),
          );
        }

        // 경험 데이터 생성
        if (experienceData && experienceData.length > 0) {
          const experiencesToCreate = experienceData.map((exp) => ({
            company: exp.company,
            position: exp.position,
            period: exp.period,
            description: exp.description,
            userId: user.id,
          }));

          await models.Experience.bulkCreate(experiencesToCreate);
        }

        // JWT 토큰 생성
        const expiresIn = input.rememberMe ? '30d' : '7d';
        const token = jwt.sign(
          { userId: user.id, email: user.email, rememberMe: input.rememberMe },
          JWT_SECRET,
          { expiresIn }
        );

        return {
          token,
          user,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "REGISTRATION_FAILED");
      }
    },

    login: async (_, { input }, { lang }) => {
      try {
        const { email, password, rememberMe } = input;

        // 이메일 유효성 검사
        if (!validateEmail(email)) {
          throw createError("INVALID_EMAIL", lang);
        }

        const user = await models.User.findOne({
          where: { email },
          include: [
            {
              model: models.Experience,
              as: "experiences",
              order: [["createdAt", "DESC"]],
            },
          ],
        });

        if (!user) {
          throw createError("INVALID_CREDENTIALS", lang);
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw createError("INVALID_CREDENTIALS", lang);
        }

        // JWT 토큰 생성
        const expiresIn = rememberMe ? "30d" : "7d";
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn },
        );

        return {
          token,
          user,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "LOGIN_FAILED");
      }
    },

    updateUserProfile: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const { emergencyContact, skills, ...userData } = input;

        // 사용자 기본 데이터 업데이트
        const allowedFields = [
          "name",
          "phoneNumber",
          "address",
          "nationality",
          "department",
          "position",
          "employeeId",
          "joinDate",
          "birthDate",
          "visaStatus",
          "avatar",
        ];

        const updates = {};
        allowedFields.forEach(field => {
          if (userData.hasOwnProperty(field)) {
            updates[field] = userData[field];
          }
        });

        await models.User.update(updates, {
          where: { id: user.userId },
        });

        // 비상 연락처 업데이트
        if (emergencyContact !== undefined) {
          await models.EmergencyContact.destroy({
            where: { userId: user.userId },
          });
          if (emergencyContact.length > 0) {
            await models.EmergencyContact.bulkCreate(
              emergencyContact.map((contact) => ({
                ...contact,
                userId: user.userId,
              })),
            );
          }
        }

        // 스킬 업데이트
        if (skills !== undefined) {
          await models.Skill.destroy({
            where: { userId: user.userId },
          });
          if (skills.length > 0) {
            await models.Skill.bulkCreate(
              skills.map((skill) => ({
                ...skill,
                userId: user.userId,
              })),
            );
          }
        }

        const updatedUser = await models.User.findByPk(user.userId, {
          include: [
            {
              model: models.Experience,
              as: "experiences",
              order: [["createdAt", "DESC"]],
            },
            { model: models.Skill, as: "skills" },
            { model: models.EmergencyContact, as: "emergencyContact" },
          ],
        });

        if (!updatedUser) {
          throw createError("USER_NOT_FOUND", lang);
        }

        return updatedUser;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "PROFILE_UPDATE_FAILED");
      }
    },

    verifyCurrentPassword: async (_, { currentPassword }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const userData = await models.User.findByPk(user.userId);
        if (!userData) {
          throw createError("USER_NOT_FOUND", lang);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
        return isPasswordValid;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    changePassword: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const { currentPassword, newPassword } = input;
        
        // 새 비밀번호 유효성 검사
        if (!validatePassword(newPassword)) {
          throw createError("WEAK_PASSWORD", lang);
        }
        
        const userData = await models.User.findByPk(user.userId);
        if (!userData) {
          throw createError("USER_NOT_FOUND", lang);
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
        if (!isCurrentPasswordValid) {
          throw createError("INCORRECT_CURRENT_PASSWORD", lang);
        }

        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await models.User.update(
          { password: hashedNewPassword },
          { where: { id: user.userId } }
        );

        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "PASSWORD_CHANGE_FAILED");
      }
    },
  },
};

module.exports = authResolvers;