'use client'

import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { useAuth, UseAuthReturn } from './hooks'

// ============================================================================
// AUTH CONTEXT
// ============================================================================

interface AuthContextValue extends UseAuthReturn {
  // Additional context-specific methods
  refreshAuth: () => Promise<void>
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ============================================================================
// AUTH PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  const refreshAuth = useCallback(async () => {
    // Force session refresh
    window.location.reload()
  }, [])

  const clearAuth = useCallback(() => {
    // Clear any local storage or cached auth data
    localStorage.removeItem('auth-storage')
    sessionStorage.removeItem('auth-temp')
  }, [])

  const contextValue = useMemo(() => ({
    ...auth,
    refreshAuth,
    clearAuth
  }), [auth, refreshAuth, clearAuth])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================================
// CONTEXT HOOKS
// ============================================================================

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}

// ============================================================================
// SCHOOL CONTEXT
// ============================================================================

interface SchoolContextValue {
  currentSchool: {
    id: string
    name: string
    subdomain: string
    role: string
    permissions: string[]
  } | null
  availableSchools: Array<{
    id: string
    name: string
    subdomain: string
    role: string
  }>
  switchSchool: (schoolId: string) => Promise<void>
  isLoading: boolean
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined)

interface SchoolProviderProps {
  children: React.ReactNode
}

export function SchoolProvider({ children }: SchoolProviderProps) {
  const { user, switchSchool, isLoading } = useAuthContext()

  const currentSchool = useMemo(() => {
    return user?.currentSchool || null
  }, [user])

  const availableSchools = useMemo(() => {
    return user?.roles
      .filter(role => role.isActive)
      .map(role => ({
        id: role.schoolId,
        name: role.schoolName,
        subdomain: '', // Would need to be fetched from school data
        role: role.role
      })) || []
  }, [user])

  const contextValue = useMemo(() => ({
    currentSchool,
    availableSchools,
    switchSchool,
    isLoading
  }), [currentSchool, availableSchools, switchSchool, isLoading])

  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  )
}

export function useSchoolContext(): SchoolContextValue {
  const context = useContext(SchoolContext)
  
  if (context === undefined) {
    throw new Error('useSchoolContext must be used within a SchoolProvider')
  }
  
  return context
}

// ============================================================================
// PERMISSIONS CONTEXT
// ============================================================================

interface PermissionsContextValue {
  permissions: string[]
  hasPermission: (resource: string, action: string) => boolean
  hasAnyPermission: (resource: string, actions: string[]) => boolean
  hasAllPermissions: (resource: string, actions: string[]) => boolean
  canCreate: (resource: string) => boolean
  canRead: (resource: string) => boolean
  canUpdate: (resource: string) => boolean
  canDelete: (resource: string) => boolean
  // Resource-specific permissions
  canManageUsers: boolean
  canManageStudents: boolean
  canManageTeachers: boolean
  canManageClasses: boolean
  canManageSubjects: boolean
  canManageExams: boolean
  canViewReports: boolean
  canManageSettings: boolean
}

const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined)

interface PermissionsProviderProps {
  children: React.ReactNode
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { permissions, hasPermission } = useAuthContext()

  const hasAnyPermission = useCallback((
    resource: string,
    actions: string[]
  ): boolean => {
    return actions.some(action => hasPermission(resource, action))
  }, [hasPermission])

  const hasAllPermissions = useCallback((
    resource: string,
    actions: string[]
  ): boolean => {
    return actions.every(action => hasPermission(resource, action))
  }, [hasPermission])

  const canCreate = useCallback((resource: string): boolean => {
    return hasPermission(resource, 'create')
  }, [hasPermission])

  const canRead = useCallback((resource: string): boolean => {
    return hasPermission(resource, 'read')
  }, [hasPermission])

  const canUpdate = useCallback((resource: string): boolean => {
    return hasPermission(resource, 'update')
  }, [hasPermission])

  const canDelete = useCallback((resource: string): boolean => {
    return hasPermission(resource, 'delete')
  }, [hasPermission])

  // Resource-specific permissions
  const resourcePermissions = useMemo(() => ({
    canManageUsers: hasAnyPermission('users', ['create', 'update', 'delete']),
    canManageStudents: hasAnyPermission('students', ['create', 'update', 'delete']),
    canManageTeachers: hasAnyPermission('teachers', ['create', 'update', 'delete']),
    canManageClasses: hasAnyPermission('classes', ['create', 'update', 'delete']),
    canManageSubjects: hasAnyPermission('subjects', ['create', 'update', 'delete']),
    canManageExams: hasAnyPermission('exams', ['create', 'update', 'delete']),
    canViewReports: hasPermission('reports', 'read'),
    canManageSettings: hasPermission('settings', 'update')
  }), [hasPermission, hasAnyPermission])

  const contextValue = useMemo(() => ({
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    ...resourcePermissions
  }), [
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    resourcePermissions
  ])

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissionsContext(): PermissionsContextValue {
  const context = useContext(PermissionsContext)
  
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider')
  }
  
  return context
}

// ============================================================================
// COMBINED PROVIDER
// ============================================================================

interface ProvidersProps {
  children: React.ReactNode
}

export function AuthProviders({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SchoolProvider>
        <PermissionsProvider>
          {children}
        </PermissionsProvider>
      </SchoolProvider>
    </AuthProvider>
  )
}