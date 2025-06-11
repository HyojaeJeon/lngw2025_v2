const { gql } = require("apollo-server-express");

const categorySchemaExtensions = gql`
  # ====================
  # CATEGORY SPECIFIC TYPES
  # ====================
  type CategoryNames {
    ko: String
    vi: String
    en: String
  }

  type CategoryDescriptions {
    ko: String
    vi: String
    en: String
  }

  type CategoryCodeCheckResult {
    isAvailable: Boolean!
    message: String!
  }

  # ====================
  # CATEGORY INPUT TYPES
  # ====================
  input CategoryNamesInput {
    ko: String
    vi: String
    en: String
  }

  input CategoryDescriptionsInput {
    ko: String
    vi: String
    en: String
  }

  input CategoryInput {
    code: String!
    names: CategoryNamesInput
    descriptions: CategoryDescriptionsInput
    sortOrder: Int
    isActive: Boolean
  }

  input CategoryUpdateInput {
    code: String
    names: CategoryNamesInput
    descriptions: CategoryDescriptionsInput
    sortOrder: Int
    isActive: Boolean
  }

  # ====================
  # CATEGORY QUERIES & MUTATIONS
  # ====================
  extend type Query {
    categories(isActive: Boolean): [Category]
    category(id: ID!): Category
    categoryByCode(code: String!): Category
    checkCategoryCode(code: String!): CategoryCodeCheckResult!
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category
    updateCategory(id: ID!, input: CategoryInput): Category
    deleteCategory(id: ID!): Boolean!
  }
`;

module.exports = categorySchemaExtensions;
