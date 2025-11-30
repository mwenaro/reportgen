/**
 * Class API Service
 * Handles all class-related API operations
 */

import { apiClient, type ApiResponse } from './client'
import type { Class } from '../types'

export interface ClassListParams {
  page?: number
  limit?: number
  search?: string
  level?: string
  section?: string
  academicYear?: string
  teacherId?: string
  subjectId?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ClassCreateData {
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacherId?: string
  subjects: string[]
  schedule?: {
    [day: string]: {
      startTime: string
      endTime: string
      subject: string
      teacher: string
    }[]
  }
  classroom?: string
  description?: string
  isActive: boolean
}

export interface ClassUpdateData extends Partial<ClassCreateData> {
  updatedAt: string
}

export interface ClassStats {
  totalClasses: number
  activeClasses: number
  totalStudents: number
  averageClassSize: number
  classCapacityUtilization: number
  byLevel: Record<string, number>
  bySection: Record<string, number>
  enrollmentTrends: Array<{
    month: string
    enrolled: number
    capacity: number
  }>
}

export interface EnrollmentData {
  classId: string
  studentId: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'transferred' | 'graduated'
}

class ClassService {
  /**
   * Get paginated list of classes
   */
  async getClasses(params?: ClassListParams): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>('/classes', params)
  }

  /**
   * Get class by ID
   */
  async getClass(id: string): Promise<ApiResponse<Class>> {
    return apiClient.get<Class>(`/classes/${id}`)
  }

  /**
   * Create new class
   */
  async createClass(data: ClassCreateData): Promise<ApiResponse<Class>> {
    return apiClient.post<Class>('/classes', data)
  }

  /**
   * Update existing class
   */
  async updateClass(id: string, data: ClassUpdateData): Promise<ApiResponse<Class>> {
    return apiClient.put<Class>(`/classes/${id}`, data)
  }

  /**
   * Delete class
   */
  async deleteClass(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/classes/${id}`)
  }

  /**
   * Get class statistics
   */
  async getClassStats(): Promise<ApiResponse<ClassStats>> {
    return apiClient.get<ClassStats>('/classes/stats')
  }

  /**
   * Get classes by teacher
   */
  async getClassesByTeacher(teacherId: string): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>(`/classes/teacher/${teacherId}`)
  }

  /**
   * Get classes by academic year
   */
  async getClassesByAcademicYear(year: string): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>(`/classes/academic-year/${year}`)
  }

  /**
   * Search classes
   */
  async searchClasses(query: string): Promise<ApiResponse<Class[]>> {
    return apiClient.get<Class[]>('/classes/search', { q: query })
  }

  /**
   * Assign teacher to class
   */
  async assignTeacher(classId: string, teacherId: string): Promise<ApiResponse<Class>> {
    return apiClient.patch<Class>(`/classes/${classId}/teacher`, { teacherId })
  }

  /**
   * Assign subjects to class
   */
  async assignSubjects(classId: string, subjectIds: string[]): Promise<ApiResponse<Class>> {
    return apiClient.patch<Class>(`/classes/${classId}/subjects`, { subjects: subjectIds })
  }

  /**
   * Get class enrollment
   */
  async getClassEnrollment(classId: string): Promise<ApiResponse<EnrollmentData[]>> {
    return apiClient.get<EnrollmentData[]>(`/classes/${classId}/enrollment`)
  }

  /**
   * Enroll student in class
   */
  async enrollStudent(classId: string, studentId: string): Promise<ApiResponse<EnrollmentData>> {
    return apiClient.post<EnrollmentData>(`/classes/${classId}/enrollment`, {
      studentId,
      enrollmentDate: new Date().toISOString(),
      status: 'active'
    })
  }

  /**
   * Remove student from class
   */
  async removeStudent(classId: string, studentId: string): Promise<ApiResponse> {
    return apiClient.delete(`/classes/${classId}/enrollment/${studentId}`)
  }

  /**
   * Update student enrollment status
   */
  async updateEnrollmentStatus(
    classId: string, 
    studentId: string, 
    status: EnrollmentData['status']
  ): Promise<ApiResponse<EnrollmentData>> {
    return apiClient.patch<EnrollmentData>(
      `/classes/${classId}/enrollment/${studentId}`, 
      { status }
    )
  }

  /**
   * Get class schedule
   */
  async getClassSchedule(classId: string, week?: string): Promise<ApiResponse<any[]>> {
    const params = week ? { week } : undefined
    return apiClient.get(`/classes/${classId}/schedule`, params)
  }

  /**
   * Update class schedule
   */
  async updateClassSchedule(
    classId: string, 
    schedule: ClassCreateData['schedule']
  ): Promise<ApiResponse<Class>> {
    return apiClient.patch<Class>(`/classes/${classId}/schedule`, { schedule })
  }

  /**
   * Get available levels
   */
  async getLevels(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/classes/levels')
  }

  /**
   * Get available sections for a level
   */
  async getSectionsForLevel(level: string): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`/classes/levels/${level}/sections`)
  }

  /**
   * Get academic years
   */
  async getAcademicYears(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/classes/academic-years')
  }

  /**
   * Get class capacity report
   */
  async getCapacityReport(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/classes/capacity-report')
  }

  /**
   * Bulk update class status
   */
  async bulkUpdateStatus(classIds: string[], isActive: boolean): Promise<ApiResponse<Class[]>> {
    return apiClient.patch<Class[]>('/classes/bulk/status', {
      classIds,
      isActive,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Import classes from CSV
   */
  async importClasses(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiClient.upload('/classes/import', file)
  }

  /**
   * Export classes to CSV
   */
  async exportClasses(params?: ClassListParams): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get('/classes/export', params)
  }

  /**
   * Generate class reports
   */
  async generateClassReport(
    classId: string, 
    reportType: 'enrollment' | 'performance' | 'attendance',
    params?: { startDate?: string; endDate?: string }
  ): Promise<ApiResponse<any>> {
    return apiClient.get(`/classes/${classId}/reports/${reportType}`, params)
  }

  /**
   * Get class performance analytics
   */
  async getPerformanceAnalytics(classId: string, subject?: string): Promise<ApiResponse<any>> {
    const params = subject ? { subject } : undefined
    return apiClient.get(`/classes/${classId}/analytics/performance`, params)
  }

  /**
   * Get attendance summary for class
   */
  async getAttendanceSummary(
    classId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<any>> {
    const params = { startDate, endDate }
    return apiClient.get(`/classes/${classId}/attendance/summary`, params)
  }

  /**
   * Transfer student between classes
   */
  async transferStudent(
    fromClassId: string, 
    toClassId: string, 
    studentId: string, 
    transferDate?: string
  ): Promise<ApiResponse> {
    return apiClient.post('/classes/transfer-student', {
      fromClassId,
      toClassId,
      studentId,
      transferDate: transferDate || new Date().toISOString()
    })
  }

  /**
   * Duplicate class for new academic year
   */
  async duplicateClass(
    classId: string, 
    newAcademicYear: string, 
    options?: {
      copyStudents?: boolean
      copySchedule?: boolean
      copySubjects?: boolean
    }
  ): Promise<ApiResponse<Class>> {
    return apiClient.post<Class>(`/classes/${classId}/duplicate`, {
      academicYear: newAcademicYear,
      ...options
    })
  }

  /**
   * Get class timetable conflicts
   */
  async getScheduleConflicts(classId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/classes/${classId}/schedule/conflicts`)
  }

  /**
   * Validate class data before creation/update
   */
  async validateClass(data: Partial<ClassCreateData>): Promise<ApiResponse<{ valid: boolean; errors?: string[] }>> {
    return apiClient.post('/classes/validate', data)
  }
}

// Create singleton instance
export const classService = new ClassService()

// Helper functions
export function validateClassData(data: Partial<ClassCreateData>): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('Class name is required')
  }

  if (!data.level?.trim()) {
    errors.push('Class level is required')
  }

  if (!data.section?.trim()) {
    errors.push('Class section is required')
  }

  if (!data.academicYear?.trim()) {
    errors.push('Academic year is required')
  }

  if (!data.capacity || data.capacity <= 0) {
    errors.push('Class capacity must be greater than 0')
  }

  if (data.capacity && data.capacity > 100) {
    errors.push('Class capacity seems unusually high (>100)')
  }

  return errors
}

export function formatClassName(classData: Class): string {
  return `${classData.level} ${classData.section} (${classData.academicYear})`
}

export function getClassStatusColor(isActive: boolean): string {
  return isActive 
    ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
    : 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
}

export function calculateCapacityUtilization(currentEnrollment: number, capacity: number): number {
  return capacity > 0 ? Math.round((currentEnrollment / capacity) * 100) : 0
}

export function getCapacityStatus(utilization: number): {
  status: 'low' | 'optimal' | 'high' | 'full'
  color: string
  message: string
} {
  if (utilization === 100) {
    return {
      status: 'full',
      color: 'text-red-600 bg-red-100',
      message: 'Class is at full capacity'
    }
  } else if (utilization > 90) {
    return {
      status: 'high',
      color: 'text-orange-600 bg-orange-100',
      message: 'Class is nearly full'
    }
  } else if (utilization >= 60) {
    return {
      status: 'optimal',
      color: 'text-green-600 bg-green-100',
      message: 'Good capacity utilization'
    }
  } else {
    return {
      status: 'low',
      color: 'text-blue-600 bg-blue-100',
      message: 'Class has available capacity'
    }
  }
}