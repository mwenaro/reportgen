import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Subject, CreateSubjectData, SubjectFilters } from '@/lib/types'

// Mock subjects data
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

// Query keys
export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (filters: SubjectFilters) => [...subjectKeys.lists(), { filters }] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
}

// Hooks
export const useSubjects = (filters: SubjectFilters = {}) => {
  return useQuery({
    queryKey: subjectKeys.list(filters),
    queryFn: () => fetchSubjects(filters),
  })
}

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => fetchSubject(id),
    enabled: !!id,
  })
}

export const useCreateSubject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all })
    },
  })
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSubjectData }) =>
      updateSubject(id, data),
    onSuccess: (updatedSubject) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all })
      queryClient.setQueryData(subjectKeys.detail(updatedSubject.id), updatedSubject)
    },
  })
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all })
    },
  })
}