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
    categories(search: String, page: Int, limit: Int): CategoryListResponse!
    category(id: Int!): Category
    categoryByCode(code: String!): Category
    checkCategoryCode(code: String!): CategoryCodeCheckResult!
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category
    updateCategory(id: ID!, input: CategoryInput): Category
    deleteCategory(id: ID!): Boolean!
  }

  type CategoryResponse {
    success: Boolean!
    message: String
    category: Category
    errors: [FieldError]
  }

  type CategoryListResponse {
    success: Boolean!
    message: String
    categories: [Category!]!
    pagination: PaginationInfo
    errors: [FieldError]
  }
`;

module.exports = categorySchemaExtensions;