import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Class, CreateClassData } from '@/lib/types'

// API functions (mock implementation)
const classesApi = {
  getClasses: async (): Promise<Class[]> => {
    // Mock data - replace with actual API call
    return [
      {
        id: 'class1',
        schoolId: 'school1',
        name: 'Form 1A',
        level: 'Form 1',
        section: 'A',
        capacity: 40,
        currentEnrollment: 35,
        classTeacherId: 'teacher1',
        classTeacherName: 'Mr. John Teacher',
        subjects: ['math', 'english', 'science'],
        academicYear: '2024',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'class2',
        schoolId: 'school1',
        name: 'Form 2B',
        level: 'Form 2',
        section: 'B',
        capacity: 40,
        currentEnrollment: 32,
        classTeacherId: 'teacher2',
        classTeacherName: 'Ms. Jane Teacher',
        subjects: ['math', 'english', 'science', 'history'],
        academicYear: '2024',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'class3',
        schoolId: 'school1',
        name: 'Form 3C',
        level: 'Form 3',
        section: 'C',
        capacity: 35,
        currentEnrollment: 30,
        classTeacherId: 'teacher3',
        classTeacherName: 'Mr. Bob Teacher',
        subjects: ['math', 'english', 'science', 'history', 'geography'],
        academicYear: '2024',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },

  getClass: async (id: string): Promise<Class | null> => {
    const classes = await classesApi.getClasses()
    return classes.find(c => c.id === id) || null
  },

  createClass: async (data: CreateClassData): Promise<Class> => {
    // Mock implementation
    return {
      id: Math.random().toString(36).substring(2, 15),
      schoolId: 'school1',
      currentEnrollment: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }
  },

  updateClass: async (id: string, data: Partial<CreateClassData>): Promise<Class> => {
    const existingClass = await classesApi.getClass(id)
    if (!existingClass) throw new Error('Class not found')
    
    return {
      ...existingClass,
      ...data,
      updatedAt: new Date(),
    }
  },

  deleteClass: async (id: string): Promise<void> => {
    console.log('Deleting class:', id)
  },
}

// Query keys
export const classKeys = {
  all: ['classes'] as const,
  lists: () => [...classKeys.all, 'list'] as const,
  list: (filters: any) => [...classKeys.lists(), filters] as const,
  details: () => [...classKeys.all, 'detail'] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
}

// Hooks
export function useClasses() {
  return useQuery({
    queryKey: classKeys.lists(),
    queryFn: () => classesApi.getClasses(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => classesApi.getClass(id),
    enabled: !!id,
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: classesApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
    },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClassData> }) =>
      classesApi.updateClass(id, data),
    onSuccess: (updatedClass) => {
      queryClient.setQueryData(classKeys.detail(updatedClass.id), updatedClass)
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
    },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: classesApi.deleteClass,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: classKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: classKeys.lists() })
    },
  })
}