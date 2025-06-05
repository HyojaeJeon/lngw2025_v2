
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      
      // Store in both localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        // Set cookie for middleware
        document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      
      // Clear localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    // Add action to initialize from localStorage or cookie if needed
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        let token = localStorage.getItem('auth_token')
        
        // If not in localStorage, check cookie
        if (!token) {
          const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
          if (cookieValue) {
            token = cookieValue.split('=')[1]
          }
        }
        
        if (token && !state.token) {
          state.token = token
          state.isAuthenticated = true
          // Sync localStorage and cookie
          localStorage.setItem('auth_token', token)
          document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`
        }
      }
    }
  },
})

export const { setCredentials, logout, setLoading, setUser, initializeAuth } = authSlice.actions
export default authSlice.reducer
