const { gql } = require("apollo-server-express");

const customerTypeDefs = gql`
  extend type Query {
    customers(limit: Int, offset: Int, search: String): [Customer!]!
    customer(id: ID!): Customer
    checkCompanyName(name: String!): CompanyNameCheckResult!
    addresses(limit: Int, offset: Int): [Address!]!
    services(limit: Int, offset: Int): [Service!]!
    users(limit: Int, offset: Int, search: String): [User!]!
  }

  extend type Mutation {
    createCustomer(input: CustomerInput!): Customer!
    updateCustomer(id: ID!, input: CustomerInput!): Customer!
    deleteCustomer(id: ID!): MutationResponse!
    createAddress(input: AddressInput!): Address!
    createService(input: ServiceInput!): Service!
  }

  type Customer {
    id: ID!
    name: String!
    contactName: String
    email: String
    phone: String
    industry: String
    companyType: String
    customCompanyType: String
    grade: String
    customGrade: String
    address: String
    assignedUserId: ID
    assignedUser: User
    status: String!
    contacts: [ContactPerson!]
    contactDepartment: String
    contactBirthDate: Date
    profileImage: String
    facilityImages: [String!]
    facebook: String
    tiktok: String
    instagram: String
    opportunities: [SalesOpportunity!]
    createdAt: Date!
    updatedAt: Date!
  }

  type ContactPerson {
    id: ID!
    name: String!
    department: String
    position: String
    phone: String
    email: String
    birthDate: Date
    facebook: String
    tiktok: String
    instagram: String
    profileImage: String
    createdAt: Date!
    updatedAt: Date!
  }

  type CompanyNameCheckResult {
    exists: Boolean!
    message: String!
  }

  type SalesOpportunity {
    id: ID!
    title: String!
    description: String
    customerId: ID
    assignedUserId: ID
    assignedUser: User
    expectedAmount: Float
    stage: String!
    probability: Int!
    expectedCloseDate: Date
    actualCloseDate: Date
    source: String
    priority: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Address {
    id: ID!
    name: String!
    country: String!
    state: String
    city: String!
    district: String
    street: String
    buildingNumber: String
    zipCode: String
    fullAddress: String!
    isDefault: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Service {
    id: ID!
    name: String!
    price: Float!
    description: String
    category: String
    status: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input CustomerInput {
    name: String!
    contactName: String
    email: String
    phone: String
    industry: String
    companyType: String
    customCompanyType: String
    grade: String
    customGrade: String
    address: String
    assignedUserId: ID
    status: String
    contactDepartment: String
    contactBirthDate: Date
    profileImage: String
    facilityImages: [String!]
    facebook: String
    tiktok: String
    instagram: String
    contacts: [ContactPersonInput!]
  }

  input ContactPersonInput {
    name: String!
    department: String
    position: String
    phone: String
    email: String
    birthDate: Date
    facebook: String
    tiktok: String
    instagram: String
    profileImage: String
  }

  input AddressInput {
    name: String!
    country: String!
    state: String
    city: String!
    district: String
    street: String
    buildingNumber: String
    zipCode: String
    fullAddress: String!
    isDefault: Boolean
  }

  input ServiceInput {
    name: String!
    price: Float!
    description: String
    category: String
    status: String
  }
`;

module.exports = customerTypeDefs;
