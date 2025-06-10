const { Op } = require('sequelize');
const { models } = require('../database/connection');

const ProductModelResolver = {
  Query: {
    // 특정 상품의 모든 모델 조회
    productModels: async (_, { productId }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const productModels = await models.ProductModel.findAll({
          where: { 
            productId,
            isActive: true
          },
          include: [
            {
              model: models.Product,
              as: 'product'
            },
            {
              model: models.InventoryRecord,
              as: 'inventoryRecords'
            }
          ],
          order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
        });

        return productModels;
      } catch (error) {
        console.error('productModels 조회 오류:', error);
        throw error;
      }
    },

    // 특정 모델 조회
    productModel: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const productModel = await models.ProductModel.findByPk(id, {
          include: [
            {
              model: models.Product,
              as: 'product'
            },
            {
              model: models.InventoryRecord,
              as: 'inventoryRecords',
              include: [{
                model: models.Warehouse,
                as: 'warehouse'
              }]
            }
          ]
        });

        return productModel;
      } catch (error) {
        console.error('productModel 조회 오류:', error);
        throw error;
      }
    },

    // 모델 코드 중복 확인
    checkProductModelCode: async (_, { productId, modelCode }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const existingModel = await models.ProductModel.findOne({
          where: {
            productId,
            modelCode: modelCode.trim(),
            isActive: true
          }
        });

        if (existingModel) {
          return {
            isAvailable: false,
            message: '이미 사용 중인 모델 코드입니다.'
          };
        }

        return {
          isAvailable: true,
          message: '사용 가능한 모델 코드입니다.'
        };
      } catch (error) {
        console.error('모델 코드 확인 오류:', error);
        return {
          isAvailable: false,
          message: '모델 코드 확인 중 오류가 발생했습니다.'
        };
      }
    }
  },

  Mutation: {
    // 모델 생성
    createProductModel: async (_, { productId, input }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        // 상품 존재 확인
        const product = await models.Product.findByPk(productId);
        if (!product) {
          return {
            success: false,
            message: '존재하지 않는 상품입니다.',
            errors: [{ field: 'productId', message: '존재하지 않는 상품입니다.' }]
          };
        }

        // 모델 코드 중복 확인
        const existingModel = await models.ProductModel.findOne({
          where: {
            productId,
            modelCode: input.modelCode.trim(),
            isActive: true
          }
        });

        if (existingModel) {
          return {
            success: false,
            message: '이미 사용 중인 모델 코드입니다.',
            errors: [{ field: 'modelCode', message: '이미 사용 중인 모델 코드입니다.' }]
          };
        }

        // 정렬 순서 설정
        if (!input.sortOrder) {
          const maxOrder = await models.ProductModel.max('sortOrder', {
            where: { productId, isActive: true }
          });
          input.sortOrder = (maxOrder || 0) + 1;
        }

        const productModel = await models.ProductModel.create({
          productId,
          ...input,
          modelCode: input.modelCode.trim(),
          currentStock: input.currentStock || 0,
          minStock: input.minStock || 0,
          soldQuantity: 0,
          isActive: input.isActive !== false
        });

        const createdModel = await models.ProductModel.findByPk(productModel.id, {
          include: [
            {
              model: models.Product,
              as: 'product'
            }
          ]
        });

        return {
          success: true,
          message: '모델이 성공적으로 생성되었습니다.',
          productModel: createdModel
        };
      } catch (error) {
        console.error('모델 생성 오류:', error);
        return {
          success: false,
          message: '모델 생성 중 오류가 발생했습니다.',
          errors: [{ field: 'general', message: error.message }]
        };
      }
    },

    // 모델 수정
    updateProductModel: async (_, { id, input }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const productModel = await models.ProductModel.findByPk(id);
        if (!productModel) {
          return {
            success: false,
            message: '존재하지 않는 모델입니다.',
            errors: [{ field: 'id', message: '존재하지 않는 모델입니다.' }]
          };
        }

        // 모델 코드 중복 확인 (자신 제외)
        if (input.modelCode && input.modelCode !== productModel.modelCode) {
          const existingModel = await models.ProductModel.findOne({
            where: {
              productId: productModel.productId,
              modelCode: input.modelCode.trim(),
              id: { [Op.ne]: id },
              isActive: true
            }
          });

          if (existingModel) {
            return {
              success: false,
              message: '이미 사용 중인 모델 코드입니다.',
              errors: [{ field: 'modelCode', message: '이미 사용 중인 모델 코드입니다.' }]
            };
          }
        }

        // 업데이트할 데이터 준비
        const updateData = { ...input };
        if (updateData.modelCode) {
          updateData.modelCode = updateData.modelCode.trim();
        }

        await productModel.update(updateData);

        const updatedModel = await models.ProductModel.findByPk(id, {
          include: [
            {
              model: models.Product,
              as: 'product'
            }
          ]
        });

        return {
          success: true,
          message: '모델이 성공적으로 수정되었습니다.',
          productModel: updatedModel
        };
      } catch (error) {
        console.error('모델 수정 오류:', error);
        return {
          success: false,
          message: '모델 수정 중 오류가 발생했습니다.',
          errors: [{ field: 'general', message: error.message }]
        };
      }
    },

    // 모델 삭제 (소프트 삭제)
    deleteProductModel: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const productModel = await models.ProductModel.findByPk(id);
        if (!productModel) {
          return {
            success: false,
            message: '존재하지 않는 모델입니다.',
            errors: [{ field: 'id', message: '존재하지 않는 모델입니다.' }]
          };
        }

        // 재고가 있는지 확인
        if (productModel.currentStock > 0) {
          return {
            success: false,
            message: '재고가 있는 모델은 삭제할 수 없습니다.',
            errors: [{ field: 'currentStock', message: '재고가 있는 모델은 삭제할 수 없습니다.' }]
          };
        }

        await productModel.destroy(); // paranoid delete

        return {
          success: true,
          message: '모델이 성공적으로 삭제되었습니다.'
        };
      } catch (error) {
        console.error('모델 삭제 오류:', error);
        return {
          success: false,
          message: '모델 삭제 중 오류가 발생했습니다.',
          errors: [{ field: 'general', message: error.message }]
        };
      }
    },

    // 모델 순서 변경
    updateProductModelOrder: async (_, { productId, modelIds }, { user }) => {
      try {
        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        // 트랜잭션으로 순서 업데이트
        const transaction = await models.sequelize.transaction();

        try {
          for (let i = 0; i < modelIds.length; i++) {
            await models.ProductModel.update(
              { sortOrder: i + 1 },
              { 
                where: { id: modelIds[i], productId },
                transaction
              }
            );
          }

          await transaction.commit();

          const updatedModels = await models.ProductModel.findAll({
            where: { 
              productId,
              isActive: true
            },
            include: [
              {
                model: models.Product,
                as: 'product'
              }
            ],
            order: [['sortOrder', 'ASC']]
          });

          return {
            success: true,
            message: '모델 순서가 성공적으로 변경되었습니다.',
            productModels: updatedModels
          };
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      } catch (error) {
        console.error('모델 순서 변경 오류:', error);
        return {
          success: false,
          message: '모델 순서 변경 중 오류가 발생했습니다.',
          errors: [{ field: 'general', message: error.message }]
        };
      }
    }
  },

  ProductModel: {
    // Product 관계 리졸버
    product: async (productModel) => {
      if (productModel.product) return productModel.product;
      return await models.Product.findByPk(productModel.productId);
    },

    // InventoryRecord 관계 리졸버
    inventoryRecords: async (productModel) => {
      if (productModel.inventoryRecords) return productModel.inventoryRecords;
      return await models.InventoryRecord.findAll({
        where: { productModelId: productModel.id }
      });
    }
  }
};

module.exports = ProductModelResolver; 