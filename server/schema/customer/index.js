const { gql } = require("apollo-server-express");

const customerSchemaExtensions = gql`
  # ====================
  # CUSTOMER INPUT TYPES
  # ====================
  input CustomerInput {
    name: String!
    contactName: String
    email: String
    phone: String
    industry: String
    companyType: String
    grade: String
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

  input CustomerUpdateInput {
    name: String
    contactName: String
    email: String
    phone: String
    industry: String
    companyType: String
    grade: String
    address: String
    assignedUserId: ID
    status: String
    profileImage: String
    facebook: String
    tiktok: String
    instagram: String
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

  input CustomerImageInput {
    imageUrl: String!
    imageType: String
    description: String
    sortOrder: Int
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

  # ====================
  # CUSTOMER RESPONSE TYPES (specific to customer schema)
  # ====================
  type CompanyNameCheckResult {
    exists: Boolean!
    message: String!
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

  # ====================
  # CUSTOMER QUERIES & MUTATIONS
  # ====================
  extend type Query {
    customers(limit: Int, offset: Int, search: String, filter: CustomerFilter): [Customer!]!
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
    addContactPerson(customerId: ID!, input: ContactPersonInput!): ContactPerson!
    updateContactPerson(id: ID!, input: ContactPersonInput!): ContactPerson!
    deleteContactPerson(id: ID!): MutationResponse!
    addCustomerImage(customerId: ID!, input: CustomerImageInput!): CustomerImage!
    deleteCustomerImage(id: ID!): MutationResponse!
  }

  input CustomerFilter {
    search: String
    status: String
    grade: String
    assignedUserId: ID
  }
`;

module.exports = customerSchemaExtensions;
