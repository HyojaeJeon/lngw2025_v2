const { gql } = require('apollo-server-express');

const marketingDashboardTypeDefs = gql`
  type MarketingOverview {
    totalCampaigns: Int
    activeCampaigns: Int
    completedCampaigns: Int
    draftCampaigns: Int
    totalBudget: Float
    spentBudget: Float
    remainingBudget: Float
    conversionRate: Float
    avgEngagementRate: Float
    totalImpressions: Int
    totalClicks: Int
    totalConversions: Int
  }

  type MarketingPlan {
    id: ID!
    title: String!
    description: String
    startDate: String
    endDate: String
    manager: String
    targetPersona: String
    coreMessage: String
    status: String
    createdAt: String
    updatedAt: String
  }

  input MarketingPlanInput {
    title: String
    description: String
    startDate: String
    endDate: String
    manager: String
    targetPersona: String
    coreMessage: String
    status: String
  }

  extend type Query {
    marketingOverview: MarketingOverview
    users(offset: Int, limit: Int): [User!]!
    usersCount: Int!
  }

  extend type Mutation {
    updateMarketingPlan(id: ID!, input: MarketingPlanInput!): MarketingPlan!
  }
`;