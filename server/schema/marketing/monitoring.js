const { gql } = require("apollo-server-express");

const monitoringSchema = gql`
  type SystemHealth {
    overallStatus: String!
    activePlatforms: Int!
    totalErrors: Int!
    averageResponseTime: Float!
    systemUptime: Float!
    memoryUsage: Float!
    cpuUsage: Float!
  }

  type AlertRule {
    id: ID!
    name: String!
    platform: String
    condition: String!
    threshold: Float!
    isActive: Boolean!
    lastTriggered: Date
  }

  input CreateAlertRuleInput {
    name: String!
    platform: String
    condition: String!
    threshold: Float!
  }

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

module.exports = monitoringSchema;
