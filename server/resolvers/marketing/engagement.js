
const engagementResolvers = {
  Query: {
    marketingEngagements: async (_, { platform, limit = 50 }) => {
      return [
        {
          id: "1",
          platform: platform || "instagram",
          type: "comment",
          message: "이 제품 정말 좋아요!",
          username: "user123",
          timestamp: new Date(),
          status: "pending",
          sentiment: "positive",
        },
        {
          id: "2", 
          platform: platform || "facebook",
          type: "message",
          message: "배송 문의드립니다",
          username: "user456",
          timestamp: new Date(),
          status: "responded",
          response: "빠른 시일 내에 답변드리겠습니다.",
          sentiment: "neutral",
        },
      ];
    },

    automationRules: async () => {
      return [
        {
          id: "1",
          name: "긍정 댓글 자동 응답",
          platform: "instagram",
          trigger: "positive_comment",
          action: "auto_reply",
          isActive: true,
          responses: ["감사합니다!", "좋은 평가 감사드려요!"],
        },
      ];
    },
  },

  Mutation: {
    respondToEngagement: async (_, { id, response }) => {
      return {
        id,
        platform: "instagram",
        type: "comment", 
        message: "샘플 메시지",
        username: "user123",
        timestamp: new Date(),
        status: "responded",
        response,
        sentiment: "positive",
      };
    },

    createAutomationRule: async (_, { input }) => {
      return {
        id: Math.random().toString(),
        ...input,
        isActive: true,
      };
    },
  },
};

module.exports = engagementResolvers;
