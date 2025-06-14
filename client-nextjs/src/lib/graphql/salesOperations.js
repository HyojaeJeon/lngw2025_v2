import { gql } from '@apollo/client';

// 매출 목록 조회
export const GET_SALES_ITEMS = gql`
  query GetSalesItems(
    $filter: SalesFilterInput
    $sort: SalesSortInput
    $page: Int
    $limit: Int
  ) {
    salesItems(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      success
      message
      salesItems {
        id
        salesDate
        type
        quantity
        unitPrice
        salesPrice
        totalPrice
        cost
        totalCost
        margin
        totalMargin
        finalMargin
        marginRate
        paymentStatus
        paidAmount
        notes
        salesRep {
          id
          name
          email
        }
        customer {
          id
          companyName
          contactPerson
        }
        category {
          id
          name
        }
        product {
          id
          name
          sku
        }
        productModel {
          id
          name
          modelNumber
        }
        createdAt
        updatedAt
      }
      pagination {
        totalCount
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
  }
`;

// 영업사원 목록 조회 (검색 지원)
export const GET_SALES_REPS = gql`
  query GetSalesReps($search: String, $limit: Int) {
    salesReps(search: $search, limit: $limit) {
      id
      name
      email
      department
      position
    }
  }
`;

// 고객사 목록 조회 (검색 지원)
export const GET_CUSTOMERS_FOR_SALES = gql`
  query GetCustomersForSales($limit: Int, $offset: Int) {
    customersForSales(limit: $limit, offset: $offset) {
      id
      contactName
      phone
      email
    }
  }
`;

// 제품 목록 조회 (검색 지원)
export const GET_PRODUCTS_FOR_SALES = gql`
  query GetProductsForSales($categoryId: Int, $search: String, $limit: Int) {
    productsForSales(categoryId: $categoryId, search: $search, limit: $limit) {
      id
      name
      sku
      price
      category {
        id
        name
      }
    }
  }
`;

// 제품 모델 목록 조회
export const GET_PRODUCT_MODELS_FOR_SALES = gql`
  query GetProductModelsForSales($productId: Int!, $search: String, $limit: Int) {
    productModelsForSales(productId: $productId, search: $search, limit: $limit) {
      id
      name
      modelNumber
      price
      consumerPrice
    }
  }
`;

// 매출 카테고리 목록 조회
export const GET_SALES_CATEGORIES = gql`
  query GetSalesCategories($search: String, $page: Int, $limit: Int) {
    salesCategories(search: $search, page: $page, limit: $limit) {
      success
      message
      salesCategories {
        id
        name
        code
        description
        sortOrder
        isActive
      }
      pagination {
        totalCount
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
  }
`;

// 매출 생성
export const CREATE_SALES_ITEM = gql`
  mutation CreateSalesItem($input: SalesItemInput!) {
    createSalesItem(input: $input) {
      success
      message
      salesItem {
        id
        salesDate
        type
        quantity
        unitPrice
        salesPrice
        totalPrice
        salesRep {
          id
          name
        }
        customer {
          id
          companyName
        }
        product {
          id
          name
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

// 매출 수정
export const UPDATE_SALES_ITEM = gql`
  mutation UpdateSalesItem($id: Int!, $input: SalesItemUpdateInput!) {
    updateSalesItem(id: $id, input: $input) {
      success
      message
      salesItem {
        id
        salesDate
        type
        quantity
        unitPrice
        salesPrice
        totalPrice
        margin
        totalMargin
        finalMargin
        marginRate
      }
      errors {
        field
        message
      }
    }
  }
`;

// 매출 삭제
export const DELETE_SALES_ITEM = gql`
  mutation DeleteSalesItem($id: Int!) {
    deleteSalesItem(id: $id) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

// 매출 카테고리 생성
export const CREATE_SALES_CATEGORY = gql`
  mutation CreateSalesCategory($input: SalesCategoryInput!) {
    createSalesCategory(input: $input) {
      success
      message
      salesCategory {
        id
        name
        code
        description
        sortOrder
        isActive
      }
      errors {
        field
        message
      }
    }
  }
`;

// 매출 카테고리 수정
export const UPDATE_SALES_CATEGORY = gql`
  mutation UpdateSalesCategory($id: Int!, $input: SalesCategoryUpdateInput!) {
    updateSalesCategory(id: $id, input: $input) {
      success
      message
      salesCategory {
        id
        name
        code
        description
        sortOrder
        isActive
      }
      errors {
        field
        message
      }
    }
  }
`;

// 대량 매출 수정
export const BULK_UPDATE_SALES_ITEMS = gql`
  mutation BulkUpdateSalesItems($updates: [SalesItemBulkUpdate!]!) {
    bulkUpdateSalesItems(updates: $updates) {
      success
      message
      salesItems {
        id
        salesDate
        quantity
        unitPrice
        salesPrice
        totalPrice
      }
      errors {
        field
        message
      }
    }
  }
`;