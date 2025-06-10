const { gql } = require("apollo-server-express");

const insightsSchemaExtensions = gql`
  extend type Query {
    marketingInsights(period: String): MarketingInsights
    performanceMetrics(platform: String, period: String): PerformanceMetrics
  }
`;

module.exports = insightsSchemaExtensions;
