
const { gql } = require("apollo-server-express");

const roleSchemaExtensions = gql`
  # ====================
  # ROLE TYPES
  # ====================
  type Role {
    id: ID!
    name: String!
    englishName: String!
    description: String
    color: String!
    isSystem: Boolean!
    isActive: Boolean!
    userCount: Int
    permissions: [RolePermission!]!
    createdAt: Date
    updatedAt: Date
  }

  type RolePermission {
    id: ID!
    roleId: ID!
    module: String!
    canRead: Boolean!
    canWrite: Boolean!
    canDelete: Boolean!
    canApprove: Boolean!
    canSystemConfig: Boolean!
    role: Role
    createdAt: Date
    updatedAt: Date
  }

  type PermissionMatrix {
    module: String!
    permissions: [RoleModulePermission!]!
  }

  type RoleModulePermission {
    roleId: ID!
    roleName: String!
    canRead: Boolean!
    canWrite: Boolean!
    canDelete: Boolean!
    canApprove: Boolean!
    canSystemConfig: Boolean!
  }

  # ====================
  # ROLE INPUT TYPES
  # ====================
  input CreateRoleInput {
    name: String!
    englishName: String!
    description: String
    color: String
    permissions: [RolePermissionInput!]
  }

  input UpdateRoleInput {
    name: String
    englishName: String
    description: String
    color: String
    isActive: Boolean
    permissions: [RolePermissionInput!]
  }

  input RolePermissionInput {
    module: String!
    canRead: Boolean!
    canWrite: Boolean!
    canDelete: Boolean!
    canApprove: Boolean!
    canSystemConfig: Boolean!
  }

  input UpdateUserRoleInput {
    userId: ID!
    roleId: ID!
  }

  input PermissionMatrixInput {
    module: String!
    permissions: [RoleModulePermissionInput!]!
  }

  input RoleModulePermissionInput {
    roleId: ID!
    canRead: Boolean!
    canWrite: Boolean!
    canDelete: Boolean!
    canApprove: Boolean!
    canSystemConfig: Boolean!
  }

  # ====================
  # ROLE QUERIES & MUTATIONS
  # ====================
  extend type Query {
    roles: [Role!]!
    role(id: ID!): Role
    permissionMatrix: [PermissionMatrix!]!
    usersWithRoles: [User!]!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: ID!, input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Boolean!
    updateUserRole(input: UpdateUserRoleInput!): User!
    updatePermissionMatrix(input: [PermissionMatrixInput!]!): Boolean!
  }
`;

module.exports = roleSchemaExtensions;
