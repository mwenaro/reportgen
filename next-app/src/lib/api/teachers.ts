/**
 * Teacher API Service
 * Handles all teacher-related API operations
 */

import { apiClient, type ApiResponse } from './client'
import type { Teacher } from '../types'

export interface TeacherListParams {
  page?: number
  limit?: number
  search?: string
  department?: string
  status?: string
  qualification?: string
  contractType?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TeacherCreateData {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  nationality: string
  qualification: string
  experience: string
  specialization: string[]
  subjects: string[]
  department: string
  joiningDate: string
  contractType: 'permanent' | 'contract' | 'part-time'
  salary: number
  status: 'active' | 'inactive' | 'on-leave'
  // Professional development
  certifications?: string[]
  trainings?: string[]
  tscNumber?: string
  // Contact information
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
}

export interface TeacherUpdateData extends Partial<TeacherCreateData> {
  updatedAt: string
}

export interface TeacherStats {
  totalTeachers: number
  activeTeachers: number
  inactiveTeachers: number
  onLeave: number
  byDepartment: Record<string, number>
  byContractType: Record<string, number>
  avgExperience: number
  recentHires: number
}

class TeacherService {
  /**
   * Get paginated list of teachers
   */
  async getTeachers(params?: TeacherListParams): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>('/teachers', params)
  }

  /**
   * Get teacher by ID
   */
  async getTeacher(id: string): Promise<ApiResponse<Teacher>> {
    return apiClient.get<Teacher>(`/teachers/${id}`)
  }

  /**
   * Create new teacher
   */
  async createTeacher(data: TeacherCreateData): Promise<ApiResponse<Teacher>> {
    return apiClient.post<Teacher>('/teachers', data)
  }

  /**
   * Update existing teacher
   */
  async updateTeacher(id: string, data: TeacherUpdateData): Promise<ApiResponse<Teacher>> {
    return apiClient.put<Teacher>(`/teachers/${id}`, data)
  }

  /**
   * Delete teacher
   */
  async deleteTeacher(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/teachers/${id}`)
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats(): Promise<ApiResponse<TeacherStats>> {
    return apiClient.get<TeacherStats>('/teachers/stats')
  }

  /**
   * Bulk import teachers from CSV
   */
  async importTeachers(file: File): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    return apiClient.upload('/teachers/import', file)
  }

  /**
   * Export teachers to CSV
   */
  async exportTeachers(params?: TeacherListParams): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get('/teachers/export', params)
  }

  /**
   * Search teachers by name, employee ID, or email
   */
  async searchTeachers(query: string): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>('/teachers/search', { q: query })
  }

  /**
   * Get teachers by department
   */
  async getTeachersByDepartment(department: string): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(`/teachers/department/${department}`)
  }

  /**
   * Get teachers by subject
   */
  async getTeachersBySubject(subjectId: string): Promise<ApiResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(`/teachers/subject/${subjectId}`)
  }

  /**
   * Update teacher status
   */
  async updateTeacherStatus(id: string, status: Teacher['status']): Promise<ApiResponse<Teacher>> {
    return apiClient.patch<Teacher>(`/teachers/${id}/status`, { status })
  }

  /**
   * Assign subjects to teacher
   */
  async assignSubjects(id: string, subjectIds: string[]): Promise<ApiResponse<Teacher>> {
    return apiClient.patch<Teacher>(`/teachers/${id}/subjects`, { subjects: subjectIds })
  }

  /**
   * Update teacher profile photo
   */
  async updateProfilePhoto(id: string, photo: File): Promise<ApiResponse<{ photoUrl: string }>> {
    return apiClient.upload(`/teachers/${id}/photo`, photo)
  }

  /**
   * Get teacher's class assignments
   */
  async getTeacherClasses(id: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/teachers/${id}/classes`)
  }

  /**
   * Get teacher's schedule
   */
  async getTeacherSchedule(id: string, week?: string): Promise<ApiResponse<any[]>> {
    const params = week ? { week } : undefined
    return apiClient.get(`/teachers/${id}/schedule`, params)
  }

  /**
   * Record professional development activity
   */
  async recordProfessionalDevelopment(
    id: string, 
    activity: {
      type: 'certification' | 'training' | 'workshop' | 'conference'
      title: string
      provider: string
      completionDate: string
      certificateUrl?: string
      description?: string
    }
  ): Promise<ApiResponse> {
    return apiClient.post(`/teachers/${id}/professional-development`, activity)
  }

  /**
   * Generate teacher performance report
   */
  async generatePerformanceReport(id: string, period: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/teachers/${id}/performance`, { period })
  }

  /**
   * Get available departments
   */
  async getDepartments(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/teachers/departments')
  }

  /**
   * Get teacher workload distribution
   */
  async getWorkloadDistribution(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/teachers/workload')
  }
}

// Create singleton instance
export const teacherService = new TeacherService()

// Helper function to validate teacher data
export function validateTeacherData(data: Partial<TeacherCreateData>): string[] {
  const errors: string[] = []

  if (!data.firstName?.trim()) {
    errors.push('First name is required')
  }

  if (!data.lastName?.trim()) {
    errors.push('Last name is required')
  }

  if (!data.email?.trim()) {
    errors.push('Email is required')
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Email format is invalid')
  }

  if (!data.employeeId?.trim()) {
    errors.push('Employee ID is required')
  }

  if (!data.phone?.trim()) {
    errors.push('Phone number is required')
  }

  if (!data.joiningDate) {
    errors.push('Joining date is required')
  }

  if (!data.contractType) {
    errors.push('Contract type is required')
  }

  if (data.salary && data.salary <= 0) {
    errors.push('Salary must be greater than 0')
  }

  return errors
}

// Helper to format teacher name
export function formatTeacherName(teacher: Teacher): string {
  return `${teacher.firstName} ${teacher.lastName}`.trim()
}

// Helper to get teacher display status
export function getTeacherStatusColor(status: Teacher['status']): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100'
    case 'inactive':
      return 'text-gray-600 bg-gray-100'
    case 'on-leave':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Helper to calculate years of experience
export function calculateExperience(joiningDate: string): number {
  const joining = new Date(joiningDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - joining.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 365)
}