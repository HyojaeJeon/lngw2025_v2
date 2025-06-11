import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories($parentId: ID, $level: Int, $isActive: Boolean) {
    categories(parentId: $parentId, level: $level, isActive: $isActive) {
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

      level
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
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
      level
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_CATEGORY_CODE = gql`
  query CheckCategoryCode($code: String!) {
    checkCategoryCode(code: $code) {
      isAvailable
      message
    }
  }
`;
