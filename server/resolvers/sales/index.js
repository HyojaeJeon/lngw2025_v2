const models = require('../../models');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

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
        order: [["paymentDate", "DESC"]],
      });
    },
    incentivePayouts: async (parent) => {
      return await models.IncentivePayout.findAll({
        where: { salesItemId: parent.id, isActive: true },
        order: [["paymentDate", "DESC"]],
      });
    },
    histories: async (parent) => {
      return await models.SalesItemHistory.findAll({
        where: { salesItemId: parent.id },
        order: [["createdAt", "DESC"]],
        limit: 20,
      });
    },
  },

  Payment: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    },
  },

  IncentivePayout: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    },
    recipient: async (parent) => {
      return await models.User.findByPk(parent.recipientId);
    },
  },

  SalesItemHistory: {
    salesItem: async (parent) => {
      return await models.SalesItem.findByPk(parent.salesItemId);
    },
    user: async (parent) => {
      return await models.User.findByPk(parent.userId);
    },
  },

  Query: {
    salesItems: async (parent, { filter, limit = 50, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const where = { isActive: true };

      if (filter) {
        if (filter.customerId) where.customerId = filter.customerId;
        if (filter.productId) where.productId = filter.productId;
        if (filter.paymentStatus) where.paymentStatus = filter.paymentStatus;
        if (filter.deliveryStatus) where.deliveryStatus = filter.deliveryStatus;
        if (filter.startDate && filter.endDate) {
          where.saleDate = {
            [models.Sequelize.Op.between]: [filter.startDate, filter.endDate]
          };
        }
      }

      return await models.SalesItem.findAll({
        where,
        limit,
        offset,
        include: ['customer', 'product'],
        order: [['saleDate', 'DESC']]
      });
    },

    salesItem: async (parent, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      return await models.SalesItem.findByPk(id, {
        include: ['customer', 'product']
      });
    },

    salesReps: async (_, { search, limit = 100 }, { user, lang }) => {
      try {
        if (!user) throw new AuthenticationError('Authentication required');
        const { Op } = require("sequelize");

        const where = {};

        if (search) {
          where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
        }

        const users = await models.User.findAll({
          where,
          limit,
          order: [["name", "ASC"]],
        });

        return users;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "SALES_REPS_FETCH_FAILED");
      }
    },

    customersForSales: async (_, { limit = 100, offset = 0 }, { user, lang }) => {
      try {
        if (!user) throw new AuthenticationError('Authentication required');

        const customers = await models.Customer.findAll({
          where: {},
          limit,
          offset,
          order: [["name", "ASC"]],
        });

        return customers;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "CUSTOMERS_FOR_SALES_FETCH_FAILED");
      }
    },

    productsForSales: async (_, { categoryId, search, limit = 100 }, { user, lang }) => {
      try {
        if (!user) throw new AuthenticationError('Authentication required');
        const { Op } = require("sequelize");

        const where = { isActive: true };

        if (categoryId) {
          where.categoryId = categoryId;
        }

        if (search) {
          where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { sku: { [Op.like]: `%${search}%` } }];
        }

        const products = await models.Product.findAll({
          where,
          limit,
          order: [["name", "ASC"]],
          include: [{ model: models.Category, as: "category" }],
        });

        return products;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "PRODUCTS_FOR_SALES_FETCH_FAILED");
      }
    },

    productModelsForSales: async (_, { productId, search, limit = 100 }, { user, lang }) => {
      try {
        if (!user) throw new AuthenticationError('Authentication required');
        const { Op } = require("sequelize");

        const where = { productId, isActive: true };

        if (search) {
          where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { modelNumber: { [Op.like]: `%${search}%` } }];
        }

        const productModels = await models.ProductModel.findAll({
          where,
          limit,
          order: [["name", "ASC"]],
        });

        return productModels;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "PRODUCT_MODELS_FOR_SALES_FETCH_FAILED");
      }
    },

    incentivePayouts: async (_, { salesItemId, type }, { user, lang }) => {
      const { requireAuth } = require("../../lib/errors");
      requireAuth(user, lang);

      try {
        const where = { salesItemId, isActive: true };
        if (type) where.type = type;

        const incentivePayouts = await models.IncentivePayout.findAll({
          where,
          order: [["paymentDate", "DESC"]],
          include: [{ model: models.User, as: "recipient" }],
        });

        return {
          success: true,
          incentivePayouts,
        };
      } catch (error) {
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUTS_FETCH_FAILED");
      }
    },

    salesItemHistories: async (_, { salesItemId }, { user, lang }) => {
      const { requireAuth } = require("../../lib/errors");
      requireAuth(user, lang);

      try {
        const histories = await models.SalesItemHistory.findAll({
          where: { salesItemId },
          order: [["createdAt", "DESC"]],
          limit: 50,
          include: [{ model: models.User, as: "user" }],
        });

        return {
          success: true,
          histories,
        };
      } catch (error) {
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "SALES_ITEM_HISTORIES_FETCH_FAILED");
      }
    },
  },

  Mutation: {
    createSalesItem: async (parent, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const totalAmount = input.quantity * input.unitPrice;
      const discountAmount = totalAmount * (input.discountRate || 0) / 100;
      const finalAmount = totalAmount - discountAmount;

      return await models.SalesItem.create({
        ...input,
        totalAmount,
        discountAmount,
        finalAmount,
        isActive: true
      });
    },

    updateSalesItem: async (parent, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const salesItem = await models.SalesItem.findByPk(id);
      if (!salesItem) throw new UserInputError('Sales item not found');

      const totalAmount = input.quantity * input.unitPrice;
      const discountAmount = totalAmount * (input.discountRate || 0) / 100;
      const finalAmount = totalAmount - discountAmount;

      await salesItem.update({
        ...input,
        totalAmount,
        discountAmount,
        finalAmount
      });

      return salesItem;
    },

    deleteSalesItem: async (parent, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const salesItem = await models.SalesItem.findByPk(id);
      if (!salesItem) throw new UserInputError('Sales item not found');

      await salesItem.update({ isActive: false });

      return {
        success: true,
        message: 'Sales item deleted successfully'
      };
    },

    bulkUpdateSalesItems: async (_, { updates }, { user, lang }) => {
      try {
        const { requireAuth, createError, ErrorCodes, handleDatabaseError } = require("../../lib/errors");
        requireAuth(user, lang);

        const updatedSalesItems = [];

        for (const update of updates) {
          const [updatedRowsCount] = await models.SalesItem.update(update.input, {
            where: { id: update.id, isActive: true },
          });

          if (updatedRowsCount > 0) {
            const salesItem = await models.SalesItem.findByPk(update.id);
            updatedSalesItems.push(salesItem);
          }
        }

        return {
          success: true,
          message: "일괄 수정이 완료되었습니다.",
          salesItems: updatedSalesItems,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "BULK_UPDATE_SALES_ITEMS_FAILED");
      }
    },

    createIncentivePayout: async (_, { input }, { user, lang }) => {
      const { requireAuth, handleDatabaseError } = require("../../lib/errors");
      requireAuth(user, lang);

      try {
        const incentivePayout = await models.IncentivePayout.create(input);

        return {
          success: true,
          incentivePayout,
          message: "인센티브 지급 내역이 성공적으로 등록되었습니다.",
        };
      } catch (error) {
        const { handleDatabaseError } = require("../../lib/errors");
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUT_CREATE_FAILED");
      }
    },
  },

  SalesItem: {
    customer: async (salesItem) => {
      return await models.Customer.findByPk(salesItem.customerId);
    },
    product: async (salesItem) => {
      return await models.Product.findByPk(salesItem.productId);
    }
  }
};

module.exports = salesResolvers;