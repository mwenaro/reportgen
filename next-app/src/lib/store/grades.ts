import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Grade, CreateGradeData } from '@/lib/types'

// API functions (mock implementation)
const gradesApi = {
  getStudentGrades: async (studentId: string): Promise<Grade[]> => {
    // Mock data - replace with actual API call
    const mockGrades: Grade[] = [
      {
        id: '1',
        studentId,
        subjectId: 'math',
        subjectName: 'Mathematics',
        examId: 'exam1',
        examName: 'Mid Term 1',
        mark: 85,
        grade: 'A',
        points: 12,
        term: 'Term 1',
        academicYear: '2024',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        studentId,
        subjectId: 'english',
        subjectName: 'English',
        examId: 'exam1',
        examName: 'Mid Term 1',
        mark: 78,
        grade: 'B+',
        points: 10,
        term: 'Term 1',
        academicYear: '2024',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        studentId,
        subjectId: 'science',
        subjectName: 'Science',
        examId: 'exam1',
        examName: 'Mid Term 1',
        mark: 92,
        grade: 'A',
        points: 12,
        term: 'Term 1',
        academicYear: '2024',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    
    return mockGrades
  },

  getClassGrades: async (classId: string, examId?: string): Promise<Grade[]> => {
    // Mock implementation
    return []
  },

  createGrade: async (data: CreateGradeData): Promise<Grade> => {
    // Mock implementation
    return {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }
  },

  updateGrade: async (id: string, data: Partial<CreateGradeData>): Promise<Grade> => {
    // Mock implementation
    const existingGrade = await gradesApi.getGrade(id)
    if (!existingGrade) throw new Error('Grade not found')
    
    return {
      ...existingGrade,
      ...data,
      updatedAt: new Date(),
    }
  },

  deleteGrade: async (id: string): Promise<void> => {
    console.log('Deleting grade:', id)
  },

  getGrade: async (id: string): Promise<Grade | null> => {
    // Mock implementation
    return null
  },
}

// Query keys
export const gradeKeys = {
  all: ['grades'] as const,
  student: (studentId: string) => [...gradeKeys.all, 'student', studentId] as const,
  class: (classId: string, examId?: string) => [...gradeKeys.all, 'class', classId, examId] as const,
  detail: (id: string) => [...gradeKeys.all, 'detail', id] as const,
}

// Hooks
export function useStudentGrades(studentId: string) {
  return useQuery({
    queryKey: gradeKeys.student(studentId),
    queryFn: () => gradesApi.getStudentGrades(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useClassGrades(classId: string, examId?: string) {
  return useQuery({
    queryKey: gradeKeys.class(classId, examId),
    queryFn: () => gradesApi.getClassGrades(classId, examId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateGrade() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: gradesApi.createGrade,
    onSuccess: (newGrade) => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.student(newGrade.studentId) })
      queryClient.invalidateQueries({ queryKey: gradeKeys.class(newGrade.classId || '') })
    },
  })
}

export function useUpdateGrade() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGradeData> }) =>
      gradesApi.updateGrade(id, data),
    onSuccess: (updatedGrade) => {
      queryClient.setQueryData(gradeKeys.detail(updatedGrade.id), updatedGrade)
      queryClient.invalidateQueries({ queryKey: gradeKeys.student(updatedGrade.studentId) })
      queryClient.invalidateQueries({ queryKey: gradeKeys.class(updatedGrade.classId || '') })
    },
  })
}

export function useDeleteGrade() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: gradesApi.deleteGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all })
    },
  })
}