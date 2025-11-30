import { NextAuthOptions, DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { UserModel } from '../database'
import { getDatabaseUtils, type TenantContext } from '../database/utils'

// ============================================================================
// EXTENDED TYPES FOR MULTI-TENANT AUTH
// ============================================================================

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      email: string
      firstName: string
      lastName: string
      image?: string
      isVerified: boolean
      isActive: boolean
      // Multi-tenant roles
      roles: {
        schoolId: string
        schoolName: string
        role: UserRole
        permissions: string[]
        isActive: boolean
      }[]
      // Current active school context
      currentSchool?: {
        id: string
        name: string
        subdomain: string
        role: UserRole
        permissions: string[]
      }
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    username: string
    firstName: string
    lastName: string
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
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    username: string
    firstName: string
    lastName: string
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
}

// ============================================================================
// ENUMS AND TYPES
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'super_admin',    // System administrator
  SCHOOL_ADMIN = 'school_admin',  // School administrator
  DEPUTY_ADMIN = 'deputy_admin',  // Deputy school administrator
  HEAD_TEACHER = 'head_teacher',  // Head teacher
  TEACHER = 'teacher',            // Teaching staff
  STUDENT = 'student',            // Students
  PARENT = 'parent',              // Parents/Guardians
  ACCOUNTANT = 'accountant',      // Finance staff
  LIBRARIAN = 'librarian',        // Library staff
  NURSE = 'nurse',                // Health staff
  SECURITY = 'security'           // Security staff
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
  scope?: 'own' | 'school' | 'class' | 'subject' | 'all'
}

// ============================================================================
// ROLE PERMISSIONS CONFIGURATION
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete'], scope: 'all' }
  ],
  
  [UserRole.SCHOOL_ADMIN]: [
    { resource: 'school', actions: ['read', 'update'], scope: 'own' },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'students', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'teachers', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'classes', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'subjects', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'exams', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'settings', actions: ['read', 'update'], scope: 'school' }
  ],

  [UserRole.DEPUTY_ADMIN]: [
    { resource: 'students', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'teachers', actions: ['read', 'update'], scope: 'school' },
    { resource: 'classes', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'subjects', actions: ['read', 'update'], scope: 'school' },
    { resource: 'exams', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'reports', actions: ['create', 'read'], scope: 'school' }
  ],

  [UserRole.HEAD_TEACHER]: [
    { resource: 'students', actions: ['read', 'update'], scope: 'school' },
    { resource: 'teachers', actions: ['read'], scope: 'school' },
    { resource: 'classes', actions: ['read', 'update'], scope: 'school' },
    { resource: 'subjects', actions: ['read'], scope: 'school' },
    { resource: 'exams', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'reports', actions: ['create', 'read'], scope: 'school' }
  ],

  [UserRole.TEACHER]: [
    { resource: 'students', actions: ['read', 'update'], scope: 'class' },
    { resource: 'classes', actions: ['read'], scope: 'own' },
    { resource: 'subjects', actions: ['read'], scope: 'own' },
    { resource: 'exams', actions: ['create', 'read', 'update'], scope: 'subject' },
    { resource: 'marks', actions: ['create', 'read', 'update'], scope: 'subject' },
    { resource: 'reports', actions: ['create', 'read'], scope: 'subject' }
  ],

  [UserRole.STUDENT]: [
    { resource: 'profile', actions: ['read', 'update'], scope: 'own' },
    { resource: 'marks', actions: ['read'], scope: 'own' },
    { resource: 'reports', actions: ['read'], scope: 'own' },
    { resource: 'assignments', actions: ['read'], scope: 'own' }
  ],

  [UserRole.PARENT]: [
    { resource: 'students', actions: ['read'], scope: 'own' },
    { resource: 'marks', actions: ['read'], scope: 'own' },
    { resource: 'reports', actions: ['read'], scope: 'own' },
    { resource: 'fees', actions: ['read'], scope: 'own' }
  ],

  [UserRole.ACCOUNTANT]: [
    { resource: 'students', actions: ['read'], scope: 'school' },
    { resource: 'fees', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'financial_reports', actions: ['create', 'read'], scope: 'school' }
  ],

  [UserRole.LIBRARIAN]: [
    { resource: 'books', actions: ['create', 'read', 'update', 'delete'], scope: 'school' },
    { resource: 'library_records', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'students', actions: ['read'], scope: 'school' }
  ],

  [UserRole.NURSE]: [
    { resource: 'health_records', actions: ['create', 'read', 'update'], scope: 'school' },
    { resource: 'students', actions: ['read'], scope: 'school' }
  ],

  [UserRole.SECURITY]: [
    { resource: 'attendance', actions: ['create', 'read'], scope: 'school' },
    { resource: 'students', actions: ['read'], scope: 'school' }
  ]
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolCode: z.string().optional(),
  remember: z.boolean().optional()
})

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string(),
  schoolCode: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function validateCredentials(credentials: any): Promise<any> {
  try {
    const { identifier, password, schoolCode } = loginSchema.parse(credentials)
    const dbUtils = getDatabaseUtils()

    // Build query to find user by email or username
    const query = {
      $or: [
        { email: identifier },
        { username: identifier }
      ],
      isActive: true
    }

    const user = await dbUtils.findOne('User', query)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // If schoolCode is provided, filter roles for that school
    let activeRoles = user.roles.filter((role: any) => role.isActive)
    
    if (schoolCode) {
      // Find school by code
      const school = await dbUtils.findOne('School', { code: schoolCode, isActive: true })
      if (!school) {
        throw new Error('Invalid school code')
      }
      
      // Filter roles for specific school
      activeRoles = activeRoles.filter((role: any) => role.schoolId.toString() === school._id.toString())
      
      if (activeRoles.length === 0) {
        throw new Error('No access to this school')
      }
      
      // Set current school context
      user.currentSchool = {
        id: school._id.toString(),
        name: school.name,
        subdomain: school.subdomain,
        role: activeRoles[0].role,
        permissions: ROLE_PERMISSIONS[activeRoles[0].role].map(p => `${p.resource}:${p.actions.join(',')}`).concat(activeRoles[0].permissions || [])
      }
    } else if (activeRoles.length === 1) {
      // Auto-select school if user has only one role
      const school = await dbUtils.findOne('School', { _id: activeRoles[0].schoolId })
      if (school) {
        user.currentSchool = {
          id: school._id.toString(),
          name: school.name,
          subdomain: school.subdomain,
          role: activeRoles[0].role,
          permissions: ROLE_PERMISSIONS[activeRoles[0].role].map(p => `${p.resource}:${p.actions.join(',')}`).concat(activeRoles[0].permissions || [])
        }
      }
    }

    // Return user data without sensitive fields
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.avatar,
      isVerified: user.isVerified,
      isActive: user.isActive,
      roles: activeRoles.map((role: any) => ({
        schoolId: role.schoolId.toString(),
        schoolName: role.schoolName,
        role: role.role,
        permissions: ROLE_PERMISSIONS[role.role].map(p => `${p.resource}:${p.actions.join(',')}`).concat(role.permissions || []),
        isActive: role.isActive
      })),
      currentSchool: user.currentSchool
    }
  } catch (error) {
    console.error('Credential validation error:', error)
    return null
  }
}

async function getUserById(id: string): Promise<any> {
  try {
    const dbUtils = getDatabaseUtils()
    const user = await dbUtils.findOne('User', { _id: id, isActive: true })
    
    if (!user) return null

    const activeRoles = user.roles.filter((role: any) => role.isActive)

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.avatar,
      isVerified: user.isVerified,
      isActive: user.isActive,
      roles: activeRoles.map((role: any) => ({
        schoolId: role.schoolId.toString(),
        schoolName: role.schoolName,
        role: role.role,
        permissions: ROLE_PERMISSIONS[role.role].map(p => `${p.resource}:${p.actions.join(',')}`).concat(role.permissions || []),
        isActive: role.isActive
      }))
    }
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}

// ============================================================================
// MONGODB ADAPTER SETUP
// ============================================================================

const client = new MongoClient(process.env.MONGODB_URI!, {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})

// ============================================================================
// NEXTAUTH CONFIGURATION
// ============================================================================

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.MONGODB_DB_NAME || 'reportgen_auth'
  }),
  
  providers: [
    // Credentials Provider for email/password and username/password
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        schoolCode: { label: 'School Code (Optional)', type: 'text' },
        remember: { label: 'Remember me', type: 'checkbox' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }
        return await validateCredentials(credentials)
      }
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account'
        }
      }
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),

    // Email Magic Link Provider
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome'
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in for OAuth providers
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const dbUtils = getDatabaseUtils()
          
          // Check if user exists with this email
          let existingUser = await dbUtils.findOne('User', { 
            email: user.email,
            isActive: true 
          })

          if (!existingUser) {
            // Create new user from OAuth
            existingUser = await dbUtils.create('User', {
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              username: user.email?.split('@')[0] || '',
              avatar: user.image,
              isVerified: true,
              isActive: true,
              provider: account.provider,
              providerId: account.providerAccountId,
              roles: [] // Will be assigned by school admin
            })
          }

          return true
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }

      // Allow sign in for credentials
      if (account?.provider === 'credentials') {
        return !!user
      }

      return true
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.username = user.username
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.isVerified = user.isVerified
        token.isActive = user.isActive
        token.roles = user.roles
        token.currentSchool = user.currentSchool
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.isVerified = token.isVerified
        session.user.isActive = token.isActive
        session.user.roles = token.roles
        session.user.currentSchool = token.currentSchool
      }

      return session
    },

    async redirect({ url, baseUrl }) {
      // Handle post-login redirects
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`
    }
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { userId: user.id, provider: account?.provider })
    },
    
    async signOut({ token }) {
      console.log('User signed out:', { userId: token?.id })
    },

    async createUser({ user }) {
      console.log('User created:', { userId: user.id, email: user.email })
    },

    async session({ session, token }) {
      // Track active sessions for security
      console.log('Session accessed:', { 
        userId: session.user.id,
        school: session.user.currentSchool?.name 
      })
    }
  },

  debug: process.env.NODE_ENV === 'development',
  
  logger: {
    error: (code, metadata) => {
      console.error(`NextAuth Error [${code}]:`, metadata)
    },
    warn: (code) => {
      console.warn(`NextAuth Warning [${code}]`)
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`NextAuth Debug [${code}]:`, metadata)
      }
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

export function hasPermission(
  userPermissions: string[],
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  // Check for super admin wildcard
  if (userPermissions.some(p => p.startsWith('*:'))) {
    return true
  }

  // Check for specific resource permission
  return userPermissions.some(p => {
    const [permResource, actions] = p.split(':')
    if (permResource === resource) {
      return actions.includes(action)
    }
    return false
  })
}

export type { Permission }
export { loginSchema, registerSchema }