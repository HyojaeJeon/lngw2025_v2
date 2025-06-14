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

  extend type Query {
    salesItems(filter: SalesFilterInput, limit: Int, offset: Int): [SalesItem!]!
    salesItem(id: ID!): SalesItem
  }

  extend type Mutation {
    createSalesItem(input: SalesItemInput!): SalesItem!
    updateSalesItem(id: ID!, input: SalesItemInput!): SalesItem!
    deleteSalesItem(id: ID!): DeleteResult!
  }
`;

module.exports = salesSchema;