// Tenant resolver utilities
// Extract and validate tenant information from subdomain/domain

export interface TenantInfo {
  id: string
  subdomain: string
  name: string
  status: 'active' | 'suspended' | 'inactive'
  settings: {
    customDomain?: string
    features: string[]
    theme: {
      primaryColor: string
      logo?: string
    }
  }
}

export interface TenantContext {
  tenant: TenantInfo | null
  isLoading: boolean
  error: string | null
}

/**
 * Extract subdomain from hostname
 * @param hostname - The full hostname (e.g., 'school1.localhost:3000')
 * @returns subdomain or null if not found
 */
export function extractSubdomain(hostname: string): string | null {
  if (!hostname) return null
  
  // Remove port if present
  const cleanHostname = hostname.split(':')[0]
  
  // Split by dots
  const parts = cleanHostname.split('.')
  
  // For development (localhost), check for subdomain before localhost
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0] !== 'localhost' ? parts[0] : null
  }
  
  // For production domains (e.g., school1.example.com)
  if (parts.length >= 3) {
    return parts[0]
  }
  
  return null
}

/**
 * Check if a tenant is valid and active
 * @param subdomain - The subdomain to validate
 * @returns Promise<TenantInfo | null>
 */
export async function validateTenant(subdomain: string): Promise<TenantInfo | null> {
  // This will be connected to the database in later implementation
  // For now, return mock data for demo tenant
  
  if (subdomain === 'demo' || subdomain === 'test') {
    return {
      id: '1',
      subdomain,
      name: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} School`,
      status: 'active',
      settings: {
        features: ['students', 'teachers', 'exams', 'reports'],
        theme: {
          primaryColor: '#3b82f6',
          logo: undefined
        }
      }
    }
  }
  
  return null
}

/**
 * Get tenant configuration
 * @param tenantId - The tenant ID
 * @returns Promise<TenantInfo | null>
 */
export async function getTenantById(tenantId: string): Promise<TenantInfo | null> {
  // This will be implemented with database queries
  // For now, return mock data
  
  return {
    id: tenantId,
    subdomain: 'demo',
    name: 'Demo School',
    status: 'active',
    settings: {
      features: ['students', 'teachers', 'exams', 'reports'],
      theme: {
        primaryColor: '#3b82f6'
      }
    }
  }
}

/**
 * Check if tenant has access to specific features
 * @param tenant - The tenant info
 * @param feature - The feature to check
 * @returns boolean
 */
export function hasFeatureAccess(tenant: TenantInfo | null, feature: string): boolean {
  if (!tenant || tenant.status !== 'active') return false
  return tenant.settings.features.includes(feature)
}

/**
 * Generate tenant-specific database name
 * @param tenantId - The tenant ID
 * @returns string
 */
export function getTenantDatabaseName(tenantId: string): string {
  return `school_${tenantId}`
}

/**
 * Check if request is from main domain (no subdomain)
 * @param hostname - The hostname to check
 * @returns boolean
 */
export function isMainDomain(hostname: string): boolean {
  const subdomain = extractSubdomain(hostname)
  return subdomain === null
}