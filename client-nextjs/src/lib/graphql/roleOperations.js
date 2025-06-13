
import { gql } from "@apollo/client";

// Queries
export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
      englishName
      description
      color
      isSystem
      isActive
      userCount
      permissions {
        id
        module
        canRead
        canWrite
        canDelete
        canApprove
        canSystemConfig
      }
    }
  }
`;

export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      name
      englishName
      description
      color
      isSystem
      isActive
      userCount
      permissions {
        id
        module
        canRead
        canWrite
        canDelete
        canApprove
        canSystemConfig
      }
    }
  }
`;

export const GET_PERMISSION_MATRIX = gql`
  query GetPermissionMatrix {
    permissionMatrix {
      module
      permissions {
        roleId
        roleName
        canRead
        canWrite
        canDelete
        canApprove
        canSystemConfig
      }
    }
  }
`;

export const GET_USERS_WITH_ROLES = gql`
  query GetUsersWithRoles {
    usersWithRoles {
      id
      name
      email
      department
      position
      roleInfo {
        id
        name
        englishName
        color
      }
    }
  }
`;

// Mutations
export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      englishName
      description
      color
      isSystem
      isActive
      userCount
      permissions {
        id
        module
        canRead
        canWrite
        canDelete
        canApprove
        canSystemConfig
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      englishName
      description
      color
      isSystem
      isActive
      userCount
      permissions {
        id
        module
        canRead
        canWrite
        canDelete
        canApprove
        canSystemConfig
      }
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      name
      email
      department
      position
      roleInfo {
        id
        name
        englishName
        color
      }
    }
  }
`;

export const UPDATE_PERMISSION_MATRIX = gql`
  mutation UpdatePermissionMatrix($input: [PermissionMatrixInput!]!) {
    updatePermissionMatrix(input: $input)
  }
`;
