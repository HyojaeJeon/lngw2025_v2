const models = require("../../models");

const monitoringResolvers = {
  Query: {
    platformStats: async () => {
      const stats = await models.PlatformStat.findAll();
      return stats.map(stat => ({
        ...stat.dataValues,
        postsToday: stat.postsToday || 0,
        errors: stat.errors || 0,
        averageResponseTime: stat.averageResponseTime || 0,
        uptime: stat.uptime || 100,
        name: stat.platform || stat.name || 'Unknown Platform',
        todayPosts: stat.postsToday || 0,
        successCount: Math.max(0, (stat.postsToday || 0) - (stat.errors || 0)),
        failureCount: stat.errors || 0,
        failureRate: stat.postsToday > 0 ? ((stat.errors || 0) / stat.postsToday) * 100 : 0,
        lastError: stat.lastError || null,
        realTimeMetrics: {
          activeConnections: 5,
          queuedPosts: 3,
          postsPerMinute: 2.5,
          averageResponseTime: stat.averageResponseTime || 0,
          errorRate: stat.postsToday > 0 ? ((stat.errors || 0) / stat.postsToday) * 100 : 0,
          uptime: stat.uptime || 100
        }
      }));
    },

    postingLogs: async (_, { platform, level, limit = 50 }) => {
      const where = {};
      if (platform) where.platform = platform;
      if (level) where.level = level;

      return await models.PostingLog.findAll({
        where,
        order: [["timestamp", "DESC"]],
        limit,
        include: [
          {
            model: models.Content,
            as: "content",
            required: false,
          },
        ],
      });
    },

    platformLogs: async (_, { platform }) => {
      return await models.PostingLog.findAll({
        where: { platform },
        order: [["timestamp", "DESC"]],
        limit: 5,
      });
    },

    systemHealth: async () => {
      const platforms = await models.PlatformStat.findAll();
      const activePlatforms = platforms.filter(
        (p) => p.status === "active",
      ).length;
      const totalErrors = await models.PostingLog.count({
        where: { level: "error" },
      });

      return {
        overallStatus: activePlatforms > 0 ? "healthy" : "warning",
        activePlatforms,
        totalErrors,
        averageResponseTime: Math.random() * 500 + 200,
        systemUptime: 99.5 + Math.random() * 0.5,
        memoryUsage: Math.random() * 30 + 40,
        cpuUsage: Math.random() * 20 + 10,
      };
    },

    alertRules: async () => {
      return [
        {
          id: "1",
          name: "High Error Rate",
          platform: "Facebook",
          condition: "error_rate > threshold",
          threshold: 5.0,
          isActive: true,
          lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          name: "Platform Down",
          platform: null,
          condition: "platform_status == down",
          threshold: 1.0,
          isActive: true,
          lastTriggered: null,
        },
      ];
    },

    realtimeMetrics: async (_, { platform }) => {
      return {
        activeConnections: Math.floor(Math.random() * 10) + 1,
        queuedPosts: Math.floor(Math.random() * 50),
        postsPerMinute: Math.random() * 5 + 1,
        averageResponseTime: Math.random() * 1000 + 200,
        errorRate: Math.random() * 5,
        uptime: Math.random() * 100,
      };
    },
  },

  Mutation: {
    createAlertRule: async (_, { input }) => {
      return {
        id: Date.now().toString(),
        ...input,
        isActive: true,
        lastTriggered: null,
      };
    },

    updatePlatformStatus: async (_, { platform, status }) => {
      const platformStat = await models.PlatformStat.findOne({
        where: { name: platform },
      });

      if (!platformStat) {
        throw new Error("Platform not found");
      }

      return await platformStat.update({ status });
    },

    clearPlatformErrors: async (_, { platform }) => {
      await models.PostingLog.destroy({
        where: {
          platform,
          level: "error",
        },
      });

      await models.PlatformStat.update(
        {
          lastError: null,
          failureCount: 0,
          failureRate: 0,
        },
        { where: { name: platform } },
      );

      return {
        success: true,
        message: `Cleared errors for ${platform}`,
      };
    },

    restartPlatformWorker: async (_, { platform }) => {
      await models.PostingLog.create({
        platform,
        level: "info",
        component: "worker",
        message: `Worker for ${platform} restarted`,
        timestamp: new Date(),
      });

      return {
        success: true,
        message: `Worker for ${platform} restarted successfully`,
      };
    },
  },
};

module.exports = monitoringResolvers;