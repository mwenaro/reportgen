export { authOptions, UserRole, getPermissionsForRole, hasPermission } from './config'
export type { Permission } from './config'

// Authentication hooks
export { 
  useAuth, 
  usePermissions, 
  useSchoolContext, 
  useRoleAccess,
  useResourceAccess 
} from './hooks'
export type { 
  AuthUser, 
  UseAuthReturn, 
  UsePermissionsReturn, 
  UseSchoolContextReturn,
  LoginCredentials 
} from './hooks'

// Server-side utilities
export {
  getAuth,
  requireAuth,
  requireRole,
  requirePermission,
  withAuth,
  getCurrentTenant,
  requireTenant,
  validateTenantAccess,
  isPublicRoute,
  isAuthRoute,
  isProtectedRoute,
  isAdminRoute,
  defaultAuthConfig
} from './server'
export type { AuthMiddlewareConfig } from './server'

// Providers and context
export { 
  AuthProvider, 
  SchoolProvider, 
  PermissionsProvider, 
  AuthProviders,
  useAuthContext,
  useSchoolContext as useSchoolContextProvider,
  usePermissionsContext
} from './providers'

// Guard components
export {
  RoleGuard,
  PermissionGuard,
  MultiPermissionGuard,
  AuthGuard,
  GuestGuard,
  SchoolGuard,
  Protected,
  withProtection,
  // Convenience guards
  AdminOnly,
  SuperAdminOnly,
  SchoolAdminOnly,
  TeachingStaffOnly,
  TeachersOnly,
  StudentsOnly,
  ParentsOnly,
  AccountantsOnly,
  // Permission guards
  CanCreateStudents,
  CanManageStudents,
  CanCreateTeachers,
  CanManageTeachers,
  CanManageExams,
  CanViewReports,
  CanManageSettings
} from './components/guards'

// Middleware
export {
  middleware,
  authMiddleware,
  tenantMiddleware,
  withAuth as withAuthAPI,
  withRole as withRoleAPI,
  withPermission as withPermissionAPI,
  withTenant as withTenantAPI
} from './middleware'

// Auth services
export {
  registerUser,
  inviteUser,
  changePassword,
  resetPassword,
  updateProfile,
  assignUserRole,
  removeUserRole,
  verifyEmail,
  registerSchema,
  inviteUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
} from './services'

// Errors
export {
  AuthError,
  PermissionError,
  RoleError,
  TenantError
} from './server'

// ============================================================================
// CONVENIENCE HELPERS
// ============================================================================

import { UserRole } from './config'

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.SCHOOL_ADMIN]: 90,
  [UserRole.DEPUTY_ADMIN]: 85,
  [UserRole.HEAD_TEACHER]: 80,
  [UserRole.TEACHER]: 70,
  [UserRole.ACCOUNTANT]: 60,
  [UserRole.LIBRARIAN]: 50,
  [UserRole.NURSE]: 40,
  [UserRole.SECURITY]: 30,
  [UserRole.PARENT]: 20,
  [UserRole.STUDENT]: 10
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2]
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole]
}

// Common role groups
export const ADMIN_ROLES = [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN]
export const TEACHING_ROLES = [UserRole.HEAD_TEACHER, UserRole.TEACHER]
export const STAFF_ROLES = [UserRole.ACCOUNTANT, UserRole.LIBRARIAN, UserRole.NURSE, UserRole.SECURITY]
export const USER_ROLES = [UserRole.PARENT, UserRole.STUDENT]

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role)
}

export function isTeachingRole(role: UserRole): boolean {
  return TEACHING_ROLES.includes(role)
}

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role)
}

export function isUserRole(role: UserRole): boolean {
  return USER_ROLES.includes(role)
}

// Permission utilities
export function formatPermission(resource: string, actions: string[]): string {
  return `${resource}:${actions.join(',')}`
}

export function parsePermission(permission: string): { resource: string; actions: string[] } {
  const [resource, actionsString] = permission.split(':')
  const actions = actionsString?.split(',') || []
  return { resource, actions }
}

// Session utilities
export function getSessionStorageKey(key: string): string {
  return `auth_${key}`
}

export function setSessionData(key: string, data: any): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(getSessionStorageKey(key), JSON.stringify(data))
  }
}

export function getSessionData(key: string): any {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem(getSessionStorageKey(key))
    return data ? JSON.parse(data) : null
  }
  return null
}

export function clearSessionData(key?: string): void {
  if (typeof window !== 'undefined') {
    if (key) {
      sessionStorage.removeItem(getSessionStorageKey(key))
    } else {
      // Clear all auth-related session data
      Object.keys(sessionStorage).forEach(storageKey => {
        if (storageKey.startsWith('auth_')) {
          sessionStorage.removeItem(storageKey)
        }
      })
    }
  }
}

// ============================================================================
// OFFLINE & HYBRID AUTHENTICATION
// ============================================================================

// Offline authentication
export {
  getOfflineAuth,
  OfflineAuthManager
} from './offline-auth'
export type {
  OfflineUser,
  OfflineSession,
  OfflineUserData,
  SyncStatus
} from './offline-auth'

// Hybrid authentication (combines NextAuth + offline)
export {
  getHybridAuth,
  HybridAuthManager
} from './hybrid-auth'
export type {
  AuthState
} from './hybrid-auth'