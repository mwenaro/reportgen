import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Error types
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors: Record<string, string[]>
  public readonly code?: string

  constructor(
    message: string,
    statusCode: number = 500,
    errors: Record<string, string[]> = {},
    code?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.code = code
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', errors: Record<string, string[]>) {
    super(message, 400, errors, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, { resource: [message] }, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, { auth: [message] }, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, { auth: [message] }, 'FORBIDDEN')
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict', errors: Record<string, string[]> = {}) {
    super(message, 409, errors, 'CONFLICT')
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, { rateLimit: [message] }, 'RATE_LIMIT')
  }
}

// Error response interface
interface ErrorResponse {
  success: false
  message: string
  errors: Record<string, string[]>
  code?: string
  timestamp: string
  path?: string
}

// Standard API response wrapper
export function createErrorResponse(
  error: ApiError | Error,
  request?: NextRequest
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString()
  const path = request?.url ? new URL(request.url).pathname : undefined

  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      message: error.message,
      errors: error.errors,
      code: error.code,
      timestamp,
      path
    }, { status: error.statusCode })
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error)
  
  return NextResponse.json({
    success: false,
    message: 'Internal server error',
    errors: { server: ['An unexpected error occurred'] },
    code: 'INTERNAL_ERROR',
    timestamp,
    path
  }, { status: 500 })
}

// Success response wrapper
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }, { status: statusCode })
}

// Paginated success response
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  },
  message: string = 'Data retrieved successfully'
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination,
    message,
    timestamp: new Date().toISOString()
  })
}

// Validation helper using Zod
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      
      throw new ValidationError('Request validation failed', errors)
    }
    throw error
  }
}

// Query parameter validation
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): T {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return validateRequestBody(schema, params)
}

// Async error handler wrapper
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const request = args.find(arg => arg instanceof NextRequest) as NextRequest | undefined
      return createErrorResponse(error as Error, request)
    }
  }
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): void {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key)
    }
  }
  
  const current = rateLimitMap.get(identifier)
  
  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now })
    return
  }
  
  if (current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now })
    return
  }
  
  if (current.count >= maxRequests) {
    throw new RateLimitError(`Rate limit exceeded. Max ${maxRequests} requests per ${windowMs}ms`)
  }
  
  current.count += 1
}

// Request logging middleware
export function logRequest(request: NextRequest, startTime: number = Date.now()) {
  const duration = Date.now() - startTime
  const { method, url } = request
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'Unknown'
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms - IP: ${ip} - UA: ${userAgent}`)
}

// Sanitization helpers
export function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return ''
  return email.trim().toLowerCase().replace(/[<>]/g, '')
}

export function sanitizeNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return !isNaN(parsed) ? parsed : defaultValue
  }
  return defaultValue
}

// Database transaction helper (placeholder for future database integration)
export async function withTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  // This would wrap database transactions in a real implementation
  try {
    return await callback()
  } catch (error) {
    // Rollback logic would go here
    throw error
  }
}

// Health check helper
export function createHealthCheck(
  checks: Record<string, () => Promise<boolean> | boolean> = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const results: Record<string, { status: 'ok' | 'error'; message?: string }> = {}
    let overallHealth = true
    
    for (const [name, check] of Object.entries(checks)) {
      try {
        const result = await Promise.resolve(check())
        results[name] = { status: result ? 'ok' : 'error' }
        if (!result) overallHealth = false
      } catch (error) {
        results[name] = { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Check failed' 
        }
        overallHealth = false
      }
    }
    
    return NextResponse.json({
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: results
    }, { 
      status: overallHealth ? 200 : 503 
    })
  }
}