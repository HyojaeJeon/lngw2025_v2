
const models = require("../../models");

const trendsResolvers = {
  Query: {
    trendingKeywords: async (_, { period = "24h" }) => {
      return await models.TrendingKeyword.findAll({
        where: { period },
        order: [["mentions", "DESC"]],
        limit: 20,
      });
    },

    trendAnalysis: async (_, { period = "24h" }) => {
      const [risingTrends, decliningTrends, recommendations] =
        await Promise.all([
          models.TrendAnalysis.findAll({
            where: { type: "rising", period },
            order: [["growth", "DESC"]],
            limit: 5,
          }),
          models.TrendAnalysis.findAll({
            where: { type: "declining", period },
            order: [["growth", "ASC"]],
            limit: 5,
          }),
          models.ContentRecommendation.findAll({
            order: [["createdAt", "DESC"]],
            limit: 6,
          }),
        ]);

      return {
        rising: risingTrends,
        declining: decliningTrends,
        contentRecommendations: recommendations,
      };
    },
  },
};

module.exports = trendsResolvers;
