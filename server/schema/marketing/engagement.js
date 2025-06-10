const { gql } = require("apollo-server-express");

const engagementSchemaExtensions = gql`
  # ====================
  # ENGAGEMENT INPUT TYPES
  # ====================
  input AutomationRuleInput {
    name: String!
    platform: String!
    trigger: String!
    action: String!
    responses: [String]
  }

  # ====================
  # ENGAGEMENT QUERIES & MUTATIONS
  # ====================
  extend type Query {
    marketingEngagements(platform: String, limit: Int): [MarketingEngagement]
    automationRules: [AutomationRule]
  }

  extend type Mutation {
    respondToEngagement(id: ID!, response: String!): MarketingEngagement
    createAutomationRule(input: AutomationRuleInput!): AutomationRule
  }
`;

module.exports = engagementSchemaExtensions;
