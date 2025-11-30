/**
 * Subject Store
 * Manages subject data and operations using TanStack Query and API client
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subjectService } from '../api/subjects'
import { handleApiError } from '../api/client'
import type { Subject, CreateSubjectData, SubjectFilters } from '../types'
import type { SubjectCreateData, SubjectUpdateData, SubjectListParams } from '../api/subjects'

// Query keys for React Query caching
export const SUBJECT_KEYS = {
  all: ['subjects'] as const,
  lists: () => [...SUBJECT_KEYS.all, 'list'] as const,
  list: (params?: SubjectListParams) => [...SUBJECT_KEYS.lists(), params] as const,
  details: () => [...SUBJECT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBJECT_KEYS.details(), id] as const,
  stats: () => [...SUBJECT_KEYS.all, 'stats'] as const,
  departments: () => [...SUBJECT_KEYS.all, 'departments'] as const,
  levels: () => [...SUBJECT_KEYS.all, 'levels'] as const,
}

// Mock subjects data for development/fallback (remove when backend is ready)
const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Secondary school mathematics covering algebra, geometry, statistics, and calculus',
    department: 'Sciences',
    level: 'Secondary',
    credits: 4,
    teacherCount: 3,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    code: 'AMATH',
    description: 'Advanced mathematics for senior students including calculus and further statistics',
    department: 'Sciences',
    level: 'Senior Secondary',
    credits: 5,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '3',
    name: 'English Language',
    code: 'ENG',
    description: 'English Language and communication skills',
    department: 'Languages',
    level: 'Secondary',
    credits: 4,
    teacherCount: 4,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    name: 'Physics',
    code: 'PHY',
    description: 'Physical sciences and applied physics with laboratory work',
    department: 'Sciences',
    level: 'Secondary',
    credits: 4,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '5',
    name: 'Chemistry',
    code: 'CHEM',
    description: 'Chemical processes and laboratory work',
    department: 'Sciences',
    level: 'Secondary',
    credits: 4,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '6',
    name: 'Biology',
    code: 'BIO',
    description: 'Life sciences and biological processes with practical work',
    department: 'Sciences',
    level: 'Secondary',
    credits: 4,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '7',
    name: 'English Literature',
    code: 'LIT',
    description: 'English literature and creative writing',
    department: 'Languages',
    level: 'Secondary',
    credits: 3,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '8',
    name: 'Statistics',
    code: 'STAT',
    description: 'Statistical analysis and data interpretation',
    department: 'Sciences',
    level: 'Senior Secondary',
    credits: 3,
    teacherCount: 1,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '9',
    name: 'Art and Design',
    code: 'ART',
    description: 'Visual arts, drawing, and creative design',
    department: 'Arts',
    level: 'Secondary',
    credits: 3,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '10',
    name: 'Music',
    code: 'MUS',
    description: 'Music theory, performance, and appreciation',
    department: 'Arts',
    level: 'Secondary',
    credits: 2,
    teacherCount: 1,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '11',
    name: 'Basic Literacy',
    code: 'LIT-K',
    description: 'Foundational reading and writing skills',
    department: 'Early Learning',
    level: 'Kindergarten',
    credits: 2,
    teacherCount: 3,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '12',
    name: 'Basic Numeracy',
    code: 'NUM-K',
    description: 'Foundational number skills and mathematics',
    department: 'Early Learning',
    level: 'Kindergarten',
    credits: 2,
    teacherCount: 3,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '13',
    name: 'Computer Science',
    code: 'CS',
    description: 'Advanced programming and computer science concepts',
    department: 'Technology',
    level: 'Senior Secondary',
    credits: 4,
    teacherCount: 1,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '14',
    name: 'Information Technology',
    code: 'IT',
    description: 'Computer literacy and information systems',
    department: 'Technology',
    level: 'Secondary',
    credits: 3,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '15',
    name: 'History',
    code: 'HIST',
    description: 'World and local history with critical analysis',
    department: 'Humanities',
    level: 'Secondary',
    credits: 3,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '16',
    name: 'Geography',
    code: 'GEO',
    description: 'Physical and human geography with fieldwork',
    department: 'Humanities',
    level: 'Secondary',
    credits: 3,
    teacherCount: 2,
    isActive: true,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
const fetchSubjects = async (filters: SubjectFilters = {}): Promise<Subject[]> => {
  await delay(500)
  
  let filteredSubjects = [...mockSubjects]
  
  // Apply filters
  if (filters.department) {
    filteredSubjects = filteredSubjects.filter(subject => subject.department === filters.department)
  }
  
  if (filters.level) {
    filteredSubjects = filteredSubjects.filter(subject => subject.level === filters.level)
  }
  
  if (filters.isActive !== undefined) {
    filteredSubjects = filteredSubjects.filter(subject => subject.isActive === filters.isActive)
  }
  
  if (filters.minCredits !== undefined) {
    filteredSubjects = filteredSubjects.filter(subject => subject.credits >= filters.minCredits)
  }
  
  if (filters.maxCredits !== undefined) {
    filteredSubjects = filteredSubjects.filter(subject => subject.credits <= filters.maxCredits)
  }
  
  if (filters.hasTeachers !== undefined) {
    if (filters.hasTeachers) {
      filteredSubjects = filteredSubjects.filter(subject => (subject.teacherCount || 0) > 0)
    } else {
      filteredSubjects = filteredSubjects.filter(subject => (subject.teacherCount || 0) === 0)
    }
  }
  
  return filteredSubjects
}

const fetchSubject = async (id: string): Promise<Subject> => {
  await delay(300)
  
  const subject = mockSubjects.find(s => s.id === id)
  if (!subject) {
    throw new Error('Subject not found')
  }
  
  return subject
}

const createSubject = async (data: CreateSubjectData): Promise<Subject> => {
  await delay(800)
  
  const newSubject: Subject = {
    id: Date.now().toString(),
    ...data,
    teacherCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockSubjects.push(newSubject)
  return newSubject
}

const updateSubject = async (id: string, data: CreateSubjectData): Promise<Subject> => {
  await delay(800)
  
  const index = mockSubjects.findIndex(s => s.id === id)
  if (index === -1) {
    throw new Error('Subject not found')
  }
  
  const updatedSubject: Subject = {
    ...mockSubjects[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  
  mockSubjects[index] = updatedSubject
  return updatedSubject
}

const deleteSubject = async (id: string): Promise<void> => {
  await delay(500)
  
  const index = mockSubjects.findIndex(s => s.id === id)
  if (index === -1) {
    throw new Error('Subject not found')
  }
  
  mockSubjects.splice(index, 1)
}

// Subject Queries with API Integration
export function useSubjects(params?: SubjectListParams) {
  return useQuery({
    queryKey: SUBJECT_KEYS.list(params),
    queryFn: async () => {
      const response = await subjectService.getSubjects(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subjects')
      }
      return response.data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: SUBJECT_KEYS.detail(id),
    queryFn: async () => {
      const response = await subjectService.getSubject(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subject')
      }
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useSubjectStats() {
  return useQuery({
    queryKey: SUBJECT_KEYS.stats(),
    queryFn: async () => {
      const response = await subjectService.getSubjectStats()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subject statistics')
      }
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useSubjectDepartments() {
  return useQuery({
    queryKey: SUBJECT_KEYS.departments(),
    queryFn: async () => {
      const response = await subjectService.getDepartments()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch departments')
      }
      return response.data || []
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

export function useSubjectLevels() {
  return useQuery({
    queryKey: SUBJECT_KEYS.levels(),
    queryFn: async () => {
      const response = await subjectService.getLevels()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch levels')
      }
      return response.data || []
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubjectCreateData) => {
      const response = await subjectService.createSubject(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create subject')
      }
      return response.data
    },
    onSuccess: (newSubject) => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.stats() })
      
      if (newSubject) {
        queryClient.setQueryData(SUBJECT_KEYS.detail(newSubject.id), newSubject)
      }
    },
    onError: (error) => {
      console.error('Failed to create subject:', error)
    }
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubjectUpdateData }) => {
      const response = await subjectService.updateSubject(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update subject')
      }
      return response.data
    },
    onSuccess: (updatedSubject) => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.stats() })
      
      if (updatedSubject) {
        queryClient.setQueryData(SUBJECT_KEYS.detail(updatedSubject.id), updatedSubject)
      }
    },
    onError: (error) => {
      console.error('Failed to update subject:', error)
    }
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await subjectService.deleteSubject(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete subject')
      }
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.stats() })
      queryClient.removeQueries({ queryKey: SUBJECT_KEYS.detail(id) })
    },
    onError: (error) => {
      console.error('Failed to delete subject:', error)
    }
  })
}

export function useSearchSubjects(query: string) {
  return useQuery({
    queryKey: [...SUBJECT_KEYS.all, 'search', query] as const,
    queryFn: async () => {
      const response = await subjectService.searchSubjects(query)
      if (!response.success) {
        throw new Error(response.message || 'Search failed')
      }
      return response.data || []
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useSubjectsByDepartment(department: string) {
  return useQuery({
    queryKey: [...SUBJECT_KEYS.all, 'department', department] as const,
    queryFn: async () => {
      const response = await subjectService.getSubjectsByDepartment(department)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subjects by department')
      }
      return response.data || []
    },
    enabled: !!department,
    staleTime: 5 * 60 * 1000,
  })
}

export function useImportSubjects() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await subjectService.importSubjects(file)
      if (!response.success) {
        throw new Error(response.message || 'Import failed')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECT_KEYS.all })
    }
  })
}

// Helper function to convert between data formats
export function convertToApiFormat(subject: CreateSubjectData): SubjectCreateData {
  return {
    name: subject.name,
    code: subject.code,
    description: subject.description || '',
    department: subject.department || '',
    level: subject.level || '',
    credits: subject.credits,
    isActive: subject.isActive !== false,
  }
}

// Backward compatibility
export const subjectKeys = SUBJECT_KEYS
export const useSubjects_ = useSubjects // For any components using old name