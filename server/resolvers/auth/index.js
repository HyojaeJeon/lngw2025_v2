const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const models = require("../../models");

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
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

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

      return userData;
    },
  },
  Mutation: {
    register: async (_, { input }) => {
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

        // Check password confirmation
        if (password !== confirmPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        // Check if user already exists
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
          throw new Error("이미 가입된 이메일입니다.");
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Filter out any undefined or invalid fields
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
          role: "editor", // Default role
        };

        // Create new user
        const user = await models.User.create(cleanUserData, {});

        // Create related data
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

        // Create experiences if provided
        if (experienceData && experienceData.length > 0) {
          const experiencesToCreate = experienceData.map((exp) => ({
            company: exp.company,
            position: exp.position,
            period: exp.period,
            description: exp.description,
            userId: user.id,
          }));

          await models.Experience.bulkCreate(experiencesToCreate, {});
        }

        // JWT 토큰 생성 (자동로그인 옵션에 따라 만료시간 설정)
        const expiresIn = input.rememberMe ? '30d' : '7d';
        const token = jwt.sign(
          { userId: user.id, email: user.email, rememberMe: input.rememberMe },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn }
        );

        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    login: async (_, { input }) => {
      try {
        const { email, password, rememberMe } = input;

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
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // rememberMe가 true이면 30일, false이면 7일
        const expiresIn = rememberMe ? "30d" : "7d";

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn },
        );

        return {
          token,
          user,
        };
      } catch (error) {
        throw new Error(error.message || "로그인 중 오류가 발생했습니다.");
      }
    },

    updateUserProfile: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const { emergencyContact, skills, ...userData } = input;

        // Update user basic data
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
          where: { id: context.user.userId },
        });

        // Update emergency contacts
        if (emergencyContact !== undefined) {
          await models.EmergencyContact.destroy({
            where: { userId: context.user.userId },
          });
          if (emergencyContact.length > 0) {
            await models.EmergencyContact.bulkCreate(
              emergencyContact.map((contact) => ({
                ...contact,
                userId: context.user.userId,
              })),
            );
          }
        }

        // Update skills
        if (skills !== undefined) {
          await models.Skill.destroy({
            where: { userId: context.user.userId },
          });
          if (skills.length > 0) {
            await models.Skill.bulkCreate(
              skills.map((skill) => ({
                ...skill,
                userId: context.user.userId,
              })),
            );
          }
        }

        const updatedUser = await models.User.findByPk(context.user.userId, {
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

        return updatedUser;
      } catch (error) {
        console.error("Update profile error:", error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    },
  },
};

module.exports = authResolvers;