import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Teacher, CreateTeacherData, TeacherFilters } from '@/lib/types'

// Mock API functions
const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    employeeId: 'EMP001',
    name: 'John Mwangi',
    email: 'john.mwangi@school.com',
    phone: '+254712345678',
    gender: 'male',
    dateOfBirth: new Date('1985-03-15'),
    address: 'Nairobi, Kenya',
    qualification: 'Bachelor of Education (Mathematics)',
    experience: '8 years',
    specialization: 'Secondary Mathematics',
    hireDate: new Date('2018-01-15'),
    contractType: 'permanent',
    status: 'active',
    salary: 45000,
    subjects: ['math', 'physics'],
    classes: ['form-1-a', 'form-2-b'],
    tscNumber: 'TSC123456',
    idNumber: '12345678',
    emergencyContact: {
      name: 'Mary Mwangi',
      phone: '+254723456789',
      relationship: 'Spouse'
    },
    notes: 'Excellent teacher with strong mathematics background',
    profileImage: '/images/teachers/john-mwangi.jpg',
    createdAt: new Date('2018-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'teacher-2',
    employeeId: 'EMP002',
    name: 'Sarah Wanjiku',
    email: 'sarah.wanjiku@school.com',
    phone: '+254734567890',
    gender: 'female',
    dateOfBirth: new Date('1987-07-22'),
    address: 'Kiambu, Kenya',
    qualification: 'Master of Arts (English Literature)',
    experience: '6 years',
    specialization: 'English Language and Literature',
    hireDate: new Date('2019-09-01'),
    contractType: 'permanent',
    status: 'active',
    salary: 42000,
    subjects: ['english', 'literature'],
    classes: ['form-3-a', 'form-4-b'],
    tscNumber: 'TSC234567',
    idNumber: '23456789',
    emergencyContact: {
      name: 'Peter Wanjiku',
      phone: '+254745678901',
      relationship: 'Brother'
    },
    notes: 'Passionate about literature and creative writing',
    profileImage: '/images/teachers/sarah-wanjiku.jpg',
    createdAt: new Date('2019-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'teacher-3',
    employeeId: 'EMP003',
    name: 'David Kimani',
    email: 'david.kimani@school.com',
    phone: '+254756789012',
    gender: 'male',
    dateOfBirth: new Date('1983-11-10'),
    address: 'Thika, Kenya',
    qualification: 'Bachelor of Science (Chemistry)',
    experience: '10 years',
    specialization: 'Chemistry and Biology',
    hireDate: new Date('2016-03-01'),
    contractType: 'permanent',
    status: 'active',
    salary: 48000,
    subjects: ['chemistry', 'biology'],
    classes: ['form-2-a', 'form-3-b'],
    tscNumber: 'TSC345678',
    idNumber: '34567890',
    emergencyContact: {
      name: 'Grace Kimani',
      phone: '+254767890123',
      relationship: 'Wife'
    },
    notes: 'Head of Science Department',
    profileImage: '/images/teachers/david-kimani.jpg',
    createdAt: new Date('2016-03-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'teacher-4',
    employeeId: 'EMP004',
    name: 'Grace Nyokabi',
    email: 'grace.nyokabi@school.com',
    phone: '+254778901234',
    gender: 'female',
    dateOfBirth: new Date('1989-05-18'),
    address: 'Nakuru, Kenya',
    qualification: 'Bachelor of Arts (History and Government)',
    experience: '4 years',
    specialization: 'History and Social Studies',
    hireDate: new Date('2021-02-15'),
    contractType: 'contract',
    status: 'active',
    salary: 38000,
    subjects: ['history', 'cre'],
    classes: ['form-1-b', 'form-2-c'],
    tscNumber: 'TSC456789',
    idNumber: '45678901',
    emergencyContact: {
      name: 'James Nyokabi',
      phone: '+254789012345',
      relationship: 'Father'
    },
    notes: 'Young and enthusiastic teacher',
    createdAt: new Date('2021-02-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'teacher-5',
    employeeId: 'EMP005',
    name: 'Michael Ochieng',
    email: 'michael.ochieng@school.com',
    phone: '+254790123456',
    gender: 'male',
    dateOfBirth: new Date('1980-12-05'),
    address: 'Kisumu, Kenya',
    qualification: 'Bachelor of Education (Physical Education)',
    experience: '12 years',
    specialization: 'Physical Education and Sports',
    hireDate: new Date('2014-07-01'),
    contractType: 'permanent',
    status: 'active',
    salary: 50000,
    subjects: ['pe', 'games'],
    classes: ['form-1-a', 'form-1-b', 'form-2-a', 'form-2-b'],
    tscNumber: 'TSC567890',
    idNumber: '56789012',
    emergencyContact: {
      name: 'Betty Ochieng',
      phone: '+254701234567',
      relationship: 'Wife'
    },
    notes: 'Head of Sports Department and games teacher',
    profileImage: '/images/teachers/michael-ochieng.jpg',
    createdAt: new Date('2014-07-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'teacher-6',
    employeeId: 'EMP006',
    name: 'Lucy Muthoni',
    email: 'lucy.muthoni@school.com',
    phone: '+254712345679',
    gender: 'female',
    dateOfBirth: new Date('1984-08-30'),
    address: 'Nyeri, Kenya',
    qualification: 'Bachelor of Education (Kiswahili)',
    experience: '9 years',
    specialization: 'Kiswahili Language',
    hireDate: new Date('2017-05-01'),
    contractType: 'permanent',
    status: 'on-leave',
    salary: 44000,
    subjects: ['kiswahili'],
    classes: ['form-1-a', 'form-2-a', 'form-3-a', 'form-4-a'],
    tscNumber: 'TSC678901',
    idNumber: '67890123',
    emergencyContact: {
      name: 'Paul Muthoni',
      phone: '+254723456780',
      relationship: 'Husband'
    },
    notes: 'Currently on maternity leave',
    profileImage: '/images/teachers/lucy-muthoni.jpg',
    createdAt: new Date('2017-05-01'),
    updatedAt: new Date('2024-01-15')
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const teachersApi = {
  // Get teachers with filters
  getTeachers: async (filters?: TeacherFilters): Promise<Teacher[]> => {
    await delay(500)
    let filteredTeachers = [...mockTeachers]

    if (filters?.status) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.status === filters.status)
    }

    if (filters?.gender) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.gender === filters.gender)
    }

    if (filters?.contractType) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.contractType === filters.contractType)
    }

    if (filters?.subjects && filters.subjects.length > 0) {
      filteredTeachers = filteredTeachers.filter(teacher =>
        teacher.subjects?.some(subjectId => filters.subjects!.includes(subjectId))
      )
    }

    if (filters?.hireDateFrom) {
      const fromDate = new Date(filters.hireDateFrom)
      filteredTeachers = filteredTeachers.filter(teacher => teacher.hireDate >= fromDate)
    }

    if (filters?.hireDateTo) {
      const toDate = new Date(filters.hireDateTo)
      filteredTeachers = filteredTeachers.filter(teacher => teacher.hireDate <= toDate)
    }

    if (filters?.qualification) {
      filteredTeachers = filteredTeachers.filter(teacher =>
        teacher.qualification?.toLowerCase().includes(filters.qualification!.toLowerCase())
      )
    }

    if (filters?.minSalary) {
      filteredTeachers = filteredTeachers.filter(teacher => 
        teacher.salary && teacher.salary >= filters.minSalary!
      )
    }

    if (filters?.maxSalary) {
      filteredTeachers = filteredTeachers.filter(teacher => 
        teacher.salary && teacher.salary <= filters.maxSalary!
      )
    }

    if (filters?.experienceRange) {
      filteredTeachers = filteredTeachers.filter(teacher => {
        const experience = teacher.experience || '0'
        const years = parseInt(experience.match(/\d+/)?.[0] || '0')
        
        switch (filters.experienceRange) {
          case '0-2':
            return years >= 0 && years <= 2
          case '3-5':
            return years >= 3 && years <= 5
          case '6-10':
            return years >= 6 && years <= 10
          case '10+':
            return years >= 10
          default:
            return true
        }
      })
    }

    return filteredTeachers
  },

  // Get teacher by ID
  getTeacher: async (id: string): Promise<Teacher | null> => {
    await delay(300)
    return mockTeachers.find(teacher => teacher.id === id) || null
  },

  // Create teacher
  createTeacher: async (data: CreateTeacherData): Promise<Teacher> => {
    await delay(800)
    const newTeacher: Teacher = {
      ...data,
      id: `teacher-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockTeachers.unshift(newTeacher)
    return newTeacher
  },

  // Update teacher
  updateTeacher: async (id: string, data: Partial<CreateTeacherData>): Promise<Teacher> => {
    await delay(600)
    const index = mockTeachers.findIndex(teacher => teacher.id === id)
    if (index === -1) throw new Error('Teacher not found')
    
    mockTeachers[index] = {
      ...mockTeachers[index],
      ...data,
      updatedAt: new Date(),
    }
    return mockTeachers[index]
  },

  // Delete teacher
  deleteTeacher: async (id: string): Promise<void> => {
    await delay(500)
    const index = mockTeachers.findIndex(teacher => teacher.id === id)
    if (index === -1) throw new Error('Teacher not found')
    mockTeachers.splice(index, 1)
  },

  // Bulk operations
  bulkUpdateTeachers: async (ids: string[], data: Partial<Teacher>): Promise<Teacher[]> => {
    await delay(1000)
    const updatedTeachers: Teacher[] = []
    
    ids.forEach(id => {
      const index = mockTeachers.findIndex(teacher => teacher.id === id)
      if (index !== -1) {
        mockTeachers[index] = {
          ...mockTeachers[index],
          ...data,
          updatedAt: new Date(),
        }
        updatedTeachers.push(mockTeachers[index])
      }
    })
    
    return updatedTeachers
  },

  bulkDeleteTeachers: async (ids: string[]): Promise<void> => {
    await delay(800)
    ids.forEach(id => {
      const index = mockTeachers.findIndex(teacher => teacher.id === id)
      if (index !== -1) {
        mockTeachers.splice(index, 1)
      }
    })
  }
}

// Query keys
export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters: TeacherFilters) => [...teacherKeys.lists(), filters] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
}

// React Query hooks
export function useTeachers(filters: TeacherFilters = {}) {
  return useQuery({
    queryKey: teacherKeys.list(filters),
    queryFn: () => teachersApi.getTeachers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => teachersApi.getTeacher(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: teachersApi.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTeacherData> }) =>
      teachersApi.updateTeacher(id, data),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
      queryClient.setQueryData(teacherKeys.detail(teacher.id), teacher)
    },
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: teachersApi.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
    },
  })
}

export function useBulkUpdateTeachers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<Teacher> }) =>
      teachersApi.bulkUpdateTeachers(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
    },
  })
}

export function useBulkDeleteTeachers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: teachersApi.bulkDeleteTeachers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
    },
  })
}