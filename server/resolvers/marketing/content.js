
const models = require("../../models");

const contentResolvers = {
  Content: {
    engagement: async (parent) => {
      return {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 200),
        ctr: Math.random() * 10,
        engagementRate: Math.random() * 20,
      };
    },
    analytics: async (parent) => {
      return {
        reach: Math.floor(Math.random() * 50000),
        impressions: Math.floor(Math.random() * 100000),
        clicks: Math.floor(Math.random() * 5000),
        conversions: Math.floor(Math.random() * 500),
        revenue: Math.random() * 10000,
        roi: Math.random() * 500,
      };
    },
  },
  Query: {
    contents: async (_, { limit = 10, offset = 0, status, sortBy = "createdAt", sortOrder = "desc" }) => {
      const where = status ? { status } : {};
      const order = [[sortBy, sortOrder.toUpperCase()]];

      const { rows: contents, count: total } = await models.Content.findAndCountAll({
        where,
        limit,
        offset,
        order,
        include: [{ model: models.User, as: "user" }],
      });

      return {
        contents,
        total,
        hasMore: offset + limit < total,
      };
    },

    content: async (_, { id }) => {
      return await models.Content.findByPk(id, {
        include: [{ model: models.User, as: "user" }],
      });
    },

    contentStats: async () => {
      const [total, approved, pending, rejected, scheduled, published] = await Promise.all([
        models.Content.count(),
        models.Content.count({ where: { status: "approved" } }),
        models.Content.count({ where: { status: "pending" } }),
        models.Content.count({ where: { status: "rejected" } }),
        models.Content.count({ where: { status: "scheduled" } }),
        models.Content.count({ where: { status: "published" } }),
      ]);

      return { total, approved, pending, rejected, scheduled, published };
    },

    topPerformingContent: async (_, { limit = 5 }) => {
      return await models.Content.findAll({
        where: { status: "published" },
        limit,
        order: [["createdAt", "DESC"]],
        include: [{ model: models.User, as: "user" }],
      });
    },
  },

  Mutation: {
    createContent: async (_, { input }) => {
      return await models.Content.create({
        ...input,
        userId: 1,
        status: "pending",
      });
    },

    updateContent: async (_, { id, input }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      return await content.update(input);
    },

    approveContent: async (_, { id, reason }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      return await content.update({
        status: "approved",
        approvedAt: new Date(),
      });
    },

    rejectContent: async (_, { id, reason }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      return await content.update({
        status: "rejected",
      });
    },

    deleteContent: async (_, { id }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      await content.destroy();
      return true;
    },

    generateContent: async (_, { input }) => {
      const { prompt, platforms, contentType, mode, keywords, topic, scheduleMode, uploadOption } = input;
      const generatedContent = `AI generated content: ${topic}\n\nPrompt: ${prompt}\nKeywords: ${keywords || 'N/A'}`;

      const status = uploadOption === "auto" ? "approved" : "pending";
      
      return await models.Content.create({
        title: `AI: ${topic}`,
        description: `Auto-generated content about ${topic}`,
        content: generatedContent,
        mediaType: contentType,
        mode: mode,
        keywords: keywords || "",
        platforms,
        aiGenerated: true,
        confidence: 0.85,
        status: status,
        userId: 1,
      });
    },

    bulkContentAction: async (_, { ids, action, reason }) => {
      const updateData = {};

      switch (action) {
        case "approve":
          updateData.status = "approved";
          updateData.approvedAt = new Date();
          break;
        case "reject":
          updateData.status = "rejected";
          break;
        case "delete":
          await models.Content.destroy({ where: { id: ids } });
          return true;
        default:
          throw new Error("Invalid action");
      }

      await models.Content.update(updateData, { where: { id: ids } });
      return true;
    },

    scheduleContent: async (_, { id, scheduledAt }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      return await content.update({
        status: "scheduled",
        scheduledAt,
      });
    },

    publishContent: async (_, { id }) => {
      const content = await models.Content.findByPk(id);
      if (!content) throw new Error("Content not found");

      return await content.update({
        status: "published",
        publishedAt: new Date(),
      });
    },
  },
};

module.exports = contentResolvers;
