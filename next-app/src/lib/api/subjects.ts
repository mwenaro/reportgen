/**
 * Subject API Service
 * Handles all subject-related API operations
 */

import { apiClient, type ApiResponse } from './client'
import type { Subject } from '../types'

export interface SubjectListParams {
  page?: number
  limit?: number
  search?: string
  department?: string
  level?: string
  credits?: number
  isActive?: boolean
  teacherId?: string
  classId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SubjectCreateData {
  name: string
  code: string
  description?: string
  department?: string
  level?: string
  credits: number
  isActive: boolean
  prerequisites?: string[]
  objectives?: string[]
  syllabus?: string
  textbooks?: Array<{
    title: string
    author: string
    isbn?: string
    required: boolean
  }>
}

export interface SubjectUpdateData extends Partial<SubjectCreateData> {
  updatedAt: string
}

export interface SubjectStats {
  totalSubjects: number
  activeSubjects: number
  inactiveSubjects: number
  totalCredits: number
  averageCredits: number
  byDepartment: Record<string, number>
  byLevel: Record<string, number>
  byCredits: Record<number, number>
  mostPopular: Array<{
    subject: Subject
    classCount: number
    teacherCount: number
  }>
}

export interface SubjectAssignment {
  subjectId: string
  teacherId: string
  classIds: string[]
  semester: string
  academicYear: string
  workload: number
}

class SubjectService {
  /**
   * Get paginated list of subjects
   */
  async getSubjects(params?: SubjectListParams): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>('/subjects', params)
  }

  /**
   * Get subject by ID
   */
  async getSubject(id: string): Promise<ApiResponse<Subject>> {
    return apiClient.get<Subject>(`/subjects/${id}`)
  }

  /**
   * Create new subject
   */
  async createSubject(data: SubjectCreateData): Promise<ApiResponse<Subject>> {
    return apiClient.post<Subject>('/subjects', data)
  }

  /**
   * Update existing subject
   */
  async updateSubject(id: string, data: SubjectUpdateData): Promise<ApiResponse<Subject>> {
    return apiClient.put<Subject>(`/subjects/${id}`, data)
  }

  /**
   * Delete subject
   */
  async deleteSubject(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/subjects/${id}`)
  }

  /**
   * Get subject statistics
   */
  async getSubjectStats(): Promise<ApiResponse<SubjectStats>> {
    return apiClient.get<SubjectStats>('/subjects/stats')
  }

  /**
   * Search subjects
   */
  async searchSubjects(query: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>('/subjects/search', { q: query })
  }

  /**
   * Get subjects by department
   */
  async getSubjectsByDepartment(department: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>(`/subjects/department/${department}`)
  }

  /**
   * Get subjects by level
   */
  async getSubjectsByLevel(level: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>(`/subjects/level/${level}`)
  }

  /**
   * Get subjects assigned to teacher
   */
  async getSubjectsByTeacher(teacherId: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>(`/subjects/teacher/${teacherId}`)
  }

  /**
   * Get subjects for class
   */
  async getSubjectsForClass(classId: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>(`/subjects/class/${classId}`)
  }

  /**
   * Get available departments
   */
  async getDepartments(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/subjects/departments')
  }

  /**
   * Get available academic levels
   */
  async getLevels(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/subjects/levels')
  }

  /**
   * Assign subject to teacher
   */
  async assignToTeacher(
    subjectId: string, 
    teacherId: string, 
    classIds: string[],
    options?: {
      semester?: string
      academicYear?: string
      workload?: number
    }
  ): Promise<ApiResponse<SubjectAssignment>> {
    return apiClient.post<SubjectAssignment>('/subjects/assignments', {
      subjectId,
      teacherId,
      classIds,
      ...options
    })
  }

  /**
   * Remove subject assignment
   */
  async removeAssignment(assignmentId: string): Promise<ApiResponse> {
    return apiClient.delete(`/subjects/assignments/${assignmentId}`)
  }

  /**
   * Get subject assignments
   */
  async getSubjectAssignments(subjectId: string): Promise<ApiResponse<SubjectAssignment[]>> {
    return apiClient.get<SubjectAssignment[]>(`/subjects/${subjectId}/assignments`)
  }

  /**
   * Update subject status
   */
  async updateSubjectStatus(id: string, isActive: boolean): Promise<ApiResponse<Subject>> {
    return apiClient.patch<Subject>(`/subjects/${id}/status`, { 
      isActive, 
      updatedAt: new Date().toISOString() 
    })
  }

  /**
   * Bulk update subjects
   */
  async bulkUpdateSubjects(
    subjectIds: string[], 
    updates: Partial<SubjectCreateData>
  ): Promise<ApiResponse<Subject[]>> {
    return apiClient.patch<Subject[]>('/subjects/bulk/update', {
      subjectIds,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    })
  }

  /**
   * Bulk delete subjects
   */
  async bulkDeleteSubjects(subjectIds: string[]): Promise<ApiResponse> {
    return apiClient.delete('/subjects/bulk/delete', {
      body: JSON.stringify({ subjectIds })
    })
  }

  /**
   * Import subjects from CSV
   */
  async importSubjects(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiClient.upload('/subjects/import', file)
  }

  /**
   * Export subjects to CSV
   */
  async exportSubjects(params?: SubjectListParams): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get('/subjects/export', params)
  }

  /**
   * Get subject prerequisites
   */
  async getPrerequisites(subjectId: string): Promise<ApiResponse<Subject[]>> {
    return apiClient.get<Subject[]>(`/subjects/${subjectId}/prerequisites`)
  }

  /**
   * Add prerequisite to subject
   */
  async addPrerequisite(subjectId: string, prerequisiteId: string): Promise<ApiResponse<Subject>> {
    return apiClient.post<Subject>(`/subjects/${subjectId}/prerequisites`, {
      prerequisiteId
    })
  }

  /**
   * Remove prerequisite from subject
   */
  async removePrerequisite(subjectId: string, prerequisiteId: string): Promise<ApiResponse<Subject>> {
    return apiClient.delete<Subject>(`/subjects/${subjectId}/prerequisites/${prerequisiteId}`)
  }

  /**
   * Get subject syllabus
   */
  async getSyllabus(subjectId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/subjects/${subjectId}/syllabus`)
  }

  /**
   * Update subject syllabus
   */
  async updateSyllabus(subjectId: string, syllabus: string): Promise<ApiResponse<Subject>> {
    return apiClient.put<Subject>(`/subjects/${subjectId}/syllabus`, { 
      syllabus,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Upload syllabus file
   */
  async uploadSyllabusFile(subjectId: string, file: File): Promise<ApiResponse<{ fileUrl: string }>> {
    return apiClient.upload(`/subjects/${subjectId}/syllabus/file`, file)
  }

  /**
   * Get subject resources
   */
  async getSubjectResources(subjectId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/subjects/${subjectId}/resources`)
  }

  /**
   * Add resource to subject
   */
  async addResource(
    subjectId: string, 
    resource: {
      type: 'textbook' | 'reference' | 'online' | 'video' | 'document'
      title: string
      description?: string
      url?: string
      author?: string
      isbn?: string
      required: boolean
    }
  ): Promise<ApiResponse<any>> {
    return apiClient.post(`/subjects/${subjectId}/resources`, resource)
  }

  /**
   * Remove resource from subject
   */
  async removeResource(subjectId: string, resourceId: string): Promise<ApiResponse> {
    return apiClient.delete(`/subjects/${subjectId}/resources/${resourceId}`)
  }

  /**
   * Get subject performance analytics
   */
  async getPerformanceAnalytics(
    subjectId: string, 
    params?: { 
      academicYear?: string
      semester?: string 
      classId?: string
    }
  ): Promise<ApiResponse<any>> {
    return apiClient.get(`/subjects/${subjectId}/analytics/performance`, params)
  }

  /**
   * Get teacher workload for subject
   */
  async getTeacherWorkload(subjectId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/subjects/${subjectId}/workload`)
  }

  /**
   * Generate subject report
   */
  async generateSubjectReport(
    subjectId: string,
    reportType: 'enrollment' | 'performance' | 'workload' | 'resources',
    params?: { startDate?: string; endDate?: string; format?: 'pdf' | 'excel' }
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get(`/subjects/${subjectId}/reports/${reportType}`, params)
  }

  /**
   * Validate subject code uniqueness
   */
  async validateSubjectCode(code: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> {
    const params = excludeId ? { excludeId } : undefined
    return apiClient.get(`/subjects/validate/code/${code}`, params)
  }

  /**
   * Get subject recommendations
   */
  async getRecommendations(
    studentLevel?: string, 
    completedSubjects?: string[]
  ): Promise<ApiResponse<Subject[]>> {
    return apiClient.post<Subject[]>('/subjects/recommendations', {
      studentLevel,
      completedSubjects
    })
  }

  /**
   * Get curriculum map
   */
  async getCurriculumMap(department?: string, level?: string): Promise<ApiResponse<any>> {
    return apiClient.get('/subjects/curriculum-map', { department, level })
  }

  /**
   * Update curriculum structure
   */
  async updateCurriculum(
    curriculumData: {
      department: string
      level: string
      subjects: Array<{
        subjectId: string
        semester: number
        year: number
        required: boolean
      }>
    }
  ): Promise<ApiResponse<any>> {
    return apiClient.put('/subjects/curriculum', curriculumData)
  }
}

// Create singleton instance
export const subjectService = new SubjectService()

// Helper functions
export function validateSubjectData(data: Partial<SubjectCreateData>): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('Subject name is required')
  }

  if (!data.code?.trim()) {
    errors.push('Subject code is required')
  } else if (!/^[A-Z]{2,4}\d{2,4}$/.test(data.code)) {
    errors.push('Subject code must be in format: 2-4 letters followed by 2-4 numbers (e.g., MATH101)')
  }

  if (!data.credits || data.credits < 1 || data.credits > 10) {
    errors.push('Credits must be between 1 and 10')
  }

  return errors
}

export function formatSubjectCode(code: string): string {
  return code.toUpperCase().replace(/\s/g, '')
}

export function getSubjectStatusColor(isActive: boolean): string {
  return isActive 
    ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
    : 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
}

export function calculateSubjectWorkload(
  classCount: number, 
  studentsPerClass: number, 
  hoursPerWeek: number
): {
  totalStudents: number
  weeklyHours: number
  workloadScore: number
  workloadLevel: 'light' | 'moderate' | 'heavy' | 'overloaded'
} {
  const totalStudents = classCount * studentsPerClass
  const weeklyHours = classCount * hoursPerWeek
  const workloadScore = (totalStudents * hoursPerWeek) / 10 // Arbitrary scale

  let workloadLevel: 'light' | 'moderate' | 'heavy' | 'overloaded'
  
  if (workloadScore < 20) {
    workloadLevel = 'light'
  } else if (workloadScore < 40) {
    workloadLevel = 'moderate'
  } else if (workloadScore < 60) {
    workloadLevel = 'heavy'
  } else {
    workloadLevel = 'overloaded'
  }

  return {
    totalStudents,
    weeklyHours,
    workloadScore,
    workloadLevel
  }
}

export function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    'Mathematics': 'text-blue-600 bg-blue-100',
    'English': 'text-green-600 bg-green-100',
    'Science': 'text-purple-600 bg-purple-100',
    'Social Studies': 'text-orange-600 bg-orange-100',
    'Computer Science': 'text-indigo-600 bg-indigo-100',
    'Arts': 'text-pink-600 bg-pink-100',
    'Physical Education': 'text-red-600 bg-red-100',
    'Music': 'text-yellow-600 bg-yellow-100',
    'Languages': 'text-teal-600 bg-teal-100'
  }

  return colors[department] || 'text-gray-600 bg-gray-100'
}