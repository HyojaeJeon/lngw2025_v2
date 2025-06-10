
const models = require('../../models');
const { Op } = require('sequelize');

const categoryResolvers = {
  Query: {
    categories: async (parent, { parentId, level, isActive }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const where = {};
        if (parentId !== undefined) where.parentId = parentId;
        if (level !== undefined) where.level = level;
        if (isActive !== undefined) where.isActive = isActive;

        const categories = await models.Category.findAll({
          where,
          include: [
            {
              model: models.Category,
              as: 'parent',
              attributes: ['id', 'code', 'names']
            },
            {
              model: models.Category,
              as: 'children',
              attributes: ['id', 'code', 'names', 'level']
            }
          ],
          order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
        });

        return categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },

    category: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const category = await models.Category.findByPk(id, {
          include: [
            {
              model: models.Category,
              as: 'parent',
              attributes: ['id', 'code', 'names']
            },
            {
              model: models.Category,
              as: 'children',
              attributes: ['id', 'code', 'names', 'level']
            }
          ]
        });

        if (!category) {
          throw new Error('Category not found');
        }

        return category;
      } catch (error) {
        console.error('Error fetching category:', error);
        throw new Error('Failed to fetch category');
      }
    },

    categoryByCode: async (parent, { code }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const category = await models.Category.findOne({
          where: { code },
          include: [
            {
              model: models.Category,
              as: 'parent',
              attributes: ['id', 'code', 'names']
            },
            {
              model: models.Category,
              as: 'children',
              attributes: ['id', 'code', 'names', 'level']
            }
          ]
        });

        return category;
      } catch (error) {
        console.error('Error fetching category by code:', error);
        throw new Error('Failed to fetch category');
      }
    },

    checkCategoryCode: async (parent, { code }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        if (!code || code.trim().length === 0) {
          return {
            isAvailable: false,
            message: 'Category code is required'
          };
        }

        const trimmedCode = code.trim().toUpperCase();
        
        if (trimmedCode.length < 2 || trimmedCode.length > 50) {
          return {
            isAvailable: false,
            message: 'Category code must be between 2 and 50 characters'
          };
        }

        const existingCategory = await models.Category.findOne({
          where: { code: trimmedCode }
        });

        if (existingCategory) {
          return {
            isAvailable: false,
            message: 'Category code already exists'
          };
        }

        return {
          isAvailable: true,
          message: 'Category code is available'
        };
      } catch (error) {
        console.error('Error checking category code:', error);
        throw new Error('Failed to check category code availability');
      }
    }
  },

  Mutation: {
    createCategory: async (parent, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        // 필수 필드 검증
        if (!input.code || !input.names || !input.names.ko || !input.names.vi) {
          throw new Error('Category code, Korean name, and Vietnamese name are required');
        }

        const trimmedCode = input.code.trim().toUpperCase();

        // 코드 중복 검사
        const existingCategory = await models.Category.findOne({
          where: { code: trimmedCode }
        });

        if (existingCategory) {
          throw new Error('Category code already exists');
        }

        // 상위 카테고리 검증
        if (input.parentId) {
          const parentCategory = await models.Category.findByPk(input.parentId);
          if (!parentCategory) {
            throw new Error('Parent category not found');
          }
        }

        // 레벨 자동 설정
        const level = input.parentId ? 2 : 1;

        const category = await models.Category.create({
          ...input,
          code: trimmedCode,
          level
        });

        return await models.Category.findByPk(category.id, {
          include: [
            {
              model: models.Category,
              as: 'parent',
              attributes: ['id', 'code', 'names']
            }
          ]
        });
      } catch (error) {
        console.error('Error creating category:', error);
        throw new Error(error.message || 'Failed to create category');
      }
    },

    updateCategory: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const category = await models.Category.findByPk(id);

        if (!category) {
          throw new Error('Category not found');
        }

        // 코드가 변경된 경우 중복 검사
        if (input.code && input.code !== category.code) {
          const trimmedCode = input.code.trim().toUpperCase();
          const existingCategory = await models.Category.findOne({
            where: { 
              code: trimmedCode,
              id: { [Op.ne]: id }
            }
          });

          if (existingCategory) {
            throw new Error('Category code already exists');
          }

          input.code = trimmedCode;
        }

        // 상위 카테고리 검증
        if (input.parentId && input.parentId !== category.parentId) {
          const parentCategory = await models.Category.findByPk(input.parentId);
          if (!parentCategory) {
            throw new Error('Parent category not found');
          }
        }

        // 레벨 자동 업데이트
        if (input.parentId !== undefined) {
          input.level = input.parentId ? 2 : 1;
        }

        await category.update(input);

        return await models.Category.findByPk(id, {
          include: [
            {
              model: models.Category,
              as: 'parent',
              attributes: ['id', 'code', 'names']
            },
            {
              model: models.Category,
              as: 'children',
              attributes: ['id', 'code', 'names', 'level']
            }
          ]
        });
      } catch (error) {
        console.error('Error updating category:', error);
        throw new Error(error.message || 'Failed to update category');
      }
    },

    deleteCategory: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const category = await models.Category.findByPk(id);

        if (!category) {
          throw new Error('Category not found');
        }

        // 하위 카테고리가 있는지 확인
        const childCategories = await models.Category.findAll({
          where: { parentId: id }
        });

        if (childCategories.length > 0) {
          throw new Error('Cannot delete category with child categories');
        }

        await category.destroy();
        return true;
      } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error(error.message || 'Failed to delete category');
      }
    }
  }
};

module.exports = categoryResolvers;
