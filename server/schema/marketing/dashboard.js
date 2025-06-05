const { gql } = require("apollo-server-express");

const dashboardSchema = gql`
  type MarketingStats {
    totalPosts: PostStats!
    pendingApproval: Int!
    errors: Int!
    abTestGroups: ABTestStats!
    trendingKeywords: Int!
  }

  type PostStats {
    today: Int!
    week: Int!
    month: Int!
  }

  extend type Query {
    marketingStats: MarketingStats
  }
`;

module.exports = dashboardSchema;
