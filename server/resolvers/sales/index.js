
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
    // 기존 쿼리들...
    salesItems: async (_, { filter, sort, page = 1, limit = 20 }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const offset = (page - 1) * limit;
        const where = { isActive: true };
        const order = [];

        // 필터 처리
        if (filter) {
          if (filter.salesRepId) where.salesRepId = filter.salesRepId;
          if (filter.customerId) where.customerId = filter.customerId;
          if (filter.type) where.type = filter.type;
          if (filter.categoryId) where.categoryId = filter.categoryId;
          if (filter.productId) where.productId = filter.productId;
          if (filter.productModelId) where.productModelId = filter.productModelId;
          if (filter.paymentStatus) where.paymentStatus = filter.paymentStatus;
          if (filter.dateFrom && filter.dateTo) {
            where.salesDate = {
              [Op.between]: [filter.dateFrom, filter.dateTo]
            };
          }
          if (filter.search) {
            where[Op.or] = [
              { notes: { [Op.like]: `%${filter.search}%` } }
            ];
          }
        }

        // 정렬 처리
        if (sort) {
          order.push([sort.field, sort.direction]);
        } else {
          order.push(['salesDate', 'DESC']);
        }

        const { rows: salesItems, count } = await models.SalesItem.findAndCountAll({
          where,
          order,
          limit,
          offset,
          include: [
            { model: models.User, as: 'salesRep' },
            { model: models.Customer, as: 'customer' },
            { model: models.Category, as: 'category' },
            { model: models.Product, as: 'product' },
            { model: models.ProductModel, as: 'productModel' },
            { model: models.Payment, as: 'payments' },
            { model: models.IncentivePayout, as: 'incentivePayouts' }
          ]
        });

        return {
          success: true,
          salesItems,
          pagination: {
            totalCount: count,
            hasNextPage: offset + salesItems.length < count,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
          }
        };
      } catch (error) {
        handleDatabaseError(error, lang, "SALES_ITEMS_FETCH_FAILED");
      }
    },

    salesCategories: async (_, { search, page = 1, limit = 20 }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const offset = (page - 1) * limit;
        const where = { isActive: true };

        if (search) {
          where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { code: { [Op.like]: `%${search}%` } }
          ];
        }

        const { rows: salesCategories, count } = await models.SalesCategory.findAndCountAll({
          where,
          order: [['sortOrder', 'ASC'], ['name', 'ASC']],
          limit,
          offset
        });

        return {
          success: true,
          salesCategories,
          pagination: {
            totalCount: count,
            hasNextPage: offset + salesCategories.length < count,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
          }
        };
      } catch (error) {
        handleDatabaseError(error, lang, "SALES_CATEGORIES_FETCH_FAILED");
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
    createSalesCategory: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const salesCategory = await models.SalesCategory.create(input);
        return {
          success: true,
          salesCategory,
          message: "매출 카테고리가 성공적으로 생성되었습니다."
        };
      } catch (error) {
        handleDatabaseError(error, lang, "SALES_CATEGORY_CREATE_FAILED");
      }
    },

    updateSalesCategory: async (_, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const salesCategory = await models.SalesCategory.findByPk(id);
        if (!salesCategory) {
          throw createError("SALES_CATEGORY_NOT_FOUND", lang);
        }

        await salesCategory.update(input);
        
        return {
          success: true,
          salesCategory,
          message: "매출 카테고리가 성공적으로 수정되었습니다."
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_CATEGORY_UPDATE_FAILED");
      }
    },

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
