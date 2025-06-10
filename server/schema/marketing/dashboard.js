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
    userId: ID!
    user: User
    objectives: [MarketingObjective!]
    createdAt: String
    updatedAt: String
  }

  type MarketingObjective {
    id: ID!
    planId: ID!
    title: String!
    description: String
    priority: String
    status: String
    progress: Int
    keyResults: [KeyResult!]
    createdAt: String
    updatedAt: String
  }

  type KeyResult {
    id: ID!
    objectiveId: ID!
    title: String!
    description: String
    targetValue: Float
    currentValue: Float
    unit: String
    status: String
    progress: Int
    checklist: [ChecklistItem!]
    createdAt: String
    updatedAt: String
  }

  type ChecklistItem {
    id: ID!
    keyResultId: ID!
    text: String!
    completed: Boolean!
    completedAt: String
    sortOrder: Int
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

  extend type Query {
    marketingOverview: MarketingOverview
    users(offset: Int, limit: Int): [User!]!
    usersCount: Int!
    marketingPlans(userId: ID, status: String, limit: Int, offset: Int): [MarketingPlan!]!
    marketingPlan(id: ID!): MarketingPlan
    marketingPlanObjectives(planId: ID!): [MarketingObjective!]!
  }

  extend type Mutation {
    createMarketingPlan(input: MarketingPlanInput!): MarketingPlan!
    updateMarketingPlan(id: ID!, input: MarketingPlanInput!): MarketingPlan!
    deleteMarketingPlan(id: ID!): Boolean!
    createMarketingObjective(planId: ID!, input: MarketingObjectiveInput!): MarketingObjective!
    updateMarketingObjective(id: ID!, input: MarketingObjectiveInput!): MarketingObjective!
    deleteMarketingObjective(id: ID!): Boolean!
    createKeyResult(objectiveId: ID!, input: KeyResultInput!): KeyResult!
    updateKeyResult(id: ID!, input: KeyResultInput!): KeyResult!
    deleteKeyResult(id: ID!): Boolean!
    createChecklistItem(keyResultId: ID!, input: ChecklistItemInput!): ChecklistItem!
    updateChecklistItem(id: ID!, input: ChecklistItemInput!): ChecklistItem!
    deleteChecklistItem(id: ID!): Boolean!
    toggleChecklistItem(id: ID!): ChecklistItem!
  }
`;