import { gql } from '@apollo/client';

// 고객 목록 조회 쿼리
export const GET_CUSTOMERS = gql`
  query GetCustomers($filter: CustomerFilterInput) {
    customers(filter: $filter) {
      id
      name
      contactName
      email
      phone
      grade
      profileImage
      address
      business
      taxId
      status
      createdAt
      updatedAt
      contactPersons {
        id
        name
        position
        phone
        email
      }
      customerImages {
        id
        imageUrl
        imageType
      }
    }
  }
`;

// 사용자 목록 조회 쿼리
export const GET_USERS = gql`
  query GetUsers($filter: UserFilterInput) {
    users(filter: $filter) {
      id
      name
      email
      role
      department
      position
      avatar
    }
  }
`;

// 고객 생성 뮤테이션
export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      success
      message
      customer {
        id
        name
        contactName
        email
        phone
        grade
        profileImage
        address
        business
        taxId
        status
      }
    }
  }
`;

// 고객 업데이트 뮤테이션
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      success
      message
      customer {
        id
        name
        contactName
        email
        phone
        grade
        profileImage
        address
        business
        taxId
        status
      }
    }
  }
`;

// 고객 삭제 뮤테이션
export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`;

// 고객 상세 조회 쿼리
export const GET_CUSTOMER_DETAIL = gql`
  query GetCustomerDetail($id: ID!) {
    customer(id: $id) {
      id
      name
      contactName
      email
      phone
      grade
      profileImage
      address
      business
      taxId
      status
      createdAt
      updatedAt
      contactPersons {
        id
        name
        position
        phone
        email
        department
      }
      customerImages {
        id
        imageUrl
        imageType
        description
      }
      salesItems {
        id
        salesDate
        totalPrice
        paymentStatus
        product {
          name
        }
      }
    }
  }
`;