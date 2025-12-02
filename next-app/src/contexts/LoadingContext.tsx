'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import PageLoader from '@/components/ui/page-loader'

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showLoader: (message?: string, duration?: number) => void
  hideLoader: () => void
  setLoadingMessage: (message: string) => void
  setLoadingProgress: (progress: number) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading...")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const pathname = usePathname()

  // Show loader on route changes
  useEffect(() => {
    setIsLoading(true)
    setLoadingMessage("Loading page...")
    setLoadingProgress(0)
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Hide loader after a short delay to show smooth transition
    const timer = setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setLoadingProgress(0)
        clearInterval(progressInterval)
      }, 300)
    }, 800)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [pathname])

  const showLoader = (message?: string, duration?: number) => {
    if (message) setLoadingMessage(message)
    setIsLoading(true)
    
    if (duration) {
      setTimeout(() => {
        setIsLoading(false)
      }, duration)
    }
  }

  const hideLoader = () => {
    setIsLoading(false)
  }

  const contextValue: LoadingContextType = {
    isLoading,
    setIsLoading,
    showLoader,
    hideLoader,
    setLoadingMessage,
    setLoadingProgress
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <PageLoader 
        isLoading={isLoading} 
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={showProgress}
      />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}