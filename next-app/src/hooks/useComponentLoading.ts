'use client'

import { useState, useCallback } from 'react'

export function useComponentLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingMessage, setLoadingMessage] = useState<string>()
  const [error, setError] = useState<string | null>(null)

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true)
    setError(null)
    if (message) setLoadingMessage(message)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage(undefined)
  }, [])

  const setLoadingError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
    setLoadingMessage(undefined)
  }, [])

  const withLoading = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    loadingMsg?: string
  ): Promise<T | null> => {
    startLoading(loadingMsg)
    try {
      const result = await asyncFn()
      stopLoading()
      return result
    } catch (err) {
      setLoadingError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }, [startLoading, stopLoading, setLoadingError])

  return {
    isLoading,
    loadingMessage,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    withLoading
  }
}