'use client'

import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dots' | 'pulse' | 'bounce'
  color?: 'blue' | 'green' | 'red' | 'gray' | 'white'
  message?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md',
  variant = 'default',
  color = 'blue',
  message,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500',
    white: 'text-white'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`rounded-full ${colorClasses[color]} ${
                  size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                style={{ backgroundColor: 'currentColor' }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <motion.div
            className={`rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ backgroundColor: 'currentColor' }}
          />
        )
      
      case 'bounce':
        return (
          <motion.div
            className={`rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ backgroundColor: 'currentColor' }}
          />
        )
      
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={colorClasses[color]}
          >
            <Loader2 className={sizeClasses[size]} />
          </motion.div>
        )
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderSpinner()}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm ${colorClasses[color]} text-center`}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export function ButtonSpinner({ size = 'sm', color = 'white', className = '' }: LoadingSpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${colorClasses[color]} ${className}`}
    >
      <RefreshCw className={sizeClasses[size]} />
    </motion.div>
  )
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}

const colorClasses = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  red: 'text-red-500',
  gray: 'text-gray-500',
  white: 'text-white'
}