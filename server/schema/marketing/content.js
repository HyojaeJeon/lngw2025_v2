const { gql } = require("apollo-server-express");

const contentSchema = gql`
  type ContentResponse {
    contents: [Content!]!
    total: Int!
    hasMore: Boolean!
  }

  type ContentStats {
    total: Int!
    approved: Int!
    pending: Int!
    rejected: Int!
    scheduled: Int!
    published: Int!
  }

  input ContentInput {
    title: String!
    description: String
    content: String!
    mediaType: String!
    mode: String!
    keywords: String
    platforms: [String!]
    aiGenerated: Boolean
    confidence: Float
  }

  input GenerateContentInput {
    prompt: String!
    platforms: [String!]!
    contentType: String!
    mode: String!
    keywords: String
    topic: String!
    scheduleMode: String
    scheduleDate: String
    scheduleTime: String
    uploadOption: String
  }

  extend type Query {
    contents(
      limit: Int
      offset: Int
      status: String
      sortBy: String
      sortOrder: String
    ): ContentResponse!
    content(id: ID!): Content
    contentStats: ContentStats!
    topPerformingContent(limit: Int): [Content!]!
  }

  extend type Mutation {
    createContent(input: ContentInput!): Content!
    updateContent(id: ID!, input: ContentInput!): Content!
    approveContent(id: ID!, reason: String): Content!
    rejectContent(id: ID!, reason: String!): Content!
    deleteContent(id: ID!): Boolean!
    generateContent(input: GenerateContentInput!): Content!
    bulkContentAction(ids: [ID!]!, action: String!, reason: String): Boolean!
    scheduleContent(id: ID!, scheduledAt: Date!): Content!
    publishContent(id: ID!): Content!
  }
`;

module.exports = contentSchema;