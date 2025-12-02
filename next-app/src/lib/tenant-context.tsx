'use client'

// Tenant Context Provider for React components
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TenantInfo, TenantContext as TenantContextType } from './tenant-resolver'

interface TenantProviderProps {
  children: ReactNode
  initialTenant?: TenantInfo | null
}

interface TenantContextValue extends TenantContextType {
  switchTenant: (tenantId: string) => Promise<void>
  refreshTenant: () => Promise<void>
  hasFeature: (feature: string) => boolean
}

const TenantContextDefault: TenantContextValue = {
  tenant: null,
  isLoading: false,
  error: null,
  switchTenant: async () => {},
  refreshTenant: async () => {},
  hasFeature: () => false
}

const TenantReactContext = createContext<TenantContextValue>(TenantContextDefault)

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantInfo | null>(initialTenant)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get tenant from headers or browser location on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && !tenant) {
      loadTenantFromBrowser()
    }
  }, [])

  const loadTenantFromBrowser = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Extract subdomain from current location
      const hostname = window.location.hostname
      const subdomain = extractSubdomain(hostname)
      
      if (subdomain) {
        const response = await fetch(`/api/tenants/${subdomain}`)
        
        if (response.ok) {
          const tenantData = await response.json()
          setTenant(tenantData)
        } else {
          setError('Failed to load tenant information')
        }
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Tenant loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const switchTenant = async (tenantId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tenants/id/${tenantId}`)
      
      if (response.ok) {
        const tenantData = await response.json()
        setTenant(tenantData)
        
        // Redirect to tenant's subdomain
        if (typeof window !== 'undefined') {
          const currentHost = window.location.host
          const newHost = currentHost.includes('.')
            ? currentHost.replace(/^[^.]+/, tenantData.subdomain)
            : `${tenantData.subdomain}.${currentHost}`
          
          window.location.href = `${window.location.protocol}//${newHost}`
        }
      } else {
        setError('Failed to switch tenant')
      }
    } catch (err) {
      setError('Failed to switch tenant')
      console.error('Tenant switching error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTenant = async () => {
    if (tenant) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/tenants/${tenant.subdomain}`)
        if (response.ok) {
          const tenantData = await response.json()
          setTenant(tenantData)
        }
      } catch (err) {
        console.error('Tenant refresh error:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const hasFeature = (feature: string): boolean => {
    return tenant?.settings.features.includes(feature) ?? false
  }

  const value: TenantContextValue = {
    tenant,
    isLoading,
    error,
    switchTenant,
    refreshTenant,
    hasFeature
  }

  return (
    <TenantReactContext.Provider value={value}>
      {children}
    </TenantReactContext.Provider>
  )
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantReactContext)
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  
  return context
}

export function withTenant<P extends object>(Component: React.ComponentType<P>) {
  return function TenantWrappedComponent(props: P) {
    return (
      <TenantProvider>
        <Component {...props} />
      </TenantProvider>
    )
  }
}

// Server-side helper to extract tenant from headers
export function getTenantFromHeaders(headers: Headers): {
  id: string | null
  subdomain: string | null
  name: string | null
  features: string[]
} {
  return {
    id: headers.get('x-tenant-id'),
    subdomain: headers.get('x-tenant-subdomain'), 
    name: headers.get('x-tenant-name'),
    features: headers.get('x-tenant-features') ? JSON.parse(headers.get('x-tenant-features') || '[]') : []
  }
}

// Helper function to extract subdomain (imported from tenant-resolver)
function extractSubdomain(hostname: string): string | null {
  if (!hostname) return null
  
  const cleanHostname = hostname.split(':')[0]
  const parts = cleanHostname.split('.')
  
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0] !== 'localhost' ? parts[0] : null
  }
  
  if (parts.length >= 3) {
    return parts[0]
  }
  
  return null
}