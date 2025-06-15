const { gql } = require("apollo-server-express");

const salesSchema = gql`
  type SalesItem {
    id: ID!
    customerId: ID!
    customer: Customer
    productId: ID!
    product: Product
    quantity: Int!
    unitPrice: Float!
    totalAmount: Float!
    discountRate: Float
    discountAmount: Float
    finalAmount: Float!
    saleDate: String!
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus!
    deliveryStatus: DeliveryStatus
    notes: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  enum PaymentMethod {
    CASH
    CARD
    TRANSFER
    CHECK
  }

  enum PaymentStatus {
    PENDING
    PAID
    CANCELLED
    REFUNDED
  }

  enum DeliveryStatus {
    PENDING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type Payment {
    id: ID!
    salesItemId: ID!
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

  input SalesItemInput {
    customerId: ID!
    productId: ID!
    quantity: Int!
    unitPrice: Float!
    discountRate: Float
    saleDate: String!
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    deliveryStatus: DeliveryStatus
    notes: String
  }

  input SalesFilterInput {
    customerId: ID
    productId: ID
    paymentStatus: PaymentStatus
    deliveryStatus: DeliveryStatus
    startDate: String
    endDate: String
  }

  input SalesItemBulkUpdate {
    id: ID!
    input: SalesItemInput!
  }

  input IncentivePayoutInput {
    salesItemId: ID!
    recipientId: ID!
    paymentDate: String!
    amount: Float!
    type: String!
    receiptImageUrl: String
    note: String
  }

  type IncentivePayout {
    id: ID!
    salesItemId: ID!
    salesItem: SalesItem
    recipientId: ID!
    recipient: User
    paymentDate: String!
    amount: Float!
    type: String!
    receiptImageUrl: String
    note: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type IncentivePayoutsResult {
    success: Boolean!
    incentivePayouts: [IncentivePayout!]!
  }

  type SalesItemHistory {
    id: ID!
    salesItemId: ID!
    salesItem: SalesItem
    userId: ID!
    user: User
    action: String!
    field: String
    oldValue: String
    newValue: String
    metadata: JSON
    createdAt: String!
    updatedAt: String!
  }

  type SalesItemHistoriesResult {
    success: Boolean!
    histories: [SalesItemHistory!]!
  }

  type BulkUpdateSalesItemsResult {
    success: Boolean!
    message: String!
    salesItems: [SalesItem!]!
  }

  type IncentivePayoutResponse {
    success: Boolean!
    incentivePayout: IncentivePayout
    message: String!
  }

  extend type Query {
    salesItems(filter: SalesFilterInput, limit: Int, offset: Int): [SalesItem!]!
    salesItem(id: ID!): SalesItem
    salesReps(search: String, limit: Int): [User!]!
    customersForSales(limit: Int, offset: Int): [Customer!]!
    productsForSales(categoryId: ID, search: String, limit: Int): [Product!]!
    productModelsForSales(productId: ID!, search: String, limit: Int): [ProductModel!]!
    incentivePayouts(salesItemId: ID!, type: String): IncentivePayoutsResult!
    salesItemHistories(salesItemId: ID!): SalesItemHistoriesResult!
  }

  extend type Mutation {
    createSalesItem(input: SalesItemInput!): SalesItem!
    updateSalesItem(id: ID!, input: SalesItemInput!): SalesItem!
    deleteSalesItem(id: ID!): DeleteResult!
    bulkUpdateSalesItems(updates: [SalesItemBulkUpdate!]!): BulkUpdateSalesItemsResult!
    createIncentivePayout(input: IncentivePayoutInput!): IncentivePayoutResponse!
  }
`;

module.exports = salesSchema;