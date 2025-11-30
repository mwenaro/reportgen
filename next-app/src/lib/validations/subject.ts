import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(100, 'Subject name too long'),
  code: z.string().min(1, 'Subject code is required').max(10, 'Subject code too long').regex(/^[A-Z0-9-]+$/, 'Subject code must contain only uppercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description too long').optional(),
  department: z.string().optional(),
  level: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  isActive: z.boolean().default(true)
})

export type SubjectSchema = z.infer<typeof subjectSchema>