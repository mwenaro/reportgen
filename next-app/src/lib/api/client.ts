/**
 * API Client Configuration
 * Handles communication with Next.js API routes (/api/*)
 */

import { ErrorHandler } from '../error-handling/client'
import { checkRateLimit } from './middleware'

interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface ApiError {
  message: string
  status: number
  code?: string
  errors?: Record<string, string[]>
}

class ApiClient {
  private config: ApiConfig
  private authToken: string | null = null
  private refreshToken: string | null = null

  constructor(config: ApiConfig) {
    this.config = config
    this.initializeAuth()
  }

  private initializeAuth() {
    // Load tokens from localStorage
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token')
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    
    let data: any
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text }
      }
    } catch {
      data = { message: 'Invalid response format' }
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data.code,
        data.errors
      )
    }

    return data
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.config.baseURL}${url}`
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout)
    }

    try {
      const response = await fetch(fullUrl, requestOptions)
      
      // Handle auth errors
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAuthToken()
        if (refreshed && retryCount === 0) {
          // Retry with new token
          return this.makeRequest<T>(url, options, retryCount + 1)
        }
      }

      return await this.handleResponse<T>(response)
    } catch (error) {
      if (retryCount < this.config.retries && !(error instanceof ApiError)) {
        await this.delay(this.config.retryDelay * Math.pow(2, retryCount))
        return this.makeRequest<T>(url, options, retryCount + 1)
      }

      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      })

      if (response.ok) {
        const data = await response.json()
        this.setAuthToken(data.access_token, data.refresh_token)
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }

    // Clear invalid tokens
    this.clearAuth()
    return false
  }

  public setAuthToken(accessToken: string, refreshToken?: string) {
    this.authToken = accessToken
    if (refreshToken) {
      this.refreshToken = refreshToken
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
    }
  }

  public clearAuth() {
    this.authToken = null
    this.refreshToken = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  }

  public isAuthenticated(): boolean {
    return !!this.authToken
  }

  // HTTP Methods
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return this.makeRequest<T>(`${url}${queryString}`, { method: 'GET' })
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' })
  }

  async upload<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const headers = this.getAuthHeaders()
    delete headers['Content-Type'] // Let browser set multipart boundary

    return this.makeRequest<T>(url, {
      method: 'POST',
      headers,
      body: formData
    })
  }
}

// API Configuration
const apiConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
}

// Create singleton instance
export const apiClient = new ApiClient(apiConfig)

// Export types
export type { ApiResponse, ApiError, ApiConfig }

// Helper function to handle API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// Helper function for TanStack Query error handling
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Environment validation
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set. Using default localhost URL.')
}