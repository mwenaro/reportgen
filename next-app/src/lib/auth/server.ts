import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, UserRole, hasPermission } from './config'

// ============================================================================
// SERVER-SIDE AUTH UTILITIES
// ============================================================================

export async function getAuth() {
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await getAuth()
  
  if (!session?.user || !session.user.isActive) {
    redirect('/auth/signin')
  }
  
  return session
}

export async function requireRole(roles: UserRole | UserRole[]) {
  const session = await requireAuth()
  const userRole = session.user.currentSchool?.role
  
  if (!userRole) {
    redirect('/auth/select-school')
  }
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  if (!allowedRoles.includes(userRole)) {
    redirect('/auth/unauthorized')
  }
  
  return session
}

export async function requirePermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
) {
  const session = await requireAuth()
  const permissions = session.user.currentSchool?.permissions || []
  
  if (!hasPermission(permissions, resource, action)) {
    redirect('/auth/unauthorized')
  }
  
  return session
}

// ============================================================================
// HIGHER-ORDER COMPONENTS
// ============================================================================

interface WithAuthOptions {
  requireAuth?: boolean
  requireRole?: UserRole | UserRole[]
  requirePermission?: {
    resource: string
    action: 'create' | 'read' | 'update' | 'delete'
  }
  redirectTo?: string
  fallback?: ReactNode
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    // This would be used in client components
    // For server components, use the server-side utilities above
    return <Component {...props} />
  }
}

// ============================================================================
// PERMISSION CHECKING COMPONENTS
// ============================================================================

interface ProtectedProps {
  children: ReactNode
  fallback?: ReactNode
  roles?: UserRole | UserRole[]
  permissions?: {
    resource: string
    action: 'create' | 'read' | 'update' | 'delete'
  }
  requireAll?: boolean
}

export function Protected({ 
  children, 
  fallback = null, 
  roles, 
  permissions,
  requireAll = false 
}: ProtectedProps) {
  // This would be implemented as a client component
  // using the auth hooks to check permissions
  return (
    <>
      {children}
    </>
  )
}

// ============================================================================
// ROLE-BASED COMPONENTS
// ============================================================================

interface RoleGuardProps {
  children: ReactNode
  roles: UserRole | UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  // Client component implementation would go here
  return <>{children}</>
}

interface PermissionGuardProps {
  children: ReactNode
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  fallback?: ReactNode
}

export function PermissionGuard({ 
  children, 
  resource, 
  action, 
  fallback = null 
}: PermissionGuardProps) {
  // Client component implementation would go here
  return <>{children}</>
}

// ============================================================================
// UTILITY COMPONENTS FOR DIFFERENT ROLES
// ============================================================================

export const AdminOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard 
    roles={[UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const TeachersOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard 
    roles={[UserRole.TEACHER, UserRole.HEAD_TEACHER]} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const StudentsOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard 
    roles={UserRole.STUDENT} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

export const ParentsOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleGuard 
    roles={UserRole.PARENT} 
    fallback={fallback}
  >
    {children}
  </RoleGuard>
)

// ============================================================================
// TENANT CONTEXT UTILITIES
// ============================================================================

export async function getCurrentTenant() {
  const session = await getAuth()
  return session?.user.currentSchool || null
}

export async function requireTenant() {
  const tenant = await getCurrentTenant()
  
  if (!tenant) {
    redirect('/auth/select-school')
  }
  
  return tenant
}

export async function validateTenantAccess(schoolId: string) {
  const session = await requireAuth()
  
  const hasAccess = session.user.roles.some(role => 
    role.schoolId === schoolId && role.isActive
  )
  
  if (!hasAccess) {
    redirect('/auth/unauthorized')
  }
  
  return session
}

// ============================================================================
// MIDDLEWARE HELPERS
// ============================================================================

export interface AuthMiddlewareConfig {
  publicRoutes?: string[]
  authRoutes?: string[]
  protectedRoutes?: string[]
  adminRoutes?: string[]
  apiRoutes?: string[]
}

export const defaultAuthConfig: AuthMiddlewareConfig = {
  publicRoutes: [
    '/',
    '/about',
    '/contact',
    '/features',
    '/pricing',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/verify-request'
  ],
  authRoutes: [
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/verify-request',
    '/auth/welcome'
  ],
  protectedRoutes: [
    '/dashboard',
    '/profile',
    '/settings'
  ],
  adminRoutes: [
    '/admin',
    '/system'
  ],
  apiRoutes: [
    '/api/auth',
    '/api/health'
  ]
}

export function isPublicRoute(pathname: string, config: AuthMiddlewareConfig = defaultAuthConfig): boolean {
  return config.publicRoutes?.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  ) ?? false
}

export function isAuthRoute(pathname: string, config: AuthMiddlewareConfig = defaultAuthConfig): boolean {
  return config.authRoutes?.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  ) ?? false
}

export function isProtectedRoute(pathname: string, config: AuthMiddlewareConfig = defaultAuthConfig): boolean {
  return config.protectedRoutes?.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  ) ?? false
}

export function isAdminRoute(pathname: string, config: AuthMiddlewareConfig = defaultAuthConfig): boolean {
  return config.adminRoutes?.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  ) ?? false
}

export function isApiRoute(pathname: string, config: AuthMiddlewareConfig = defaultAuthConfig): boolean {
  return config.apiRoutes?.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  ) ?? false
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export class PermissionError extends AuthError {
  constructor(resource: string, action: string) {
    super(
      `Insufficient permissions to ${action} ${resource}`,
      'PERMISSION_DENIED',
      403
    )
  }
}

export class RoleError extends AuthError {
  constructor(requiredRoles: UserRole[]) {
    super(
      `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      'ROLE_DENIED',
      403
    )
  }
}

export class TenantError extends AuthError {
  constructor(schoolId: string) {
    super(
      `No access to school with ID: ${schoolId}`,
      'TENANT_ACCESS_DENIED',
      403
    )
  }
}