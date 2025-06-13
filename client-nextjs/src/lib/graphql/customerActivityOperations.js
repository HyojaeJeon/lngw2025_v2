
import { gql } from '@apollo/client';

export const GET_CUSTOMER_ACTIVITIES = gql`
  query GetCustomerActivities($limit: Int, $offset: Int, $filter: CustomerActivityFilter) {
    customerActivities(limit: $limit, offset: $offset, filter: $filter) {
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
