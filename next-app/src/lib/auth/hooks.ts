import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { Session } from 'next-auth'
import { UserRole, hasPermission } from './config'

// ============================================================================
// AUTHENTICATION HOOK
// ============================================================================

export interface AuthUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  image?: string
  isVerified: boolean
  isActive: boolean
  roles: {
    schoolId: string
    schoolName: string
    role: UserRole
    permissions: string[]
    isActive: boolean
  }[]
  currentSchool?: {
    id: string
    name: string
    subdomain: string
    role: UserRole
    permissions: string[]
  }
}

export interface UseAuthReturn {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  currentSchool: AuthUser['currentSchool'] | null
  currentRole: UserRole | null
  permissions: string[]
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  logout: () => Promise<void>
  switchSchool: (schoolId: string) => Promise<void>
  // Permission checking
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete') => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  canAccessSchool: (schoolId: string) => boolean
}

export interface LoginCredentials {
  identifier: string
  password: string
  schoolCode?: string
  remember?: boolean
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = useMemo(() => {
    return session?.user || null
  }, [session])

  const isLoading = status === 'loading'
  const isAuthenticated = !!user && user.isActive

  const currentSchool = useMemo(() => {
    return user?.currentSchool || null
  }, [user])

  const currentRole = useMemo(() => {
    return currentSchool?.role || null
  }, [currentSchool])

  const permissions = useMemo(() => {
    return currentSchool?.permissions || []
  }, [currentSchool])

  // Authentication actions
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await signIn('credentials', {
        identifier: credentials.identifier,
        password: credentials.password,
        schoolCode: credentials.schoolCode,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect will be handled by NextAuth callback
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [router])

  const loginWithGoogle = useCallback(async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }, [])

  const loginWithGitHub = useCallback(async () => {
    try {
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('GitHub login error:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [])

  const switchSchool = useCallback(async (schoolId: string) => {
    try {
      // Find the role for the specified school
      const targetRole = user?.roles.find(role => role.schoolId === schoolId && role.isActive)
      
      if (!targetRole) {
        throw new Error('No access to the specified school')
      }

      // Update the session with new school context
      // This would require a custom API endpoint to update the JWT token
      const response = await fetch('/api/auth/switch-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId })
      })

      if (!response.ok) {
        throw new Error('Failed to switch school')
      }

      // Refresh the session
      router.refresh()
    } catch (error) {
      console.error('Switch school error:', error)
      throw error
    }
  }, [user, router])

  // Permission checking functions
  const checkPermission = useCallback((
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete'
  ): boolean => {
    if (!permissions.length) return false
    return hasPermission(permissions, resource, action)
  }, [permissions])

  const checkRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!currentRole) return false
    
    const rolesToCheck = Array.isArray(role) ? role : [role]
    return rolesToCheck.includes(currentRole)
  }, [currentRole])

  const canAccessSchool = useCallback((schoolId: string): boolean => {
    return !!user?.roles.some(role => 
      role.schoolId === schoolId && role.isActive
    )
  }, [user])

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    currentSchool,
    currentRole,
    permissions,
    login,
    loginWithGoogle,
    loginWithGitHub,
    logout,
    switchSchool,
    hasPermission: checkPermission,
    hasRole: checkRole,
    canAccessSchool
  }
}

// ============================================================================
// PERMISSIONS HOOK
// ============================================================================

export interface UsePermissionsReturn {
  permissions: string[]
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete') => boolean
  hasAnyPermission: (resource: string, actions: ('create' | 'read' | 'update' | 'delete')[]) => boolean
  hasAllPermissions: (resource: string, actions: ('create' | 'read' | 'update' | 'delete')[]) => boolean
  canCreate: (resource: string) => boolean
  canRead: (resource: string) => boolean
  canUpdate: (resource: string) => boolean
  canDelete: (resource: string) => boolean
}

export function usePermissions(): UsePermissionsReturn {
  const { permissions, hasPermission } = useAuth()

  const hasAnyPermission = useCallback((
    resource: string,
    actions: ('create' | 'read' | 'update' | 'delete')[]
  ): boolean => {
    return actions.some(action => hasPermission(resource, action))
  }, [hasPermission])

  const hasAllPermissions = useCallback((
    resource: string,
    actions: ('create' | 'read' | 'update' | 'delete')[]
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

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete
  }
}

// ============================================================================
// SCHOOL CONTEXT HOOK
// ============================================================================

export interface UseSchoolContextReturn {
  currentSchool: AuthUser['currentSchool'] | null
  availableSchools: {
    id: string
    name: string
    subdomain: string
    role: UserRole
  }[]
  switchSchool: (schoolId: string) => Promise<void>
  isLoading: boolean
}

export function useSchoolContext(): UseSchoolContextReturn {
  const { user, currentSchool, switchSchool, isLoading } = useAuth()

  const availableSchools = useMemo(() => {
    return user?.roles
      .filter(role => role.isActive)
      .map(role => ({
        id: role.schoolId,
        name: role.schoolName,
        subdomain: '', // Would need to be populated from school data
        role: role.role
      })) || []
  }, [user])

  return {
    currentSchool,
    availableSchools,
    switchSchool,
    isLoading
  }
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL HOOKS
// ============================================================================

export function useRoleAccess() {
  const { currentRole, hasRole } = useAuth()

  return {
    isSuperAdmin: hasRole(UserRole.SUPER_ADMIN),
    isSchoolAdmin: hasRole([UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN]),
    isTeachingStaff: hasRole([UserRole.HEAD_TEACHER, UserRole.TEACHER]),
    isAdminStaff: hasRole([UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER]),
    isTeacher: hasRole(UserRole.TEACHER),
    isStudent: hasRole(UserRole.STUDENT),
    isParent: hasRole(UserRole.PARENT),
    isAccountant: hasRole(UserRole.ACCOUNTANT),
    currentRole
  }
}

// ============================================================================
// RESOURCE ACCESS HOOKS
// ============================================================================

export function useResourceAccess() {
  const { hasPermission } = usePermissions()

  return {
    // Student management
    canManageStudents: hasPermission('students', 'create') || hasPermission('students', 'update'),
    canViewStudents: hasPermission('students', 'read'),
    canDeleteStudents: hasPermission('students', 'delete'),

    // Teacher management
    canManageTeachers: hasPermission('teachers', 'create') || hasPermission('teachers', 'update'),
    canViewTeachers: hasPermission('teachers', 'read'),
    canDeleteTeachers: hasPermission('teachers', 'delete'),

    // Class management
    canManageClasses: hasPermission('classes', 'create') || hasPermission('classes', 'update'),
    canViewClasses: hasPermission('classes', 'read'),
    canDeleteClasses: hasPermission('classes', 'delete'),

    // Subject management
    canManageSubjects: hasPermission('subjects', 'create') || hasPermission('subjects', 'update'),
    canViewSubjects: hasPermission('subjects', 'read'),
    canDeleteSubjects: hasPermission('subjects', 'delete'),

    // Exam management
    canManageExams: hasPermission('exams', 'create') || hasPermission('exams', 'update'),
    canViewExams: hasPermission('exams', 'read'),
    canDeleteExams: hasPermission('exams', 'delete'),

    // Report generation
    canGenerateReports: hasPermission('reports', 'create'),
    canViewReports: hasPermission('reports', 'read'),

    // Settings
    canManageSettings: hasPermission('settings', 'update'),
    canViewSettings: hasPermission('settings', 'read'),

    // General utility
    hasPermission
  }
}