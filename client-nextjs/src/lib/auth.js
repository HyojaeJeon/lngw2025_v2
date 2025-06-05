
'use client'

export function isAuthenticated() {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('token')
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export function logout() {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
