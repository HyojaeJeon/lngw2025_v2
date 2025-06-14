const models = require("../../models");
const { 
  createError, 
  requireAuth, 
  handleDatabaseError 
} = require("../../lib/errors");
const { Op } = require('sequelize');

const salesResolvers = {
  SalesItem: {
    salesRep: async (parent) => {
      return await models.User.findByPk(parent.salesRepId);
    },
    customer: async (parent) => {
      return await models.Customer.findByPk(parent.customerId);
    },
    category: async (parent) => {
      return await models.Category.findByPk(parent.categoryId);
    },
    product: async (parent) => {
      return await models.Product.findByPk(parent.productId);
    },
    productModel: async (parent) => {
      if (!parent.productModelId) return null;
      return await models.ProductModel.findByPk(parent.productModelId);
    },
    payments: async (parent) => {
      return await models.Payment.findAll({
        where: { salesItemId: parent.id, isActive: true },
        order: [['paymentDate', 'DESC']]
      });
    },
    incentivePayouts: async (parent) => {
      return await models.IncentivePayout.findAll({
        where: { salesItemId: parent.id, isActive: true },
        order: [['paymentDate', 'DESC']]
      });
    },
    histories: async (parent) => {
      return await models.SalesItemHistory.findAll({
        where: { salesItemId: parent.id },
        order: [['createdAt', 'DESC']],
        limit: 20
      });
    }
  },

  Payment: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    }
  },

  IncentivePayout: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    },
    recipient: async (parent) => {
      return await models.User.findByPk(parent.recipientId);
    }
  },

  SalesItemHistory: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    },
    user: async (parent) => {
      return await models.User.findByPk(parent.userId);
    }
  },

  Query: {
    salesItems: async (_, { filter = {}, sort = { field: "salesDate", direction: "DESC" }, page = 1, limit = 20 }, { user }) => {
      requireAuth(user);

      try {
        const offset = (page - 1) * limit;
        const where = { isActive: true };

        // 필터 조건 적용
        if (filter.search) {
          where[Op.or] = [
            { notes: { [Op.like]: `%${filter.search}%` } },
            { productModel: { [Op.like]: `%${filter.search}%` } }
          ];
        }

        if (filter.salesRepId) where.salesRepId = filter.salesRepId;
        if (filter.customerId) where.customerId = filter.customerId;
        if (filter.categoryId) where.categoryId = filter.categoryId;
        if (filter.productId) where.productId = filter.productId;
        if (filter.type) where.type = filter.type;
        if (filter.paymentStatus) where.paymentStatus = filter.paymentStatus;

        if (filter.dateFrom || filter.dateTo) {
          where.salesDate = {};
          if (filter.dateFrom) where.salesDate[Op.gte] = filter.dateFrom;
          if (filter.dateTo) where.salesDate[Op.lte] = filter.dateTo;
        }

        const orderDirection = sort.direction === "ASC" ? "ASC" : "DESC";

        const { count, rows } = await models.SalesItem.findAndCountAll({
          where,
          limit,
          offset,
          order: [[sort.field, orderDirection]],
          include: [
            { model: models.User, as: 'salesRep' },
            { model: models.Customer, as: 'customer' },
            { model: models.Category, as: 'category' },
            { model: models.Product, as: 'product' }
          ]
        });

        return {
          salesItems: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page * limit < count,
            hasPreviousPage: page > 1
          }
        };
      } catch (error) {
        handleDatabaseError(error, lang, "SALES_ITEMS_FETCH_FAILED");
      }
    },

    salesItem: async (_, { id }, { user }) => {
      try {
        requireAuth(user);

        const salesItem = await models.SalesItem.findByPk(id, {
          include: [
            { model: models.User, as: 'salesRep' },
            { model: models.Customer, as: 'customer' },
            { model: models.Category, as: 'category' },
            { model: models.Product, as: 'product' }
          ]
        });

        if (!salesItem) {
          throw createError(ERROR_CODES.NOT_FOUND, '매출 항목을 찾을 수 없습니다');
        }

        return salesItem;
      } catch (error) {
        throw createError(ERROR_CODES.DATABASE_ERROR, '매출 항목 조회 실패', error);
      }
    },

    salesReps: async (_, { limit = 100, offset = 0 }, { user }) => {
      try {
        requireAuth(user);

        const users = await models.User.findAll({
          where: { isActive: true },
          limit,
          offset,
          order: [['name', 'ASC']]
        });

        return users;
      } catch (error) {
        throw createError(ERROR_CODES.DATABASE_ERROR, '영업사원 조회 실패', error);
      }
    },

    customersForSales: async (_, { limit = 100, offset = 0 }, { user }) => {
      try {
        requireAuth(user);

        const customers = await models.Customer.findAll({
          where: { isActive: true },
          limit,
          offset,
          order: [['contactName', 'ASC']]
        });

        return customers;
      } catch (error) {
        throw createError(ERROR_CODES.DATABASE_ERROR, '고객사 조회 실패', error);
      }
    },

    productsForSales: async (_, { categoryId, search, limit = 100 }, { user }) => {
      try {
        requireAuth(user);

        const where = { isActive: true };
        
        if (categoryId) {
          where.categoryId = categoryId;
        }
        
        if (search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { sku: { [Op.like]: `%${search}%` } }
          ];
        }

        const products = await models.Product.findAll({
          where,
          limit,
          order: [['name', 'ASC']],
          include: [
            { model: models.Category, as: 'category' }
          ]
        });

        return products;
      } catch (error) {
        throw createError(ERROR_CODES.DATABASE_ERROR, '제품 조회 실패', error);
      }
    },

    productModelsForSales: async (_, { productId, search, limit = 100 }, { user }) => {
      try {
        requireAuth(user);

        const where = { productId, isActive: true };
        
        if (search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { modelNumber: { [Op.like]: `%${search}%` } }
          ];
        }

        const productModels = await models.ProductModel.findAll({
          where,
          limit,
          order: [['name', 'ASC']]
        });

        return productModels;
      } catch (error) {
        throw createError(ERROR_CODES.DATABASE_ERROR, '제품 모델 조회 실패', error);
      }
    },

    

    incentivePayouts: async (_, { salesItemId, type }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const where = { salesItemId, isActive: true };
        if (type) where.type = type;

        const incentivePayouts = await models.IncentivePayout.findAll({
          where,
          order: [['paymentDate', 'DESC']],
          include: [
            { model: models.User, as: 'recipient' }
          ]
        });

        return {
          success: true,
          incentivePayouts
        };
      } catch (error) {
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUTS_FETCH_FAILED");
      }
    },

    salesItemHistories: async (_, { salesItemId }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const histories = await models.SalesItemHistory.findAll({
          where: { salesItemId },
          order: [['createdAt', 'DESC']],
          limit: 50,
          include: [
            { model: models.User, as: 'user' }
          ]
        });

        return {
          success: true,
          histories
        };
      } catch (error) {
        handleDatabaseError(error, lang, "SALES_ITEM_HISTORIES_FETCH_FAILED");
      }
    }
  },

  Mutation: {
    

    createIncentivePayout: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const incentivePayout = await models.IncentivePayout.create(input);

        return {
          success: true,
          incentivePayout,
          message: "인센티브 지급 내역이 성공적으로 등록되었습니다."
        };
      } catch (error) {
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUT_CREATE_FAILED");
      }
    }
  }
};

module.exports = salesResolvers;