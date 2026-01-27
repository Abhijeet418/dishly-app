import { create } from 'zustand'
import { User } from '@/types'
import { authService } from '@/services/api'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  isInitialized: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, username: string) => Promise<void>
  logout: () => void
  initializeAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login({ emailOrUsername: email, password })
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },

      register: async (email: string, password: string, name: string, username: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register({ email, password, name, username })
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      initializeAuth: async () => {
        try {
          const user = await authService.getCurrentUser()
          set({ user, isAuthenticated: true, isInitialized: true })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: true,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
