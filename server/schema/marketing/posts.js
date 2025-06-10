const { gql } = require("apollo-server-express");

const postsSchemaExtensions = gql`
  # ====================
  # POSTS INPUT TYPES
  # ====================
  input SchedulePostInput {
    contentId: ID!
    scheduledTime: Date!
    platform: String!
    mode: String = "Manual"
  }

  # ====================
  # POSTS QUERIES & MUTATIONS
  # ====================
  extend type Query {
    scheduledPosts(limit: Int, offset: Int): [ScheduledPost!]!
    scheduledPost(id: ID!): ScheduledPost
    postingLogs(limit: Int, offset: Int): [PostingLog!]!
  }

  extend type Mutation {
    schedulePost(input: SchedulePostInput!): ScheduledPost!
    updateScheduledPost(id: ID!, scheduledTime: Date!): ScheduledPost!
    cancelScheduledPost(id: ID!): ScheduledPost!
    retryScheduledPost(id: ID!): ScheduledPost!
  }
`;

module.exports = postsSchemaExtensions;
