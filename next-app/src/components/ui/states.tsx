'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Clock,
  XCircle,
  CheckCircle2,
  Info
} from 'lucide-react'

// Loading States
interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <LoadingSpinner size={size} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <Card className={`animate-pulse ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-muted rounded w-20"></div>
          <div className="h-8 bg-muted rounded w-20"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4 p-4 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1 animate-pulse"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-muted rounded flex-1 animate-pulse"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Error States
interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | string
  showRetry?: boolean
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Error',
  message = 'Something went wrong',
  error,
  showRetry = true,
  onRetry,
  className = ''
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="text-destructive">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">{message}</p>
        {errorMessage && (
          <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
            {errorMessage}
          </p>
        )}
      </div>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={isOnline ? 'text-muted-foreground' : 'text-destructive'}>
        {isOnline ? <Wifi className="h-12 w-12" /> : <WifiOff className="h-12 w-12" />}
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">
          {isOnline ? 'Connection Issues' : 'No Internet Connection'}
        </h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {isOnline 
            ? 'Unable to reach the server. Please check your connection and try again.'
            : 'You appear to be offline. Please check your internet connection.'
          }
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" disabled={!isOnline}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {isOnline ? 'Try Again' : 'Waiting for connection...'}
        </Button>
      )}
    </div>
  )
}

export function TimeoutErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-orange-500">
        <Clock className="h-12 w-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">Request Timeout</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          The request took too long to complete. This might be due to a slow connection or server issues.
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

// Empty States
interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'No data found',
  message = 'There are no items to display',
  icon,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 space-y-4 ${className}`}>
      <div className="text-muted-foreground">
        {icon || <Info className="h-12 w-12" />}
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">{message}</p>
      </div>
      {action}
    </div>
  )
}

// Success States
interface SuccessStateProps {
  title?: string
  message?: string
  action?: React.ReactNode
  className?: string
}

export function SuccessState({
  title = 'Success!',
  message = 'Operation completed successfully',
  action,
  className = ''
}: SuccessStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="text-green-600">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">{message}</p>
      </div>
      {action}
    </div>
  )
}

// Combined State Handler
interface StateHandlerProps {
  loading?: boolean
  error?: Error | string | null
  empty?: boolean
  success?: boolean
  loadingMessage?: string
  errorTitle?: string
  errorMessage?: string
  emptyTitle?: string
  emptyMessage?: string
  successTitle?: string
  successMessage?: string
  onRetry?: () => void
  children?: React.ReactNode
  className?: string
}

export function StateHandler({
  loading = false,
  error = null,
  empty = false,
  success = false,
  loadingMessage,
  errorTitle,
  errorMessage,
  emptyTitle,
  emptyMessage,
  successTitle,
  successMessage,
  onRetry,
  children,
  className = ''
}: StateHandlerProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} className={className} />
  }

  if (error) {
    // Determine error type
    if (typeof error === 'string' && error.includes('network')) {
      return <NetworkErrorState onRetry={onRetry} />
    }
    if (typeof error === 'string' && error.includes('timeout')) {
      return <TimeoutErrorState onRetry={onRetry} />
    }
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage}
        error={error}
        onRetry={onRetry}
        className={className}
      />
    )
  }

  if (success) {
    return (
      <SuccessState
        title={successTitle}
        message={successMessage}
        className={className}
      />
    )
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        className={className}
      />
    )
  }

  return <>{children}</>
}

// Hook for managing component states
export function useStateHandler() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const reset = React.useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  const handleAsync = React.useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: {
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
      showSuccess?: boolean
    } = {}
  ) => {
    const { onSuccess, onError, showSuccess = false } = options
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await asyncFn()
      
      if (showSuccess) {
        setSuccess(true)
      }
      
      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      
      if (onError) {
        onError(errorObj)
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    success,
    setLoading,
    setError,
    setSuccess,
    reset,
    handleAsync
  }
}