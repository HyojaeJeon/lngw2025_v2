const models = require("../../models");
const { Op } = require("sequelize");
const {
  createError,
  requireAuth,
  requireRole,
  handleDatabaseError,
} = require("../../lib/errors");

// ====================
// 유효성 검사 헬퍼 함수
// ====================
const validateCategoryCode = (code) => {
  if (!code || code.trim().length === 0) {
    return { isValid: false, message: "Category code is required" };
  }

  const trimmedCode = code.trim().toUpperCase();

  if (trimmedCode.length < 2 || trimmedCode.length > 50) {
    return {
      isValid: false,
      message: "Category code must be between 2 and 50 characters",
    };
  }

  return { isValid: true, code: trimmedCode };
};

const validateCategoryNames = (names) => {
  if (!names || !names.ko || !names.vi) {
    return {
      isValid: false,
      message: "Korean and Vietnamese names are required",
    };
  }

  return { isValid: true };
};

const categoryResolvers = {
  Query: {
    categories: async (parent, args, context) => {
      console.log("context : ", context);
      // 카테고리 목록은 공개적으로 접근 가능
      // requireAuth(user, lang);
      const { user, lang } = context;
      console.log("user : ", user);
      console.log("lang : ", lang);
      try {
        const where = {};

        const categories = await models.Category.findAll({
          where,

          order: [
            ["sortOrder", "ASC"],
            ["createdAt", "ASC"],
          ],
        });

        return categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    category: async (parent, args, context) => {
      const { user, lang } = context;
      const { id } = args;
      console.log("User : ", user);
      requireAuth(user, lang);

      try {
        const category = await models.Category.findByPk(id, {});

        if (!category) {
          throw createError("CATEGORY_NOT_FOUND", lang);
        }

        return category;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error fetching category:", error);
        handleDatabaseError(error, lang, "CATEGORY_NOT_FOUND");
      }
    },

    categoryByCode: async ({ code }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const category = await models.Category.findOne({
          where: { code },
        });

        return category;
      } catch (error) {
        console.error("Error fetching category by code:", error);
        handleDatabaseError(error, lang, "CATEGORY_NOT_FOUND");
      }
    },

    checkCategoryCode: async ({ code }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const validation = validateCategoryCode(code);

        if (!validation.isValid) {
          return {
            isAvailable: false,
            message: validation.message,
          };
        }

        const existingCategory = await models.Category.findOne({
          where: { code: validation.code },
        });

        if (existingCategory) {
          return {
            isAvailable: false,
            message: "Category code already exists",
          };
        }

        return {
          isAvailable: true,
          message: "Category code is available",
        };
      } catch (error) {
        console.error("Error checking category code:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },

  Mutation: {
    createCategory: async (args, { user, lang }) => {
      console.log("USER LANG : ", user, lang);
      console.log("args : ", args);
      requireAuth(user, lang);

      try {
        // 필수 필드 검증
        const codeValidation = validateCategoryCode(input.code);
        if (!codeValidation.isValid) {
          throw createError("VALIDATION_ERROR", lang);
        }

        const namesValidation = validateCategoryNames(input.names);
        if (!namesValidation.isValid) {
          throw createError("VALIDATION_ERROR", lang);
        }

        const trimmedCode = codeValidation.code;

        // 코드 중복 검사
        const existingCategory = await models.Category.findOne({
          where: { code: trimmedCode },
        });

        if (existingCategory) {
          throw createError("CATEGORY_CODE_EXISTS", lang);
        }

        const category = await models.Category.create({
          ...input,
          code: trimmedCode,
        });

        return await models.Category.findByPk(category.id, {});
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error creating category:", error);
        handleDatabaseError(error, lang, "CATEGORY_CREATE_FAILED");
      }
    },

    updateCategory: async ({ id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const category = await models.Category.findByPk(id);

        if (!category) {
          throw createError("CATEGORY_NOT_FOUND", lang);
        }

        // 이름 검증 (이름이 제공된 경우)
        if (input.names) {
          const namesValidation = validateCategoryNames(input.names);
          if (!namesValidation.isValid) {
            throw createError("VALIDATION_ERROR", lang);
          }
        }

        // 코드가 변경된 경우 중복 검사
        if (input.code && input.code !== category.code) {
          const codeValidation = validateCategoryCode(input.code);
          if (!codeValidation.isValid) {
            throw createError("VALIDATION_ERROR", lang);
          }

          const trimmedCode = codeValidation.code;
          const existingCategory = await models.Category.findOne({
            where: {
              code: trimmedCode,
              id: { [Op.ne]: id },
            },
          });

          if (existingCategory) {
            throw createError("CATEGORY_CODE_EXISTS", lang);
          }

          input.code = trimmedCode;
        }

        await category.update(input);

        return await models.Category.findByPk(id, {});
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error updating category:", error);
        handleDatabaseError(error, lang, "CATEGORY_UPDATE_FAILED");
      }
    },

    deleteCategory: async ({ id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const category = await models.Category.findByPk(id);

        if (!category) {
          throw createError("CATEGORY_NOT_FOUND", lang);
        }

        if (childCategories.length > 0) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "Cannot delete category with child categories",
          });
        }

        await category.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting category:", error);
        handleDatabaseError(error, lang, "CATEGORY_DELETE_FAILED");
      }
    },
  },
};

module.exports = categoryResolvers;
