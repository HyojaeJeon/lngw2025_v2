const { gql } = require("apollo-server-express");
const { mergeTypeDefs } = require("@graphql-tools/merge");

// 기본 스칼라 타입과 루트 타입 정의
const baseTypeDefs = gql`
  scalar Date
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }



  type EmergencyContact {
    id: ID!
    name: String!
    relationship: String!
    phoneNumber: String!
    userId: ID!
    createdAt: Date!
    updatedAt: Date!
  }

  type Skill {
    id: ID!
    name: String!
    level: String!
    userId: ID!
    createdAt: Date!
    updatedAt: Date!
  }

  # 공통 타입들
  type Content {
    id: ID!
    title: String!
    description: String
    content: String!
    mediaType: String!
    mode: String!
    keywords: String
    status: String!
    platforms: [String!]!
    aiGenerated: Boolean!
    confidence: Float
    userId: ID!
    user: User
    engagement: ContentEngagement
    analytics: ContentAnalytics
    createdAt: Date!
    updatedAt: Date!
    approvedAt: Date
    scheduledAt: Date
    publishedAt: Date
  }

  type ContentEngagement {
    views: Int!
    likes: Int!
    shares: Int!
    comments: Int!
    ctr: Float!
    engagementRate: Float!
  }

  type ContentAnalytics {
    reach: Int!
    impressions: Int!
    clicks: Int!
    conversions: Int!
    revenue: Float!
    roi: Float!
  }

  type PlatformStat {
    id: ID!
    platform: String!
    status: String!
    lastPosted: Date
    postsToday: Int!
    errors: Int!
    averageResponseTime: Float!
    uptime: Float!
    createdAt: Date!
    updatedAt: Date!
    name: String
    todayPosts: Int!
    successCount: Int!
    failureCount: Int!
    failureRate: Float!
    lastError: String
    realTimeMetrics: PlatformRealTimeMetrics
  }

  type PostingLog {
    id: ID!
    platform: String!
    action: String!
    level: String!
    message: String!
    details: JSON
    timestamp: Date!
    contentId: ID
    content: Content
  }

  type ScheduledPost {
    id: ID!
    contentId: ID!
    content: Content
    platform: String!
    scheduledTime: Date!
    status: String!
    mode: String!
    retries: Int!
    lastError: String
    postedAt: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type ABTestGroup {
    id: ID!
    name: String!
    description: String
    status: String!
    duration: Int!
    startDate: Date
    endDate: Date
    targetAudience: String
    hypothesis: String
    confidence: Float
    winningVariantId: ID
    createdAt: Date!
    updatedAt: Date!
    variants: [ABTestVariant!]!
  }

  type ABTestVariant {
    id: ID!
    name: String!
    content: String!
    abTestGroupId: Int!
    abTestGroup: ABTestGroup
    platform: String
    mediaType: String
    views: Int!
    engagement: Int!
    conversions: Int!
    revenue: Float!
    conversionRate: Float!
    createdAt: Date!
    updatedAt: Date!
  }

  type ABTestResults {
    winningVariant: ABTestVariant
    improvement: Float!
    significance: Float!
    variants: [ABTestVariant!]!
  }

  type PlatformRealTimeMetrics {
    activeConnections: Int!
    queuedPosts: Int!
    postsPerMinute: Float!
    averageResponseTime: Float!
    errorRate: Float!
    uptime: Float!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }
`;

// 메뉴별 스키마 import
const authSchema = require("./auth");
const customerSchema = require("./customer");
const contentSchema = require("./marketing/content");
const trendsSchema = require("./marketing/trends");
const monitoringSchema = require("./marketing/monitoring");
const abtestSchema = require("./marketing/abtest");
const dashboardSchema = require("./marketing/dashboard");
const engagementSchema = require("./marketing/engagement");
const insightsSchema = require("./marketing/insights");
const postsSchema = require("./marketing/posts");
const categorySchema = require('./category');

// 모든 스키마 병합
module.exports = mergeTypeDefs([
  baseTypeDefs,
  authSchema,
  customerSchema,
  categorySchema,
  contentSchema,
  dashboardSchema,
  monitoringSchema,
  abtestSchema,
  engagementSchema,
  trendsSchema,
  insightsSchema,
  postsSchema,
]);