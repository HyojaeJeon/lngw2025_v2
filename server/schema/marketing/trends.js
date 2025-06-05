const { gql } = require("apollo-server-express");

const trendsSchema = gql`
  type TrendingKeyword {
    keyword: String!
    mentions: Int!
    growth: Float!
    sentiment: String!
    relatedKeywords: [String]
  }

  type TrendAnalysisItem {
    topic: String!
    description: String
    growth: Float!
    opportunity: String
    risk: String
  }

  type ContentRecommendation {
    id: ID!
    trend: String!
    title: String!
    description: String!
    expectedEngagement: String!
    difficulty: String!
    priority: String!
  }

  type TrendAnalysis {
    rising: [TrendAnalysisItem]
    declining: [TrendAnalysisItem]
    contentRecommendations: [ContentRecommendation]
  }

  extend type Query {
    trendingKeywords(period: String): [TrendingKeyword]
    trendAnalysis(period: String): TrendAnalysis
  }
`;

module.exports = trendsSchema;
