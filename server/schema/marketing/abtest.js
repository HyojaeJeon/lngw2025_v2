const { gql } = require("apollo-server-express");

const abtestSchemaExtensions = gql`
  # ====================
  # ABTEST INPUT TYPES
  # ====================
  input ABTestGroupInput {
    name: String!
    description: String
    duration: Int!
    endDate: Date
    targetAudience: String
    hypothesis: String
  }

  input ABTestVariantInput {
    name: String!
    content: String!
    abTestGroupId: Int!
    platform: String
    mediaType: String
  }

  input UpdateVariantMetricsInput {
    variantId: ID!
    views: Int
    engagement: Int
    conversions: Int
    revenue: Float
  }

  # ====================
  # ABTEST QUERIES & MUTATIONS
  # ====================
  extend type Query {
    abTestGroups(status: String): [ABTestGroup!]!
    abTestGroup(id: ID!): ABTestGroup
    abTestVariants(abTestGroupId: ID!): [ABTestVariant!]!
    abTestStats: ABTestStats!
    abTestResults(id: ID!): ABTestResults
    runningABTests: [ABTestGroup!]!
  }

  extend type Mutation {
    createABTestGroup(input: ABTestGroupInput!): ABTestGroup!
    createABTestVariant(input: ABTestVariantInput!): ABTestVariant!
    startABTest(id: ID!): ABTestGroup!
    endABTest(id: ID!): ABTestGroup!
    pauseABTest(id: ID!): ABTestGroup!
    resumeABTest(id: ID!): ABTestGroup!
    deleteABTest(id: ID!): MutationResponse!
    updateVariantMetrics(input: UpdateVariantMetricsInput!): ABTestVariant!
    cloneABTest(id: ID!, name: String!): ABTestGroup!
  }
`;

module.exports = abtestSchemaExtensions;
