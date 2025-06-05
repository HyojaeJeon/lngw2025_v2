
const models = require("../../models");

const postsResolvers = {
  Query: {
    scheduledPosts: async (_, { limit = 10, offset = 0 }) => {
      return await models.ScheduledPost.findAll({
        limit,
        offset,
        order: [["scheduledTime", "ASC"]],
        include: [
          {
            model: models.Content,
            as: "content",
            required: false,
          },
        ],
      });
    },

    scheduledPost: async (_, { id }) => {
      return await models.ScheduledPost.findByPk(id, {
        include: [
          {
            model: models.Content,
            as: "content",
            required: false,
          },
        ],
      });
    },

    postingLogs: async (_, { limit = 10, offset = 0 }) => {
      return await models.PostingLog.findAll({
        limit,
        offset,
        order: [["postedAt", "DESC"]],
        include: [
          {
            model: models.Content,
            as: "content",
            required: false,
          },
        ],
      });
    },
  },

  Mutation: {
    schedulePost: async (_, { input }) => {
      return await models.ScheduledPost.create({
        ...input,
        approvalStatus: "pending",
        scheduleStatus: "scheduled",
      });
    },

    updateScheduledPost: async (_, { id, scheduledTime }) => {
      const scheduledPost = await models.ScheduledPost.findByPk(id);
      if (!scheduledPost) {
        throw new Error("Scheduled post not found");
      }

      return await scheduledPost.update({
        scheduledTime: new Date(scheduledTime),
      });
    },

    cancelScheduledPost: async (_, { id }) => {
      const scheduledPost = await models.ScheduledPost.findByPk(id);
      if (!scheduledPost) {
        throw new Error("Scheduled post not found");
      }

      return await scheduledPost.update({
        scheduleStatus: "cancelled",
        cancelledAt: new Date(),
      });
    },

    retryScheduledPost: async (_, { id }) => {
      const scheduledPost = await models.ScheduledPost.findByPk(id);
      if (!scheduledPost) {
        throw new Error("Scheduled post not found");
      }

      return await scheduledPost.update({
        scheduleStatus: "scheduled",
        error: null,
        cancelledAt: null,
      });
    },
  },
};

module.exports = postsResolvers;
