const { gql } = require("apollo-server-express");

const marketingDashboardSchemaExtensions = gql`
  # ====================
  # MARKETING DASHBOARD INPUT TYPES
  # ====================
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

  input MarketingObjectiveInput {
    title: String!
    description: String
    priority: String
    status: String
    progress: Int
  }

  input KeyResultInput {
    title: String!
    description: String
    targetValue: Float
    currentValue: Float
    unit: String
    status: String
    progress: Int
  }

  input ChecklistItemInput {
    text: String!
    completed: Boolean
    sortOrder: Int
  }

  # ====================
  # MARKETING DASHBOARD QUERIES & MUTATIONS
  # ====================
  extend type Query {
    marketingStats: MarketingStats!
    marketingOverview: MarketingOverview
    users(offset: Int, limit: Int): [User!]!
    usersCount: Int!
    marketingPlans(
      userId: ID
      status: String
      limit: Int
      offset: Int
    ): [MarketingPlan!]!
    marketingPlan(id: ID!): MarketingPlan
    marketingPlanObjectives(planId: ID!): [MarketingObjective!]!
  }

  extend type Mutation {
    createMarketingPlan(input: MarketingPlanInput!): MarketingPlan!
    updateMarketingPlan(id: ID!, input: MarketingPlanInput!): MarketingPlan!
    deleteMarketingPlan(id: ID!): Boolean!
    createMarketingObjective(
      planId: ID!
      input: MarketingObjectiveInput!
    ): MarketingObjective!
    updateMarketingObjective(
      id: ID!
      input: MarketingObjectiveInput!
    ): MarketingObjective!
    deleteMarketingObjective(id: ID!): Boolean!
    createKeyResult(objectiveId: ID!, input: KeyResultInput!): KeyResult!
    updateKeyResult(id: ID!, input: KeyResultInput!): KeyResult!
    deleteKeyResult(id: ID!): Boolean!
    createChecklistItem(
      keyResultId: ID!
      input: ChecklistItemInput!
    ): ChecklistItem!
    updateChecklistItem(id: ID!, input: ChecklistItemInput!): ChecklistItem!
    deleteChecklistItem(id: ID!): Boolean!
    toggleChecklistItem(id: ID!): ChecklistItem!
  }
`;

module.exports = marketingDashboardSchemaExtensions;