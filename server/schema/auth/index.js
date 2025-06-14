const { gql } = require("apollo-server-express");

const authSchemaExtensions = gql`
  # ====================
  # AUTH INPUT TYPES
  # ====================
  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  input RegisterInput {
    email: String!
    password: String!
    confirmPassword: String!
    name: String!
    department: String
    position: String
    employeeId: String
    joinDate: Date
    phoneNumber: String
    phoneCountry: String
    address: String
    nationality: String
    birthDate: Date
    visaStatus: String
    emergencyContact: [EmergencyContactInput]
    skills: [SkillInput]
    experiences: [ExperienceInput]
  }

  input EmergencyContactInput {
    name: String!
    relationship: String!
    phoneNumber: String!
  }

  input SkillInput {
    name: String!
    level: String
  }

  input ExperienceInput {
    company: String!
    position: String!
    period: String!
    description: String
  }

  input UserUpdateInput {
    name: String
    phoneNumber: String
    address: String
    nationality: String
    department: String
    position: String
    employeeId: String
    joinDate: Date
    birthDate: Date
    visaStatus: String
    avatar: String
    emergencyContact: [EmergencyContactInput]
    skills: [SkillInput]
  }

  input UpdateUserProfileInput {
    name: String
    phoneNumber: String
    address: String
    nationality: String
    department: String
    position: String
    employeeId: String
    joinDate: Date
    birthDate: Date
    visaStatus: String
    avatar: String
    emergencyContact: [EmergencyContactInput]
    skills: [SkillInput]
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  # ====================
  # AUTH QUERIES & MUTATIONS
  # ====================
  extend type Query {
    me: User!
    employees(filter: EmployeeFilter): [User!]!
  }

  input EmployeeFilter {
    search: String
    role: String
    department: String
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    updateUserProfile(input: UpdateUserProfileInput!): User!
    verifyCurrentPassword(currentPassword: String!): Boolean
    changePassword(input: ChangePasswordInput!): Boolean
  }
`;

module.exports = authSchemaExtensions;