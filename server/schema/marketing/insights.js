const { gql } = require("apollo-server-express");

const insightsSchema = gql`
  type MarketingInsights {
    kpiData: KPIData!
    topPerformingContent: [ContentPerformance]
    audienceInsights: AudienceInsights!
    competitorAnalysis: [CompetitorData]
  }

  type KPIData {
    totalReach: KPIMetric!
    totalViews: KPIMetric!
    totalEngagement: KPIMetric!
    avgEngagementRate: KPIMetric!
  }

  type KPIMetric {
    value: Int!
    change: Float!
    period: String!
  }

  type ContentPerformance {
    id: ID!
    title: String!
    platform: String!
    reach: Int!
    engagement: Int!
    ctr: Float!
    postedAt: Date!
  }

  type AudienceInsights {
    demographics: [DemographicData]
    interests: [InterestData]
    peakTimes: [PeakTimeData]
  }

  type DemographicData {
    ageGroup: String!
    percentage: Float!
  }

  type InterestData {
    category: String!
    affinity: Float!
  }

  type PeakTimeData {
    hour: Int!
    engagement: Int!
  }

  type CompetitorData {
    competitor: String!
    reach: Int!
    engagement: Int!
    contentTypes: [String]
    trends: [String]
  }

  type PerformanceMetrics {
    platform: String!
    period: String!
    metrics: PlatformMetrics!
  }

  type PlatformMetrics {
    followers: Int!
    posts: Int!
    engagement: Int!
    reach: Int!
    impressions: Int!
  }

  extend type Query {
    marketingInsights(period: String): MarketingInsights
    performanceMetrics(platform: String, period: String): PerformanceMetrics
  }
`;

module.exports = insightsSchema;
