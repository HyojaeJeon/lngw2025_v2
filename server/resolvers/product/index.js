const { requireAuth, createError, handleDatabaseError } = require('../../lib/errors');
const { Op } = require('sequelize');
const models = require("../../models");

const productResolvers = {
  Product: {
    productModels: async (parent, args, ) => {
      const { ProductModel } = models;
      return await ProductModel.findAll({
        where: { productId: parent.id },
        order: [['sortOrder', 'ASC'], ['modelName', 'ASC']]
      });
    },
    category: async (parent, args, ) => {
      if (!parent.categoryId) return null;
      const { Category } = models;
      return await Category.findByPk(parent.categoryId);
    }
  },
  Query: {
    // 상품 목록 조회
    products: async (parent, { filter = {}, sort, page = 1, limit = 20 }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product, Category, ProductModel } = models;
        const offset = (page - 1) * limit;
        
        // 필터 조건 구성
        const whereClause = {};
        
        if (filter.categoryId) {
          whereClause.categoryId = filter.categoryId;
        }
        
        if (filter.status) {
          whereClause.status = filter.status;
        }
        
        if (filter.isActive !== undefined) {
          whereClause.isActive = filter.isActive;
        }
        
        if (filter.isFeatured !== undefined) {
          whereClause.isFeatured = filter.isFeatured;
        }
        
        if (filter.minPrice || filter.maxPrice) {
          whereClause.price = {};
          if (filter.minPrice) whereClause.price[Op.gte] = filter.minPrice;
          if (filter.maxPrice) whereClause.price[Op.lte] = filter.maxPrice;
        }
        
        if (filter.minStock || filter.maxStock) {
          whereClause.currentStock = {};
          if (filter.minStock) whereClause.currentStock[Op.gte] = filter.minStock;
          if (filter.maxStock) whereClause.currentStock[Op.lte] = filter.maxStock;
        }
        
        if (filter.brand) {
          whereClause.brand = { [Op.like]: `%${filter.brand}%` };
        }
        
        if (filter.search) {
          whereClause[Op.or] = [
            { name: { [Op.like]: `%${filter.search}%` } },
            { code: { [Op.like]: `%${filter.search}%` } },
            { description: { [Op.like]: `%${filter.search}%` } },
            { brand: { [Op.like]: `%${filter.search}%` } }
          ];
        }
        
        // 정렬 조건
        let orderClause = [['createdAt', 'DESC']];
        if (sort) {
          orderClause = [[sort.field, sort.direction.toUpperCase()]];
        }
        
        // 데이터 조회 - 직접 배열로 반환
        const products = await Product.findAll({
          where: whereClause,
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            },
            {
              model: ProductModel,
              as: 'productModels',
              attributes: ['id', 'modelName', 'modelCode', 'images'],
              required: false
            }
          ],
          order: orderClause,
          limit,
          offset,
          distinct: true
        });
        
        return products;
        
      } catch (error) {
        console.error('Products query error:', error);
        throw error;
      }
    },
    
    // 상품 상세 조회
    product: async (parent, { id }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product, Category } = models;
        
        const product = await Product.findByPk(id, {
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ]
        });
        
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        return {
          success: true,
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 코드 중복 확인
    checkProductCode: async (parent, { code }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const existingProduct = await Product.findOne({
          where: { code: code.toUpperCase() }
        });
        
        if (existingProduct) {
          return {
            isAvailable: false,
            message: lang === 'ko' ? '이미 사용 중인 상품 코드입니다.' 
                   : lang === 'en' ? 'Product code is already in use.'
                   : 'Mã sản phẩm đã được sử dụng.'
          };
        }
        
        return {
          isAvailable: true,
          message: lang === 'ko' ? '사용 가능한 상품 코드입니다.'
                 : lang === 'en' ? 'Product code is available.'
                 : 'Mã sản phẩm có thể sử dụng.'
        };
        
      } catch (error) {
        return {
          isAvailable: false,
          message: lang === 'ko' ? '코드 확인 중 오류가 발생했습니다.'
                 : lang === 'en' ? 'Error occurred while checking code.'
                 : 'Lỗi xảy ra khi kiểm tra mã.'
        };
      }
    },
    
    // 상품 통계
    productStats: async (parent, args, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const [totalProducts, activeProducts, inactiveProducts, outOfStockProducts] = await Promise.all([
          Product.count(),
          Product.count({ where: { status: 'active' } }),
          Product.count({ where: { status: 'inactive' } }),
          Product.count({ where: { status: 'out_of_stock' } })
        ]);
        
        const stockStats = await Product.findAll({
          attributes: [
            [models.sequelize.fn('SUM', models.sequelize.col('currentStock')), 'totalStock'],
            [models.sequelize.fn('SUM', models.sequelize.literal('price * currentStock')), 'totalValue'],
            [models.sequelize.fn('COUNT', models.sequelize.literal('CASE WHEN currentStock <= minStock THEN 1 END')), 'lowStockProducts']
          ],
          raw: true
        });
        
        return {
          success: true,
          totalProducts,
          activeProducts,
          inactiveProducts,
          outOfStockProducts,
          totalStock: parseInt(stockStats[0].totalStock) || 0,
          totalValue: parseFloat(stockStats[0].totalValue) || 0,
          lowStockProducts: parseInt(stockStats[0].lowStockProducts) || 0
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 추천 상품 목록
    featuredProducts: async (parent, { limit = 10 }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product, Category } = models;
        
        const products = await Product.findAll({
          where: { 
            isFeatured: true,
            isActive: true,
            status: 'active'
          },
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ],
          order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
          limit
        });
        
        return {
          success: true,
          products
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 카테고리별 상품 목록
    productsByCategory: async (parent, { categoryId, limit = 20 }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product, Category } = models;
        
        const products = await Product.findAll({
          where: { 
            categoryId,
            isActive: true
          },
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ],
          order: [['sortOrder', 'ASC'], ['name', 'ASC']],
          limit
        });
        
        return {
          success: true,
          products
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 재고 부족 상품 목록
    lowStockProducts: async (parent, { limit = 20 }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product, Category } = models;
        
        const products = await Product.findAll({
          where: {
            [Op.and]: [
              models.sequelize.literal('currentStock <= minStock'),
              { isActive: true }
            ]
          },
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ],
          order: [['currentStock', 'ASC']],
          limit
        });
        
        return {
          success: true,
          products
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    }
  },
  
  Mutation: {
    // 상품 생성
    createProduct: async (parent, { input }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        // 코드 중복 확인
        const existingProduct = await Product.findOne({
          where: { code: input.code.toUpperCase() }
        });
        
        if (existingProduct) {
          throw createError('PRODUCT_CODE_DUPLICATE', lang);
        }
        
        // 상품 생성
        const product = await Product.create({
          ...input,
          code: input.code.toUpperCase()
        });
        
        // 생성된 상품 정보 반환 (category 포함)
        const createdProduct = await Product.findByPk(product.id, {
          include: [
            {
              model: models.Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ]
        });
        
        return {
          success: true,
          message: lang === 'ko' ? '상품이 성공적으로 생성되었습니다.'
                 : lang === 'en' ? 'Product created successfully.'
                 : 'Sản phẩm đã được tạo thành công.',
          product: createdProduct
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 수정
    updateProduct: async (parent, { id, input }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        // 코드 변경 시 중복 확인
        if (input.code && input.code.toUpperCase() !== product.code) {
          const existingProduct = await Product.findOne({
            where: { 
              code: input.code.toUpperCase(),
              id: { [Op.ne]: id }
            }
          });
          
          if (existingProduct) {
            throw createError('PRODUCT_CODE_DUPLICATE', lang);
          }
          
          input.code = input.code.toUpperCase();
        }
        
        // 상품 업데이트
        await product.update(input);
        
        // 업데이트된 상품 정보 반환
        const updatedProduct = await Product.findByPk(id, {
          include: [
            {
              model: models.Category,
              as: 'category',
              attributes: ['id', 'code', 'names']
            }
          ]
        });
        
        return {
          success: true,
          message: lang === 'ko' ? '상품이 성공적으로 수정되었습니다.'
                 : lang === 'en' ? 'Product updated successfully.'
                 : 'Sản phẩm đã được cập nhật thành công.',
          product: updatedProduct
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 삭제 (소프트 삭제)
    deleteProduct: async (parent, { id }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        await product.destroy(); // 소프트 삭제
        
        return {
          success: true,
          message: lang === 'ko' ? '상품이 성공적으로 삭제되었습니다.'
                 : lang === 'en' ? 'Product deleted successfully.'
                 : 'Sản phẩm đã được xóa thành công.'
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 복원
    restoreProduct: async (parent, { id }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id, { paranoid: false });
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        await product.restore();
        
        return {
          success: true,
          message: lang === 'ko' ? '상품이 성공적으로 복원되었습니다.'
                 : lang === 'en' ? 'Product restored successfully.'
                 : 'Sản phẩm đã được khôi phục thành công.',
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 상태 변경
    updateProductStatus: async (parent, { id, status }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        await product.update({ status });
        
        return {
          success: true,
          message: lang === 'ko' ? '상품 상태가 성공적으로 변경되었습니다.'
                 : lang === 'en' ? 'Product status updated successfully.'
                 : 'Trạng thái sản phẩm đã được cập nhật thành công.',
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 재고 업데이트
    updateStock: async (parent, { id, quantity, type }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        let newStock;
        switch (type) {
          case 'SET':
            newStock = quantity;
            break;
          case 'ADD':
            newStock = product.currentStock + quantity;
            break;
          case 'SUBTRACT':
            newStock = product.currentStock - quantity;
            break;
          default:
            throw createError('VALIDATION_ERROR', lang);
        }
        
        if (newStock < 0) {
          throw createError('INVALID_STOCK', lang);
        }
        
        await product.update({ currentStock: newStock });
        
        return {
          success: true,
          message: lang === 'ko' ? '재고가 성공적으로 업데이트되었습니다.'
                 : lang === 'en' ? 'Stock updated successfully.'
                 : 'Tồn kho đã được cập nhật thành công.',
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 상품 순서 변경
    updateProductOrder: async (parent, { id, sortOrder }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        await product.update({ sortOrder });
        
        return {
          success: true,
          message: lang === 'ko' ? '상품 순서가 성공적으로 변경되었습니다.'
                 : lang === 'en' ? 'Product order updated successfully.'
                 : 'Thứ tự sản phẩm đã được cập nhật thành công.',
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    },
    
    // 추천 상품 설정/해제
    toggleFeaturedProduct: async (parent, { id }, {  user, lang }) => {
      try {
        requireAuth(user, lang);
        
        const { Product } = models;
        
        const product = await Product.findByPk(id);
        if (!product) {
          throw createError('PRODUCT_NOT_FOUND', lang);
        }
        
        await product.update({ isFeatured: !product.isFeatured });
        
        const message = product.isFeatured 
          ? (lang === 'ko' ? '추천 상품으로 설정되었습니다.'
           : lang === 'en' ? 'Product set as featured.'
           : 'Sản phẩm đã được đặt làm nổi bật.')
          : (lang === 'ko' ? '추천 상품에서 해제되었습니다.'
           : lang === 'en' ? 'Product removed from featured.'
           : 'Sản phẩm đã được bỏ khỏi nổi bật.');
        
        return {
          success: true,
          message,
          product
        };
        
      } catch (error) {
        return handleDatabaseError(error, lang);
      }
    }
  }
};

module.exports = productResolvers; 