export { default as SchoolModel } from './models/school.model'
export { default as StudentModel } from './models/student.model'
export { default as TeacherModel } from './models/teacher.model'
export { default as ClassModel } from './models/class.model'
export { default as SubjectModel } from './models/subject.model'
export { default as UserModel } from './models/user.model'
export { default as ExamModel } from './models/exam.model'

// Database connection and management
export { 
  DatabaseManager, 
  initializeDatabase as initDB, 
  getDatabase,
  createDatabaseConfig
} from './connection'
export type { DatabaseConfig, ConnectionState } from './connection'

// NeDB adapter for offline support
export { 
  NeDBAdapter, 
  getNeDBAdapter 
} from './nedb-adapter'
export type { 
  NeDBConfig, 
  SyncResult, 
  ConflictResolution 
} from './nedb-adapter'

// Database utilities and tenant isolation
export { 
  DatabaseUtils, 
  getDatabaseUtils,
  TenantQueryBuilder
} from './utils'
export type { 
  TenantContext, 
  QueryOptions, 
  BulkOperation 
} from './utils'

// Migration and seeding
export { 
  MigrationRunner, 
  SeedRunner,
  runMigrations,
  runSeeds,
  initializeDatabase,
  migrations,
  getDefaultSeeds
} from './migrations'
export type { 
  Migration, 
  SeedData, 
  MigrationStatus 
} from './migrations'

// Model registry for dynamic access
export const ModelRegistry = {
  School: 'SchoolModel',
  Student: 'StudentModel', 
  Teacher: 'TeacherModel',
  Class: 'ClassModel',
  Subject: 'SubjectModel',
  User: 'UserModel',
  Exam: 'ExamModel'
} as const

// Collection names
export const Collections = {
  SCHOOLS: 'schools',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  USERS: 'users',
  EXAMS: 'exams'
} as const

// Type definitions
export type ModelName = keyof typeof ModelRegistry
export type CollectionName = typeof Collections[keyof typeof Collections]

// ============================================================================
// DATABASE INITIALIZATION HELPER
// ============================================================================

import { DatabaseManager, createDatabaseConfig } from './connection'
import { initializeDatabase } from './migrations'
import type { TenantContext } from './utils'

export interface InitOptions {
  environment?: 'development' | 'production' | 'test'
  tenantContext?: TenantContext
  runMigrations?: boolean
  runSeeds?: boolean
  autoSync?: boolean
}

/**
 * Initialize the complete database system with proper configuration
 * @param options Initialization options
 * @returns Promise<DatabaseManager>
 */
export const initializeDatabaseSystem = async (options: InitOptions = {}): Promise<DatabaseManager> => {
  const {
    environment = 'development',
    tenantContext,
    runMigrations = true,
    runSeeds = true,
    autoSync = environment !== 'test'
  } = options

  console.log(`🚀 Initializing database system for ${environment} environment...`)

  // Create environment-specific configuration
  const config = createDatabaseConfig(environment)
  config.nedb = config.nedb || {}
  config.nedb.autoSync = autoSync

  // Initialize database manager
  const dbManager = DatabaseManager.getInstance(config)
  await dbManager.initialize()

  console.log(`✅ Database connections established`)
  console.log(`   - MongoDB: ${dbManager.isOnline() ? 'Connected' : 'Offline'}`)
  console.log(`   - NeDB: ${dbManager.getNeDBAdapter() ? 'Ready' : 'Unavailable'}`)

  // Run migrations and seeds if requested
  if (runMigrations || runSeeds) {
    try {
      if (dbManager.isOnline()) {
        await initializeDatabase(tenantContext)
        console.log(`✅ Database schema and seed data ready`)
      } else {
        console.log(`⚠️  Skipping migrations/seeds - running offline`)
      }
    } catch (error) {
      console.error(`❌ Database initialization failed:`, error)
      throw error
    }
  }

  return dbManager
}

/**
 * Quick setup for common use cases
 */
export const quickSetup = {
  /**
   * Development setup with full features
   */
  development: async (tenantContext?: TenantContext) => {
    return await initializeDatabaseSystem({
      environment: 'development',
      tenantContext,
      runMigrations: true,
      runSeeds: true,
      autoSync: true
    })
  },

  /**
   * Production setup with minimal logging
   */
  production: async (tenantContext?: TenantContext) => {
    return await initializeDatabaseSystem({
      environment: 'production',
      tenantContext,
      runMigrations: true,
      runSeeds: false,
      autoSync: true
    })
  },

  /**
   * Test setup with isolated data
   */
  test: async () => {
    return await initializeDatabaseSystem({
      environment: 'test',
      runMigrations: true,
      runSeeds: true,
      autoSync: false
    })
  },

  /**
   * Offline-only setup
   */
  offline: async (tenantContext?: TenantContext) => {
    const config = createDatabaseConfig('development')
    config.mongodb = undefined // Force offline mode
    
    const dbManager = DatabaseManager.getInstance(config)
    await dbManager.initialize()
    
    return dbManager
  }
}