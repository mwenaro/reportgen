import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Subject, CreateSubjectData } from '@/lib/types'

// Mock subjects data
const mockSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Secondary school mathematics covering algebra, geometry, statistics, and calculus',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'english',
    name: 'English',
    code: 'ENG',
    description: 'English Language and communication skills',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'kiswahili',
    name: 'Kiswahili',
    code: 'KIS',
    description: 'Kiswahili language and literature',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    description: 'Life sciences and biological processes',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHEM',
    description: 'Chemical processes and laboratory work',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    description: 'Physical sciences and applied physics',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'history',
    name: 'History',
    code: 'HIST',
    description: 'World and Kenyan history',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'geography',
    name: 'Geography',
    code: 'GEO',
    description: 'Physical and human geography',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'cre',
    name: 'Christian Religious Education',
    code: 'CRE',
    description: 'Christian religious studies and ethics',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'business',
    name: 'Business Studies',
    code: 'BUS',
    description: 'Business principles and entrepreneurship',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'computer',
    name: 'Computer Studies',
    code: 'COMP',
    description: 'Computer literacy and programming basics',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    code: 'AGR',
    description: 'Agricultural practices and farming techniques',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'art',
    name: 'Art and Design',
    code: 'ART',
    description: 'Visual arts, drawing, and creative design',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'music',
    name: 'Music',
    code: 'MUS',
    description: 'Music theory, performance, and appreciation',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pe',
    name: 'Physical Education',
    code: 'PE',
    description: 'Physical fitness and sports activities',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'literature',
    name: 'Literature',
    code: 'LIT',
    description: 'English literature and creative writing',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'french',
    name: 'French',
    code: 'FR',
    description: 'French language and culture',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'german',
    name: 'German',
    code: 'GER',
    description: 'German language and culture',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'games',
    name: 'Games',
    code: 'GAMES',
    description: 'Sports and recreational activities',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const subjectsApi = {
  // Get all subjects
  getSubjects: async (): Promise<Subject[]> => {
    await delay(300)
    return mockSubjects.filter(subject => subject.isActive)
  },

  // Get subject by ID
  getSubject: async (id: string): Promise<Subject | null> => {
    await delay(200)
    return mockSubjects.find(subject => subject.id === id) || null
  },

  // Create subject
  createSubject: async (data: CreateSubjectData): Promise<Subject> => {
    await delay(500)
    const newSubject: Subject = {
      ...data,
      id: `subject-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSubjects.push(newSubject)
    return newSubject
  },

  // Update subject
  updateSubject: async (id: string, data: Partial<CreateSubjectData>): Promise<Subject> => {
    await delay(400)
    const index = mockSubjects.findIndex(subject => subject.id === id)
    if (index === -1) throw new Error('Subject not found')
    
    mockSubjects[index] = {
      ...mockSubjects[index],
      ...data,
      updatedAt: new Date(),
    }
    return mockSubjects[index]
  },

  // Delete subject (soft delete - set isActive to false)
  deleteSubject: async (id: string): Promise<void> => {
    await delay(300)
    const index = mockSubjects.findIndex(subject => subject.id === id)
    if (index === -1) throw new Error('Subject not found')
    mockSubjects[index].isActive = false
    mockSubjects[index].updatedAt = new Date()
  }
}

// Query keys
export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: () => [...subjectKeys.lists()] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
}

// React Query hooks
export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.list(),
    queryFn: subjectsApi.getSubjects,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectsApi.getSubject(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: subjectsApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubjectData> }) =>
      subjectsApi.updateSubject(id, data),
    onSuccess: (subject) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      queryClient.setQueryData(subjectKeys.detail(subject.id), subject)
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: subjectsApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
    },
  })
}