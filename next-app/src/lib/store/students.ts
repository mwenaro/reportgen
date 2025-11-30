import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Student, StudentFilters, CreateStudentData } from '@/lib/types'

// API functions (these would connect to your backend)
const studentsApi = {
  getStudents: async (filters: StudentFilters = {}): Promise<Student[]> => {
    // Mock data - replace with actual API call
    const mockStudents: Student[] = [
      {
        id: '1',
        schoolId: 'school1',
        admissionNumber: 'STD/2024/001',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+254700000001',
        dateOfBirth: new Date('2010-05-15'),
        gender: 'male',
        classId: 'class1',
        className: 'Form 1A',
        kcpeMarks: 350,
        status: 'active',
        enrollmentDate: new Date('2024-01-15'),
        address: {
          street: '123 Main Street',
          city: 'Nairobi',
          county: 'Nairobi',
          postalCode: '00100',
        },
        guardian: {
          name: 'Jane Doe',
          relationship: 'mother',
          phone: '+254700000002',
          email: 'jane.doe@email.com',
          occupation: 'Teacher',
        },
        profileImage: undefined,
        medicalInfo: 'No known allergies',
        notes: 'Excellent student with good behavior',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        schoolId: 'school1',
        admissionNumber: 'STD/2024/002',
        name: 'Mary Smith',
        email: 'mary.smith@email.com',
        phone: '+254700000003',
        dateOfBirth: new Date('2009-08-22'),
        gender: 'female',
        classId: 'class2',
        className: 'Form 2B',
        kcpeMarks: 380,
        status: 'active',
        enrollmentDate: new Date('2024-01-20'),
        address: {
          street: '456 Oak Avenue',
          city: 'Mombasa',
          county: 'Mombasa',
          postalCode: '80100',
        },
        guardian: {
          name: 'Peter Smith',
          relationship: 'father',
          phone: '+254700000004',
          email: 'peter.smith@email.com',
          occupation: 'Engineer',
        },
        profileImage: undefined,
        medicalInfo: 'Asthma - requires inhaler',
        notes: 'Top performer in mathematics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        schoolId: 'school1',
        admissionNumber: 'STD/2024/003',
        name: 'David Wilson',
        email: undefined,
        phone: undefined,
        dateOfBirth: new Date('2011-03-10'),
        gender: 'male',
        classId: 'class1',
        className: 'Form 1A',
        kcpeMarks: 320,
        status: 'active',
        enrollmentDate: new Date('2024-02-01'),
        address: {
          street: '789 Pine Road',
          city: 'Kisumu',
          county: 'Kisumu',
          postalCode: '40100',
        },
        guardian: {
          name: 'Sarah Wilson',
          relationship: 'mother',
          phone: '+254700000005',
          email: undefined,
          occupation: 'Farmer',
        },
        profileImage: undefined,
        medicalInfo: undefined,
        notes: 'Needs extra support in English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Apply filters
    return mockStudents.filter(student => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!student.name.toLowerCase().includes(searchLower) &&
            !student.admissionNumber.toLowerCase().includes(searchLower) &&
            !student.email?.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      if (filters.classId && student.classId !== filters.classId) return false
      if (filters.status && student.status !== filters.status) return false
      if (filters.gender && student.gender !== filters.gender) return false

      if (filters.kcpeMarksMin && (!student.kcpeMarks || student.kcpeMarks < filters.kcpeMarksMin)) return false
      if (filters.kcpeMarksMax && (!student.kcpeMarks || student.kcpeMarks > filters.kcpeMarksMax)) return false

      if (filters.ageMin || filters.ageMax) {
        const age = new Date().getFullYear() - student.dateOfBirth.getFullYear()
        if (filters.ageMin && age < filters.ageMin) return false
        if (filters.ageMax && age > filters.ageMax) return false
      }

      if (filters.hasEmail && !student.email) return false
      if (filters.hasPhone && !student.phone) return false

      if (filters.guardianRelationship && student.guardian?.relationship !== filters.guardianRelationship) return false

      return true
    })
  },

  getStudent: async (id: string): Promise<Student | null> => {
    const students = await studentsApi.getStudents()
    return students.find(s => s.id === id) || null
  },

  createStudent: async (data: CreateStudentData): Promise<Student> => {
    // Mock implementation - replace with actual API call
    const newStudent: Student = {
      id: Math.random().toString(36).substring(2, 15),
      schoolId: 'school1',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return newStudent
  },

  updateStudent: async (id: string, data: Partial<CreateStudentData>): Promise<Student> => {
    // Mock implementation - replace with actual API call
    const student = await studentsApi.getStudent(id)
    if (!student) throw new Error('Student not found')
    
    return {
      ...student,
      ...data,
      updatedAt: new Date(),
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    // Mock implementation - replace with actual API call
    console.log('Deleting student:', id)
  },

  bulkCreateStudents: async (students: CreateStudentData[]): Promise<Student[]> => {
    // Mock implementation - replace with actual API call
    return students.map((data, index) => ({
      id: Math.random().toString(36).substring(2, 15),
      schoolId: 'school1',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  },

  bulkDeleteStudents: async (ids: string[]): Promise<void> => {
    // Mock implementation - replace with actual API call
    console.log('Bulk deleting students:', ids)
  },
}

// Query keys
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
}

// Hooks
export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsApi.getStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsApi.getStudent(id),
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: studentsApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStudentData> }) =>
      studentsApi.updateStudent(id, data),
    onSuccess: (updatedStudent) => {
      queryClient.setQueryData(
        studentKeys.detail(updatedStudent.id),
        updatedStudent
      )
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: studentKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useBulkCreateStudents() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: studentsApi.bulkCreateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useBulkDeleteStudents() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: studentsApi.bulkDeleteStudents,
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: studentKeys.detail(id) })
      })
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}