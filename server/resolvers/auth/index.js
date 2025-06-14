const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("../../models");
const { createError, requireAuth, requireRole, handleDatabaseError } = require("../../lib/errors");

// JWT Secret 설정 - index.js와 동일하게 설정
// const JWT_SECRET = process.env.JWT_SECRET || "lngw2025_super_secret_key_for_jwt_tokens_2024";
const JWT_SECRET = "lngw2025_super_secret_key_for_jwt_tokens_2024_strict"; // 디버깅을 위한 고정 값

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
        const currentUser = await models.User.findByPk(user.id, {
          include: [
            {
              model: models.Skill,
              as: "skills",
            },
            {
              model: models.EmergencyContact,
              as: "emergencyContact",
            },
            {
              model: models.Experience,
              as: "experiences",
            },
          ],
        });

        if (!currentUser) {
          throw createError("USER_NOT_FOUND", lang);
        }

        return currentUser;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "USER_FETCH_FAILED");
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
          if (filter.role === "SALES") {
            where.department = "Sales";
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
        const { email, password, confirmPassword, phoneCountry, emergencyContact = [], skills = [], experiences: experienceData = [], ...userData } = input;

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
          department: userData?.department === "other" ? userData?.otherDepartment : userData?.department,
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
        const newUser = await models.User.create(cleanUserData);

        // 관련 데이터 생성
        if (emergencyContact && emergencyContact.length > 0) {
          await models.EmergencyContact.bulkCreate(
            emergencyContact.map((contact) => ({
              ...contact,
              userId: newUser.id,
            }))
          );
        }

        if (skills && skills.length > 0) {
          await models.Skill.bulkCreate(
            skills.map((skill) => ({
              ...skill,
              userId: newUser.id,
            }))
          );
        }

        // 경험 데이터 생성
        if (experienceData && experienceData.length > 0) {
          const experiencesToCreate = experienceData.map((exp) => ({
            company: exp.company,
            position: exp.position,
            period: exp.period,
            description: exp.description,
            userId: newUser.id,
          }));

          await models.Experience.bulkCreate(experiencesToCreate);
        }

        const accessToken = jwt.sign(
          { userId: newUser.id, email: newUser.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { userId: newUser.id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // refreshToken을 데이터베이스에 저장
        await newUser.update({ refreshToken });

        return {
          accessToken,
          refreshToken,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            department: newUser.department,
            position: newUser.position,
          },
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

        const accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // refreshToken을 데이터베이스에 저장
        await user.update({ refreshToken });

        return {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            position: user.position,
          },
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
        const allowedFields = ["name", "phoneNumber", "address", "nationality", "department", "position", "employeeId", "joinDate", "birthDate", "visaStatus", "avatar"];

        const updates = {};
        allowedFields.forEach((field) => {
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
              }))
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
              }))
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

    changePassword: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const { currentPassword, newPassword } = input;

        const foundUser = await models.User.findByPk(user.id);
        if (!foundUser) {
          throw createError("USER_NOT_FOUND", lang);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, foundUser.password);
        if (!isPasswordValid) {
          throw createError("INCORRECT_CURRENT_PASSWORD", lang);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await foundUser.update({ password: hashedNewPassword });

        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Change password error:", error);
        handleDatabaseError(error, lang, "PASSWORD_CHANGE_FAILED");
      }
    },

    refreshToken: async (parent, { refreshToken }, { lang }) => {
      try {
        if (!refreshToken) {
          throw createError("AUTHENTICATION_REQUIRED", lang);
        }

        const foundUser = await models.User.findOne({
          where: { refreshToken }
        });

        if (!foundUser) {
          throw createError("INVALID_CREDENTIALS", lang);
        }

        // 새로운 accessToken과 refreshToken 생성
        const newAccessToken = jwt.sign(
          { userId: foundUser.id, email: foundUser.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        const newRefreshToken = jwt.sign(
          { userId: foundUser.id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // refreshToken 업데이트
        await foundUser.update({ refreshToken: newRefreshToken });

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            department: foundUser.department,
            position: foundUser.position,
          },
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Refresh token error:", error);
        handleDatabaseError(error, lang, "AUTHENTICATION_REQUIRED");
      }
    },
  },
};

module.exports = authResolvers;