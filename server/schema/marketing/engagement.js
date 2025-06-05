const { gql } = require("apollo-server-express");

const engagementSchema = gql`
  type MarketingEngagement {
    id: ID!
    platform: String!
    type: String!
    message: String!
    username: String!
    timestamp: Date!
    status: String!
    response: String
    sentiment: String
  }

  type AutomationRule {
    id: ID!
    name: String!
    platform: String!
    trigger: String!
    action: String!
    isActive: Boolean!
    responses: [String]
  }

  input AutomationRuleInput {
    name: String!
    platform: String!
    trigger: String!
    action: String!
    responses: [String]
  }

  extend type Query {
    marketingEngagements(platform: String, limit: Int): [MarketingEngagement]
    automationRules: [AutomationRule]
  }

  extend type Mutation {
    respondToEngagement(id: ID!, response: String!): MarketingEngagement
    createAutomationRule(input: AutomationRuleInput!): AutomationRule
  }
`;

module.exports = engagementSchema;
