import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'teacher' | 'student'
  schoolId?: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Mock authentication for demo purposes
          // In production, this would make an API call
          if (email === 'admin@school.edu' && password === 'password123') {
            const mockUser: User = {
              id: 'user_1',
              email: 'admin@school.edu',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              schoolId: 'school_1'
            }
            
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMSIsImVtYWlsIjoiYWRtaW5Ac2Nob29sLmVkdSJ9.mock'
            const mockRefreshToken = 'refresh_token_mock'
            
            set({
              user: mockUser,
              token: mockToken,
              refreshToken: mockRefreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            throw new Error('Invalid email or password')
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)