import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
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
        role
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
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
      }
    }
  }
`;

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      companyName
      contactName
      email
      phone
      address
      grade
      industry
      createdAt
    }
  }
`;


export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
      email
      phone
      company
      status
      notes
      updatedAt
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      id
      name
      description
      price
      category
      status
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
      }
      status
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
      contactDepartment
      contactBirthDate
      profileImage
      facebook
      tiktok
      instagram
      createdAt
      updatedAt
    }
  }
`;
export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: AddressInput!) {
    createAddress(input: $input) {
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

export const CREATE_SALES_OPPORTUNITY = gql`
  mutation CreateSalesOpportunity($input: SalesOpportunityInput!) {
    createSalesOpportunity(input: $input) {
      id
      title
      description
      value
      stage
      probability
      expectedCloseDate
      customerId
      createdAt
    }
  }
`;

export const UPDATE_SALES_OPPORTUNITY = gql`
  mutation UpdateSalesOpportunity($id: ID!, $input: SalesOpportunityInput!) {
    updateSalesOpportunity(id: $id, input: $input) {
      id
      title
      description
      value
      stage
      probability
      expectedCloseDate
      updatedAt
    }
  }
`;

export const DELETE_SALES_OPPORTUNITY = gql`
  mutation DeleteSalesOpportunity($id: ID!) {
    deleteSalesOpportunity(id: $id)
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
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
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
        department
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      name
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
    }
  }
`;