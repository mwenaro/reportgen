// Custom React hooks
import { useEffect, useState } from 'react'
import { useTenant as useTenantContext } from '@/lib/tenant-context'

// Authentication hook placeholder
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Implementation will be added in Prompt 5
  useEffect(() => {
    // Placeholder for auth logic
    setIsLoading(false)
  }, [])
  
  return {
    user,
    isLoading,
    login: async (credentials: any) => {
      // Implementation will be added later
    },
    logout: async () => {
      // Implementation will be added later
    }
  }
}

// Re-export tenant hook from context
export { useTenant } from '@/lib/tenant-context'

// Additional custom hooks
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }
  
  return [storedValue, setValue] as const
}

// Hook for checking feature access
export function useFeatureAccess(feature: string) {
  const { hasFeature } = useTenantContext()
  return hasFeature(feature)
}

// Hook for tenant-aware API calls
export function useTenantApi() {
  const { tenant } = useTenantContext()
  
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }
    
    if (tenant) {
      headers['X-Tenant-ID'] = tenant.id
      headers['X-Tenant-Subdomain'] = tenant.subdomain
    }
    
    const response = await fetch(endpoint, {
      ...options,
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  return { apiCall }
}