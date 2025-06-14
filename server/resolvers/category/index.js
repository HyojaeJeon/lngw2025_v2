const models = require("../../models");
const { createError, requireAuth, handleDatabaseError } = require("../../lib/errors");
const { Op } = require('sequelize');
const {
  requireRole,
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
    categories: async (_, { search, page = 1, limit = 20 }, { user }) => {
      requireAuth(user);

      try {
        const offset = (page - 1) * limit;
        const where = { isActive: true };

        if (search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { code: { [Op.like]: `%${search}%` } }
          ];
        }

        const { count, rows } = await models.Category.findAndCountAll({
          where,
          limit,
          offset,
          order: [['name', 'ASC']]
        });

        return {
          success: true,
          categories: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page * limit < count,
            hasPreviousPage: page > 1,
            totalCount: count
          }
        };
      } catch (error) {
        handleDatabaseError(error, 'ko', "CATEGORIES_FETCH_FAILED");
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

    checkCategoryCode: async (parent, args, context) => {
      const { user, lang } = context;
      const { code } = args || {};
      requireAuth(user, lang);

      try {
        // 입력 검증
        if (!code) {
          return {
            isAvailable: false,
            message: "카테고리 코드가 제공되지 않았습니다",
          };
        }

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
            message: "이미 존재하는 카테고리 코드입니다",
          };
        }

        return {
          isAvailable: true,
          message: "사용 가능한 카테고리 코드입니다",
        };
      } catch (error) {
        console.error("Error checking category code:", error);
        return {
          isAvailable: false,
          message: "카테고리 코드 확인 중 오류가 발생했습니다",
        };
      }
    },

    categoryByCode: async (parent, args, context) => {
      const { user, lang } = context;
      const { code } = args || {};
      requireAuth(user, lang);

      try {
        // 입력 검증
        if (!code) {
          return null;
        }

        const category = await models.Category.findOne({
          where: { code },
        });

        return category;
      } catch (error) {
        console.error("Error fetching category by code:", error);
        handleDatabaseError(error, lang, "CATEGORY_NOT_FOUND");
      }
    },
  },

  Mutation: {
    createCategory: async (parent, { input }, { user, lang }) => {
      console.log("USER LANG : ", user, lang);
      console.log("input : ", input);
      requireAuth(user, lang);

      try {
        // 입력 데이터 유효성 검사
        if (!input) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "입력 데이터가 제공되지 않았습니다",
          });
        }

        // 필수 필드 검증
        const codeValidation = validateCategoryCode(input.code);
        if (!codeValidation.isValid) {
          throw createError("VALIDATION_ERROR", lang, {
            details: codeValidation.message,
          });
        }

        const namesValidation = validateCategoryNames(input.names);
        if (!namesValidation.isValid) {
          throw createError("VALIDATION_ERROR", lang, {
            details: namesValidation.message,
          });
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

    updateCategory: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        // 입력 검증
        if (!id) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "카테고리 ID가 제공되지 않았습니다",
          });
        }

        if (!input) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "수정할 데이터가 제공되지 않았습니다",
          });
        }

        const category = await models.Category.findByPk(id);

        if (!category) {
          throw createError("CATEGORY_NOT_FOUND", lang);
        }

        // 이름 검증 (이름이 제공된 경우)
        if (input.names) {
          const namesValidation = validateCategoryNames(input.names);
          if (!namesValidation.isValid) {
            throw createError("VALIDATION_ERROR", lang, {
              details: namesValidation.message,
            });
          }
        }

        // 코드가 변경된 경우 중복 검사
        if (input.code && input.code !== category.code) {
          const codeValidation = validateCategoryCode(input.code);
          if (!codeValidation.isValid) {
            throw createError("VALIDATION_ERROR", lang, {
              details: codeValidation.message,
            });
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

    deleteCategory: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        // 입력 검증
        if (!id) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "카테고리 ID가 제공되지 않았습니다",
          });
        }

        const category = await models.Category.findByPk(id);

        if (!category) {
          throw createError("CATEGORY_NOT_FOUND", lang);
        }

        // 하위 카테고리 존재 여부 확인
        const childCategories = await models.Category.findAll({
          where: { parentId: id },
        });

        if (childCategories.length > 0) {
          throw createError("VALIDATION_ERROR", lang, {
            details: "하위 카테고리가 있는 카테고리는 삭제할 수 없습니다",
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