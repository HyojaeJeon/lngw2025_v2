const models = require("../../models");
const { createError, requireAuth, handleDatabaseError, ErrorCodes } = require("../../lib/errors");
const { Op } = require("sequelize");

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
    salesItems: async (_, { filter = {}, sort = { field: "salesDate", direction: "DESC" }, page = 1, limit = 20 }, { user, lang }) => {
      try {
        requireAuth(user, lang);

        const offset = (page - 1) * limit;
        const where = { isActive: true };

        // 필터 조건 적용
        if (filter.search) {
          where[Op.or] = [{ notes: { [Op.like]: `%${filter.search}%` } }, { productModel: { [Op.like]: `%${filter.search}%` } }];
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
            { model: models.User, as: "salesRep" },
            { model: models.Customer, as: "customer" },
            { model: models.Category, as: "category" },
            { model: models.Product, as: "product" },
          ],
        });

        return {
          success: true,
          salesItems: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page * limit < count,
            hasPreviousPage: page > 1,
            totalCount: count,
          },
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_ITEMS_FETCH_FAILED");
      }
    },

    salesItem: async (_, { id }, { user, lang }) => {
      try {
        requireAuth(user, lang);

        const salesItem = await models.SalesItem.findByPk(id, {
          include: [
            { model: models.User, as: "salesRep" },
            { model: models.Customer, as: "customer" },
            { model: models.Category, as: "category" },
            { model: models.Product, as: "product" },
          ],
        });

        if (!salesItem) {
          throw createError(ErrorCodes.NOT_FOUND, "매출 항목을 찾을 수 없습니다");
        }

        return {
          success: true,
          salesItem,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_ITEM_FETCH_FAILED");
      }
    },

    salesReps: async (_, { search, limit = 100 }, { user, lang }) => {
      try {
        requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "SALES_REPS_FETCH_FAILED");
      }
    },

    customersForSales: async (_, { limit = 100, offset = 0 }, { user, lang }) => {
      try {
        requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "CUSTOMERS_FOR_SALES_FETCH_FAILED");
      }
    },

    productsForSales: async (_, { categoryId, search, limit = 100 }, { user, lang }) => {
      try {
        requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "PRODUCTS_FOR_SALES_FETCH_FAILED");
      }
    },

    productModelsForSales: async (_, { productId, search, limit = 100 }, { user, lang }) => {
      try {
        requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "PRODUCT_MODELS_FOR_SALES_FETCH_FAILED");
      }
    },

    incentivePayouts: async (_, { salesItemId, type }, { user, lang }) => {
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
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUTS_FETCH_FAILED");
      }
    },

    salesItemHistories: async (_, { salesItemId }, { user, lang }) => {
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
        handleDatabaseError(error, lang, "SALES_ITEM_HISTORIES_FETCH_FAILED");
      }
    },
  },

  Mutation: {
    createSalesItem: async (_, { input }, { user, lang }) => {
      try {
        requireAuth(user, lang);

        // 제품 정보 조회하여 기본값 설정
        let productData = null;
        let productModelData = null;

        if (input.productId) {
          productData = await models.Product.findByPk(input.productId);
        }

        if (input.productModelId) {
          productModelData = await models.ProductModel.findByPk(input.productModelId);
        }

        // 제품의 기본 인센티브 및 원가 값 설정
        const enrichedInput = {
          ...input,
          // 제품 기본 인센티브 값 (사용자가 직접 입력하지 않은 경우)
          productIncentiveA: input.productIncentiveA ?? (productModelData?.incentiveA || productData?.incentiveA || 0),
          productIncentiveB: input.productIncentiveB ?? (productModelData?.incentiveB || productData?.incentiveB || 0),
          // 원가 정보 설정
          originalUnitCost: productModelData?.cost || productData?.cost || 0,
          adjustedUnitCost: input.adjustedUnitCost ?? (productModelData?.cost || productData?.cost || 0),
          // 기본 소비자가 설정
          consumerPrice: input.consumerPrice ?? (productModelData?.consumerPrice || productData?.consumerPrice || 0),
        };

        const salesItem = await models.SalesItem.create(enrichedInput);

        return {
          success: true,
          message: "매출이 성공적으로 등록되었습니다.",
          salesItem,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_ITEM_CREATE_FAILED");
      }
    },

    updateSalesItem: async (_, { id, input }, { user, lang }) => {
      try {
        requireAuth(user, lang);

        const [updatedRowsCount] = await models.SalesItem.update(input, {
          where: { id, isActive: true },
        });

        if (updatedRowsCount === 0) {
          throw createError(ErrorCodes.NOT_FOUND, "매출 항목을 찾을 수 없습니다");
        }

        const salesItem = await models.SalesItem.findByPk(id);

        return {
          success: true,
          message: "매출이 성공적으로 수정되었습니다.",
          salesItem,
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_ITEM_UPDATE_FAILED");
      }
    },

    deleteSalesItem: async (_, { id }, { user, lang }) => {
      try {
        requireAuth(user, lang);

        const [updatedRowsCount] = await models.SalesItem.update({ isActive: false }, { where: { id, isActive: true } });

        if (updatedRowsCount === 0) {
          throw createError(ErrorCodes.NOT_FOUND, "매출 항목을 찾을 수 없습니다");
        }

        return {
          success: true,
          message: "매출이 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "SALES_ITEM_DELETE_FAILED");
      }
    },

    bulkUpdateSalesItems: async (_, { updates }, { user, lang }) => {
      try {
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
        handleDatabaseError(error, lang, "BULK_UPDATE_SALES_ITEMS_FAILED");
      }
    },

    createIncentivePayout: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const incentivePayout = await models.IncentivePayout.create(input);

        return {
          success: true,
          incentivePayout,
          message: "인센티브 지급 내역이 성공적으로 등록되었습니다.",
        };
      } catch (error) {
        handleDatabaseError(error, lang, "INCENTIVE_PAYOUT_CREATE_FAILED");
      }
    },
  },
};

module.exports = salesResolvers;
