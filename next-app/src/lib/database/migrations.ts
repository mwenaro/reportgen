import mongoose from 'mongoose'
import { DatabaseManager, getDatabase } from './connection'
import { TenantContext } from './utils'

// ============================================================================
// MIGRATION INTERFACE
// ============================================================================

export interface Migration {
  version: string
  name: string
  up: (connection: mongoose.Connection) => Promise<void>
  down: (connection: mongoose.Connection) => Promise<void>
}

export interface SeedData {
  collection: string
  data: any[]
  options?: {
    updateOnDuplicate?: boolean
    upsertKey?: string
    tenantSpecific?: boolean
  }
}

export interface MigrationStatus {
  version: string
  name: string
  executed: boolean
  executedAt?: Date
  error?: string
}

// ============================================================================
// MIGRATION RUNNER
// ============================================================================

export class MigrationRunner {
  private connection: mongoose.Connection
  private migrationsCollection = 'migrations'

  constructor(connection: mongoose.Connection) {
    this.connection = connection
  }

  async initialize(): Promise<void> {
    // Ensure migrations collection exists
    const collections = await this.connection.db.listCollections().toArray()
    const migrationExists = collections.some(col => col.name === this.migrationsCollection)
    
    if (!migrationExists) {
      await this.connection.db.createCollection(this.migrationsCollection)
      console.log('Migrations collection created')
    }
  }

  async getExecutedMigrations(): Promise<string[]> {
    const collection = this.connection.db.collection(this.migrationsCollection)
    const executed = await collection.find({}).sort({ executedAt: 1 }).toArray()
    return executed.map(m => m.version)
  }

  async markMigrationExecuted(version: string, name: string): Promise<void> {
    const collection = this.connection.db.collection(this.migrationsCollection)
    await collection.insertOne({
      version,
      name,
      executedAt: new Date()
    })
  }

  async markMigrationReverted(version: string): Promise<void> {
    const collection = this.connection.db.collection(this.migrationsCollection)
    await collection.deleteOne({ version })
  }

  async runMigrations(migrations: Migration[]): Promise<MigrationStatus[]> {
    await this.initialize()
    
    const executed = await this.getExecutedMigrations()
    const pending = migrations.filter(m => !executed.includes(m.version))
    const results: MigrationStatus[] = []

    console.log(`Found ${pending.length} pending migrations`)

    for (const migration of pending.sort((a, b) => a.version.localeCompare(b.version))) {
      console.log(`Running migration: ${migration.version} - ${migration.name}`)
      
      try {
        await migration.up(this.connection)
        await this.markMigrationExecuted(migration.version, migration.name)
        
        results.push({
          version: migration.version,
          name: migration.name,
          executed: true,
          executedAt: new Date()
        })
        
        console.log(`✓ Migration ${migration.version} completed`)
      } catch (error) {
        console.error(`✗ Migration ${migration.version} failed:`, error)
        
        results.push({
          version: migration.version,
          name: migration.name,
          executed: false,
          error: error.message
        })
        
        // Stop on first error
        break
      }
    }

    return results
  }

  async revertMigration(migration: Migration): Promise<void> {
    console.log(`Reverting migration: ${migration.version} - ${migration.name}`)
    
    try {
      await migration.down(this.connection)
      await this.markMigrationReverted(migration.version)
      console.log(`✓ Migration ${migration.version} reverted`)
    } catch (error) {
      console.error(`✗ Migration revert ${migration.version} failed:`, error)
      throw error
    }
  }
}

// ============================================================================
// SEED DATA RUNNER
// ============================================================================

export class SeedRunner {
  private dbManager: DatabaseManager

  constructor(dbManager?: DatabaseManager) {
    this.dbManager = dbManager || getDatabase()
  }

  async runSeeds(seeds: SeedData[], tenantContext?: TenantContext): Promise<void> {
    console.log(`Running ${seeds.length} seed operations...`)

    for (const seed of seeds) {
      try {
        await this.runSeed(seed, tenantContext)
        console.log(`✓ Seeded ${seed.collection}: ${seed.data.length} records`)
      } catch (error) {
        console.error(`✗ Seed failed for ${seed.collection}:`, error)
        throw error
      }
    }

    console.log('All seeds completed successfully')
  }

  private async runSeed(seed: SeedData, tenantContext?: TenantContext): Promise<void> {
    const { collection, data, options = {} } = seed
    const { updateOnDuplicate = false, upsertKey = '_id', tenantSpecific = false } = options

    if (this.dbManager.isOnline()) {
      await this.runMongoSeed(collection, data, options, tenantContext)
    } else {
      await this.runNeDBSeed(collection, data, options, tenantContext)
    }
  }

  private async runMongoSeed(
    collection: string,
    data: any[],
    options: any,
    tenantContext?: TenantContext
  ): Promise<void> {
    const Model = mongoose.models[collection]
    if (!Model) throw new Error(`Model ${collection} not found`)

    const bulkOps = data.map(item => {
      let enrichedItem = { ...item }
      
      // Add tenant context if specified
      if (options.tenantSpecific && tenantContext) {
        enrichedItem.schoolId = tenantContext.schoolId
        if (tenantContext.userId) {
          enrichedItem.createdBy = tenantContext.userId
        }
      }

      if (options.updateOnDuplicate) {
        return {
          updateOne: {
            filter: { [options.upsertKey]: item[options.upsertKey] },
            update: { $set: enrichedItem },
            upsert: true
          }
        }
      } else {
        return {
          insertOne: { document: enrichedItem }
        }
      }
    })

    if (bulkOps.length > 0) {
      await Model.bulkWrite(bulkOps, { ordered: false })
    }
  }

  private async runNeDBSeed(
    collection: string,
    data: any[],
    options: any,
    tenantContext?: TenantContext
  ): Promise<void> {
    const nedb = this.dbManager.getNeDBAdapter()
    if (!nedb) throw new Error('NeDB adapter not available')

    for (const item of data) {
      let enrichedItem = { ...item }
      
      // Add tenant context if specified
      if (options.tenantSpecific && tenantContext) {
        enrichedItem.schoolId = tenantContext.schoolId
        if (tenantContext.userId) {
          enrichedItem.createdBy = tenantContext.userId
        }
      }

      if (options.updateOnDuplicate) {
        const existing = await nedb.findOne(collection.toLowerCase(), {
          [options.upsertKey]: item[options.upsertKey]
        })

        if (existing) {
          await nedb.update(
            collection.toLowerCase(),
            { [options.upsertKey]: item[options.upsertKey] },
            enrichedItem
          )
        } else {
          await nedb.insert(collection.toLowerCase(), enrichedItem)
        }
      } else {
        await nedb.insert(collection.toLowerCase(), enrichedItem)
      }
    }
  }
}

// ============================================================================
// PREDEFINED MIGRATIONS
// ============================================================================

export const migrations: Migration[] = [
  {
    version: '001',
    name: 'Create initial collections and indexes',
    up: async (connection) => {
      const collections = [
        'schools', 'students', 'teachers', 'classes',
        'subjects', 'users', 'exams', 'marks'
      ]

      for (const collectionName of collections) {
        // Create collection if it doesn't exist
        const existing = await connection.db.listCollections({ name: collectionName }).toArray()
        if (existing.length === 0) {
          await connection.db.createCollection(collectionName)
        }

        const collection = connection.db.collection(collectionName)

        // Create common indexes
        await collection.createIndex({ createdAt: 1 })
        await collection.createIndex({ updatedAt: 1 })
        await collection.createIndex({ isDeleted: 1 })

        // Collection-specific indexes
        switch (collectionName) {
          case 'schools':
            await collection.createIndex({ subdomain: 1 }, { unique: true })
            await collection.createIndex({ code: 1 }, { unique: true })
            await collection.createIndex({ isActive: 1 })
            break

          case 'students':
            await collection.createIndex({ schoolId: 1, admissionNumber: 1 }, { unique: true })
            await collection.createIndex({ schoolId: 1, currentClassId: 1 })
            await collection.createIndex({ schoolId: 1, status: 1 })
            break

          case 'teachers':
            await collection.createIndex({ schoolId: 1, employeeNumber: 1 }, { unique: true })
            await collection.createIndex({ email: 1 }, { unique: true })
            await collection.createIndex({ schoolId: 1, status: 1 })
            break

          case 'classes':
            await collection.createIndex({ schoolId: 1, code: 1 }, { unique: true })
            await collection.createIndex({ schoolId: 1, grade: 1, academicYear: 1 })
            break

          case 'subjects':
            await collection.createIndex({ schoolId: 1, code: 1 }, { unique: true })
            await collection.createIndex({ schoolId: 1, category: 1 })
            break

          case 'users':
            await collection.createIndex({ email: 1 }, { unique: true })
            await collection.createIndex({ username: 1 }, { unique: true })
            await collection.createIndex({ isActive: 1 })
            break

          case 'exams':
            await collection.createIndex({ schoolId: 1, subjectId: 1, date: 1 })
            await collection.createIndex({ schoolId: 1, status: 1 })
            break

          case 'marks':
            await collection.createIndex({ schoolId: 1, studentId: 1, examId: 1 }, { unique: true })
            await collection.createIndex({ schoolId: 1, subjectId: 1 })
            break
        }
      }
    },
    down: async (connection) => {
      const collections = [
        'schools', 'students', 'teachers', 'classes',
        'subjects', 'users', 'exams', 'marks'
      ]

      for (const collectionName of collections) {
        await connection.db.dropCollection(collectionName)
      }
    }
  },

  {
    version: '002',
    name: 'Add audit fields and soft delete support',
    up: async (connection) => {
      const collections = [
        'schools', 'students', 'teachers', 'classes',
        'subjects', 'users', 'exams', 'marks'
      ]

      for (const collectionName of collections) {
        const collection = connection.db.collection(collectionName)
        
        // Add audit fields to existing documents
        await collection.updateMany(
          { createdBy: { $exists: false } },
          {
            $set: {
              createdBy: null,
              updatedBy: null,
              isDeleted: false,
              deletedBy: null,
              deletedAt: null,
              version: 1
            }
          }
        )
      }
    },
    down: async (connection) => {
      const collections = [
        'schools', 'students', 'teachers', 'classes',
        'subjects', 'users', 'exams', 'marks'
      ]

      for (const collectionName of collections) {
        const collection = connection.db.collection(collectionName)
        
        await collection.updateMany(
          {},
          {
            $unset: {
              createdBy: 1,
              updatedBy: 1,
              isDeleted: 1,
              deletedBy: 1,
              deletedAt: 1,
              version: 1
            }
          }
        )
      }
    }
  }
]

// ============================================================================
// PREDEFINED SEED DATA
// ============================================================================

export const getDefaultSeeds = (tenantContext?: TenantContext): SeedData[] => [
  {
    collection: 'users',
    data: [
      {
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'System',
        lastName: 'Administrator',
        roles: [
          {
            schoolId: tenantContext?.schoolId,
            role: 'super_admin',
            permissions: [
              'user:create', 'user:read', 'user:update', 'user:delete',
              'school:manage', 'student:manage', 'teacher:manage',
              'class:manage', 'subject:manage', 'exam:manage'
            ],
            isActive: true
          }
        ],
        isActive: true,
        isVerified: true,
        hashedPassword: '$2b$10$dummy.hash.for.seeding.purposes.only'
      }
    ],
    options: {
      updateOnDuplicate: true,
      upsertKey: 'email'
    }
  },

  {
    collection: 'subjects',
    data: [
      { code: 'MATH', name: 'Mathematics', category: 'core', credits: 4, isActive: true },
      { code: 'ENG', name: 'English Language', category: 'core', credits: 4, isActive: true },
      { code: 'SCI', name: 'Science', category: 'core', credits: 4, isActive: true },
      { code: 'SST', name: 'Social Studies', category: 'core', credits: 3, isActive: true },
      { code: 'PE', name: 'Physical Education', category: 'elective', credits: 2, isActive: true },
      { code: 'ART', name: 'Arts & Crafts', category: 'elective', credits: 2, isActive: true }
    ],
    options: {
      updateOnDuplicate: true,
      upsertKey: 'code',
      tenantSpecific: true
    }
  },

  {
    collection: 'classes',
    data: [
      { code: 'PRE-K', name: 'Pre-Kindergarten', grade: 'Pre-K', capacity: 20, isActive: true },
      { code: 'K', name: 'Kindergarten', grade: 'K', capacity: 25, isActive: true },
      { code: 'G1', name: 'Grade 1', grade: '1', capacity: 30, isActive: true },
      { code: 'G2', name: 'Grade 2', grade: '2', capacity: 30, isActive: true },
      { code: 'G3', name: 'Grade 3', grade: '3', capacity: 32, isActive: true },
      { code: 'G4', name: 'Grade 4', grade: '4', capacity: 32, isActive: true },
      { code: 'G5', name: 'Grade 5', grade: '5', capacity: 35, isActive: true }
    ],
    options: {
      updateOnDuplicate: true,
      upsertKey: 'code',
      tenantSpecific: true
    }
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const runMigrations = async (customMigrations?: Migration[]): Promise<MigrationStatus[]> => {
  const dbManager = getDatabase()
  if (!dbManager.isOnline()) {
    throw new Error('Migrations require MongoDB connection')
  }

  const connection = dbManager.getMongoConnection()
  if (!connection) {
    throw new Error('MongoDB connection not available')
  }

  const runner = new MigrationRunner(connection)
  const allMigrations = [...migrations, ...(customMigrations || [])]
  
  return await runner.runMigrations(allMigrations)
}

export const runSeeds = async (
  customSeeds?: SeedData[],
  tenantContext?: TenantContext
): Promise<void> => {
  const dbManager = getDatabase()
  const runner = new SeedRunner(dbManager)
  
  const defaultSeeds = getDefaultSeeds(tenantContext)
  const allSeeds = [...defaultSeeds, ...(customSeeds || [])]
  
  return await runner.runSeeds(allSeeds, tenantContext)
}

export const initializeDatabase = async (
  tenantContext?: TenantContext,
  customMigrations?: Migration[],
  customSeeds?: SeedData[]
): Promise<void> => {
  console.log('Initializing database with migrations and seeds...')
  
  // Run migrations first
  const migrationResults = await runMigrations(customMigrations)
  const failedMigrations = migrationResults.filter(r => !r.executed)
  
  if (failedMigrations.length > 0) {
    console.error('Some migrations failed:', failedMigrations)
    throw new Error('Database migration failed')
  }
  
  console.log(`✓ ${migrationResults.length} migrations completed`)
  
  // Run seeds
  await runSeeds(customSeeds, tenantContext)
  console.log('✓ Database seeding completed')
  
  console.log('Database initialization completed successfully')
}

export { MigrationRunner, SeedRunner }