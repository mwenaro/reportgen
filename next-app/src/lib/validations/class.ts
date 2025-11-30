import { z } from 'zod'

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
  level: z.string().min(1, 'Level is required'),
  section: z.string().min(1, 'Section is required').max(10, 'Section too long'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity too high'),
  currentEnrollment: z.number().min(0, 'Enrollment cannot be negative'),
  academicYear: z.string().min(1, 'Academic year is required'),
  classTeacherId: z.string().optional(),
  subjects: z.array(z.string()).optional().default([]),
  schedule: z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    daysOfWeek: z.array(z.string()).min(1, 'At least one day is required')
  }).optional(),
  room: z.string().optional(),
  isActive: z.boolean().default(true)
}).refine((data) => data.currentEnrollment <= data.capacity, {
  message: 'Current enrollment cannot exceed capacity',
  path: ['currentEnrollment']
}).refine((data) => {
  if (data.schedule && data.schedule.startTime && data.schedule.endTime) {
    return data.schedule.startTime < data.schedule.endTime
  }
  return true
}, {
  message: 'Start time must be before end time',
  path: ['schedule', 'endTime']
})

export type ClassSchema = z.infer<typeof classSchema>