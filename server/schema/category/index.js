
const { gql } = require('apollo-server-express');

const categoryTypeDefs = gql`
  type Category {
    id: ID!
    code: String!
    names: CategoryNames!
    descriptions: CategoryDescriptions
    parentId: ID
    parent: Category
    children: [Category!]
    level: Int!
    sortOrder: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type CategoryNames {
    ko: String!
    vi: String!
    en: String!
  }

  type CategoryDescriptions {
    ko: String
    vi: String
    en: String
  }

  input CategoryNamesInput {
    ko: String!
    vi: String!
    en: String!
  }

  input CategoryDescriptionsInput {
    ko: String
    vi: String
    en: String
  }

  input CategoryInput {
    code: String!
    names: CategoryNamesInput!
    descriptions: CategoryDescriptionsInput
    parentId: ID
    level: Int
    sortOrder: Int
    isActive: Boolean
  }

  type CategoryCodeCheckResult {
    isAvailable: Boolean!
    message: String!
  }

  extend type Query {
    categories(parentId: ID, level: Int, isActive: Boolean): [Category!]!
    category(id: ID!): Category
    categoryByCode(code: String!): Category
    checkCategoryCode(code: String!): CategoryCodeCheckResult!
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

module.exports = categoryTypeDefs;
