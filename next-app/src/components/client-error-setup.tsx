'use client'

import { useEffect } from 'react'
import { ErrorHandler } from '@/lib/error-handling/client'

export function ClientErrorSetup() {
  useEffect(() => {
    // Setup global error handlers
    ErrorHandler.setupGlobalErrorHandlers()

    // Log that error handling is initialized
    console.log('Global error handling initialized')
  }, [])

  // This component doesn't render anything
  return null
}