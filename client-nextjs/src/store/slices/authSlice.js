
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
      
      // Also store in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    // Add action to initialize from localStorage if needed
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        if (token && !state.token) {
          state.token = token
          state.isAuthenticated = true
        }
      }
    }
  },
})

export const { setCredentials, logout, setLoading, setUser, initializeAuth } = authSlice.actions
export default authSlice.reducer
