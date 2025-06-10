const { gql } = require("apollo-server-express");

const trendsSchemaExtensions = gql`
  extend type Query {
    trendingKeywords(period: String): [TrendingKeyword]
    trendAnalysis(period: String): TrendAnalysisResponse
  }
`;

module.exports = trendsSchemaExtensions;
