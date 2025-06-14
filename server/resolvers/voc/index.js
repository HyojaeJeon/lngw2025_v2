
const models = require("../../models");
const { Op } = require("sequelize");
const { createError, requireAuth, handleDatabaseError } = require("../../lib/errors");

const vocResolvers = {
  Query: {
    vocs: async (parent, { filter = {}, limit = 10, offset = 0 }, { user, lang }) => {
      requireAuth(user, lang);

      const whereCondition = {};

      // 필터 조건 적용
      if (filter.customerId) {
        whereCondition.customerId = filter.customerId;
      }

      if (filter.status) {
        whereCondition.status = filter.status;
      }

      if (filter.priority) {
        whereCondition.priority = filter.priority;
      }

      if (filter.type) {
        whereCondition.type = filter.type;
      }

      if (filter.assignedToId) {
        whereCondition.assignedToId = filter.assignedToId;
      }

      if (filter.dateFrom || filter.dateTo) {
        whereCondition.createdAt = {};
        if (filter.dateFrom) {
          whereCondition.createdAt[Op.gte] = new Date(filter.dateFrom);
        }
        if (filter.dateTo) {
          whereCondition.createdAt[Op.lte] = new Date(filter.dateTo);
        }
      }

      if (filter.search) {
        whereCondition[Op.or] = [
          { title: { [Op.like]: `%${filter.search}%` } },
          { content: { [Op.like]: `%${filter.search}%` } },
        ];
      }

      try {
        const vocs = await models.Voc.findAll({
          where: whereCondition,
          limit,
          offset,
          include: [
            {
              model: models.Customer,
              as: "customer",
              attributes: ["id", "name", "email", "phone"],
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
              attributes: ["id", "name", "position", "email", "phone"],
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        });

        return vocs;
      } catch (error) {
        console.error("Error fetching VOCs:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    voc: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!voc) {
          throw createError("VOC_NOT_FOUND", lang);
        }

        return voc;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error fetching VOC:", error);
        handleDatabaseError(error, lang, "VOC_NOT_FOUND");
      }
    },

    vocStats: async (parent, args, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const [totalCount, pendingCount, inProgressCount, resolvedCount] = await Promise.all([
          models.Voc.count(),
          models.Voc.count({ where: { status: "pending" } }),
          models.Voc.count({ where: { status: "in_progress" } }),
          models.Voc.count({ where: { status: "resolved" } }),
        ]);

        const [highPriorityCount, mediumPriorityCount, lowPriorityCount] = await Promise.all([
          models.Voc.count({ where: { priority: "high" } }),
          models.Voc.count({ where: { priority: "medium" } }),
          models.Voc.count({ where: { priority: "low" } }),
        ]);

        const typeStats = await models.Voc.findAll({
          attributes: [
            "type",
            [models.sequelize.fn("COUNT", "*"), "count"],
          ],
          group: ["type"],
          raw: true,
        });

        return {
          total: totalCount,
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          byPriority: {
            high: highPriorityCount,
            medium: mediumPriorityCount,
            low: lowPriorityCount,
          },
          byType: typeStats.map(stat => ({
            type: stat.type,
            count: parseInt(stat.count),
          })),
        };
      } catch (error) {
        console.error("Error fetching VOC stats:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },

  Mutation: {
    createVoc: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.create({
          ...input,
          createdBy: user.id,
        });

        const createdVoc = await models.Voc.findByPk(voc.id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return createdVoc;
      } catch (error) {
        console.error("Error creating VOC:", error);
        handleDatabaseError(error, lang, "VOC_CREATE_FAILED");
      }
    },

    updateVoc: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.findByPk(id);
        if (!voc) {
          throw createError("VOC_NOT_FOUND", lang);
        }

        // 해결 완료 시 resolvedAt 설정
        if (input.status === "resolved" && !voc.resolvedAt) {
          input.resolvedAt = new Date();
        }

        await voc.update(input);

        const updatedVoc = await models.Voc.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return updatedVoc;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error updating VOC:", error);
        handleDatabaseError(error, lang, "VOC_UPDATE_FAILED");
      }
    },

    deleteVoc: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.findByPk(id);
        if (!voc) {
          throw createError("VOC_NOT_FOUND", lang);
        }

        await voc.destroy();
        return { success: true, message: "VOC deleted successfully" };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting VOC:", error);
        handleDatabaseError(error, lang, "VOC_DELETE_FAILED");
      }
    },

    assignVoc: async (parent, { id, assignedToId }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.findByPk(id);
        if (!voc) {
          throw createError("VOC_NOT_FOUND", lang);
        }

        await voc.update({ 
          assignedToId,
          status: voc.status === "pending" ? "in_progress" : voc.status
        });

        const updatedVoc = await models.Voc.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return updatedVoc;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error assigning VOC:", error);
        handleDatabaseError(error, lang, "VOC_ASSIGN_FAILED");
      }
    },

    resolveVoc: async (parent, { id, resolution }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const voc = await models.Voc.findByPk(id);
        if (!voc) {
          throw createError("VOC_NOT_FOUND", lang);
        }

        await voc.update({
          status: "resolved",
          resolution,
          resolvedAt: new Date(),
        });

        const updatedVoc = await models.Voc.findByPk(id, {
          include: [
            {
              model: models.Customer,
              as: "customer",
            },
            {
              model: models.ContactPerson,
              as: "contactPerson",
            },
            {
              model: models.User,
              as: "assignedTo",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        return updatedVoc;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error resolving VOC:", error);
        handleDatabaseError(error, lang, "VOC_RESOLVE_FAILED");
      }
    },
  },
};

module.exports = vocResolvers;
