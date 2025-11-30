/**
 * Authentication Store
 * Manages user authentication state and operations using TanStack Query
 */

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../api/auth'
import type { LoginRequest, UserProfile } from '../api/auth'

// Query keys for React Query caching
export const AUTH_KEYS = {
  all: ['auth'] as const,
  profile: () => [...AUTH_KEYS.all, 'profile'] as const,
  verify: () => [...AUTH_KEYS.all, 'verify'] as const,
}

// Authentication state hook
export function useAuthProfile() {
  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: async () => {
      const response = await authService.getProfile()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile')
      }
      return response.data
    },
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if auth fails
  })
}

// Authentication verification hook
export function useAuthVerification() {
  return useQuery({
    queryKey: AUTH_KEYS.verify(),
    queryFn: async () => {
      const response = await authService.verifyAuth()
      return response.data?.valid ?? false
    },
    enabled: authService.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials)
      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }
      return response.data
    },
    onSuccess: (data) => {
      // Cache user profile immediately
      if (data?.user) {
        queryClient.setQueryData(AUTH_KEYS.profile(), data.user)
      }
      
      // Set verification as valid
      queryClient.setQueryData(AUTH_KEYS.verify(), true)
      
      // Invalidate all queries to refresh with authenticated requests
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      console.error('Login failed:', error)
      
      // Clear any stale auth data
      queryClient.removeQueries({ queryKey: AUTH_KEYS.all })
    }
  })
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await authService.logout()
      return response.data
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      
      // Force clear cache even if logout request failed
      queryClient.clear()
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  })
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await authService.updateProfile(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile')
      }
      return response.data
    },
    onSuccess: (updatedProfile) => {
      // Update cached profile
      if (updatedProfile) {
        queryClient.setQueryData(AUTH_KEYS.profile(), updatedProfile)
      }
    },
    onError: (error) => {
      console.error('Profile update failed:', error)
    }
  })
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => {
      const response = await authService.changePassword(passwordData)
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password')
      }
      return response.data
    },
    onError: (error) => {
      console.error('Password change failed:', error)
    }
  })
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await authService.refreshToken()
      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed')
      }
      return response.data
    },
    onSuccess: () => {
      // Refresh verification status
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.verify() })
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      
      // Clear auth data and redirect to login
      queryClient.removeQueries({ queryKey: AUTH_KEYS.all })
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  })
}

// Password reset request mutation
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await authService.requestPasswordReset(email)
      if (!response.success) {
        throw new Error(response.message || 'Failed to request password reset')
      }
      return response.data
    },
    onError: (error) => {
      console.error('Password reset request failed:', error)
    }
  })
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const response = await authService.resetPassword(token, newPassword)
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password')
      }
      return response.data
    },
    onError: (error) => {
      console.error('Password reset failed:', error)
    }
  })
}

// Custom hooks for common auth operations
export function useAuth() {
  const { data: profile, isLoading: profileLoading } = useAuthProfile()
  const { data: isValid, isLoading: verifyLoading } = useAuthVerification()
  
  return {
    user: profile,
    isAuthenticated: authService.isAuthenticated() && isValid,
    isLoading: profileLoading || verifyLoading,
    hasRole: (role: string) => {
      if (!profile) return false
      return profile.role === role || profile.role === 'admin'
    },
    hasPermission: (permission: string) => {
      if (!profile) return false
      return profile.permissions.includes(permission) || profile.role === 'admin'
    }
  }
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }

  return isAuthenticated
}

// Role guard hook
export function useRoleGuard(requiredRole: string | string[]) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const hasRole = user && (roles.includes(user.role) || user.role === 'admin')

  if (!isLoading && isAuthenticated && !hasRole) {
    throw new Error('Insufficient permissions')
  }

  return {
    hasAccess: hasRole,
    isLoading,
    user
  }
}

// Permission guard hook
export function usePermissionGuard(requiredPermissions: string | string[]) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
  const hasPermission = user && (
    user.role === 'admin' || 
    permissions.every(perm => user.permissions.includes(perm))
  )

  if (!isLoading && isAuthenticated && !hasPermission) {
    throw new Error('Insufficient permissions')
  }

  return {
    hasAccess: hasPermission,
    isLoading,
    user
  }
}

// Auto logout on token expiry
export function useAutoLogout() {
  const logout = useLogout()
  const refreshToken = useRefreshToken()

  // Check token expiry periodically
  React.useEffect(() => {
    if (!authService.isAuthenticated()) return

    const interval = setInterval(async () => {
      try {
        // Try to refresh token
        await refreshToken.mutateAsync()
      } catch (error) {
        // If refresh fails, logout user
        console.warn('Auto-logout due to token expiry')
        logout.mutate()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [refreshToken, logout])
}

// Authentication status helpers
export function isAuthenticated(): boolean {
  return authService.isAuthenticated()
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('user_profile')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Export auth service for direct access if needed
export { authService }