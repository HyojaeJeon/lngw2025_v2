import { gql } from '@apollo/client';

export const GET_CUSTOMER_ACTIVITIES = gql`
  query GetCustomerActivities($filter: CustomerActivityFilterInput, $limit: Int, $offset: Int) {
    customerActivities(filter: $filter, limit: $limit, offset: $offset) {
      id
      customerId
      type
      title
      description
      activityDate
      duration
      participants
      result
      nextAction
      attachments
      createdBy
      customer {
        id
        name
        contactName
        phone
        email
      }
      creator {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_ACTIVITY = gql`
  query GetCustomerActivity($id: ID!) {
    customerActivity(id: $id) {
      id
      customerId
      type
      title
      description
      activityDate
      duration
      participants
      result
      nextAction
      attachments
      createdBy
      customer {
        id
        name
        contactName
        phone
        email
      }
      creator {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_ACTIVITY_TYPES = gql`
  query GetCustomerActivityTypes {
    customerActivityTypes
  }
`;

export const CREATE_CUSTOMER_ACTIVITY = gql`
  mutation CreateCustomerActivity($input: CustomerActivityInput!) {
    createCustomerActivity(input: $input) {
      id
      customerId
      type
      title
      description
      activityDate
      duration
      participants
      result
      nextAction
      attachments
      createdBy
      customer {
        id
        name
        contactName
      }
      creator {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CUSTOMER_ACTIVITY = gql`
  mutation UpdateCustomerActivity($id: ID!, $input: CustomerActivityUpdateInput!) {
    updateCustomerActivity(id: $id, input: $input) {
      id
      customerId
      type
      title
      description
      activityDate
      duration
      participants
      result
      nextAction
      attachments
      createdBy
      customer {
        id
        name
        contactName
      }
      creator {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CUSTOMER_ACTIVITY = gql`
  mutation DeleteCustomerActivity($id: ID!) {
    deleteCustomerActivity(id: $id) {
      success
      message
    }
  }
`;