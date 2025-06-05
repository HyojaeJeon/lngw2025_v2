
'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/lib/graphql/mutations.js'
import { GET_ME } from '@/lib/graphql/queries.js'
import { apolloClient } from '@/lib/apolloClient.js'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const { data: meData, refetch: refetchMe } = useQuery(GET_ME, {
    skip: !token,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me)
      }
      setLoading(false)
    },
    onError: (error) => {
      console.error('Failed to fetch user:', error)
      logout()
    }
  })

  const [loginMutation] = useMutation(LOGIN_MUTATION)
  const [registerMutation] = useMutation(REGISTER_MUTATION)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { email, password }
        }
      })

      const { token: newToken, user: userData } = data.login
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('auth_token', newToken)
      
      // Apollo Client 캐시 업데이트
      apolloClient.resetStore()
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (registerData) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: registerData
        }
      })

      const { token: newToken, user: userData } = data.register
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('auth_token', newToken)
      
      // Apollo Client 캐시 업데이트
      apolloClient.resetStore()
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    apolloClient.clearStore()
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
