const { gql } = require("apollo-server-express");

const types = gql`
  # ====================
  # SCALAR TYPES
  # ====================
  scalar Date
  scalar JSON
  scalar DateTime

  # ====================
  # BASE TYPES
  # ====================
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type DeleteResult {
    success: Boolean!
    message: String!
  }

  # ====================
  # USER & AUTH TYPES
  # ====================
  type User {
    id: ID
    email: String
    name: String
    firstName: String
    lastName: String
    role: String
    roleId: ID
    userRole: Role
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
    profileImage: String
    emergencyContact: [EmergencyContact]
    skills: [Skill]
    experiences: [Experience]
    createdAt: Date
    updatedAt: Date
  }

  # ====================
  # AUTH PAYLOAD
  # ====================
  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type EmergencyContact {
    id: ID
    name: String
    relationship: String
    phoneNumber: String
    userId: ID
    createdAt: Date
    updatedAt: Date
  }

  type Skill {
    id: ID
    name: String
    level: String
    userId: ID
    createdAt: Date
    updatedAt: Date
  }

  type Experience {
    id: ID
    company: String
    position: String
    period: String
    description: String
    userId: ID
    createdAt: Date
    updatedAt: Date
  }

  # ====================
  # CONTENT TYPES
  # ====================
  type Content {
    id: ID
    title: String
    description: String
    content: String
    mediaType: String
    mode: String
    keywords: String
    status: String
    platforms: [String]
    aiGenerated: Boolean
    confidence: Float
    userId: ID
    user: User
    engagement: ContentEngagement
    analytics: ContentAnalytics
    createdAt: Date
    updatedAt: Date
    approvedAt: Date
    scheduledAt: Date
    publishedAt: Date
  }

  type ContentEngagement {
    views: Int
    likes: Int
    shares: Int
    comments: Int
    ctr: Float
    engagementRate: Float
  }

  type ContentAnalytics {
    reach: Int
    impressions: Int
    clicks: Int
    conversions: Int
    revenue: Float
    roi: Float
  }

  type ContentResponse {
    contents: [Content]
    total: Int
    hasMore: Boolean
  }

  type ContentStats {
    total: Int
    approved: Int
    pending: Int
    rejected: Int
    scheduled: Int
    published: Int
  }

  # ====================
  # PLATFORM & POSTING TYPES
  # ====================
  type PlatformStat {
    id: ID
    platform: String
    status: String
    lastPosted: Date
    postsToday: Int
    errors: Int
    averageResponseTime: Float
    uptime: Float
    createdAt: Date
    updatedAt: Date
    name: String
    todayPosts: Int
    successCount: Int
    failureCount: Int
    failureRate: Float
    lastError: String
    realTimeMetrics: PlatformRealTimeMetrics
  }

  type PlatformRealTimeMetrics {
    activeConnections: Int
    queuedPosts: Int
    postsPerMinute: Float
    averageResponseTime: Float
    errorRate: Float
    uptime: Float
  }

  type PostingLog {
    id: ID
    platform: String
    action: String
    level: String
    message: String
    details: JSON
    timestamp: Date
    contentId: ID
    content: Content
  }

  type ScheduledPost {
    id: ID
    contentId: ID
    content: Content
    platform: String
    scheduledTime: Date
    status: String
    mode: String
    retries: Int
    lastError: String
    postedAt: Date
    createdAt: Date
    updatedAt: Date
  }

  # ====================
  # AB TEST TYPES
  # ====================
  type ABTestGroup {
    id: ID
    name: String
    description: String
    status: String
    duration: Int
    startDate: Date
    endDate: Date
    targetAudience: String
    hypothesis: String
    confidence: Float
    winningVariantId: ID
    createdAt: Date
    updatedAt: Date
    variants: [ABTestVariant]
  }

  type ABTestVariant {
    id: ID
    name: String
    content: String
    abTestGroupId: Int
    abTestGroup: ABTestGroup
    platform: String
    mediaType: String
    views: Int
    engagement: Int
    conversions: Int
    revenue: Float
    conversionRate: Float
    createdAt: Date
    updatedAt: Date
  }

  type ABTestResults {
    winningVariant: ABTestVariant
    improvement: Float
    significance: Float
    variants: [ABTestVariant]
  }

  type ABTestGroupStats {
    totalTests: Int
    activeTests: Int
    completedTests: Int
    avgImprovement: Float
    topPerformingVariant: ABTestVariant
    active: Int
    completed: Int
  }

  # ====================
  # MARKETING TYPES
  # ====================
  type MarketingStats {
    totalPosts: TotalPosts
    pendingApproval: Int
    errors: Int
    abTestGroups: ABTestGroupStats
    trendingKeywords: Int
  }

  type TotalPosts {
    today: Int
    week: Int
    month: Int
  }

  type MarketingOverview {
    totalCampaigns: Int
    activeCampaigns: Int
    completedCampaigns: Int
    draftCampaigns: Int
    totalBudget: Float
    spentBudget: Float
    remainingBudget: Float
    conversionRate: Float
    avgEngagementRate: Float
    totalImpressions: Int
    totalClicks: Int
    totalConversions: Int
  }

  type MarketingPlan {
    id: ID
    title: String
    description: String
    startDate: String
    endDate: String
    manager: String
    targetPersona: String
    coreMessage: String
    status: String
    userId: ID
    user: User
    objectives: [MarketingObjective]
    createdAt: String
    updatedAt: String
  }

  type MarketingObjective {
    id: ID
    planId: ID
    title: String
    description: String
    priority: String
    status: String
    progress: Int
    keyResults: [KeyResult]
    createdAt: String
    updatedAt: String
  }

  type KeyResult {
    id: ID
    objectiveId: ID
    title: String
    description: String
    targetValue: Float
    currentValue: Float
    unit: String
    status: String
    progress: Int
    checklist: [ChecklistItem]
    createdAt: String
    updatedAt: String
  }

  type ChecklistItem {
    id: ID
    keyResultId: ID
    text: String
    completed: Boolean
    completedAt: String
    sortOrder: Int
    createdAt: String
    updatedAt: String
  }

  # ====================
  # TREND & ANALYTICS TYPES
  # ====================
  type TrendAnalysis {
    id: ID
    topic: String
    description: String
    growth: Float
    type: String
    opportunity: String
    risk: String
    period: String
    confidence: Float
    createdAt: Date
    updatedAt: Date
    keywords: [TrendingKeyword]
  }

  type TrendingKeyword {
    id: ID
    keyword: String
    mentions: Int
    growth: Float
    sentiment: String
    relatedKeywords: [String]
    period: String
    source: String
    createdAt: Date
    updatedAt: Date
    trendId: ID
    trend: TrendAnalysis
  }

  type ContentRecommendation {
    id: ID
    trend: String
    title: String
    description: String
    expectedEngagement: String
    difficulty: String
    priority: String
    trendAnalysisId: ID
    trendAnalysis: TrendAnalysis
    createdAt: Date
    updatedAt: Date
  }

  type TrendAnalysisItem {
    topic: String
    description: String
    growth: Float
    opportunity: String
    risk: String
  }

  type TrendAnalysisResponse {
    rising: [TrendAnalysisItem]
    declining: [TrendAnalysisItem]
    contentRecommendations: [ContentRecommendation]
  }

  # ====================
  # ENGAGEMENT TYPES
  # ====================
  type MarketingEngagement {
    id: ID
    platform: String
    type: String
    message: String
    username: String
    timestamp: Date
    status: String
    response: String
    sentiment: String
  }

  type AutomationRule {
    id: ID
    name: String
    platform: String
    trigger: String
    action: String
    isActive: Boolean
    responses: [String]
  }

  # ====================
  # INSIGHTS TYPES
  # ====================
  type MarketingInsights {
    kpiData: KPIData
    topPerformingContent: [ContentPerformance]
    audienceInsights: AudienceInsights
    competitorAnalysis: [CompetitorData]
  }

  type KPIData {
    totalReach: KPIMetric
    totalViews: KPIMetric
    totalEngagement: KPIMetric
    avgEngagementRate: KPIMetric
  }

  type KPIMetric {
    value: Int
    change: Float
    period: String
  }

  type ContentPerformance {
    id: ID
    title: String
    platform: String
    reach: Int
    engagement: Int
    ctr: Float
    postedAt: Date
  }

  type AudienceInsights {
    demographics: [DemographicData]
    interests: [InterestData]
    peakTimes: [PeakTimeData]
  }

  type DemographicData {
    ageGroup: String
    percentage: Float
  }

  type InterestData {
    category: String
    affinity: Float
  }

  type PeakTimeData {
    hour: Int
    engagement: Int
  }

  type CompetitorData {
    competitor: String
    reach: Int
    engagement: Int
    contentTypes: [String]
    trends: [String]
  }

  type PerformanceMetrics {
    platform: String
    period: String
    metrics: PlatformMetrics
  }

  type PlatformMetrics {
    followers: Int
    posts: Int
    engagement: Int
    reach: Int
    impressions: Int
  }

  # ====================
  # MONITORING TYPES
  # ====================
  type SystemHealth {
    overallStatus: String
    activePlatforms: Int
    totalErrors: Int
    averageResponseTime: Float
    systemUptime: Float
    memoryUsage: Float
    cpuUsage: Float
  }

  type AlertRule {
    id: ID
    name: String
    platform: String
    condition: String
    threshold: Float
    isActive: Boolean
    lastTriggered: Date
  }

  # ====================
  # CUSTOMER TYPES
  # ====================

  type Customer {
    id: ID
    name: String
    companyName: String # 호환성을 위해 추가 (name의 별칭)
    contactName: String
    contactPerson: String # 호환성을 위해 추가 (contactName의 별칭)
    email: String
    phone: String
    industry: String
    companyType: String
    grade: String
    address: String
    assignedUserId: ID
    assignedUser: User
    status: String
    profileImage: String
    facebook: String
    tiktok: String
    instagram: String
    contacts: [ContactPerson]
    images: [CustomerImage]
    facilityImages: [CustomerImage]
    opportunities: [SalesOpportunity]
    createdAt: Date
    updatedAt: Date
  }

  type ContactPerson {
    id: ID
    customerId: ID
    customer: Customer
    name: String
    department: String
    position: String
    phone: String
    email: String
    birthDate: Date
    facebook: String
    tiktok: String
    instagram: String
    profileImage: String
    createdAt: Date
    updatedAt: Date
  }

  type CustomerImage {
    id: ID
    customerId: ID
    customer: Customer
    imageUrl: String
    imageType: String
    description: String
    sortOrder: Int
    createdAt: Date
    updatedAt: Date
  }

  type SalesOpportunity {
    id: ID
    title: String
    description: String
    customerId: ID
    customer: Customer
    assignedUserId: ID
    assignedUser: User
    expectedAmount: Float
    stage: String
    probability: Int
    expectedCloseDate: Date
    actualCloseDate: Date
    source: String
    priority: String
    createdAt: Date
    updatedAt: Date
  }

  # ====================
  # CATEGORY TYPES
  # ====================

  type Category {
    id: ID
    code: String
    names: CategoryNames
    name: String # 호환성을 위해 추가 (names.ko의 별칭)
    descriptions: CategoryDescriptions
    description: String # 호환성을 위해 추가 (descriptions.ko의 별칭)
    sortOrder: Int
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

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

  # Product 관련 타입들
  type Product {
    id: Int
    name: String
    code: String
    sku: String # 호환성을 위해 추가 (code의 별칭)
    description: String
    specifications: String
    categoryId: Int
    category: Category
    price: Float
    consumerPrice: Float
    cost: Float
    # salesList.md 추가 필드들
    incentiveA: Float
    incentiveB: Float
    currentStock: Int
    minStock: Int
    maxStock: Int
    soldQuantity: Int
    sampleQuantity: Int
    defectiveQuantity: Int
    status: ProductStatus
    weight: Float
    dimensions: Dimensions
    brand: String
    manufacturer: String
    modelNumber: String
    tags: [ProductTag]
    productModels: [ProductModel]
    images: [String]
    launchDate: String
    discontinueDate: String
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    seoTitle: String
    seoDescription: String
    seoKeywords: String
    inventoryRecords: [InventoryRecord]
    totalStock: Int
    totalValue: Float
    createdAt: String
    updatedAt: String
    deletedAt: String
  }

  type ProductTag {
    id: Int
    name: String
    description: String
    color: String
    isActive: Boolean
    usageCount: Int
    products: [Product]
    createdAt: String
    updatedAt: String
  }

  type Warehouse {
    id: Int
    code: String
    name: String
    description: String
    address: String
    managerName: String
    managerPhone: String
    capacity: Int
    temperature: JSON
    humidity: JSON
    isActive: Boolean
    isDefault: Boolean
    inventoryRecords: [InventoryRecord]
    createdAt: String
    updatedAt: String
  }

  type InventoryRecord {
    id: Int
    productId: Int
    product: Product
    warehouseId: Int
    warehouse: Warehouse
    quantity: Int
    reservedQuantity: Int
    availableQuantity: Int
    location: String
    lotNumber: String
    expiryDate: String
    cost: Float
    lastCountDate: String
    lastMovementDate: String
    stockMovements: [StockMovement]
    createdAt: String
    updatedAt: String
  }

  type StockMovement {
    id: Int
    inventoryRecordId: Int
    inventoryRecord: InventoryRecord
    type: StockMovementType
    reason: StockMovementReason
    quantity: Int
    unitCost: Float
    totalCost: Float
    fromWarehouseId: Int
    fromWarehouse: Warehouse
    toWarehouseId: Int
    toWarehouse: Warehouse
    referenceType: ReferenceType
    referenceId: Int
    referenceNumber: String
    notes: String
    processedBy: Int
    processor: User
    processedAt: String
    isConfirmed: Boolean
    confirmedBy: Int
    confirmer: User
    confirmedAt: String
    createdAt: String
    updatedAt: String
  }

  enum StockMovementType {
    IN
    OUT
    TRANSFER
    ADJUSTMENT
    RETURN
    DAMAGE
    SAMPLE
    PRODUCTION
  }

  enum StockMovementReason {
    PURCHASE
    SALE
    TRANSFER
    COUNT_ADJUST
    DAMAGED
    EXPIRED
    CUSTOMER_RETURN
    SUPPLIER_RETURN
    SAMPLE_REQUEST
    PRODUCTION_INPUT
    PRODUCTION_OUTPUT
    LOST
    THEFT
    OTHER
  }

  enum ReferenceType {
    PURCHASE_ORDER
    SALES_ORDER
    TRANSFER_ORDER
    ADJUSTMENT_ORDER
    RETURN_ORDER
    MANUAL
  }

  type Dimensions {
    length: Float
    width: Float
    height: Float
  }

  enum ProductStatus {
    active
    inactive
    discontinued
    out_of_stock
  }

  # ProductModel 관련 타입들
  type ProductModel {
    id: ID
    productId: Int
    product: Product
    modelName: String
    name: String # 호환성을 위해 추가 (modelName의 별칭)
    modelCode: String
    modelNumber: String # 호환성을 위해 추가 (modelCode의 별칭)
    description: String
    specifications: String
    price: Float
    consumerPrice: Float
    cost: Float
    # salesList.md 추가 필드들
    incentiveA: Float
    incentiveB: Float
    currentStock: Int
    minStock: Int
    maxStock: Int
    soldQuantity: Int
    weight: Float
    dimensions: JSON
    images: [String]
    color: String
    size: String
    material: String
    status: ProductModelStatus
    sortOrder: Int
    isActive: Boolean
    inventoryRecords: [InventoryRecord]
    createdAt: String
    updatedAt: String
  }

  enum ProductModelStatus {
    active
    inactive
    discontinued
    out_of_stock
  }

  # Common Types
  type FieldError {
    field: String
    message: String
  }
  type PaginationInfo {
    page: Int
    limit: Int
    total: Int
    totalCount: Int # 호환성을 위해 추가
    totalPages: Int
    hasNextPage: Boolean
    hasPrevPage: Boolean
    hasPreviousPage: Boolean # 호환성을 위해 추가
    currentPage: Int # 호환성을 위해 추가
  }

  enum SortDirection {
    ASC
    DESC
  }

  enum SortOrder {
    ASC
    DESC
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  # Employee Management Types
  type Employee {
    id: ID!
    employeeId: String!
    name: String!
    email: String!
    phone: String
    department: String!
    position: String!
    hireDate: Date!
    status: EmployeeStatus!
    salary: Float
    manager: Employee
    managerId: ID
    skills: [Skill!]!
    emergencyContacts: [EmergencyContact!]!
    experiences: [Experience!]!
    attendanceRecords: [AttendanceRecord!]!
    leaveRequests: [LeaveRequest!]!
    evaluations: [PerformanceEvaluation!]!
    createdAt: Date!
    updatedAt: Date!
  }

  enum EmployeeStatus {
    ACTIVE
    INACTIVE
    ON_LEAVE
    TERMINATED
  }

  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    date: Date!
    checkIn: DateTime
    checkOut: DateTime
    breakStart: DateTime
    breakEnd: DateTime
    workHours: Float
    overtimeHours: Float
    status: AttendanceStatus!
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    HALF_DAY
    SICK_LEAVE
    VACATION
  }

  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    type: LeaveType!
    startDate: Date!
    endDate: Date!
    days: Int!
    reason: String!
    status: LeaveStatus!
    approver: Employee
    approverId: ID
    approvedAt: DateTime
    comments: String
    createdAt: Date!
    updatedAt: Date!
  }

  enum LeaveType {
    ANNUAL
    SICK
    PERSONAL
    MATERNITY
    PATERNITY
    BEREAVEMENT
    UNPAID
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    employee: Employee!
    evaluator: Employee!
    evaluatorId: ID!
    period: String!
    overallRating: Float!
    goals: [EvaluationGoal!]!
    strengths: String
    improvements: String
    comments: String
    status: EvaluationStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  type EvaluationGoal {
    id: ID!
    evaluationId: ID!
    title: String!
    description: String
    targetValue: String
    actualValue: String
    rating: Float
    weight: Float
  }

  enum EvaluationStatus {
    DRAFT
    SUBMITTED
    REVIEWED
    COMPLETED
  }

  type SalaryRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    baseSalary: Float!
    allowances: Float
    deductions: Float
    overtime: Float
    bonus: Float
    totalSalary: Float!
    payPeriod: String!
    payDate: Date!
    status: PayrollStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  enum PayrollStatus {
    PENDING
    PROCESSED
    PAID
    CANCELLED
  }

  # Employee Input Types
  input EmployeeInput {
    employeeId: String!
    name: String!
    email: String!
    phone: String
    department: String!
    position: String!
    hireDate: Date!
    salary: Float
    managerId: ID
    status: EmployeeStatus
  }

  input AttendanceInput {
    employeeId: ID!
    date: Date!
    checkIn: DateTime
    checkOut: DateTime
    breakStart: DateTime
    breakEnd: DateTime
    status: AttendanceStatus!
    notes: String
  }

  input LeaveRequestInput {
    employeeId: ID!
    type: LeaveType!
    startDate: Date!
    endDate: Date!
    reason: String!
  }

  input PerformanceEvaluationInput {
    employeeId: ID!
    evaluatorId: ID!
    period: String!
    overallRating: Float!
    strengths: String
    improvements: String
    comments: String
    goals: [EvaluationGoalInput!]!
  }

  input EvaluationGoalInput {
    title: String!
    description: String
    targetValue: String
    actualValue: String
    rating: Float
    weight: Float
  }

  input SalaryRecordInput {
    employeeId: ID!
    baseSalary: Float!
    allowances: Float
    deductions: Float
    overtime: Float
    bonus: Float
    payPeriod: String!
    payDate: Date!
  }
`;

module.exports = types;