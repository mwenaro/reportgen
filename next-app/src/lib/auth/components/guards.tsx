'use client'

import React from 'react'
import { useAuth, useRoleAccess, useResourceAccess } from '../hooks'
import { UserRole } from '../config'

// ============================================================================
// ROLE-BASED GUARDS
// ============================================================================

interface RoleGuardProps {
  children: React.ReactNode
  roles: UserRole | UserRole[]
  fallback?: React.ReactNode
  requireAll?: boolean
}

export function RoleGuard({ 
  children, 
  roles, 
  fallback = null,
  requireAll = false 
}: RoleGuardProps) {
  const { hasRole } = useAuth()
  
  const rolesArray = Array.isArray(roles) ? roles : [roles]
  const hasAccess = requireAll 
    ? rolesArray.every(role => hasRole(role))
    : rolesArray.some(role => hasRole(role))

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// PERMISSION-BASED GUARDS
// ============================================================================

interface PermissionGuardProps {
  children: React.ReactNode
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  children, 
  resource, 
  action, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission } = useAuth()
  
  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface MultiPermissionGuardProps {
  children: React.ReactNode
  permissions: Array<{
    resource: string
    action: 'create' | 'read' | 'update' | 'delete'
  }>
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function MultiPermissionGuard({ 
  children, 
  permissions, 
  requireAll = false,
  fallback = null 
}: MultiPermissionGuardProps) {
  const { hasPermission } = useAuth()
  
  const hasAccess = requireAll
    ? permissions.every(({ resource, action }) => hasPermission(resource, action))
    : permissions.some(({ resource, action }) => hasPermission(resource, action))

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// AUTHENTICATION GUARDS
// ============================================================================

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  fallback = null,
  redirectTo 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Redirect if specified and not authenticated
  if (!isAuthenticated && redirectTo) {
    window.location.href = redirectTo
    return null
  }

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface GuestGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function GuestGuard({ 
  children, 
  fallback = null,
  redirectTo 
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Redirect if specified and authenticated
  if (isAuthenticated && redirectTo) {
    window.location.href = redirectTo
    return null
  }

  // Show fallback if authenticated
  if (isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// SCHOOL CONTEXT GUARDS
// ============================================================================

interface SchoolGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireSchool?: boolean
}

export function SchoolGuard({ 
  children, 
  fallback = null,
  requireSchool = true 
}: SchoolGuardProps) {
  const { currentSchool } = useAuth()

  if (requireSchool && !currentSchool) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// CONVENIENCE GUARDS FOR COMMON ROLES
// ============================================================================

export const AdminOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={[UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const SuperAdminOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={UserRole.SUPER_ADMIN} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const SchoolAdminOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={[UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const TeachingStaffOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={[UserRole.HEAD_TEACHER, UserRole.TEACHER]} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const TeachersOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={UserRole.TEACHER} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const StudentsOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={UserRole.STUDENT} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const ParentsOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={UserRole.PARENT} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const AccountantsOnly = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <RoleGuard 
    roles={UserRole.ACCOUNTANT} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

// ============================================================================
// CONVENIENCE GUARDS FOR COMMON PERMISSIONS
// ============================================================================

export const CanCreateStudents = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard resource="students" action="create" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const CanManageStudents = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <MultiPermissionGuard 
    permissions={[
      { resource: 'students', action: 'create' },
      { resource: 'students', action: 'update' },
      { resource: 'students', action: 'delete' }
    ]}
    fallback={fallback}
  >
    {children}
  </MultiPermissionGuard>
)

export const CanCreateTeachers = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard resource="teachers" action="create" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const CanManageTeachers = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <MultiPermissionGuard 
    permissions={[
      { resource: 'teachers', action: 'create' },
      { resource: 'teachers', action: 'update' },
      { resource: 'teachers', action: 'delete' }
    ]}
    fallback={fallback}
  >
    {children}
  </MultiPermissionGuard>
)

export const CanManageExams = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <MultiPermissionGuard 
    permissions={[
      { resource: 'exams', action: 'create' },
      { resource: 'exams', action: 'update' },
      { resource: 'exams', action: 'delete' }
    ]}
    fallback={fallback}
  >
    {children}
  </MultiPermissionGuard>
)

export const CanViewReports = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard resource="reports" action="read" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const CanManageSettings = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard resource="settings" action="update" fallback={fallback}>
    {children}
  </PermissionGuard>
)

// ============================================================================
// COMBINED GUARDS
// ============================================================================

interface ProtectedProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  roles?: UserRole | UserRole[]
  permissions?: Array<{
    resource: string
    action: 'create' | 'read' | 'update' | 'delete'
  }>
  requireAuth?: boolean
  requireSchool?: boolean
  requireAll?: boolean
}

export function Protected({ 
  children,
  fallback = <div>Access denied</div>,
  roles,
  permissions,
  requireAuth = true,
  requireSchool = true,
  requireAll = false
}: ProtectedProps) {
  return (
    <AuthGuard fallback={requireAuth ? fallback : children}>
      <SchoolGuard fallback={requireSchool ? fallback : children} requireSchool={requireSchool}>
        {roles && (
          <RoleGuard roles={roles} fallback={fallback} requireAll={requireAll}>
            {permissions ? (
              <MultiPermissionGuard 
                permissions={permissions} 
                fallback={fallback} 
                requireAll={requireAll}
              >
                {children}
              </MultiPermissionGuard>
            ) : (
              children
            )}
          </RoleGuard>
        )}
        {!roles && permissions && (
          <MultiPermissionGuard 
            permissions={permissions} 
            fallback={fallback} 
            requireAll={requireAll}
          >
            {children}
          </MultiPermissionGuard>
        )}
        {!roles && !permissions && children}
      </SchoolGuard>
    </AuthGuard>
  )
}

// ============================================================================
// HOC WRAPPER
// ============================================================================

export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  config: Omit<ProtectedProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <Protected {...config}>
        <Component {...props} />
      </Protected>
    )
  }
}