
import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      code
      names {
        ko
        vi
        en
      }
      descriptions {
        ko
        vi
        en
      }
      parentId
      parent {
        id
        code
        names {
          ko
          vi
          en
        }
      }
      level
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      code
      names {
        ko
        vi
        en
      }
      descriptions {
        ko
        vi
        en
      }
      parentId
      parent {
        id
        code
        names {
          ko
          vi
          en
        }
      }
      children {
        id
        code
        names {
          ko
          vi
          en
        }
        level
      }
      level
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
