import mongoose from 'mongoose'
import { DatabaseManager, getDatabase } from './connection'

// ============================================================================
// TENANT ISOLATION UTILITIES
// ============================================================================

export interface TenantContext {
  schoolId: string
  tenantId?: string
  userId?: string
  permissions?: string[]
}

export interface QueryOptions {
  tenant?: TenantContext
  populate?: string | string[]
  sort?: any
  limit?: number
  skip?: number
  select?: string
  lean?: boolean
}

export interface BulkOperation {
  operation: 'insert' | 'update' | 'delete'
  collection: string
  data: any
  query?: any
  options?: any
}

// ============================================================================
// TENANT-AWARE QUERY BUILDER
// ============================================================================

export class TenantQueryBuilder {
  private context: TenantContext
  
  constructor(context: TenantContext) {
    this.context = context
  }

  addTenantFilter(query: any = {}): any {
    // Always add school-level isolation
    return {
      ...query,
      schoolId: this.context.schoolId,
      // Soft delete filter
      isDeleted: { $ne: true }
    }
  }

  addUserFilter(query: any = {}, field: string = 'userId'): any {
    if (this.context.userId) {
      return {
        ...this.addTenantFilter(query),
        [field]: this.context.userId
      }
    }
    return this.addTenantFilter(query)
  }

  addPermissionFilter(query: any = {}, requiredPermission: string): any {
    // This would integrate with your permission system
    // For now, just add tenant filter
    return this.addTenantFilter(query)
  }

  buildAggregationPipeline(basePipeline: any[] = []): any[] {
    return [
      {
        $match: {
          schoolId: new mongoose.Types.ObjectId(this.context.schoolId),
          isDeleted: { $ne: true }
        }
      },
      ...basePipeline
    ]
  }
}

// ============================================================================
// DATABASE UTILITIES CLASS
// ============================================================================

export class DatabaseUtils {
  private dbManager: DatabaseManager

  constructor(dbManager?: DatabaseManager) {
    this.dbManager = dbManager || getDatabase()
  }

  // ============================================================================
  // CRUD OPERATIONS WITH TENANT ISOLATION
  // ============================================================================

  async findOne(
    modelName: string,
    query: any,
    options: QueryOptions = {}
  ): Promise<any> {
    const { tenant, populate, select, lean } = options
    
    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      let finalQuery = query
      if (tenant) {
        const queryBuilder = new TenantQueryBuilder(tenant)
        finalQuery = queryBuilder.addTenantFilter(query)
      }

      let mongoQuery = Model.findOne(finalQuery)
      
      if (populate) mongoQuery = mongoQuery.populate(populate)
      if (select) mongoQuery = mongoQuery.select(select)
      if (lean) mongoQuery = mongoQuery.lean()

      return await mongoQuery.exec()
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      let finalQuery = query
      if (tenant) {
        const queryBuilder = new TenantQueryBuilder(tenant)
        finalQuery = queryBuilder.addTenantFilter(query)
      }

      return await nedb.findOne(modelName.toLowerCase(), finalQuery)
    }
  }

  async find(
    modelName: string,
    query: any = {},
    options: QueryOptions = {}
  ): Promise<any[]> {
    const { tenant, populate, sort, limit, skip, select, lean } = options
    
    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      let finalQuery = query
      if (tenant) {
        const queryBuilder = new TenantQueryBuilder(tenant)
        finalQuery = queryBuilder.addTenantFilter(query)
      }

      let mongoQuery = Model.find(finalQuery)
      
      if (populate) mongoQuery = mongoQuery.populate(populate)
      if (select) mongoQuery = mongoQuery.select(select)
      if (sort) mongoQuery = mongoQuery.sort(sort)
      if (skip) mongoQuery = mongoQuery.skip(skip)
      if (limit) mongoQuery = mongoQuery.limit(limit)
      if (lean) mongoQuery = mongoQuery.lean()

      return await mongoQuery.exec()
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      let finalQuery = query
      if (tenant) {
        const queryBuilder = new TenantQueryBuilder(tenant)
        finalQuery = queryBuilder.addTenantFilter(query)
      }

      const nedbOptions: any = {}
      if (sort) nedbOptions.sort = sort
      if (skip) nedbOptions.skip = skip
      if (limit) nedbOptions.limit = limit

      return await nedb.find(modelName.toLowerCase(), finalQuery, nedbOptions)
    }
  }

  async create(
    modelName: string,
    data: any,
    options: QueryOptions = {}
  ): Promise<any> {
    const { tenant } = options
    
    // Add tenant context to data
    let enrichedData = { ...data }
    if (tenant) {
      enrichedData.schoolId = tenant.schoolId
      if (tenant.userId) enrichedData.createdBy = tenant.userId
    }

    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      const document = new Model(enrichedData)
      return await document.save()
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      return await nedb.insert(modelName.toLowerCase(), enrichedData)
    }
  }

  async update(
    modelName: string,
    query: any,
    update: any,
    options: QueryOptions = {}
  ): Promise<any> {
    const { tenant } = options
    
    let finalQuery = query
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      finalQuery = queryBuilder.addTenantFilter(query)
    }

    // Add update metadata
    const enrichedUpdate = {
      ...update,
      updatedAt: new Date()
    }
    if (tenant?.userId) enrichedUpdate.updatedBy = tenant.userId

    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      return await Model.findOneAndUpdate(
        finalQuery,
        { $set: enrichedUpdate },
        { new: true, runValidators: true }
      )
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      await nedb.update(modelName.toLowerCase(), finalQuery, enrichedUpdate)
      return await nedb.findOne(modelName.toLowerCase(), finalQuery)
    }
  }

  async delete(
    modelName: string,
    query: any,
    options: QueryOptions & { hardDelete?: boolean } = {}
  ): Promise<any> {
    const { tenant, hardDelete = false } = options
    
    let finalQuery = query
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      finalQuery = queryBuilder.addTenantFilter(query)
    }

    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      if (hardDelete) {
        return await Model.findOneAndDelete(finalQuery)
      } else {
        // Soft delete
        const update = {
          isDeleted: true,
          deletedAt: new Date()
        }
        if (tenant?.userId) update.deletedBy = tenant.userId

        return await Model.findOneAndUpdate(
          finalQuery,
          { $set: update },
          { new: true }
        )
      }
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      return await nedb.remove(modelName.toLowerCase(), finalQuery, { softDelete: !hardDelete })
    }
  }

  async count(
    modelName: string,
    query: any = {},
    options: QueryOptions = {}
  ): Promise<number> {
    const { tenant } = options
    
    let finalQuery = query
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      finalQuery = queryBuilder.addTenantFilter(query)
    }

    if (this.dbManager.isOnline()) {
      // Use MongoDB
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      return await Model.countDocuments(finalQuery)
    } else {
      // Use NeDB
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      return await nedb.count(modelName.toLowerCase(), finalQuery)
    }
  }

  // ============================================================================
  // AGGREGATION UTILITIES
  // ============================================================================

  async aggregate(
    modelName: string,
    pipeline: any[],
    options: QueryOptions = {}
  ): Promise<any[]> {
    const { tenant } = options

    if (!this.dbManager.isOnline()) {
      throw new Error('Aggregation only supported in online mode (MongoDB)')
    }

    const Model = mongoose.models[modelName]
    if (!Model) throw new Error(`Model ${modelName} not found`)

    let finalPipeline = pipeline
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      finalPipeline = queryBuilder.buildAggregationPipeline(pipeline)
    }

    return await Model.aggregate(finalPipeline)
  }

  async distinct(
    modelName: string,
    field: string,
    query: any = {},
    options: QueryOptions = {}
  ): Promise<any[]> {
    const { tenant } = options

    let finalQuery = query
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      finalQuery = queryBuilder.addTenantFilter(query)
    }

    if (this.dbManager.isOnline()) {
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      return await Model.distinct(field, finalQuery)
    } else {
      // NeDB doesn't have distinct, so we'll simulate it
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      const docs = await nedb.find(modelName.toLowerCase(), finalQuery)
      const values = docs.map(doc => doc[field]).filter(val => val !== undefined)
      return [...new Set(values)]
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkWrite(
    modelName: string,
    operations: BulkOperation[],
    options: QueryOptions = {}
  ): Promise<any> {
    const { tenant } = options

    if (this.dbManager.isOnline()) {
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      const bulkOps = operations.map(op => {
        let query = op.query || {}
        let data = op.data || {}

        // Add tenant context
        if (tenant) {
          const queryBuilder = new TenantQueryBuilder(tenant)
          query = queryBuilder.addTenantFilter(query)
          if (op.operation !== 'delete') {
            data.schoolId = tenant.schoolId
            if (tenant.userId) {
              data[op.operation === 'insert' ? 'createdBy' : 'updatedBy'] = tenant.userId
            }
          }
        }

        switch (op.operation) {
          case 'insert':
            return { insertOne: { document: data } }
          case 'update':
            return { updateOne: { filter: query, update: { $set: data }, upsert: op.options?.upsert || false } }
          case 'delete':
            return { deleteOne: { filter: query } }
          default:
            throw new Error(`Unsupported bulk operation: ${op.operation}`)
        }
      })

      return await Model.bulkWrite(bulkOps)
    } else {
      // NeDB doesn't have bulk operations, so we'll execute individually
      const nedb = this.dbManager.getNeDBAdapter()
      if (!nedb) throw new Error('No database adapter available')

      const results = []
      for (const op of operations) {
        let query = op.query || {}
        let data = op.data || {}

        if (tenant) {
          const queryBuilder = new TenantQueryBuilder(tenant)
          query = queryBuilder.addTenantFilter(query)
          if (op.operation !== 'delete') {
            data.schoolId = tenant.schoolId
          }
        }

        try {
          switch (op.operation) {
            case 'insert':
              const inserted = await nedb.insert(modelName.toLowerCase(), data)
              results.push({ ok: 1, _id: inserted._id })
              break
            case 'update':
              const updated = await nedb.update(modelName.toLowerCase(), query, data)
              results.push({ ok: 1, modified: updated })
              break
            case 'delete':
              const deleted = await nedb.remove(modelName.toLowerCase(), query)
              results.push({ ok: 1, deleted })
              break
          }
        } catch (error) {
          results.push({ ok: 0, error: error.message })
        }
      }

      return { results }
    }
  }

  // ============================================================================
  // TRANSACTION UTILITIES (MongoDB only)
  // ============================================================================

  async withTransaction<T>(
    callback: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    if (!this.dbManager.isOnline()) {
      throw new Error('Transactions only supported in online mode (MongoDB)')
    }

    const session = await mongoose.startSession()
    try {
      return await session.withTransaction(callback)
    } finally {
      await session.endSession()
    }
  }

  // ============================================================================
  // SEARCH AND PAGINATION
  // ============================================================================

  async search(
    modelName: string,
    searchTerm: string,
    searchFields: string[],
    options: QueryOptions & { pagination?: { page: number; limit: number } } = {}
  ): Promise<{ results: any[]; total: number; page?: number; pages?: number }> {
    const { tenant, pagination } = options

    // Build search query
    const searchQuery = {
      $or: searchFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' }
      }))
    }

    let baseQuery = searchQuery
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      baseQuery = queryBuilder.addTenantFilter(searchQuery)
    }

    const total = await this.count(modelName, baseQuery, options)

    let findOptions = { ...options }
    if (pagination) {
      findOptions.skip = (pagination.page - 1) * pagination.limit
      findOptions.limit = pagination.limit
    }

    const results = await this.find(modelName, baseQuery, findOptions)

    const response: any = { results, total }
    if (pagination) {
      response.page = pagination.page
      response.pages = Math.ceil(total / pagination.limit)
    }

    return response
  }

  // ============================================================================
  // VALIDATION AND SCHEMA UTILITIES
  // ============================================================================

  async validateDocument(modelName: string, data: any): Promise<{ isValid: boolean; errors?: any[] }> {
    if (this.dbManager.isOnline()) {
      const Model = mongoose.models[modelName]
      if (!Model) throw new Error(`Model ${modelName} not found`)

      try {
        const doc = new Model(data)
        await doc.validate()
        return { isValid: true }
      } catch (error) {
        const errors = Object.values(error.errors || {}).map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
        return { isValid: false, errors }
      }
    } else {
      // NeDB validation would be handled by the registered schemas
      const nedb = this.dbManager.getNeDBAdapter()
      if (nedb) {
        const validation = nedb['validator']?.validate(modelName.toLowerCase(), data)
        if (validation) {
          return {
            isValid: validation.success,
            errors: validation.errors?.map(err => ({ message: err }))
          }
        }
      }
      return { isValid: true } // No validation available
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  isOnline(): boolean {
    return this.dbManager.isOnline()
  }

  isOffline(): boolean {
    return this.dbManager.isOffline()
  }

  async getCollectionStats(modelName: string, tenant?: TenantContext): Promise<any> {
    let query = {}
    if (tenant) {
      const queryBuilder = new TenantQueryBuilder(tenant)
      query = queryBuilder.addTenantFilter()
    }

    const total = await this.count(modelName, query)
    const active = await this.count(modelName, { ...query, isDeleted: { $ne: true } })
    
    return {
      total,
      active,
      deleted: total - active,
      collection: modelName.toLowerCase()
    }
  }

  createTenantContext(schoolId: string, userId?: string, permissions?: string[]): TenantContext {
    return { schoolId, userId, permissions }
  }
}

// ============================================================================
// EXPORT DEFAULT INSTANCE
// ============================================================================

let defaultUtils: DatabaseUtils | null = null

export const getDatabaseUtils = (): DatabaseUtils => {
  if (!defaultUtils) {
    defaultUtils = new DatabaseUtils()
  }
  return defaultUtils
}

export default DatabaseUtils