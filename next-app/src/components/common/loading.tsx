import React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'white' | 'current'
}

export interface LoadingDotsProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'secondary' | 'white' | 'current'
}

export interface LoadingSkeletonProps {
  className?: string
  lines?: number
  height?: string
  width?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  blur?: boolean
}

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  spinnerSize?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
}

// ============================================================================
// SIZE AND COLOR CONFIGURATIONS
// ============================================================================

const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const dotSizes = {
  xs: 'h-1 w-1',
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
}

const colorClasses = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  white: 'border-white',
  current: 'border-current',
}

const dotColorClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  white: 'bg-white',
  current: 'bg-current',
}

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'primary',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        spinnerSizes[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingDots({ size = 'md', className, color = 'primary' }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)} role="status" aria-label="Loading...">
      <div
        className={cn(
          'animate-pulse rounded-full',
          dotSizes[size],
          dotColorClasses[color]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(
          'animate-pulse rounded-full',
          dotSizes[size],
          dotColorClasses[color]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(
          'animate-pulse rounded-full',
          dotSizes[size],
          dotColorClasses[color]
        )}
        style={{ animationDelay: '300ms' }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingSkeleton({
  className,
  lines = 1,
  height = 'h-4',
  width,
  variant = 'text',
}: LoadingSkeletonProps) {
  const skeletonClasses = cn(
    'animate-pulse bg-muted',
    variant === 'text' && height,
    variant === 'circular' && 'rounded-full',
    variant === 'rectangular' && 'rounded',
    variant === 'text' && 'rounded',
    width,
    className
  )

  if (lines === 1) {
    return <div className={skeletonClasses} role="status" aria-label="Loading content..." />
  }

  return (
    <div className="space-y-2" role="status" aria-label="Loading content...">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            skeletonClasses,
            // Vary the width for the last line to make it look more natural
            index === lines - 1 && variant === 'text' && !width && 'w-3/4'
          )}
        />
      ))}
    </div>
  )
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  spinnerSize = 'lg',
  message,
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80',
            blur && 'backdrop-blur-sm'
          )}
        >
          <LoadingSpinner size={spinnerSize} />
          {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
        </div>
      )}
    </div>
  )
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  spinnerSize = 'sm',
  variant = 'default',
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-4 py-2',
        variantClasses[variant],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner size={spinnerSize} className="mr-2" />}
      {isLoading ? loadingText || 'Loading...' : children}
    </button>
  )
}

// ============================================================================
// SPECIALIZED LOADING STATES
// ============================================================================

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border rounded-lg', className)}>
      <div className="space-y-4">
        <LoadingSkeleton height="h-6" width="w-1/3" />
        <LoadingSkeleton lines={3} />
        <div className="flex space-x-2 pt-2">
          <LoadingSkeleton height="h-9" width="w-20" variant="rectangular" />
          <LoadingSkeleton height="h-9" width="w-20" variant="rectangular" />
        </div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5, columns = 4, className }: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('border rounded-lg', className)}>
      {/* Header */}
      <div className="border-b p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <LoadingSkeleton key={index} height="h-4" width="w-3/4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton key={colIndex} height="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoadingList({ items = 5, className }: {
  items?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <LoadingSkeleton variant="circular" height="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton height="h-4" width="w-1/3" />
            <LoadingSkeleton height="h-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useLoadingDelay(loading: boolean, delay: number = 300) {
  const [delayedLoading, setDelayedLoading] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (loading) {
      timeoutId = setTimeout(() => setDelayedLoading(true), delay)
    } else {
      setDelayedLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [loading, delay])

  return delayedLoading
}

export default LoadingSpinner