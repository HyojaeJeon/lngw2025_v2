
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth } from '@/store/slices/authSlice'

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, token } = useSelector((state) => state.auth)

  useEffect(() => {
    // Initialize auth from localStorage if not already authenticated
    if (!isAuthenticated && !token) {
      dispatch(initializeAuth())
    }
  }, [dispatch, isAuthenticated, token])

  return children
}
