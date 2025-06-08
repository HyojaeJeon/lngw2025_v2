const { gql } = require("apollo-server-express");

const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
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

  input ExperienceInput {
    company: String!
    position: String!
    period: String!
    description: String
  }

  type EmergencyContact {
    name: String!
    relationship: String!
    phoneNumber: String!
  }

  type Experience {
    id: ID!
    company: String!
    position: String!
    period: String!
    description: String
    userId: ID!
    createdAt: Date!
    updatedAt: Date!
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

  type User {
    id: ID!
    email: String!
    name: String
    role: String
    department: String
    position: String
    phoneNumber: String
    nationality: String
    joinDate: Date
    birthDate: Date
    address: String
    employeeId: String
    visaStatus: String
    avatar: String
    emergencyContact: [EmergencyContact]
    skills: [Skill]
    experiences: [Experience]
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUserProfile(input: UpdateUserProfileInput!): User!
    verifyCurrentPassword(currentPassword: String!): Boolean
    changePassword(input: ChangePasswordInput!): Boolean
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }
`;

module.exports = authTypeDefs;