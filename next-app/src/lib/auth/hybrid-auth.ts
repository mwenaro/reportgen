import { getOfflineAuth, OfflineAuthManager, OfflineUser, OfflineSession } from './offline-auth'
import { getDatabaseUtils } from '../database/utils'

// ============================================================================
// HYBRID AUTH MANAGER
// ============================================================================

export interface AuthState {
  user: OfflineUser | null
  session: OfflineSession | null
  isOnline: boolean
  isLoading: boolean
  lastSync: Date | null
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
}

export class HybridAuthManager {
  private offlineAuth: OfflineAuthManager
  private authState: AuthState = {
    user: null,
    session: null,
    isOnline: navigator?.onLine ?? false,
    isLoading: false,
    lastSync: null,
    syncStatus: 'idle'
  }
  
  private listeners: ((state: AuthState) => void)[] = []
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.offlineAuth = getOfflineAuth()
    this.initializeEventListeners()
    this.startAutoSync()
  }

  private initializeEventListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this))
      window.addEventListener('offline', this.handleOffline.bind(this))
    }
  }

  private handleOnline() {
    this.authState.isOnline = true
    this.notifyListeners()
    this.performSync()
  }

  private handleOffline() {
    this.authState.isOnline = false
    this.notifyListeners()
  }

  private startAutoSync() {
    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (this.authState.isOnline) {
        this.performSync()
      }
    }, 5 * 60 * 1000)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.authState }))
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  async login(credentials: {
    identifier: string
    password: string
    schoolCode?: string
    preferOffline?: boolean
  }): Promise<{ success: boolean; error?: string }> {
    this.authState.isLoading = true
    this.notifyListeners()

    try {
      // Try offline authentication first if preferred or if offline
      if (credentials.preferOffline || !this.authState.isOnline) {
        const offlineResult = await this.offlineAuth.authenticateOffline({
          identifier: credentials.identifier,
          password: credentials.password
        })

        if (offlineResult) {
          this.authState.user = offlineResult.user
          this.authState.session = offlineResult.session
          this.authState.isLoading = false
          this.notifyListeners()

          // Try to sync with server if online
          if (this.authState.isOnline) {
            this.performSync()
          }

          return { success: true }
        }
      }

      // Try online authentication if online
      if (this.authState.isOnline) {
        try {
          // Use NextAuth signIn
          const { signIn } = await import('next-auth/react')
          const result = await signIn('credentials', {
            identifier: credentials.identifier,
            password: credentials.password,
            schoolCode: credentials.schoolCode,
            redirect: false
          })

          if (result?.ok && !result.error) {
            // Get the user session and sync to offline storage
            const { getSession } = await import('next-auth/react')
            const session = await getSession()
            
            if (session?.user) {
              await this.syncOnlineUserToOffline(session.user)
              const offlineUser = await this.getOfflineUserByEmail(session.user.email!)
              
              if (offlineUser) {
                const offlineSession = await this.offlineAuth.createOfflineSession(offlineUser.id)
                this.authState.user = offlineUser
                this.authState.session = offlineSession
              }
            }

            this.authState.isLoading = false
            this.notifyListeners()
            return { success: true }
          }
        } catch (onlineError) {
          console.warn('Online authentication failed, trying offline:', onlineError)
          
          // Fallback to offline authentication
          const offlineResult = await this.offlineAuth.authenticateOffline({
            identifier: credentials.identifier,
            password: credentials.password
          })

          if (offlineResult) {
            this.authState.user = offlineResult.user
            this.authState.session = offlineResult.session
            this.authState.isLoading = false
            this.notifyListeners()
            return { success: true }
          }
        }
      }

      this.authState.isLoading = false
      this.notifyListeners()
      return { success: false, error: 'Invalid credentials' }

    } catch (error) {
      console.error('Login error:', error)
      this.authState.isLoading = false
      this.notifyListeners()
      return { success: false, error: 'Authentication failed' }
    }
  }

  async logout(): Promise<void> {
    try {
      // Sign out from NextAuth if online
      if (this.authState.isOnline) {
        const { signOut } = await import('next-auth/react')
        await signOut({ redirect: false })
      }

      // Revoke offline session
      if (this.authState.session) {
        await this.offlineAuth.revokeOfflineSession(this.authState.session.token)
      }

      // Clear state
      this.authState.user = null
      this.authState.session = null
      this.notifyListeners()

    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    schoolCode?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Always create user offline first for immediate access
      const offlineUser = await this.offlineAuth.createOfflineUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName
      })

      // Create offline session
      const offlineSession = await this.offlineAuth.createOfflineSession(offlineUser.id)
      
      this.authState.user = offlineUser
      this.authState.session = offlineSession
      this.notifyListeners()

      // Try to sync to server if online
      if (this.authState.isOnline) {
        this.performSync()
      }

      return { success: true }

    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  async validateSession(token: string): Promise<OfflineUser | null> {
    return await this.offlineAuth.validateOfflineSession(token)
  }

  async getCurrentUser(): Promise<OfflineUser | null> {
    return this.authState.user
  }

  async refreshSession(): Promise<boolean> {
    if (!this.authState.session) {
      return false
    }

    try {
      const user = await this.validateSession(this.authState.session.token)
      if (user) {
        this.authState.user = user
        this.notifyListeners()
        return true
      } else {
        // Session expired, clear state
        this.authState.user = null
        this.authState.session = null
        this.notifyListeners()
        return false
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }

  // ============================================================================
  // SYNCHRONIZATION
  // ============================================================================

  async performSync(): Promise<void> {
    if (!this.authState.isOnline) {
      return
    }

    this.authState.syncStatus = 'syncing'
    this.notifyListeners()

    try {
      // Get all users that need syncing
      const pendingUsers = await this.offlineAuth.getPendingSyncUsers()

      for (const user of pendingUsers) {
        await this.offlineAuth.syncUserToServer(user)
      }

      // Sync users from server (if we have permissions)
      await this.syncUsersFromServer()

      this.authState.syncStatus = 'success'
      this.authState.lastSync = new Date()

    } catch (error) {
      console.error('Sync error:', error)
      this.authState.syncStatus = 'error'
    }

    this.notifyListeners()
  }

  private async syncUsersFromServer(): Promise<void> {
    try {
      const dbUtils = getDatabaseUtils()
      
      // Get recent users from server (last 24 hours)
      const recentUsers = await dbUtils.find('User', {
        updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })

      for (const user of recentUsers) {
        await this.offlineAuth.syncUserFromServer(user)
      }

    } catch (error) {
      console.error('Server sync error:', error)
    }
  }

  private async syncOnlineUserToOffline(onlineUser: any): Promise<void> {
    const offlineUser = await this.getOfflineUserByEmail(onlineUser.email)
    
    if (offlineUser) {
      // Update existing offline user
      await this.offlineAuth.syncUserFromServer(onlineUser)
    } else {
      // Create new offline user
      await this.offlineAuth.syncUserFromServer(onlineUser)
    }
  }

  private async getOfflineUserByEmail(email: string): Promise<OfflineUser | null> {
    const users = await this.offlineAuth.getOfflineUsers()
    return users.find(user => user.email === email) || null
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  isAuthenticated(): boolean {
    return !!(this.authState.user && this.authState.session)
  }

  isOnline(): boolean {
    return this.authState.isOnline
  }

  async getStats(): Promise<{
    offline: any
    online: boolean
    lastSync: Date | null
    syncStatus: string
  }> {
    const offlineStats = await this.offlineAuth.getOfflineStats()
    
    return {
      offline: offlineStats,
      online: this.authState.isOnline,
      lastSync: this.authState.lastSync,
      syncStatus: this.authState.syncStatus
    }
  }

  async exportAuthData(): Promise<any> {
    return await this.offlineAuth.exportOfflineData()
  }

  async importAuthData(data: any): Promise<void> {
    await this.offlineAuth.importOfflineData(data)
  }

  async clearOfflineData(): Promise<void> {
    await this.offlineAuth.clearAllOfflineData()
    this.authState.user = null
    this.authState.session = null
    this.notifyListeners()
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline.bind(this))
      window.removeEventListener('offline', this.handleOffline.bind(this))
    }

    this.listeners = []
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let hybridAuthInstance: HybridAuthManager | null = null

export const getHybridAuth = (): HybridAuthManager => {
  if (!hybridAuthInstance) {
    hybridAuthInstance = new HybridAuthManager()
  }
  return hybridAuthInstance
}

export default HybridAuthManager