
const models = require("../../models");
const moment = require("moment");
const { Op } = require("sequelize");

const dashboardResolvers = {
  Query: {
    marketingStats: async () => {
      const today = moment().startOf("day").toDate();
      const weekAgo = moment().subtract(7, "days").startOf("day").toDate();
      const monthAgo = moment().subtract(30, "days").startOf("day").toDate();

      const [
        todayPosts,
        weekPosts,
        monthPosts,
        pendingApproval,
        errors,
        activeABTests,
        completedABTests,
        trendingKeywords,
      ] = await Promise.all([
        models.Content.count({ where: { createdAt: { [Op.gte]: today } } }),
        models.Content.count({ where: { createdAt: { [Op.gte]: weekAgo } } }),
        models.Content.count({ where: { createdAt: { [Op.gte]: monthAgo } } }),
        models.Content.count({ where: { status: "pending" } }),
        models.PostingLog.count({
          where: { level: "error", createdAt: { [Op.gte]: today } },
        }),
        models.ABTestGroup.count({ where: { status: "active" } }),
        models.ABTestGroup.count({ where: { status: "completed" } }),
        models.TrendingKeyword.count(),
      ]);

      return {
        totalPosts: {
          today: todayPosts,
          week: weekPosts,
          month: monthPosts,
        },
        pendingApproval,
        errors,
        abTestGroups: {
          active: activeABTests,
          completed: completedABTests,
        },
        trendingKeywords,
      };
    },
  },
};

module.exports = dashboardResolvers;
