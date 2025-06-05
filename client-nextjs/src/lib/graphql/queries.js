import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      department
      position
      employeeId
      joinDate
      phoneNumber
      address
      nationality
      birthDate
      visaStatus
      emergencyContact {
        name
        relationship
        phoneNumber
      }
      skills {
        name
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      id
      name
      email
      department
      position
    }
  }
`;

export const CHECK_COMPANY_NAME = gql`
  query CheckCompanyName($name: String!) {
    checkCompanyName(name: $name) {
      exists
      message
    }
  }
`;

export const GET_ADDRESSES = gql`
  query GetAddresses($limit: Int, $offset: Int) {
    addresses(limit: $limit, offset: $offset) {
      id
      name
      country
      state
      city
      district
      street
      buildingNumber
      zipCode
      fullAddress
      isDefault
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices($limit: Int, $offset: Int) {
    services(limit: $limit, offset: $offset) {
      id
      name
      price
      description
      category
      status
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers($limit: Int, $offset: Int, $search: String) {
    customers(limit: $limit, offset: $offset, search: $search) {
      id
      name
      contactName
      email
      phone
      industry
      companyType
      grade
      address
      profileImage
      status
      facilityImages {
        id
        imageUrl
        description
        sortOrder
      }
      assignedUserId
      assignedUser {
        id
        name
        email
        department
        position
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
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
      profileImage
      status
      assignedUserId
      assignedUser {
        id
        name
        email
        department
        position
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

export const GET_SALES_OPPORTUNITIES = gql`
  query GetSalesOpportunities {
    salesOpportunities {
      id
      title
      description
      customerId
      assignedUserId
      assignedUser {
        id
        name
        email
      }
      expectedAmount
      stage
      probability
      expectedCloseDate
      actualCloseDate
      source
      priority
      createdAt
      updatedAt
    }
  }
`;

export const USER_QUERY = gql`
  query GetUser {
    user {
      id
      email
      name
      role
      department
      position
      phoneNumber
      nationality
      joinDate
      birthDate
      address
      employeeId
      visaStatus
      emergencyContact {
        id
        name
        relationship
        phoneNumber
      }
      skills {
        id
        name
        level
      }
      experiences {
        id
        company
        position
        period
        description
      }
      createdAt
      updatedAt
    }
  }
`;