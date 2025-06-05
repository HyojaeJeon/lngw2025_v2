
const insightsResolvers = {
  Query: {
    marketingInsights: async (_, { period = "30d" }) => {
      return {
        kpiData: {
          totalReach: { value: 125000, change: 12.5, period },
          totalViews: { value: 89000, change: 8.3, period },
          totalEngagement: { value: 12500, change: 15.2, period },
          avgEngagementRate: { value: 14, change: 2.1, period },
        },
        topPerformingContent: [
          {
            id: "1",
            title: "신제품 런칭 이벤트",
            platform: "Instagram",
            reach: 25000,
            engagement: 3200,
            ctr: 4.2,
            postedAt: new Date(),
          },
        ],
        audienceInsights: {
          demographics: [
            { ageGroup: "18-24", percentage: 25.5 },
            { ageGroup: "25-34", percentage: 45.2 },
            { ageGroup: "35-44", percentage: 20.1 },
            { ageGroup: "45+", percentage: 9.2 },
          ],
          interests: [
            { category: "패션", affinity: 78.5 },
            { category: "뷰티", affinity: 65.2 },
            { category: "라이프스타일", affinity: 55.8 },
          ],
          peakTimes: [
            { hour: 9, engagement: 120 },
            { hour: 12, engagement: 180 },
            { hour: 18, engagement: 250 },
            { hour: 21, engagement: 200 },
          ],
        },
        competitorAnalysis: [
          {
            competitor: "경쟁사A",
            reach: 95000,
            engagement: 8500,
            contentTypes: ["이미지", "비디오", "스토리"],
            trends: ["친환경", "지속가능성"],
          },
        ],
      };
    },

    performanceMetrics: async (_, { platform, period = "30d" }) => {
      return {
        platform: platform || "instagram",
        period,
        metrics: {
          followers: 15420,
          posts: 45,
          engagement: 8250,
          reach: 125000,
          impressions: 180500,
        },
      };
    },
  },
};

module.exports = insightsResolvers;
