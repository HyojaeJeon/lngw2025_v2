
'use client'

export function isAuthenticated() {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('token')
}

export function getToken() {
  if (typeof window === 'undefined') return null
  
  // First check localStorage
  let token = localStorage.getItem('token') || localStorage.getItem('auth_token')
  
  // If not found, check cookie
  if (!token) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
    if (cookieValue) {
      token = cookieValue.split('=')[1]
    }
  }
  
  return token
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
  localStorage.setItem('auth_token', token)
  document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem('auth_token')
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function logout() {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
