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
      status
      assignedUserId
      assignedUser {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_DETAIL = gql`
  query GetCustomerDetail($id: ID!) {
    customer(id: $id) {
      id
      name
      contactName
      email
      phone
      industry
      companyType
      grade
      address
      status
      profileImage
      facebook
      instagram
      assignedUserId
      assignedUser {
        id
        name
        email
      }
      contacts {
        id
        name
        department
        position
        phone
        email
        birthDate
        facebook
        instagram
        profileImage
      }
      opportunities {
        id
        title
        description
        expectedAmount
        stage
        probability
        priority
        expectedCloseDate
        source
      }
      images {
        id
        imageUrl
        imageType
        description
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_VOCS = gql`
  query GetCustomerVocs($filter: VocFilter!) {
    vocs(filter: $filter) {
      id
      title
      type
      content
      priority
      status
      createdAt
      updatedAt
      resolvedAt
      assignedTo {
        id
        name
      }
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