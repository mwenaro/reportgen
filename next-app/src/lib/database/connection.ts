import mongoose from 'mongoose'
import { NeDBAdapter, getNeDBAdapter, SyncResult, ConflictResolution } from './nedb-adapter'

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

export interface DatabaseConfig {
  mongodb?: {
    uri: string
    options?: mongoose.ConnectOptions
  }
  nedb?: {
    dataDir: string
    autoSync: boolean
    syncInterval: number
  }
  fallbackToNeDB?: boolean
  syncOnConnect?: boolean
}

export interface ConnectionState {
  mongodb: {
    connected: boolean
    error: string | null
    lastConnected: Date | null
  }
  nedb: {
    initialized: boolean
    error: string | null
    lastActivity: Date | null
  }
}

class DatabaseManager {
  private static instance: DatabaseManager
  private config: DatabaseConfig
  private mongoConnection: mongoose.Connection | null = null
  private nedbAdapter: NeDBAdapter | null = null
  private syncInterval: NodeJS.Timeout | null = null
  private connectionState: ConnectionState = {
    mongodb: { connected: false, error: null, lastConnected: null },
    nedb: { initialized: false, error: null, lastActivity: null }
  }

  private constructor(config: DatabaseConfig) {
    this.config = config
  }

  static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      if (!config) {
        throw new Error('Database configuration required for first initialization')
      }
      DatabaseManager.instance = new DatabaseManager(config)
    }
    return DatabaseManager.instance
  }

  async initialize(): Promise<void> {
    console.log('Initializing database connections...')

    // Initialize NeDB first (offline support)
    if (this.config.nedb) {
      try {
        this.nedbAdapter = await getNeDBAdapter(this.config.nedb.dataDir)
        this.connectionState.nedb = {
          initialized: true,
          error: null,
          lastActivity: new Date()
        }
        console.log('NeDB initialized successfully')
      } catch (error) {
        console.error('NeDB initialization failed:', error)
        this.connectionState.nedb.error = error.message
      }
    }

    // Initialize MongoDB (online support)
    if (this.config.mongodb) {
      try {
        await this.connectMongoDB()
      } catch (error) {
        console.error('MongoDB connection failed:', error)
        this.connectionState.mongodb.error = error.message

        if (!this.config.fallbackToNeDB) {
          throw error
        }
        console.log('Falling back to NeDB for offline operation')
      }
    }

    // Setup auto-sync if configured
    if (this.config.nedb?.autoSync && this.connectionState.mongodb.connected) {
      this.setupAutoSync()
    }

    // Initial sync if requested
    if (this.config.syncOnConnect && this.isOnline()) {
      await this.performInitialSync()
    }
  }

  private async connectMongoDB(): Promise<void> {
    if (!this.config.mongodb) return

    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      ...this.config.mongodb.options
    }

    await mongoose.connect(this.config.mongodb.uri, options)
    
    this.mongoConnection = mongoose.connection
    this.connectionState.mongodb = {
      connected: true,
      error: null,
      lastConnected: new Date()
    }

    // Handle connection events
    this.mongoConnection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
      this.connectionState.mongodb.connected = false
    })

    this.mongoConnection.on('reconnected', () => {
      console.log('MongoDB reconnected')
      this.connectionState.mongodb.connected = true
      this.connectionState.mongodb.lastConnected = new Date()
    })

    this.mongoConnection.on('error', (error) => {
      console.error('MongoDB error:', error)
      this.connectionState.mongodb.error = error.message
    })

    console.log('MongoDB connected successfully')
  }

  private setupAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    const syncIntervalMs = (this.config.nedb?.syncInterval || 300) * 1000 // Default 5 minutes

    this.syncInterval = setInterval(async () => {
      if (this.isOnline()) {
        await this.syncAllCollections()
      }
    }, syncIntervalMs)

    console.log(`Auto-sync enabled with ${syncIntervalMs / 1000}s interval`)
  }

  async syncAllCollections(): Promise<{ [collection: string]: SyncResult }> {
    if (!this.nedbAdapter || !this.isOnline()) {
      throw new Error('Sync requires both NeDB and MongoDB connections')
    }

    const collections = [
      'schools', 'students', 'teachers', 'classes',
      'subjects', 'users', 'exams', 'marks'
    ]

    const results: { [collection: string]: SyncResult } = {}

    for (const collection of collections) {
      try {
        // Sync to server (upload local changes)
        const uploadResult = await this.syncToServer(collection)
        
        // Sync from server (download server changes)
        const downloadResult = await this.syncFromServer(collection)
        
        results[collection] = {
          success: uploadResult.success && downloadResult.success,
          synced: uploadResult.synced + downloadResult.synced,
          errors: [...uploadResult.errors, ...downloadResult.errors],
          lastSync: new Date()
        }
      } catch (error) {
        console.error(`Sync failed for ${collection}:`, error)
        results[collection] = {
          success: false,
          synced: 0,
          errors: [{ id: 'sync', error: error.message }],
          lastSync: new Date()
        }
      }
    }

    return results
  }

  private async syncToServer(collection: string): Promise<SyncResult> {
    if (!this.nedbAdapter) throw new Error('NeDB not initialized')

    const serverSyncFn = async (data: any[]) => {
      try {
        // Get the corresponding Mongoose model
        const Model = mongoose.models[collection] || mongoose.model(collection)
        const bulkOps = []

        for (const item of data) {
          const { _id, _syncStatus, _lastSyncAttempt, _version, ...cleanData } = item

          if (item.isDeleted) {
            bulkOps.push({
              deleteOne: { filter: { _id: item._id } }
            })
          } else if (item._version === 1) {
            // New document
            bulkOps.push({
              insertOne: { document: cleanData }
            })
          } else {
            // Update existing
            bulkOps.push({
              updateOne: {
                filter: { _id: item._id },
                update: { $set: cleanData },
                upsert: true
              }
            })
          }
        }

        if (bulkOps.length > 0) {
          await Model.bulkWrite(bulkOps)
        }

        return { success: true, errors: [] }
      } catch (error) {
        console.error(`Server sync failed for ${collection}:`, error)
        return { success: false, errors: [{ id: 'bulk', message: error.message }] }
      }
    }

    return await this.nedbAdapter.syncToServer(collection, serverSyncFn)
  }

  private async syncFromServer(collection: string): Promise<SyncResult> {
    if (!this.nedbAdapter) throw new Error('NeDB not initialized')

    try {
      // Get data from MongoDB
      const Model = mongoose.models[collection] || mongoose.model(collection)
      
      // Get last sync timestamp for incremental sync
      const lastSync = await this.getLastSyncTime(collection)
      const query = lastSync ? { updatedAt: { $gt: lastSync } } : {}
      
      const serverData = await Model.find(query).lean()

      return await this.nedbAdapter.syncFromServer(serverData, {
        strategy: 'server_wins' // Can be configured per collection
      })
    } catch (error) {
      console.error(`Server data fetch failed for ${collection}:`, error)
      return {
        success: false,
        synced: 0,
        errors: [{ id: 'fetch', error: error.message }],
        lastSync: new Date()
      }
    }
  }

  private async getLastSyncTime(collection: string): Promise<Date | null> {
    // This would typically be stored in a sync metadata collection
    // For now, return null to do full sync
    return null
  }

  private async performInitialSync(): Promise<void> {
    console.log('Performing initial data synchronization...')
    
    try {
      const results = await this.syncAllCollections()
      
      let totalSynced = 0
      let totalErrors = 0
      
      for (const [collection, result] of Object.entries(results)) {
        totalSynced += result.synced
        totalErrors += result.errors.length
        
        if (!result.success) {
          console.warn(`Initial sync failed for ${collection}:`, result.errors)
        }
      }
      
      console.log(`Initial sync completed: ${totalSynced} records synced, ${totalErrors} errors`)
    } catch (error) {
      console.error('Initial sync failed:', error)
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  isOnline(): boolean {
    return this.connectionState.mongodb.connected
  }

  isOffline(): boolean {
    return this.connectionState.nedb.initialized && !this.connectionState.mongodb.connected
  }

  getConnectionState(): ConnectionState {
    return { ...this.connectionState }
  }

  getActiveAdapter(): 'mongodb' | 'nedb' | null {
    if (this.isOnline()) return 'mongodb'
    if (this.connectionState.nedb.initialized) return 'nedb'
    return null
  }

  getNeDBAdapter(): NeDBAdapter | null {
    return this.nedbAdapter
  }

  getMongoConnection(): mongoose.Connection | null {
    return this.mongoConnection
  }

  async forceSync(collections?: string[]): Promise<{ [collection: string]: SyncResult }> {
    if (!this.isOnline()) {
      throw new Error('Cannot sync while offline')
    }

    const targetCollections = collections || [
      'schools', 'students', 'teachers', 'classes',
      'subjects', 'users', 'exams', 'marks'
    ]

    const results: { [collection: string]: SyncResult } = {}

    for (const collection of targetCollections) {
      try {
        const uploadResult = await this.syncToServer(collection)
        const downloadResult = await this.syncFromServer(collection)
        
        results[collection] = {
          success: uploadResult.success && downloadResult.success,
          synced: uploadResult.synced + downloadResult.synced,
          errors: [...uploadResult.errors, ...downloadResult.errors],
          lastSync: new Date()
        }
      } catch (error) {
        results[collection] = {
          success: false,
          synced: 0,
          errors: [{ id: 'sync', error: error.message }],
          lastSync: new Date()
        }
      }
    }

    return results
  }

  async switchToOfflineMode(): Promise<void> {
    console.log('Switching to offline mode...')
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }

    if (this.mongoConnection) {
      await mongoose.disconnect()
      this.connectionState.mongodb.connected = false
    }

    if (!this.nedbAdapter) {
      this.nedbAdapter = await getNeDBAdapter(this.config.nedb?.dataDir)
    }

    console.log('Offline mode activated')
  }

  async switchToOnlineMode(): Promise<void> {
    console.log('Switching to online mode...')
    
    if (this.config.mongodb) {
      await this.connectMongoDB()
      
      // Perform sync after reconnection
      if (this.nedbAdapter) {
        setTimeout(async () => {
          await this.syncAllCollections()
        }, 5000) // Wait 5 seconds before syncing
      }
      
      // Re-enable auto-sync
      if (this.config.nedb?.autoSync) {
        this.setupAutoSync()
      }
    }

    console.log('Online mode activated')
  }

  async getStats(): Promise<any> {
    const stats: any = {
      connectionState: this.getConnectionState(),
      activeAdapter: this.getActiveAdapter(),
      lastSync: null
    }

    if (this.nedbAdapter) {
      stats.nedb = {}
      const collections = ['schools', 'students', 'teachers', 'classes', 'subjects', 'users', 'exams', 'marks']
      
      for (const collection of collections) {
        stats.nedb[collection] = await this.nedbAdapter.getStats(collection)
      }
    }

    if (this.isOnline()) {
      stats.mongodb = {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    }

    return stats
  }

  async backup(path?: string): Promise<string | null> {
    if (this.nedbAdapter) {
      return await this.nedbAdapter.backup(path)
    }
    return null
  }

  async restore(backupPath: string): Promise<void> {
    if (this.nedbAdapter) {
      await this.nedbAdapter.restore(backupPath)
    }
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up database connections...')
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }

    if (this.mongoConnection) {
      await mongoose.disconnect()
    }

    if (this.nedbAdapter) {
      await this.nedbAdapter.close()
    }

    DatabaseManager.instance = null as any
    console.log('Database cleanup completed')
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const initializeDatabase = async (config: DatabaseConfig): Promise<DatabaseManager> => {
  const manager = DatabaseManager.getInstance(config)
  await manager.initialize()
  return manager
}

export const getDatabase = (): DatabaseManager => {
  return DatabaseManager.getInstance()
}

export const createDatabaseConfig = (environment: 'development' | 'production' | 'test'): DatabaseConfig => {
  const baseConfig: DatabaseConfig = {
    fallbackToNeDB: true,
    syncOnConnect: true,
    nedb: {
      dataDir: './data/local',
      autoSync: true,
      syncInterval: 300 // 5 minutes
    }
  }

  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        mongodb: {
          uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reportgen_dev',
          options: {
            serverSelectionTimeoutMS: 5000
          }
        }
      }

    case 'production':
      return {
        ...baseConfig,
        mongodb: {
          uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reportgen_prod',
          options: {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true
          }
        },
        nedb: {
          dataDir: './data/production',
          autoSync: true,
          syncInterval: 180 // 3 minutes in production
        }
      }

    case 'test':
      return {
        ...baseConfig,
        mongodb: {
          uri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/reportgen_test',
          options: {
            serverSelectionTimeoutMS: 5000
          }
        },
        nedb: {
          dataDir: './data/test',
          autoSync: false,
          syncInterval: 0
        },
        syncOnConnect: false
      }

    default:
      return baseConfig
  }
}

export type { DatabaseConfig, ConnectionState, SyncResult, ConflictResolution }
export { DatabaseManager }