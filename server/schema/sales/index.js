const { gql } = require('apollo-server-express');

const salesTypeDefs = gql`
  # SalesItem 타입 정의
  type SalesItem {
    id: ID!
    salesRepId: Int!
    salesRep: User
    customerId: Int!
    customer: Customer
    type: SalesType!
    salesDate: String!
    categoryId: Int!
    category: Category
    productId: Int!
    product: Product
    productModelId: Int
    productModel: ProductModel
    quantity: Int!
    consumerPrice: Float
    unitPrice: Float!
    salesPrice: Float!
    totalPrice: Float!
    discountRate: Float!
    cost: Float!
    totalCost: Float!
    deliveryFee: Float!
    incentiveA: Float!
    incentiveB: Float!
    incentivePaid: Boolean!
    margin: Float!
    totalMargin: Float!
    finalMargin: Float!
    marginRate: Float!
    paymentStatus: PaymentStatus!
    paidAmount: Float!
    notes: String
    isActive: Boolean!
    payments: [Payment!]
    createdAt: String!
    updatedAt: String!
  }

  # Payment 타입 정의
  type Payment {
    id: ID!
    salesItemId: Int!
    salesItem: SalesItem
    paymentDate: String!
    amount: Float!
    paymentMethod: PaymentMethod!
    note: String
    receiptImageUrl: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # SalesCategory 타입 정의
  type SalesCategory {
    id: ID!
    name: String!
    code: String!
    description: String
    sortOrder: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # SalesItemHistory 타입 정의
  type SalesItemHistory {
    id: ID!
    salesItemId: Int!
    salesItem: SalesItem
    userId: Int!
    user: User
    action: String!
    field: String
    oldValue: String
    newValue: String
    metadata: String
    createdAt: String!
  }

  # IncentivePayout 타입 정의
  type IncentivePayout {
    id: ID!
    salesItemId: Int!
    salesItem: SalesItem
    recipientId: Int!
    recipient: User
    paymentDate: String!
    amount: Float!
    type: IncentiveType!
    receiptImageUrl: String
    note: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # Enum 타입들
  enum SalesType {
    SALE
    SAMPLE
    DEFECTIVE
    EXPIRED
  }

  enum PaymentStatus {
    UNPAID
    PARTIAL_PAID
    PAID
  }

  enum PaymentMethod {
    CASH
    CARD
    BANK_TRANSFER
    OTHER
  }

  enum IncentiveType {
    INCENTIVE_A
    INCENTIVE_B
  }

  # 입력 타입들
  input SalesItemInput {
    salesRepId: Int!
    customerId: Int!
    type: SalesType!
    salesDate: String!
    categoryId: Int!
    productId: Int!
    productModelId: Int
    quantity: Int!
    consumerPrice: Float
    unitPrice: Float!
    salesPrice: Float!
    deliveryFee: Float
    incentiveA: Float
    incentiveB: Float
    incentivePaid: Boolean
    notes: String
  }

  input SalesItemUpdateInput {
    salesRepId: Int
    customerId: Int
    type: SalesType
    salesDate: String
    categoryId: Int
    productId: Int
    productModelId: Int
    quantity: Int
    consumerPrice: Float
    unitPrice: Float
    salesPrice: Float
    deliveryFee: Float
    incentiveA: Float
    incentiveB: Float
    incentivePaid: Boolean
    notes: String
  }

  input PaymentInput {
    salesItemId: Int!
    paymentDate: String!
    amount: Float!
    paymentMethod: PaymentMethod!
    note: String
    receiptImageUrl: String
  }

  input PaymentUpdateInput {
    paymentDate: String
    amount: Float
    paymentMethod: PaymentMethod
    note: String
    receiptImageUrl: String
  }

  input SalesCategoryInput {
    name: String!
    code: String!
    description: String
    sortOrder: Int
  }

  input SalesCategoryUpdateInput {
    name: String
    code: String
    description: String
    sortOrder: Int
    isActive: Boolean
  }

  input IncentivePayoutInput {
    salesItemId: Int!
    recipientId: Int!
    paymentDate: String!
    amount: Float!
    type: IncentiveType!
    receiptImageUrl: String
    note: String
  }

  input IncentivePayoutUpdateInput {
    recipientId: Int
    paymentDate: String
    amount: Float
    type: IncentiveType
    receiptImageUrl: String
    note: String
  }

  input SalesFilterInput {
    salesRepId: Int
    customerId: Int
    type: SalesType
    categoryId: Int
    productId: Int
    productModelId: Int
    paymentStatus: PaymentStatus
    dateFrom: String
    dateTo: String
    search: String
    isActive: Boolean
  }

  input SalesSortInput {
    field: SalesSortField!
    direction: SortDirection!
  }

  enum SalesSortField {
    salesDate
    customerId
    productId
    quantity
    unitPrice
    totalPrice
    margin
    finalMargin
    marginRate
    createdAt
    updatedAt
  }

  # 응답 타입들
  type SalesItemResponse {
    success: Boolean!
    message: String
    salesItem: SalesItem
    errors: [FieldError]
  }

  type SalesItemListResponse {
    success: Boolean!
    message: String
    salesItems: [SalesItem]
    pagination: PaginationInfo
    errors: [FieldError]
  }

  type PaymentResponse {
    success: Boolean!
    message: String
    payment: Payment
    errors: [FieldError]
  }

  type PaymentListResponse {
    success: Boolean!
    message: String
    payments: [Payment]
    errors: [FieldError]
  }

  type SalesStatsResponse {
    success: Boolean!
    totalSales: Float!
    totalMargin: Float!
    totalPayments: Float!
    pendingPayments: Float!
    salesCount: Int!
    averageMarginRate: Float!
  }

  type SalesCategoryResponse {
    success: Boolean!
    message: String
    salesCategory: SalesCategory
    errors: [FieldError]
  }

  type SalesCategoryListResponse {
    success: Boolean!
    message: String
    salesCategories: [SalesCategory]
    pagination: PaginationInfo
    errors: [FieldError]
  }

  type IncentivePayoutResponse {
    success: Boolean!
    message: String
    incentivePayout: IncentivePayout
    errors: [FieldError]
  }

  type IncentivePayoutListResponse {
    success: Boolean!
    message: String
    incentivePayouts: [IncentivePayout]
    errors: [FieldError]
  }

  type SalesItemHistoryListResponse {
    success: Boolean!
    message: String
    histories: [SalesItemHistory]
    errors: [FieldError]
  }

  # 연관 데이터 조회를 위한 확장 Query
  extend type Query {
    # 매출 목록 조회 (필터링, 정렬, 페이지네이션 지원)
    salesItems(
      filter: SalesFilterInput
      sort: SalesSortInput
      page: Int
      limit: Int
    ): SalesItemListResponse!

    # 매출 상세 조회
    salesItem(id: Int!): SalesItemResponse!

    # 결제 내역 조회
    payments(salesItemId: Int!): PaymentListResponse!

    # 매출 통계
    salesStats(filter: SalesFilterInput): SalesStatsResponse!

    # 영업사원 목록 (검색 지원)
    salesReps(search: String, limit: Int): [User!]!

    # 고객사 목록 (검색 지원)
    customers(search: String, limit: Int): [Customer!]!
    customersForSales(limit: Int, offset: Int): [Customer!]!

    # 제품 목록 (카테고리별, 검색 지원)
    productsForSales(categoryId: Int, search: String, limit: Int): [Product!]!

    # 모델 목록 (제품별, 검색 지원)
    productModelsForSales(productId: Int!, search: String, limit: Int): [ProductModel!]!

    # 매출 카테고리 관련 쿼리
    salesCategories(search: String, page: Int, limit: Int): SalesCategoryListResponse!
    salesCategory(id: Int!): SalesCategoryResponse!

    # 인센티브 지급 내역 쿼리
    incentivePayouts(salesItemId: Int!, type: IncentiveType): IncentivePayoutListResponse!
    incentivePayout(id: Int!): IncentivePayoutResponse!

    # 매출 항목 변경 이력 쿼리
    salesItemHistories(salesItemId: Int!): SalesItemHistoryListResponse!
  }

  # Mutation 확장
  extend type Mutation {
    # 매출 생성
    createSalesItem(input: SalesItemInput!): SalesItemResponse!

    # 매출 수정 (인라인 편집용)
    updateSalesItem(id: Int!, input: SalesItemUpdateInput!): SalesItemResponse!

    # 매출 삭제
    deleteSalesItem(id: Int!): SalesItemResponse!

    # 결제 정보 관리
    createPayment(input: PaymentInput!): PaymentResponse!
    updatePayment(id: Int!, input: PaymentUpdateInput!): PaymentResponse!
    deletePayment(id: Int!): PaymentResponse!

    # 대량 처리
    bulkUpdateSalesItems(updates: [SalesItemBulkUpdate!]!): SalesItemListResponse!

    # 매출 카테고리 관리
    createSalesCategory(input: SalesCategoryInput!): SalesCategoryResponse!
    updateSalesCategory(id: Int!, input: SalesCategoryUpdateInput!): SalesCategoryResponse!
    deleteSalesCategory(id: Int!): SalesCategoryResponse!

    # 인센티브 지급 내역 관리
    createIncentivePayout(input: IncentivePayoutInput!): IncentivePayoutResponse!
    updateIncentivePayout(id: Int!, input: IncentivePayoutUpdateInput!): IncentivePayoutResponse!
    deleteIncentivePayout(id: Int!): IncentivePayoutResponse!
  }

  input SalesItemBulkUpdate {
    id: Int!
    input: SalesItemUpdateInput!
  }
`;

module.exports = salesTypeDefs;