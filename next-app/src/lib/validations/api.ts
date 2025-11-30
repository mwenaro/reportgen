import { z } from 'zod'

// Common validation patterns
const emailSchema = z.string().email('Please enter a valid email address')
const phoneSchema = z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional()
const urlSchema = z.string().url('Please enter a valid URL').optional()

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Teacher validation schemas
export const teacherCreateSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().max(255, 'Address must be less than 255 characters').optional(),
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && parsed < new Date()
  }, 'Please enter a valid date of birth').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),

  // Professional Information
  employeeId: z.string().max(20, 'Employee ID must be less than 20 characters').optional(),
  qualification: z.string().max(100, 'Qualification must be less than 100 characters').optional(),
  experience: z.string().max(50, 'Experience must be less than 50 characters').optional(),
  specialization: z.string().max(100, 'Specialization must be less than 100 characters').optional(),
  subjects: z.array(z.string()).optional(),

  // Employment Details
  joiningDate: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, 'Please enter a valid joining date').optional(),
  contractType: z.enum(['permanent', 'contract', 'part-time']).optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).default('active'),
  department: z.string().max(50, 'Department must be less than 50 characters').optional(),
  position: z.string().max(50, 'Position must be less than 50 characters').optional(),

  // Contact Information
  emergencyContact: z.object({
    name: z.string().max(100, 'Emergency contact name must be less than 100 characters').optional(),
    relationship: z.string().max(50, 'Relationship must be less than 50 characters').optional(),
    phone: phoneSchema
  }).optional(),

  // Professional Development
  certifications: z.array(z.string().max(100, 'Certification must be less than 100 characters')).optional(),
  trainings: z.array(z.object({
    title: z.string().max(100, 'Training title must be less than 100 characters').optional(),
    provider: z.string().max(100, 'Training provider must be less than 100 characters').optional(),
    completionDate: z.string().refine((date) => {
      if (!date) return true
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    }, 'Please enter a valid completion date').optional()
  })).optional(),

  // Performance & Compensation
  performanceRating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  lastReviewDate: z.string().refine((date) => {
    if (!date) return true
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, 'Please enter a valid review date').optional(),
  salary: z.number().min(0, 'Salary cannot be negative').optional(),
  benefits: z.array(z.string().max(100, 'Benefit must be less than 100 characters')).optional()
})

export const teacherUpdateSchema = teacherCreateSchema.partial().extend({
  id: z.string().optional()
})

// Class validation schemas
export const classCreateSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Class name is required').max(100, 'Class name must be less than 100 characters'),
  level: z.string().min(1, 'Grade level is required').max(50, 'Grade level must be less than 50 characters'),
  section: z.string().min(1, 'Section is required').max(10, 'Section must be less than 10 characters'),
  academicYear: z.string().min(1, 'Academic year is required').max(20, 'Academic year must be less than 20 characters'),

  // Teacher Assignment
  classTeacher: z.string().optional(),
  classTeacherName: z.string().max(100, 'Teacher name must be less than 100 characters').optional(),
  subjectTeachers: z.array(z.object({
    teacherId: z.string(),
    teacherName: z.string().max(100, 'Teacher name must be less than 100 characters'),
    subjectId: z.string(),
    subjectName: z.string().max(100, 'Subject name must be less than 100 characters')
  })).optional(),

  // Enrollment & Capacity
  currentEnrollment: z.number().min(0, 'Current enrollment cannot be negative').default(0),
  maxCapacity: z.number().min(1, 'Maximum capacity must be at least 1').max(100, 'Maximum capacity cannot exceed 100'),

  // Schedule & Subjects
  subjects: z.array(z.string()).optional(),
  schedule: z.array(z.object({
    day: z.string().max(20, 'Day must be less than 20 characters'),
    periods: z.array(z.object({
      time: z.string().max(20, 'Time must be less than 20 characters'),
      subject: z.string().max(100, 'Subject must be less than 100 characters'),
      teacher: z.string().max(100, 'Teacher must be less than 100 characters')
    }))
  })).optional(),

  // Class Details
  classroom: z.string().max(50, 'Classroom must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isActive: z.boolean().default(true)
})

export const classUpdateSchema = classCreateSchema.partial().extend({
  id: z.string().optional()
}).refine((data) => {
  if (data.currentEnrollment && data.maxCapacity) {
    return data.currentEnrollment <= data.maxCapacity
  }
  return true
}, {
  message: 'Current enrollment cannot exceed maximum capacity',
  path: ['currentEnrollment']
})

// Subject validation schemas
export const subjectCreateSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(100, 'Subject name must be less than 100 characters'),
  code: z.string().min(1, 'Subject code is required').max(20, 'Subject code must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Subject code must contain only uppercase letters and numbers'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  department: z.string().max(50, 'Department must be less than 50 characters').optional(),
  level: z.string().max(50, 'Level must be less than 50 characters').optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  isActive: z.boolean().default(true)
})

export const subjectUpdateSchema = subjectCreateSchema.partial().extend({
  id: z.string().optional()
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(1, 'Page must be at least 1')).optional().default('1'),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100')).optional().default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
})

export const teacherQuerySchema = paginationSchema.extend({
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).optional(),
  department: z.string().max(50, 'Department must be less than 50 characters').optional(),
  contractType: z.enum(['permanent', 'contract', 'part-time']).optional()
})

export const classQuerySchema = paginationSchema.extend({
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  level: z.string().max(50, 'Level must be less than 50 characters').optional(),
  academicYear: z.string().max(20, 'Academic year must be less than 20 characters').optional(),
  classTeacher: z.string().optional(),
  isActive: z.string().transform((val) => val === 'true').pipe(z.boolean()).optional()
})

export const subjectQuerySchema = paginationSchema.extend({
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  department: z.string().max(50, 'Department must be less than 50 characters').optional(),
  level: z.string().max(50, 'Level must be less than 50 characters').optional(),
  isActive: z.string().transform((val) => val === 'true').pipe(z.boolean()).optional(),
  credits: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(1).max(10)).optional()
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => {
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      return allowedTypes.includes(file.type)
    }, 'File must be CSV, XLS, or XLSX format')
})

// Bulk operation schemas
export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1, 'ID cannot be empty')).min(1, 'At least one ID is required').max(100, 'Cannot delete more than 100 items at once')
})

export const bulkUpdateSchema = z.object({
  ids: z.array(z.string().min(1, 'ID cannot be empty')).min(1, 'At least one ID is required').max(100, 'Cannot update more than 100 items at once'),
  updates: z.record(z.any()) // Generic updates object
})

// Export types for TypeScript
export type LoginRequest = z.infer<typeof loginSchema>
export type RegisterRequest = z.infer<typeof registerSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type TeacherCreateRequest = z.infer<typeof teacherCreateSchema>
export type TeacherUpdateRequest = z.infer<typeof teacherUpdateSchema>
export type ClassCreateRequest = z.infer<typeof classCreateSchema>
export type ClassUpdateRequest = z.infer<typeof classUpdateSchema>
export type SubjectCreateRequest = z.infer<typeof subjectCreateSchema>
export type SubjectUpdateRequest = z.infer<typeof subjectUpdateSchema>
export type TeacherQueryParams = z.infer<typeof teacherQuerySchema>
export type ClassQueryParams = z.infer<typeof classQuerySchema>
export type SubjectQueryParams = z.infer<typeof subjectQuerySchema>
export type BulkDeleteRequest = z.infer<typeof bulkDeleteSchema>
export type BulkUpdateRequest = z.infer<typeof bulkUpdateSchema>