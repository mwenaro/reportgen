/**
 * Error Handling Utilities
 * Comprehensive error handling for API calls, validation, and user feedback
 */

import React from 'react'
import { toast } from 'sonner'
import { ApiError } from './api/client'

// Error types
export interface ErrorInfo {
  message: string
  code?: string
  field?: string
  details?: any
  statusCode?: number
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

class ErrorHandler {
  private errorLog: ErrorInfo[] = []
  private maxLogSize = 100

  /**
   * Handle and categorize errors
   */
  handleError(error: unknown, context?: string): ErrorInfo {
    const errorInfo = this.parseError(error, context)
    this.logError(errorInfo)
    this.showUserFeedback(errorInfo)
    return errorInfo
  }

  /**
   * Parse different types of errors into a consistent format
   */
  private parseError(error: unknown, context?: string): ErrorInfo {
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.status,
        details: {
          context,
          errors: error.errors,
          timestamp: new Date().toISOString()
        }
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        details: {
          context,
          name: error.name,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      }
    }

    // Handle network errors
    if (typeof error === 'object' && error !== null) {
      const err = error as any
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        return {
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
          details: { context, originalError: err, timestamp: new Date().toISOString() }
        }
      }
      
      if (err.code === 'TIMEOUT' || err.name === 'TimeoutError') {
        return {
          message: 'Request timeout - please try again',
          code: 'TIMEOUT_ERROR',
          details: { context, originalError: err, timestamp: new Date().toISOString() }
        }
      }
    }

    // Generic error
    return {
      message: typeof error === 'string' ? error : 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: {
        context,
        originalError: error,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Categorize error based on its characteristics
   */
  categorizeError(error: ErrorInfo): ErrorCategory {
    if (error.statusCode === 401) return ErrorCategory.AUTHENTICATION
    if (error.statusCode === 403) return ErrorCategory.AUTHORIZATION
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) return ErrorCategory.CLIENT
    if (error.statusCode && error.statusCode >= 500) return ErrorCategory.SERVER
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR') return ErrorCategory.NETWORK
    if (error.code === 'VALIDATION_ERROR') return ErrorCategory.VALIDATION
    
    return ErrorCategory.UNKNOWN
  }

  /**
   * Determine error severity
   */
  getErrorSeverity(error: ErrorInfo): ErrorSeverity {
    const category = this.categorizeError(error)
    
    switch (category) {
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.AUTHORIZATION:
        return ErrorSeverity.HIGH
      case ErrorCategory.SERVER:
        return ErrorSeverity.CRITICAL
      case ErrorCategory.NETWORK:
        return ErrorSeverity.MEDIUM
      case ErrorCategory.VALIDATION:
        return ErrorSeverity.LOW
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  /**
   * Show appropriate user feedback based on error type
   */
  private showUserFeedback(error: ErrorInfo): void {
    const category = this.categorizeError(error)
    const severity = this.getErrorSeverity(error)

    // Don't show toast for low severity validation errors
    if (severity === ErrorSeverity.LOW && category === ErrorCategory.VALIDATION) {
      return
    }

    const toastOptions = {
      duration: this.getToastDuration(severity),
    }

    switch (category) {
      case ErrorCategory.AUTHENTICATION:
        toast.error('Authentication required - please log in again', toastOptions)
        break
      case ErrorCategory.AUTHORIZATION:
        toast.error('Access denied - insufficient permissions', toastOptions)
        break
      case ErrorCategory.NETWORK:
        toast.error('Connection error - please check your network', toastOptions)
        break
      case ErrorCategory.SERVER:
        toast.error('Server error - please try again later', toastOptions)
        break
      default:
        toast.error(error.message, toastOptions)
    }
  }

  /**
   * Get toast duration based on severity
   */
  private getToastDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case ErrorSeverity.LOW: return 3000
      case ErrorSeverity.MEDIUM: return 5000
      case ErrorSeverity.HIGH: return 7000
      case ErrorSeverity.CRITICAL: return 10000
      default: return 5000
    }
  }

  /**
   * Log error for debugging and monitoring
   */
  private logError(error: ErrorInfo): void {
    // Add to in-memory log
    this.errorLog.unshift(error)
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize)
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorHandler:', error)
    }

    // In production, you might want to send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportToMonitoring(error)
    }
  }

  /**
   * Report error to monitoring service (placeholder)
   */
  private reportToMonitoring(error: ErrorInfo): void {
    // Implement monitoring service integration
    // e.g., Sentry, LogRocket, etc.
    console.info('Error reported to monitoring:', error.message)
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): ErrorInfo[] {
    return this.errorLog.slice(0, limit)
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * Retry mechanism with exponential backoff
   */
  async retry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: unknown

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxAttempts) {
          break
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Validation helpers
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      value
    }
  }
  return null
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Invalid email format',
      value: email
    }
  }
  return null
}

export function validatePhoneNumber(phone: string): ValidationError | null {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
  if (!phoneRegex.test(phone)) {
    return {
      field: 'phone',
      message: 'Invalid phone number format',
      value: phone
    }
  }
  return null
}

export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationError | null {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters`,
      value
    }
  }
  return null
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationError | null {
  if (value && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} cannot exceed ${maxLength} characters`,
      value
    }
  }
  return null
}

export function validateRange(value: number, min: number, max: number, fieldName: string): ValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      value
    }
  }
  return null
}

// Form validation helper
export function validateForm<T>(
  data: T,
  validators: Array<(data: T) => ValidationError | null>
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  validators.forEach(validator => {
    const error = validator(data)
    if (error) {
      errors.push(error)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// React Query error handling
export function handleQueryError(error: unknown, context?: string): void {
  errorHandler.handleError(error, context)
}

// HOC for error boundary
export function withErrorHandling<T extends {}>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function ErrorHandledComponent(props: T) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean
  error?: ErrorInfo
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorInfo = errorHandler.handleError(error, 'React Error Boundary')
    return {
      hasError: true,
      error: errorInfo
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorHandler.handleError(error, `React Error Boundary: ${errorInfo.componentStack}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-center mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Export types and utilities
export type { ErrorInfo, ValidationError }
export { ErrorCategory, ErrorSeverity, ErrorBoundary }