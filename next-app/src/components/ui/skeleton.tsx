'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded'
  width?: string | number
  height?: string | number
  animated?: boolean
  style?: React.CSSProperties
}

export default function Skeleton({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  animated = true,
  style: customStyle
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    text: 'rounded',
    rounded: 'rounded-lg'
  }

  const style = {
    width: width || undefined,
    height: height || undefined,
    ...customStyle
  }

  if (animated) {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Pre-built skeleton components for common use cases
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={`h-4 ${colIndex === 0 ? 'w-1/4' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ showAvatar = false }: { showAvatar?: boolean }) {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center space-x-4">
        {showAvatar && <Skeleton variant="circular" className="w-12 h-12" />}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton variant="circular" className="w-4 h-4" />
          </div>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton variant="circular" className="w-5 h-5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <div 
          className="flex items-end justify-between space-x-2"
          style={{ height }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-full"
              style={{ 
                height: `${Math.random() * 80 + 20}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}