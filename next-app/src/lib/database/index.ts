// Multi-tenant database connection manager
// Supports both MongoDB (online) and NeDB (offline)

import mongoose, { Connection } from 'mongoose'
import Datastore from 'nedb-promises'
import { getTenantDatabaseName } from '../tenant-resolver'

// Type alias for NeDB Datastore to handle generic type issues
type NeDBStore = Datastore<any>

export interface DatabaseConfig {
  mongodb: {
    uri: string
    options: mongoose.ConnectOptions
  }
  nedb: {
    dataPath: string
  }
  mode: 'mongodb' | 'nedb' | 'hybrid'
}

export const databaseConfig: DatabaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  nedb: {
    dataPath: process.env.NEDB_DATA_PATH || './data'
  },
  mode: (process.env.DB_MODE as 'mongodb' | 'nedb' | 'hybrid') || 'hybrid'
}

// Connection pool for multi-tenant MongoDB connections
const mongoConnections: Map<string, Connection> = new Map()

// NeDB datastores for offline support
const nedbStores: Map<string, Map<string, NeDBStore>> = new Map()

export interface DatabaseConnection {
  type: 'mongodb' | 'nedb'
  connection: Connection | Map<string, NeDBStore>
  tenantId: string
}

/**
 * Get or create database connection for a specific tenant
 * @param tenantId - The tenant ID
 * @param preferOffline - Prefer NeDB over MongoDB if available
 * @returns Promise<DatabaseConnection>
 */
export async function getTenantDatabase(tenantId: string, preferOffline = false): Promise<DatabaseConnection> {
  const dbName = getTenantDatabaseName(tenantId)
  
  // Check if offline mode is preferred or MongoDB is unavailable
  if (preferOffline || databaseConfig.mode === 'nedb') {
    return getNeDBConnection(tenantId)
  }
  
  // Try MongoDB first
  try {
    if (databaseConfig.mode === 'mongodb' || databaseConfig.mode === 'hybrid') {
      return await getMongoConnection(tenantId, dbName)
    }
  } catch (error) {
    console.warn(`MongoDB connection failed for tenant ${tenantId}, falling back to NeDB:`, error)
    
    // Fall back to NeDB if MongoDB fails and hybrid mode is enabled
    if (databaseConfig.mode === 'hybrid') {
      return getNeDBConnection(tenantId)
    }
    
    throw error
  }
  
  throw new Error(`No database connection available for tenant ${tenantId}`)
}

/**
 * Get or create MongoDB connection for tenant
 */
async function getMongoConnection(tenantId: string, dbName: string): Promise<DatabaseConnection> {
  // Check if connection already exists
  if (mongoConnections.has(tenantId)) {
    const connection = mongoConnections.get(tenantId)!
    if (connection.readyState === 1) {
      return { type: 'mongodb', connection, tenantId }
    }
  }
  
  // Create new connection
  const connection = mongoose.createConnection(databaseConfig.mongodb.uri, {
    ...databaseConfig.mongodb.options,
    dbName
  })
  
  await connection.asPromise()
  mongoConnections.set(tenantId, connection)
  
  return { type: 'mongodb', connection, tenantId }
}

/**
 * Get or create NeDB connection for tenant
 */
function getNeDBConnection(tenantId: string): DatabaseConnection {
  if (!nedbStores.has(tenantId)) {
    const stores = new Map<string, NeDBStore>()
    
    // Initialize common collections
    const collections = ['users', 'students', 'teachers', 'classes', 'subjects', 'exams', 'grades']
    
    collections.forEach(collection => {
      const store = Datastore.create({
        filename: `${databaseConfig.nedb.dataPath}/${tenantId}/${collection}.db`,
        autoload: true,
        timestampData: true
      })
      stores.set(collection, store)
    })
    
    nedbStores.set(tenantId, stores)
  }
  
  return {
    type: 'nedb',
    connection: nedbStores.get(tenantId)!,
    tenantId
  }
}

/**
 * Close database connection for a specific tenant
 */
export async function closeTenantDatabase(tenantId: string): Promise<void> {
  // Close MongoDB connection
  if (mongoConnections.has(tenantId)) {
    const connection = mongoConnections.get(tenantId)!
    await connection.close()
    mongoConnections.delete(tenantId)
  }
  
  // NeDB connections are automatically managed
  if (nedbStores.has(tenantId)) {
    nedbStores.delete(tenantId)
  }
}

/**
 * Close all database connections
 */
export async function disconnectFromAllDatabases(): Promise<void> {
  // Close all MongoDB connections
  const closePromises = Array.from(mongoConnections.values()).map(conn => conn.close())
  await Promise.all(closePromises)
  mongoConnections.clear()
  
  // Clear NeDB stores
  nedbStores.clear()
}

/**
 * Health check for database connections
 */
export async function checkDatabaseHealth(): Promise<{
  mongodb: boolean
  nedb: boolean
  tenants: string[]
}> {
  let mongodbHealthy = false
  let nedbHealthy = true // NeDB is always available
  
  // Check MongoDB connectivity
  try {
    const testConnection = mongoose.createConnection(databaseConfig.mongodb.uri, {
      serverSelectionTimeoutMS: 3000
    })
    await testConnection.asPromise()
    await testConnection.close()
    mongodbHealthy = true
  } catch (error) {
    console.warn('MongoDB health check failed:', error)
  }
  
  return {
    mongodb: mongodbHealthy,
    nedb: nedbHealthy,
    tenants: Array.from(mongoConnections.keys())
  }
}

/**
 * Sync data between MongoDB and NeDB for a tenant
 */
export async function syncTenantData(tenantId: string, direction: 'mongo-to-nedb' | 'nedb-to-mongo' = 'mongo-to-nedb'): Promise<void> {
  // This will be implemented in later prompts
  console.log(`Data sync placeholder for tenant ${tenantId}, direction: ${direction}`)
}

/**
 * Initialize database connections on startup
 */
export async function initializeDatabases(): Promise<void> {
  console.log('Initializing database connections...')
  
  const health = await checkDatabaseHealth()
  console.log('Database health check:', health)
  
  // Set up cleanup on process exit
  process.on('SIGINT', async () => {
    console.log('Closing database connections...')
    await disconnectFromAllDatabases()
    process.exit(0)
  })
}