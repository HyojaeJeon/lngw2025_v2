'use client'

const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'

export async function graphqlRequest(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL Error')
    }

    return data.data
  } catch (error) {
    console.error('GraphQL Request Error:', error)
    throw error
  }
}

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`

export const GET_ME_QUERY = `
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`

export const GET_CUSTOMERS_QUERY = `
  query GetCustomers {
    customers {
      id
      name
      contact
      email
      phone
      createdAt
    }
  }
`