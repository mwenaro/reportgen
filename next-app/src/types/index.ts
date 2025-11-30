// Export all comprehensive type definitions for the school management system

// ============================================================================
// CORE ENTITY TYPES
// ============================================================================
export * from './entities'

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================
export * from './auth'

// ============================================================================
// ACADEMIC & EDUCATIONAL TYPES
// ============================================================================
export * from './academics'

// ============================================================================
// API & COMMUNICATION TYPES
// ============================================================================
export * from './api'

// ============================================================================
// UI COMPONENT & INTERFACE TYPES
// ============================================================================
export * from './components'

// ============================================================================
// TYPE UTILITIES & HELPERS
// ============================================================================

// Utility types for common operations
export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type Required<T> = {
  [P in keyof T]-?: T[P]
}

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type KeyOf<T> = keyof T

export type ValueOf<T> = T[keyof T]

export type NonNullable<T> = T extends null | undefined ? never : T

// Database document types with timestamps
export type WithTimestamps<T> = T & {
  createdAt: Date
  updatedAt: Date
}

// Optional timestamps for creation
export type WithOptionalTimestamps<T> = T & {
  createdAt?: Date
  updatedAt?: Date
}

// ID-based entity types
export type WithId<T> = T & {
  id: string
}

// School-scoped entity types  
export type WithSchoolId<T> = T & {
  schoolId: string
}

// User audit fields
export type WithAudit<T> = T & {
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

// Soft delete support
export type WithSoftDelete<T> = T & {
  deletedAt?: Date
  deletedBy?: string
  isDeleted: boolean
}

// Version tracking
export type WithVersion<T> = T & {
  version: number
  versionHistory?: T[]
}

// Status tracking
export type WithStatus<T, S = string> = T & {
  status: S
  statusChangedAt: Date
  statusChangedBy: string
}

// Meta information
export type WithMeta<T> = T & {
  metadata?: Record<string, any>
  tags?: string[]
  notes?: string
}

// Complete entity type with all common fields
export type CompleteEntity<T> = WithId<WithSchoolId<WithTimestamps<WithAudit<WithSoftDelete<WithMeta<T>>>>>>

// ============================================================================
// RESPONSE TYPE BUILDERS
// ============================================================================

// Build paginated response type
export type PaginatedResponseOf<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Build API response type
export type ApiResponseOf<T> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
  message?: string
  timestamp: string
  requestId: string
}

// Build search response type
export type SearchResponseOf<T> = {
  results: Array<{
    item: T
    score: number
    highlights?: Record<string, string[]>
  }>
  totalResults: number
  executionTime: number
  facets?: Array<{
    field: string
    values: Array<{
      value: string
      count: number
    }>
  }>
}

// ============================================================================
// CONDITIONAL TYPES FOR DIFFERENT CONTEXTS
// ============================================================================

// Create vs Update operations
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

// Form data types
export type FormData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>

// List item types (minimal data for lists)
export type ListItem<T> = Pick<T, 'id' | 'name'> & {
  status?: string
  createdAt: Date
}

// Detail types (full data for detail views)
export type DetailView<T> = T & {
  _relations?: Record<string, any>
  _computed?: Record<string, any>
}

// ============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

// Branded string types for IDs
declare const __brand: unique symbol
type Brand<K, T> = K & { __brand: T }

export type SchoolId = Brand<string, 'SchoolId'>
export type StudentId = Brand<string, 'StudentId'>
export type TeacherId = Brand<string, 'TeacherId'>
export type ClassId = Brand<string, 'ClassId'>
export type SubjectId = Brand<string, 'SubjectId'>
export type ExamId = Brand<string, 'ExamId'>
export type UserId = Brand<string, 'UserId'>

// Email type
export type Email = Brand<string, 'Email'>

// Phone number type
export type PhoneNumber = Brand<string, 'PhoneNumber'>

// URL type
export type URL = Brand<string, 'URL'>

// Percentage type (0-100)
export type Percentage = Brand<number, 'Percentage'>

// Grade type (letter grades)
export type LetterGrade = Brand<string, 'LetterGrade'>

// Academic year format (e.g., "2024-2025")
export type AcademicYear = Brand<string, 'AcademicYear'>

// ============================================================================
// DISCRIMINATED UNIONS
// ============================================================================

// User types with role-specific data
export type RoleBasedUser = 
  | { role: 'SUPER_ADMIN'; adminLevel: 'system' }
  | { role: 'SCHOOL_ADMIN'; schoolId: string; permissions: string[] }
  | { role: 'TEACHER'; teacherId: string; subjects: string[]; classes: string[] }
  | { role: 'STUDENT'; studentId: string; classId: string; guardianId: string }
  | { role: 'PARENT'; studentIds: string[]; contactPreferences: string[] }

// Event types
export type SystemEvent = 
  | { type: 'USER_LOGIN'; userId: string; timestamp: Date }
  | { type: 'USER_LOGOUT'; userId: string; timestamp: Date }
  | { type: 'GRADE_ENTERED'; studentId: string; examId: string; grade: number; timestamp: Date }
  | { type: 'REPORT_GENERATED'; studentId: string; reportType: string; timestamp: Date }
  | { type: 'PAYMENT_RECEIVED'; studentId: string; amount: number; method: string; timestamp: Date }

// Notification types
export type NotificationType =
  | { type: 'GRADE_ALERT'; studentId: string; subjectId: string; grade: number }
  | { type: 'ATTENDANCE_ALERT'; studentId: string; absences: number }
  | { type: 'FEE_REMINDER'; studentId: string; amount: number; dueDate: Date }
  | { type: 'EXAM_SCHEDULE'; examId: string; date: Date; subjects: string[] }
  | { type: 'GENERAL_ANNOUNCEMENT'; message: string; priority: 'low' | 'medium' | 'high' }

// ============================================================================
// GLOBAL TYPE DECLARATIONS
// ============================================================================

declare global {
  namespace SchoolMS {
    // Global types available throughout the application
    type ID = string
    type Timestamp = Date
    type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }
    
    // Window extensions for browser APIs
    interface Window {
      gtag?: (...args: any[]) => void
      dataLayer?: any[]
      fbq?: (...args: any[]) => void
      // School management specific globals
      schoolConfig?: {
        id: string
        name: string
        features: string[]
        theme: string
      }
    }
  }
}