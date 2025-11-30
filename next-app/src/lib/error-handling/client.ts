import { toast } from 'sonner'

// Error types
export interface ApiError {
  message: string
  status: number
  code?: string
  errors?: Record<string, string[]>
}

export interface NetworkError {
  type: 'network'
  message: string
  isOffline: boolean
}

export interface ValidationErrors {
  [field: string]: string[]
}

// Error handling configuration
interface ErrorHandlerConfig {
  showToast?: boolean
  logError?: boolean
  retryable?: boolean
  customMessage?: string
}

export class ErrorHandler {
  private static retryAttempts = new Map<string, number>()
  private static maxRetries = 3
  private static retryDelay = 1000

  static handle(
    error: unknown, 
    config: ErrorHandlerConfig = {}
  ): {
    message: string
    errors?: ValidationErrors
    shouldRetry?: boolean
  } {
    const {
      showToast = true,
      logError = true,
      retryable = false,
      customMessage
    } = config

    let message = 'An unexpected error occurred'
    let errors: ValidationErrors = {}
    let shouldRetry = false

    if (logError) {
      console.error('Error caught by ErrorHandler:', error)
    }

    // Handle different error types
    if (this.isApiError(error)) {
      message = customMessage || error.message || 'API request failed'
      errors = error.errors || {}
      shouldRetry = retryable && this.isRetryableError(error.status)
    } else if (this.isNetworkError(error)) {
      message = customMessage || 'Network connection failed'
      shouldRetry = retryable
    } else if (this.isAbortError(error)) {
      message = 'Request was cancelled'
      shouldRetry = false
    } else if (error instanceof Error) {
      message = customMessage || error.message || 'An error occurred'
    } else {
      message = customMessage || 'Unknown error occurred'
    }

    // Show toast notification
    if (showToast) {
      if (Object.keys(errors).length > 0) {
        // Show validation errors
        const firstError = Object.values(errors)[0]?.[0]
        if (firstError) {
          toast.error(firstError)
        }
      } else {
        toast.error(message)
      }
    }

    return { message, errors, shouldRetry }
  }

  static async handleWithRetry<T>(
    operation: () => Promise<T>,
    operationId: string,
    config: ErrorHandlerConfig & { maxRetries?: number; retryDelay?: number } = {}
  ): Promise<T> {
    const maxRetries = config.maxRetries || this.maxRetries
    const retryDelay = config.retryDelay || this.retryDelay
    const currentAttempts = this.retryAttempts.get(operationId) || 0

    try {
      const result = await operation()
      // Success - reset retry count
      this.retryAttempts.delete(operationId)
      return result
    } catch (error) {
      const { shouldRetry } = this.handle(error, { 
        ...config, 
        showToast: currentAttempts === 0 // Only show toast on first failure
      })

      if (shouldRetry && currentAttempts < maxRetries) {
        this.retryAttempts.set(operationId, currentAttempts + 1)
        
        // Show retry notification
        toast.loading(`Retrying... (${currentAttempts + 1}/${maxRetries})`)
        
        await this.delay(retryDelay * Math.pow(2, currentAttempts)) // Exponential backoff
        
        return this.handleWithRetry(operation, operationId, config)
      } else {
        // Max retries exceeded or not retryable
        this.retryAttempts.delete(operationId)
        throw error
      }
    }
  }

  static handleValidationErrors(
    errors: ValidationErrors,
    formSetError?: (field: string, error: { message: string }) => void
  ): void {
    Object.entries(errors).forEach(([field, messages]) => {
      const message = messages[0] || 'Invalid value'
      
      // Set form error if form handler provided
      if (formSetError) {
        formSetError(field, { message })
      }
      
      // Also show toast for first error
      if (Object.keys(errors).length === 1 || field === Object.keys(errors)[0]) {
        toast.error(message)
      }
    })
  }

  static createFormErrorHandler(
    setError: (field: string, error: { message: string }) => void
  ) {
    return (error: unknown) => {
      const { errors } = this.handle(error)
      if (errors && Object.keys(errors).length > 0) {
        this.handleValidationErrors(errors, setError)
      }
    }
  }

  private static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error
    )
  }

  private static isNetworkError(error: unknown): error is NetworkError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      (error as any).type === 'network'
    )
  }

  private static isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError'
  }

  private static isRetryableError(status: number): boolean {
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429 || status === 408
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static getNetworkStatus(): {
    isOnline: boolean
    connection: string
  } {
    const nav = navigator as any
    return {
      isOnline: navigator.onLine,
      connection: nav.connection?.effectiveType || 'unknown'
    }
  }

  static setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      this.handle(event.reason, { 
        customMessage: 'An unexpected error occurred',
        showToast: true 
      })
    })

    // Handle network status changes
    window.addEventListener('online', () => {
      toast.success('Connection restored')
    })

    window.addEventListener('offline', () => {
      toast.error('Connection lost. Some features may not work.')
    })

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global JavaScript error:', event.error)
      this.handle(event.error, {
        customMessage: 'A client-side error occurred',
        showToast: false // Don't show toast for JS errors to avoid spam
      })
    })
  }
}

// Hook for React components
export function useErrorHandler() {
  const handleError = (error: unknown, config?: ErrorHandlerConfig) => {
    return ErrorHandler.handle(error, config)
  }

  const handleWithRetry = <T>(
    operation: () => Promise<T>,
    operationId: string,
    config?: ErrorHandlerConfig & { maxRetries?: number; retryDelay?: number }
  ) => {
    return ErrorHandler.handleWithRetry(operation, operationId, config)
  }

  const handleValidationErrors = (
    errors: ValidationErrors,
    formSetError?: (field: string, error: { message: string }) => void
  ) => {
    return ErrorHandler.handleValidationErrors(errors, formSetError)
  }

  const createFormErrorHandler = (
    setError: (field: string, error: { message: string }) => void
  ) => {
    return ErrorHandler.createFormErrorHandler(setError)
  }

  return {
    handleError,
    handleWithRetry,
    handleValidationErrors,
    createFormErrorHandler,
    networkStatus: ErrorHandler.getNetworkStatus()
  }
}

// Utility functions for common error scenarios
export const errorMessages = {
  network: 'Please check your internet connection and try again.',
  timeout: 'The request took too long. Please try again.',
  serverError: 'Server is experiencing issues. Please try again later.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You don\'t have permission to perform this action.',
  validation: 'Please check your input and try again.',
  rateLimit: 'Too many requests. Please wait a moment and try again.'
}

export const getErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return errorMessages.validation
    case 401:
      return errorMessages.unauthorized
    case 403:
      return errorMessages.forbidden
    case 404:
      return errorMessages.notFound
    case 408:
      return errorMessages.timeout
    case 429:
      return errorMessages.rateLimit
    case 500:
    case 502:
    case 503:
    case 504:
      return errorMessages.serverError
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}