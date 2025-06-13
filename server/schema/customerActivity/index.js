
const { gql } = require("apollo-server-express");

const customerActivitySchema = gql`
  type CustomerActivity {
    id: ID!
    customerId: ID!
    type: String!
    title: String!
    description: String
    activityDate: Date!
    duration: String
    participants: [String!]
    result: String!
    nextAction: String
    attachments: [String!]
    createdBy: ID!
    customer: Customer
    creator: User
    createdAt: Date!
    updatedAt: Date!
  }

  input CustomerActivityInput {
    customerId: ID!
    type: String!
    title: String!
    description: String
    activityDate: Date!
    duration: String
    participants: [String!]
    result: String!
    nextAction: String
    attachments: [String!]
  }

  input CustomerActivityUpdateInput {
    type: String
    title: String
    description: String
    activityDate: Date
    duration: String
    participants: [String!]
    result: String
    nextAction: String
    attachments: [String!]
  }

  input CustomerActivityFilter {
    customerId: ID
    type: String
    result: String
    dateFrom: Date
    dateTo: Date
    search: String
  }

  extend type Query {
    customerActivities(
      limit: Int
      offset: Int
      filter: CustomerActivityFilter
    ): [CustomerActivity!]!
    customerActivity(id: ID!): CustomerActivity
  }

  extend type Mutation {
    createCustomerActivity(input: CustomerActivityInput!): CustomerActivity!
    updateCustomerActivity(id: ID!, input: CustomerActivityUpdateInput!): CustomerActivity!
    deleteCustomerActivity(id: ID!): MutationResponse!
  }
`;

module.exports = customerActivitySchema;
