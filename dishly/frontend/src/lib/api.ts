import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  let token: string | null = null
  
  // Try to get token from localStorage (for SSR/hydration)
  if (typeof window !== 'undefined') {
    // Get from Zustand's persisted auth-store
    const authStoreStr = localStorage.getItem('auth-store')
    if (authStoreStr) {
      try {
        const authStore = JSON.parse(authStoreStr)
        token = authStore.state?.token || null
      } catch (e) {
        // If parsing fails, try direct token key as fallback
        token = localStorage.getItem('token')
      }
    }
    
    // If no token found, try sessionStorage as fallback
    if (!token) {
      token = sessionStorage.getItem('token')
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
