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
      profileImage
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

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
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

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`;

export const ADD_CONTACT_PERSON = gql`
  mutation AddContactPerson($customerId: ID!, $input: ContactPersonInput!) {
    addContactPerson(customerId: $customerId, input: $input) {
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
  }
`;

export const UPDATE_CONTACT_PERSON = gql`
  mutation UpdateContactPerson($id: ID!, $input: ContactPersonInput!) {
    updateContactPerson(id: $id, input: $input) {
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
  }
`;

export const DELETE_CONTACT_PERSON = gql`
  mutation DeleteContactPerson($id: ID!) {
    deleteContactPerson(id: $id) {
      success
      message
    }
  }
`;

export const ADD_CUSTOMER_IMAGE = gql`
  mutation AddCustomerImage($customerId: ID!, $input: CustomerImageInput!) {
    addCustomerImage(customerId: $customerId, input: $input) {
      id
      imageUrl
      imageType
      description
      sortOrder
    }
  }
`;

export const DELETE_CUSTOMER_IMAGE = gql`
  mutation DeleteCustomerImage($id: ID!) {
    deleteCustomerImage(id: $id) {
      success
      message
    }
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
      avatar
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

export const VERIFY_CURRENT_PASSWORD = gql`
  mutation VerifyCurrentPassword($currentPassword: String!) {
    verifyCurrentPassword(currentPassword: $currentPassword)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        email
        name
        role
        department
        position
      }
    }
  }
`;