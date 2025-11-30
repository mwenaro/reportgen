import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { getNeDBAdapter } from '../database/nedb-adapter'
import { getDatabaseUtils } from '../database/utils'
import { UserRole, ROLE_PERMISSIONS } from './config'

// ============================================================================
// OFFLINE AUTH STORAGE SCHEMA
// ============================================================================

export interface OfflineUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  hashedPassword: string
  avatar?: string
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
  // Offline-specific fields
  lastSync: Date
  syncStatus: 'synced' | 'pending' | 'conflict' | 'offline_only'
  offlineToken?: string
  tokenExpires?: Date
  createdOffline: boolean
}

export interface OfflineSession {
  id: string
  userId: string
  token: string
  expires: Date
  lastActivity: Date
  deviceInfo?: {
    userAgent: string
    ip: string
    platform: string
  }
  syncStatus: 'active' | 'expired' | 'synced'
}

// ============================================================================
// OFFLINE AUTH MANAGER
// ============================================================================

export class OfflineAuthManager {
  private nedb: any
  private isInitialized = false
  
  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (this.isInitialized) return
    
    try {
      this.nedb = await getNeDBAdapter()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize offline auth:', error)
    }
  }

  // ============================================================================
  // OFFLINE USER MANAGEMENT
  // ============================================================================

  async createOfflineUser(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    schoolId?: string
    role?: UserRole
  }): Promise<OfflineUser> {
    await this.initialize()

    // Check if user already exists offline
    const existingUser = await this.nedb.findOne('users', {
      $or: [{ email: userData.email }, { username: userData.username }]
    })

    if (existingUser) {
      throw new Error('User already exists offline')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Generate offline token
    const offlineToken = crypto.randomBytes(32).toString('hex')

    const user: OfflineUser = {
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      hashedPassword,
      isVerified: true, // Auto-verify offline users
      isActive: true,
      roles: userData.schoolId ? [{
        schoolId: userData.schoolId,
        schoolName: 'Offline School', // Will be updated on sync
        role: userData.role || UserRole.STUDENT,
        permissions: ROLE_PERMISSIONS[userData.role || UserRole.STUDENT]
          .map(p => `${p.resource}:${p.actions.join(',')}`),
        isActive: true
      }] : [],
      currentSchool: userData.schoolId ? {
        id: userData.schoolId,
        name: 'Offline School',
        subdomain: 'offline',
        role: userData.role || UserRole.STUDENT,
        permissions: ROLE_PERMISSIONS[userData.role || UserRole.STUDENT]
          .map(p => `${p.resource}:${p.actions.join(',')}`),
      } : undefined,
      lastSync: new Date(0), // Never synced
      syncStatus: 'offline_only',
      offlineToken,
      tokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdOffline: true
    }

    await this.nedb.insert('users', user)
    return user
  }

  async authenticateOffline(credentials: {
    identifier: string
    password: string
  }): Promise<{ user: OfflineUser; session: OfflineSession } | null> {
    await this.initialize()

    // Find user by email or username
    const user = await this.nedb.findOne('users', {
      $or: [
        { email: credentials.identifier },
        { username: credentials.identifier }
      ],
      isActive: true
    })

    if (!user) {
      return null
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
    if (!isValidPassword) {
      return null
    }

    // Create offline session
    const session = await this.createOfflineSession(user.id)

    return { user, session }
  }

  async createOfflineSession(userId: string): Promise<OfflineSession> {
    const sessionToken = crypto.randomBytes(32).toString('hex')
    
    const session: OfflineSession = {
      id: crypto.randomUUID(),
      userId,
      token: sessionToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      lastActivity: new Date(),
      deviceInfo: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        ip: 'offline',
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'
      },
      syncStatus: 'active'
    }

    await this.nedb.insert('sessions', session)
    return session
  }

  async validateOfflineSession(token: string): Promise<OfflineUser | null> {
    await this.initialize()

    const session = await this.nedb.findOne('sessions', {
      token,
      syncStatus: 'active',
      expires: { $gt: new Date() }
    })

    if (!session) {
      return null
    }

    const user = await this.nedb.findOne('users', {
      id: session.userId,
      isActive: true
    })

    if (!user) {
      return null
    }

    // Update last activity
    await this.nedb.update('sessions', 
      { token },
      { lastActivity: new Date() }
    )

    return user
  }

  // ============================================================================
  // SYNC MANAGEMENT
  // ============================================================================

  async syncUserToServer(user: OfflineUser): Promise<boolean> {
    if (!navigator.onLine) {
      return false
    }

    try {
      const dbUtils = getDatabaseUtils()

      // Check if user exists online
      const onlineUser = await dbUtils.findOne('User', { 
        $or: [{ email: user.email }, { username: user.username }]
      })

      if (onlineUser) {
        // Update existing user
        await dbUtils.update('User', 
          { _id: onlineUser._id },
          {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            lastSync: new Date(),
            offlineUpdates: true
          }
        )
      } else {
        // Create new user online
        const newUser = await dbUtils.create('User', {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          hashedPassword: user.hashedPassword,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isActive: user.isActive,
          roles: user.roles,
          provider: 'offline',
          createdOffline: true,
          syncedAt: new Date()
        })

        // Update offline user with online ID
        await this.nedb.update('users',
          { id: user.id },
          { 
            onlineId: newUser._id.toString(),
            syncStatus: 'synced',
            lastSync: new Date()
          }
        )
      }

      return true
    } catch (error) {
      console.error('Failed to sync user to server:', error)
      
      // Mark as conflict if sync fails
      await this.nedb.update('users',
        { id: user.id },
        { syncStatus: 'conflict' }
      )
      
      return false
    }
  }

  async syncUserFromServer(onlineUser: any): Promise<void> {
    await this.initialize()

    // Check if user exists offline
    const offlineUser = await this.nedb.findOne('users', {
      $or: [
        { email: onlineUser.email },
        { onlineId: onlineUser._id.toString() }
      ]
    })

    if (offlineUser) {
      // Update existing offline user
      await this.nedb.update('users',
        { id: offlineUser.id },
        {
          firstName: onlineUser.firstName,
          lastName: onlineUser.lastName,
          avatar: onlineUser.avatar,
          isVerified: onlineUser.isVerified,
          isActive: onlineUser.isActive,
          roles: onlineUser.roles,
          syncStatus: 'synced',
          lastSync: new Date(),
          onlineId: onlineUser._id.toString()
        }
      )
    } else {
      // Create new offline user from server data
      const user: OfflineUser = {
        id: crypto.randomUUID(),
        username: onlineUser.username,
        email: onlineUser.email,
        firstName: onlineUser.firstName,
        lastName: onlineUser.lastName,
        hashedPassword: onlineUser.hashedPassword,
        avatar: onlineUser.avatar,
        isVerified: onlineUser.isVerified,
        isActive: onlineUser.isActive,
        roles: onlineUser.roles || [],
        currentSchool: onlineUser.roles?.[0] ? {
          id: onlineUser.roles[0].schoolId,
          name: onlineUser.roles[0].schoolName,
          subdomain: 'synced',
          role: onlineUser.roles[0].role,
          permissions: onlineUser.roles[0].permissions
        } : undefined,
        lastSync: new Date(),
        syncStatus: 'synced',
        createdOffline: false
      }

      await this.nedb.insert('users', user)
    }
  }

  async getOfflineUsers(): Promise<OfflineUser[]> {
    await this.initialize()
    return await this.nedb.find('users', {})
  }

  async getPendingSyncUsers(): Promise<OfflineUser[]> {
    await this.initialize()
    return await this.nedb.find('users', {
      syncStatus: { $in: ['offline_only', 'pending', 'conflict'] }
    })
  }

  // ============================================================================
  // OFFLINE SESSION MANAGEMENT
// ============================================================================

  async getActiveSessions(userId: string): Promise<OfflineSession[]> {
    await this.initialize()
    return await this.nedb.find('sessions', {
      userId,
      syncStatus: 'active',
      expires: { $gt: new Date() }
    })
  }

  async revokeOfflineSession(token: string): Promise<void> {
    await this.initialize()
    await this.nedb.update('sessions',
      { token },
      { syncStatus: 'expired' }
    )
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.initialize()
    await this.nedb.remove('sessions', {
      expires: { $lt: new Date() }
    }, { multi: true })
  }

  // ============================================================================
  // DATA MANAGEMENT
  // ============================================================================

  async exportOfflineData(): Promise<{
    users: OfflineUser[]
    sessions: OfflineSession[]
    lastExport: Date
  }> {
    await this.initialize()
    
    const users = await this.nedb.find('users', {})
    const sessions = await this.nedb.find('sessions', {})
    
    return {
      users,
      sessions,
      lastExport: new Date()
    }
  }

  async importOfflineData(data: {
    users: OfflineUser[]
    sessions: OfflineSession[]
  }): Promise<void> {
    await this.initialize()

    // Clear existing data
    await this.nedb.remove('users', {}, { multi: true })
    await this.nedb.remove('sessions', {}, { multi: true })

    // Import new data
    for (const user of data.users) {
      await this.nedb.insert('users', user)
    }

    for (const session of data.sessions) {
      await this.nedb.insert('sessions', session)
    }
  }

  async clearAllOfflineData(): Promise<void> {
    await this.initialize()
    await this.nedb.remove('users', {}, { multi: true })
    await this.nedb.remove('sessions', {}, { multi: true })
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async isUserOffline(identifier: string): Promise<boolean> {
    await this.initialize()
    const user = await this.nedb.findOne('users', {
      $or: [{ email: identifier }, { username: identifier }]
    })
    return !!user
  }

  async getOfflineUserCount(): Promise<number> {
    await this.initialize()
    return await this.nedb.count('users', {})
  }

  async getOfflineStats(): Promise<{
    totalUsers: number
    activeUsers: number
    pendingSync: number
    conflicted: number
    activeSessions: number
  }> {
    await this.initialize()
    
    const totalUsers = await this.nedb.count('users', {})
    const activeUsers = await this.nedb.count('users', { isActive: true })
    const pendingSync = await this.nedb.count('users', { 
      syncStatus: { $in: ['offline_only', 'pending'] }
    })
    const conflicted = await this.nedb.count('users', { syncStatus: 'conflict' })
    const activeSessions = await this.nedb.count('sessions', {
      syncStatus: 'active',
      expires: { $gt: new Date() }
    })

    return {
      totalUsers,
      activeUsers,
      pendingSync,
      conflicted,
      activeSessions
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let offlineAuthInstance: OfflineAuthManager | null = null

export const getOfflineAuth = (): OfflineAuthManager => {
  if (!offlineAuthInstance) {
    offlineAuthInstance = new OfflineAuthManager()
  }
  return offlineAuthInstance
}

export default OfflineAuthManager