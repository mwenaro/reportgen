/**
 * Class Store
 * Manages class data and operations using TanStack Query and API client
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { classService } from '../api/classes'
import { handleApiError } from '../api/client'
import type { Class, CreateClassData, ClassFilters } from '../types'
import type { ClassCreateData, ClassUpdateData, ClassListParams } from '../api/classes'

// Query keys for React Query caching
export const CLASS_KEYS = {
  all: ['classes'] as const,
  lists: () => [...CLASS_KEYS.all, 'list'] as const,
  list: (params?: ClassListParams) => [...CLASS_KEYS.lists(), params] as const,
  details: () => [...CLASS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CLASS_KEYS.details(), id] as const,
  stats: () => [...CLASS_KEYS.all, 'stats'] as const,
  levels: () => [...CLASS_KEYS.all, 'levels'] as const,
  academicYears: () => [...CLASS_KEYS.all, 'academic-years'] as const,
}

// Mock data for development/fallback (remove when backend is ready)
const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Grade 5A Mathematics',
    level: 'Grade 5',
    section: 'A',
    description: 'Advanced mathematics class focusing on algebraic concepts and problem-solving.',
    capacity: 30,
    currentEnrollment: 28,
    academicYear: '2024/2025',
    classTeacherId: '1',
    classTeacherName: 'Sarah Johnson',
    subjects: ['1', '2'],
    schedule: {
      startTime: '08:00',
      endTime: '15:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Room 101',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Grade 6B Science',
    level: 'Grade 6',
    section: 'B',
    description: 'Comprehensive science program covering biology, chemistry, and physics fundamentals.',
    capacity: 25,
    currentEnrollment: 24,
    academicYear: '2024/2025',
    classTeacherId: '2',
    classTeacherName: 'Michael Chen',
    subjects: ['3', '4', '5'],
    schedule: {
      startTime: '08:30',
      endTime: '15:30',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Science Lab A',
    isActive: true,
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z'
  },
  {
    id: '3',
    name: 'Form 1A English Literature',
    level: 'Form 1',
    section: 'A',
    description: 'English literature and language arts program emphasizing critical thinking and writing skills.',
    capacity: 32,
    currentEnrollment: 30,
    academicYear: '2024/2025',
    classTeacherId: '3',
    classTeacherName: 'Emily Davis',
    subjects: ['6', '7'],
    schedule: {
      startTime: '08:00',
      endTime: '14:30',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Room 205',
    isActive: true,
    createdAt: '2024-01-17T08:00:00Z',
    updatedAt: '2024-01-17T08:00:00Z'
  },
  {
    id: '4',
    name: 'Grade 4C General Studies',
    level: 'Grade 4',
    section: 'C',
    description: 'Integrated curriculum covering multiple subjects for holistic learning.',
    capacity: 28,
    currentEnrollment: 26,
    academicYear: '2024/2025',
    classTeacherId: '4',
    classTeacherName: 'James Wilson',
    subjects: ['1', '3', '6'],
    schedule: {
      startTime: '08:15',
      endTime: '14:45',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Room 102',
    isActive: true,
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z'
  },
  {
    id: '5',
    name: 'Form 2B Advanced Mathematics',
    level: 'Form 2',
    section: 'B',
    description: 'Advanced mathematics including calculus preparation and statistical analysis.',
    capacity: 20,
    currentEnrollment: 18,
    academicYear: '2024/2025',
    classTeacherId: '5',
    classTeacherName: 'Lisa Thompson',
    subjects: ['2', '8'],
    schedule: {
      startTime: '09:00',
      endTime: '16:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Math Lab',
    isActive: true,
    createdAt: '2024-01-19T08:00:00Z',
    updatedAt: '2024-01-19T08:00:00Z'
  },
  {
    id: '6',
    name: 'Grade 3A Creative Arts',
    level: 'Grade 3',
    section: 'A',
    description: 'Creative arts program combining visual arts, music, and drama.',
    capacity: 35,
    currentEnrollment: 32,
    academicYear: '2024/2025',
    classTeacherId: '6',
    classTeacherName: 'Maria Rodriguez',
    subjects: ['9', '10'],
    schedule: {
      startTime: '08:30',
      endTime: '15:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday']
    },
    room: 'Art Studio',
    isActive: true,
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: '7',
    name: 'Kindergarten Morning Group',
    level: 'Kindergarten',
    section: 'Morning',
    description: 'Early childhood development program for 4-5 year olds.',
    capacity: 18,
    currentEnrollment: 16,
    academicYear: '2024/2025',
    classTeacherId: '7',
    classTeacherName: 'Anna Kumar',
    subjects: ['11', '12'],
    schedule: {
      startTime: '08:00',
      endTime: '12:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Kindergarten Room A',
    isActive: true,
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T08:00:00Z'
  },
  {
    id: '8',
    name: 'Form 4A Computer Science',
    level: 'Form 4',
    section: 'A',
    description: 'Advanced computer science program covering programming, algorithms, and software development.',
    capacity: 22,
    currentEnrollment: 20,
    academicYear: '2024/2025',
    classTeacherId: '8',
    classTeacherName: 'David Park',
    subjects: ['13', '14'],
    schedule: {
      startTime: '09:00',
      endTime: '16:30',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Computer Lab 1',
    isActive: true,
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z'
  },
  {
    id: '9',
    name: 'Grade 7B Social Studies',
    level: 'Grade 7',
    section: 'B',
    description: 'Comprehensive social studies program covering history, geography, and civics.',
    capacity: 30,
    currentEnrollment: 27,
    academicYear: '2024/2025',
    classTeacherId: '9',
    classTeacherName: 'Robert Brown',
    subjects: ['15', '16'],
    schedule: {
      startTime: '08:15',
      endTime: '15:15',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Room 301',
    isActive: true,
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T08:00:00Z'
  },
  {
    id: '10',
    name: 'Grade 8A Physics & Chemistry',
    level: 'Grade 8',
    section: 'A',
    description: 'Advanced science program with hands-on laboratory experiments.',
    capacity: 24,
    currentEnrollment: 23,
    academicYear: '2024/2025',
    classTeacherId: '10',
    classTeacherName: 'Jennifer Lee',
    subjects: ['4', '5'],
    schedule: {
      startTime: '08:45',
      endTime: '15:45',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    room: 'Science Lab B',
    isActive: true,
    createdAt: '2024-01-24T08:00:00Z',
    updatedAt: '2024-01-24T08:00:00Z'
  }
]

// Simulate API calls with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
const fetchClasses = async (filters: ClassFilters = {}): Promise<Class[]> => {
  await delay(500)
  
  let filteredClasses = [...mockClasses]
  
  // Apply filters
  if (filters.level) {
    filteredClasses = filteredClasses.filter(cls => cls.level === filters.level)
  }
  
  if (filters.academicYear) {
    filteredClasses = filteredClasses.filter(cls => cls.academicYear === filters.academicYear)
  }
  
  if (filters.classTeacherId) {
    filteredClasses = filteredClasses.filter(cls => cls.classTeacherId === filters.classTeacherId)
  }
  
  if (filters.isActive !== undefined) {
    filteredClasses = filteredClasses.filter(cls => cls.isActive === filters.isActive)
  }
  
  if (filters.minEnrollment !== undefined) {
    filteredClasses = filteredClasses.filter(cls => cls.currentEnrollment >= filters.minEnrollment)
  }
  
  if (filters.maxEnrollment !== undefined) {
    filteredClasses = filteredClasses.filter(cls => cls.currentEnrollment <= filters.maxEnrollment)
  }
  
  return filteredClasses
}

const fetchClass = async (id: string): Promise<Class> => {
  await delay(300)
  
  const cls = mockClasses.find(c => c.id === id)
  if (!cls) {
    throw new Error('Class not found')
  }
  
  return cls
}

const createClass = async (data: CreateClassData): Promise<Class> => {
  await delay(800)
  
  // Find teacher name if teacher is assigned
  const classTeacherName = data.classTeacherId 
    ? `Teacher ${data.classTeacherId}` // In real app, this would be fetched from teacher data
    : undefined
  
  const newClass: Class = {
    id: Date.now().toString(),
    ...data,
    classTeacherName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockClasses.push(newClass)
  return newClass
}

const updateClass = async (id: string, data: CreateClassData): Promise<Class> => {
  await delay(800)
  
  const index = mockClasses.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Class not found')
  }
  
  // Find teacher name if teacher is assigned
  const classTeacherName = data.classTeacherId 
    ? `Teacher ${data.classTeacherId}` // In real app, this would be fetched from teacher data
    : undefined
  
  const updatedClass: Class = {
    ...mockClasses[index],
    ...data,
    classTeacherName,
    updatedAt: new Date().toISOString()
  }
  
  mockClasses[index] = updatedClass
  return updatedClass
}

const deleteClass = async (id: string): Promise<void> => {
  await delay(500)
  
  const index = mockClasses.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Class not found')
  }
  
  mockClasses.splice(index, 1)
}

// Class Queries with API Integration
export function useClasses(params?: ClassListParams) {
  return useQuery({
    queryKey: CLASS_KEYS.list(params),
    queryFn: async () => {
      const response = await classService.getClasses(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch classes')
      }
      return response.data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: CLASS_KEYS.detail(id),
    queryFn: async () => {
      const response = await classService.getClass(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch class')
      }
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useClassStats() {
  return useQuery({
    queryKey: CLASS_KEYS.stats(),
    queryFn: async () => {
      const response = await classService.getClassStats()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch class statistics')
      }
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useLevels() {
  return useQuery({
    queryKey: CLASS_KEYS.levels(),
    queryFn: async () => {
      const response = await classService.getLevels()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch levels')
      }
      return response.data || []
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

export function useAcademicYears() {
  return useQuery({
    queryKey: CLASS_KEYS.academicYears(),
    queryFn: async () => {
      const response = await classService.getAcademicYears()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch academic years')
      }
      return response.data || []
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ClassCreateData) => {
      const response = await classService.createClass(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create class')
      }
      return response.data
    },
    onSuccess: (newClass) => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.stats() })
      
      if (newClass) {
        queryClient.setQueryData(CLASS_KEYS.detail(newClass.id), newClass)
      }
    },
    onError: (error) => {
      console.error('Failed to create class:', error)
    }
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClassUpdateData }) => {
      const response = await classService.updateClass(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update class')
      }
      return response.data
    },
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.stats() })
      
      if (updatedClass) {
        queryClient.setQueryData(CLASS_KEYS.detail(updatedClass.id), updatedClass)
      }
    },
    onError: (error) => {
      console.error('Failed to update class:', error)
    }
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await classService.deleteClass(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete class')
      }
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.stats() })
      queryClient.removeQueries({ queryKey: CLASS_KEYS.detail(id) })
    },
    onError: (error) => {
      console.error('Failed to delete class:', error)
    }
  })
}

export function useSearchClasses(query: string) {
  return useQuery({
    queryKey: [...CLASS_KEYS.all, 'search', query] as const,
    queryFn: async () => {
      const response = await classService.searchClasses(query)
      if (!response.success) {
        throw new Error(response.message || 'Search failed')
      }
      return response.data || []
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useClassesByTeacher(teacherId: string) {
  return useQuery({
    queryKey: [...CLASS_KEYS.all, 'teacher', teacherId] as const,
    queryFn: async () => {
      const response = await classService.getClassesByTeacher(teacherId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch classes by teacher')
      }
      return response.data || []
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAssignTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
      const response = await classService.assignTeacher(classId, teacherId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to assign teacher')
      }
      return response.data
    },
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.lists() })
      
      if (updatedClass) {
        queryClient.setQueryData(CLASS_KEYS.detail(updatedClass.id), updatedClass)
      }
    }
  })
}

export function useImportClasses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await classService.importClasses(file)
      if (!response.success) {
        throw new Error(response.message || 'Import failed')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_KEYS.all })
    }
  })
}

// Helper function to convert between data formats
export function convertToApiFormat(classData: CreateClassData): ClassCreateData {
  return {
    name: classData.name,
    level: classData.level,
    section: classData.section,
    academicYear: classData.academicYear,
    capacity: classData.capacity,
    classTeacherId: classData.classTeacherId,
    subjects: classData.subjects || [],
    classroom: classData.room,
    description: classData.description,
    isActive: classData.isActive !== false,
    schedule: classData.schedule ? {
      [classData.schedule.daysOfWeek[0]]: [{
        startTime: classData.schedule.startTime,
        endTime: classData.schedule.endTime,
        subject: '',
        teacher: ''
      }]
    } : undefined
  }
}

// Backward compatibility
export const classKeys = CLASS_KEYS