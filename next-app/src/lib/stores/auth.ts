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
        console.log('Login attempt:', { email, password })
        set({ isLoading: true, error: null })
        
        try {
          // Mock authentication for demo purposes
          // In production, this would make an API call
          
          let authenticatedUser: User | null = null
          
          // Check demo admin user
          if (email === 'admin@school.edu' && password === 'password123') {
            console.log('Demo admin login successful')
            authenticatedUser = {
              id: 'user_1',
              email: 'admin@school.edu',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              schoolId: 'school_1'
            }
          } else {
            // Check registered users from signup
            const registeredUsers = JSON.parse(localStorage.getItem('demo-users') || '[]')
            console.log('Checking registered users:', registeredUsers)
            const foundUser = registeredUsers.find((user: any) => 
              user.email === email && user.password === password
            )
            console.log('Found user:', foundUser)
            
            if (foundUser) {
              authenticatedUser = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                role: foundUser.role,
                schoolId: 'school_1'
              }
            }
          }
          
          console.log('Authenticated user:', authenticatedUser)
          
          if (authenticatedUser) {
            const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiR7YXV0aGVudGljYXRlZFVzZXIuaWR9IiwiZW1haWwiOiIke2F1dGhlbnRpY2F0ZWRVc2VyLmVtYWlsfSJ9.mock`
            const mockRefreshToken = 'refresh_token_mock'
            
            // Set cookie for middleware to read
            if (typeof document !== 'undefined') {
              document.cookie = `auth-token=${mockToken}; path=/; max-age=86400; SameSite=Lax`
            }
            
            set({
              user: authenticatedUser,
              token: mockToken,
              refreshToken: mockRefreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            console.log('Auth state updated successfully')
          } else {
            console.log('No authenticated user found, throwing error')
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
        // Clear cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        
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
      }),
      onRehydrateStorage: () => (state) => {
        // Sync cookie with stored state when rehydrating
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `auth-token=${state.token}; path=/; max-age=86400; SameSite=Lax`
        }
      }
    }
  )
)