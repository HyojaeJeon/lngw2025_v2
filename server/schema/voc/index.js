
const { gql } = require("apollo-server-express");

const vocSchemaExtensions = gql`
  # ====================
  # VOC INPUT TYPES
  # ====================
  input VocInput {
    customerId: ID!
    contactPersonId: ID
    type: String!
    title: String!
    content: String!
    priority: String!
    assignedToId: ID
    attachments: [String!]
  }

  input VocUpdateInput {
    type: String
    title: String
    content: String
    priority: String
    status: String
    assignedToId: ID
    resolution: String
    resolvedAt: Date
    attachments: [String!]
  }

  input VocFilter {
    customerId: ID
    status: String
    priority: String
    type: String
    assignedToId: ID
    dateFrom: Date
    dateTo: Date
    search: String
  }

  # ====================
  # VOC TYPES
  # ====================
  type Voc {
    id: ID!
    customerId: ID!
    customer: Customer!
    contactPersonId: ID
    contactPerson: ContactPerson
    type: String!
    title: String!
    content: String!
    priority: String!
    status: String!
    assignedToId: ID
    assignedTo: User
    resolution: String
    attachments: [String!]
    createdAt: Date!
    updatedAt: Date!
    resolvedAt: Date
    createdBy: User!
  }

  # ====================
  # VOC QUERIES & MUTATIONS
  # ====================
  extend type Query {
    vocs(filter: VocFilter, limit: Int, offset: Int): [Voc!]!
    voc(id: ID!): Voc
    vocStats: VocStats!
  }

  extend type Mutation {
    createVoc(input: VocInput!): Voc!
    updateVoc(id: ID!, input: VocUpdateInput!): Voc!
    deleteVoc(id: ID!): MutationResponse!
    assignVoc(id: ID!, assignedToId: ID!): Voc!
    resolveVoc(id: ID!, resolution: String!): Voc!
  }

  type VocStats {
    total: Int!
    pending: Int!
    inProgress: Int!
    resolved: Int!
    byPriority: VocPriorityStats!
    byType: [VocTypeStats!]!
  }

  type VocPriorityStats {
    high: Int!
    medium: Int!
    low: Int!
  }

  type VocTypeStats {
    type: String!
    count: Int!
  }
`;

module.exports = vocSchemaExtensions;
