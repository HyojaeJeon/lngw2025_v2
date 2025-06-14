
import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query GetCustomers($limit: Int, $offset: Int, $filter: CustomerFilter) {
    customers(limit: $limit, offset: $offset, filter: $filter) {
      id
      name
      contactName
      email
      phone
      industry
      companyType
      grade
      address
      assignedUserId
      assignedUser {
        id
        name
        email
        department
        position
      }
      status
      profileImage
      facebook
      tiktok
      instagram
      contacts {
        id
        name
        department
        position
        phone
        email
        birthDate
        facebook
        tiktok
        instagram
        profileImage
      }
      facilityImages {
        id
        imageUrl
        description
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      id
      name
      email
      phoneNumber
      department
      position
    }
  }
`;

export const USERS_QUERY = gql`
  query Users($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      id
      name
      email
      phoneNumber
      department
      position
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      name
      contactName
      email
      phone
      industry
      companyType
      grade
      address
      assignedUserId
      assignedUser {
        id
        name
        email
        department
        position
      }
      status
      profileImage
      facebook
      tiktok
      instagram
      contacts {
        id
        name
        department
        position
        phone
        email
        birthDate
        facebook
        tiktok
        instagram
        profileImage
      }
      facilityImages {
        id
        imageUrl
        description
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      name
      contactName
      email
      phone
      industry
      companyType
      grade
      address
      assignedUserId
      assignedUser {
        id
        name
        email
        department
        position
      }
      status
      profileImage
      facebook
      tiktok
      instagram
      contacts {
        id
        name
        department
        position
        phone
        email
        birthDate
        facebook
        tiktok
        instagram
        profileImage
      }
      facilityImages {
        id
        imageUrl
        description
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_COMPANY_NAME_QUERY = gql`
  query CheckCompanyName($name: String!) {
    checkCompanyName(name: $name) {
      exists
      message
    }
  }
`;
