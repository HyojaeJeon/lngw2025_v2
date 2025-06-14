const { gql } = require('apollo-server-express');

const customerActivityTypeDefs = gql`
  type CustomerActivity {
    id: ID!
    customerId: ID!
    type: String!
    title: String!
    description: String
    activityDate: String!
    duration: String
    participants: [String!]
    result: String
    nextAction: String
    attachments: [String!]
    createdBy: ID!
    customer: Customer
    creator: User
    createdAt: String!
    updatedAt: String!
  }

  input CustomerActivityInput {
    customerId: ID!
    type: String!
    title: String!
    description: String
    activityDate: String!
    duration: String
    participants: [String!]
    result: String
    nextAction: String
    attachments: [String!]
  }

  input CustomerActivityUpdateInput {
    type: String
    title: String
    description: String
    activityDate: String
    duration: String
    participants: [String!]
    result: String
    nextAction: String
    attachments: [String!]
  }

  input CustomerActivityFilterInput {
    customerId: ID
    type: String
    dateFrom: String
    dateTo: String
    createdBy: ID
  }

  extend type Query {
    customerActivities(filter: CustomerActivityFilterInput, limit: Int, offset: Int): [CustomerActivity!]!
    customerActivity(id: ID!): CustomerActivity
    customerActivityTypes: [String!]!
  }

  extend type Mutation {
    createCustomerActivity(input: CustomerActivityInput!): CustomerActivity!
    updateCustomerActivity(id: ID!, input: CustomerActivityUpdateInput!): CustomerActivity!
    deleteCustomerActivity(id: ID!): DeleteResult!
  }
`;

module.exports = customerActivityTypeDefs;