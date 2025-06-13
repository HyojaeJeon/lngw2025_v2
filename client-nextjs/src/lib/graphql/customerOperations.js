
import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query Users($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      id
      name
      email
      position
      avatar
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
      status
      profileImage
      facebook
      tiktok
      instagram
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
