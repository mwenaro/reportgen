/**
 * Authentication Service
 * Handles login, logout, and user session management
 */

import { apiClient, type ApiResponse } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    role: 'admin' | 'teacher' | 'user'
    permissions: string[]
  }
  expires_at: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
  expires_at: string
}

export interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'teacher' | 'user'
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

class AuthService {
  /**
   * Authenticate user with username/password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    
    if (response.success && response.data) {
      // Store authentication tokens
      apiClient.setAuthToken(
        response.data.access_token,
        response.data.refresh_token
      )
    }
    
    return response
  }

  /**
   * Log out current user
   */
  async logout(): Promise<ApiResponse> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout request failed:', error)
      // Continue with local logout even if server request fails
    }
    
    // Clear local authentication
    apiClient.clearAuth()
    
    return { success: true }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh')
    
    if (response.success && response.data) {
      apiClient.setAuthToken(
        response.data.access_token,
        response.data.refresh_token
      )
    }
    
    return response
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/auth/profile')
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>('/auth/profile', data)
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return apiClient.post('/auth/change-password', data)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated()
  }

  /**
   * Verify authentication status with server
   */
  async verifyAuth(): Promise<ApiResponse<{ valid: boolean }>> {
    try {
      return await apiClient.get('/auth/verify')
    } catch (error) {
      return { success: false, data: { valid: false } }
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return apiClient.post('/auth/forgot-password', { email })
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return apiClient.post('/auth/reset-password', {
      token,
      password: newPassword
    })
  }
}

// Create singleton instance
export const authService = new AuthService()

// Auth guard helper for pages
export function requireAuth(): boolean {
  const isAuth = authService.isAuthenticated()
  
  if (!isAuth && typeof window !== 'undefined') {
    // Redirect to login page
    window.location.href = '/login'
    return false
  }
  
  return isAuth
}

// Role-based access control helper
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('admin')
}

// Role hierarchy helper
export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'admin': ['admin', 'teacher', 'user'],
    'teacher': ['teacher', 'user'],
    'user': ['user']
  }
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(requiredRole) || false
}