
const models = require("../../models");
const { Op } = require("sequelize");
const { 
  createError, 
  requireAuth, 
  requireRole, 
  handleDatabaseError 
} = require("../../lib/errors");

const customerActivityResolvers = {
  Query: {
    customerActivities: async (parent, { limit = 10, offset = 0, filter }, { user, lang }) => {
      requireAuth(user, lang);

      const whereCondition = {};
      
      if (filter?.customerId) {
        whereCondition.customerId = filter.customerId;
      }

      if (filter?.type) {
        whereCondition.type = filter.type;
      }

      if (filter?.result) {
        whereCondition.result = filter.result;
      }

      if (filter?.dateFrom || filter?.dateTo) {
        whereCondition.activityDate = {};
        if (filter.dateFrom) {
          whereCondition.activityDate[Op.gte] = new Date(filter.dateFrom);
        }
        if (filter.dateTo) {
          whereCondition.activityDate[Op.lte] = new Date(filter.dateTo);
        }
      }

      if (filter?.search) {
        whereCondition[Op.or] = [
          { title: { [Op.like]: `%${filter.search}%` } },
          { description: { [Op.like]: `%${filter.search}%` } },
          { nextAction: { [Op.like]: `%${filter.search}%` } }
        ];
      }

      try {
        const activities = await models.CustomerActivity.findAll({
          where: whereCondition,
          limit,
          offset,
          include: [
            {
              model: models.Customer,
              as: "customer",
              attributes: ["id", "name", "contactName"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["activityDate", "DESC"]],
        });

        return activities;
      } catch (error) {
        console.error("Error fetching customer activities:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    customerActivity: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const activity = await models.CustomerActivity.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
              attributes: ["id", "name", "contactName"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!activity) {
          throw createError("NOT_FOUND", lang);
        }

        return activity;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error fetching customer activity:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },

  Mutation: {
    createCustomerActivity: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const activity = await models.CustomerActivity.create({
          ...input,
          createdBy: user.id,
          activityDate: new Date(input.activityDate),
        });

        const createdActivity = await models.CustomerActivity.findByPk(activity.id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
              attributes: ["id", "name", "contactName"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return createdActivity;
      } catch (error) {
        console.error("Error creating customer activity:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    updateCustomerActivity: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const activity = await models.CustomerActivity.findByPk(id);
        if (!activity) {
          throw createError("NOT_FOUND", lang);
        }

        const updateData = { ...input };
        if (input.activityDate) {
          updateData.activityDate = new Date(input.activityDate);
        }

        await activity.update(updateData);

        const updatedActivity = await models.CustomerActivity.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
              attributes: ["id", "name", "contactName"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return updatedActivity;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error updating customer activity:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteCustomerActivity: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const activity = await models.CustomerActivity.findByPk(id);
        if (!activity) {
          throw createError("NOT_FOUND", lang);
        }

        await activity.destroy();
        return { success: true, message: "Customer activity deleted successfully" };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting customer activity:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },
};

module.exports = customerActivityResolvers;
