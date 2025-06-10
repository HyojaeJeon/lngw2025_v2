const { gql } = require("apollo-server-express");

const monitoringSchemaExtensions = gql`
  # ====================
  # MONITORING INPUT TYPES
  # ====================
  input CreateAlertRuleInput {
    name: String!
    platform: String
    condition: String!
    threshold: Float!
  }

  # ====================
  # MONITORING QUERIES & MUTATIONS
  # ====================
  extend type Query {
    platformStats: [PlatformStat!]!
    postingLogs(platform: String, level: String, limit: Int): [PostingLog!]!
    platformLogs(platform: String!): [PostingLog!]!
    systemHealth: SystemHealth!
    alertRules: [AlertRule!]!
    realtimeMetrics(platform: String): PlatformRealTimeMetrics
  }

  extend type Mutation {
    createAlertRule(input: CreateAlertRuleInput!): AlertRule!
    updatePlatformStatus(platform: String!, status: String!): PlatformStat!
    clearPlatformErrors(platform: String!): MutationResponse!
    restartPlatformWorker(platform: String!): MutationResponse!
  }
`;

module.exports = monitoringSchemaExtensions;
