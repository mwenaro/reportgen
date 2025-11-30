import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, queryKeys, useOfflineQuery, useOfflineMutation } from './query-client'
import { useAppStore, Student, Teacher, Class, Subject, Exam, ExamResult, School } from './store'
import { getOfflineAuth } from '../auth/hybrid-auth'

// ============================================================================
// STUDENT HOOKS
// ============================================================================

export function useStudents() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const students = useAppStore((state) => state.students)
  
  return useOfflineQuery(
    queryKeys.studentsBySchool(currentSchool?.id || ''),
    () => apiClient.get<Student[]>(`/students?schoolId=${currentSchool?.id}`),
    {
      enabled: !!currentSchool?.id,
      offlineData: async () => students,
    }
  )
}

export function useStudent(id: string) {
  const students = useAppStore((state) => state.students)
  
  return useOfflineQuery(
    queryKeys.student(id),
    () => apiClient.get<Student>(`/students/${id}`),
    {
      enabled: !!id,
      offlineData: async () => students.find(s => s.id === id) || null,
    }
  )
}

export function useStudentsByClass(classId: string) {
  const students = useAppStore((state) => state.students)
  
  return useOfflineQuery(
    queryKeys.studentsByClass(classId),
    () => apiClient.get<Student[]>(`/students?classId=${classId}`),
    {
      enabled: !!classId,
      offlineData: async () => students.filter(s => s.classId === classId),
    }
  )
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  const addStudent = useAppStore((state) => state.addStudent)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineMutation(
    (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<Student>('/students', data),
    {
      onSuccess: (newStudent) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        if (currentSchool?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.studentsBySchool(currentSchool.id) })
        }
        addStudent(newStudent)
      },
      offlineHandler: async (data) => {
        const student: Student = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addStudent(student)
        return student
      }
    }
  )
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  const updateStudent = useAppStore((state) => state.updateStudent)
  
  return useOfflineMutation(
    ({ id, data }: { id: string; data: Partial<Student> }) =>
      apiClient.put<Student>(`/students/${id}`, data),
    {
      onSuccess: (updatedStudent) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.student(updatedStudent.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        updateStudent(updatedStudent.id, updatedStudent)
      },
      offlineHandler: async ({ id, data }) => {
        const updates = { ...data, updatedAt: new Date() }
        updateStudent(id, updates)
        return updates as Student
      }
    }
  )
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  const removeStudent = useAppStore((state) => state.removeStudent)
  
  return useOfflineMutation(
    (id: string) => apiClient.delete(`/students/${id}`),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        removeStudent(id)
      },
      offlineHandler: async (id) => {
        removeStudent(id)
        return undefined
      }
    }
  )
}

// ============================================================================
// TEACHER HOOKS
// ============================================================================

export function useTeachers() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const teachers = useAppStore((state) => state.teachers)
  
  return useOfflineQuery(
    queryKeys.teachersBySchool(currentSchool?.id || ''),
    () => apiClient.get<Teacher[]>(`/teachers?schoolId=${currentSchool?.id}`),
    {
      enabled: !!currentSchool?.id,
      offlineData: async () => teachers,
    }
  )
}

export function useTeacher(id: string) {
  const teachers = useAppStore((state) => state.teachers)
  
  return useOfflineQuery(
    queryKeys.teacher(id),
    () => apiClient.get<Teacher>(`/teachers/${id}`),
    {
      enabled: !!id,
      offlineData: async () => teachers.find(t => t.id === id) || null,
    }
  )
}

export function useTeachersBySubject(subjectId: string) {
  const teachers = useAppStore((state) => state.teachers)
  
  return useOfflineQuery(
    queryKeys.teachersBySubject(subjectId),
    () => apiClient.get<Teacher[]>(`/teachers?subjectId=${subjectId}`),
    {
      enabled: !!subjectId,
      offlineData: async () => teachers.filter(t => t.subjects.includes(subjectId)),
    }
  )
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  const addTeacher = useAppStore((state) => state.addTeacher)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineMutation(
    (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<Teacher>('/teachers', data),
    {
      onSuccess: (newTeacher) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
        if (currentSchool?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.teachersBySchool(currentSchool.id) })
        }
        addTeacher(newTeacher)
      },
      offlineHandler: async (data) => {
        const teacher: Teacher = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addTeacher(teacher)
        return teacher
      }
    }
  )
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  const updateTeacher = useAppStore((state) => state.updateTeacher)
  
  return useOfflineMutation(
    ({ id, data }: { id: string; data: Partial<Teacher> }) =>
      apiClient.put<Teacher>(`/teachers/${id}`, data),
    {
      onSuccess: (updatedTeacher) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.teacher(updatedTeacher.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
        updateTeacher(updatedTeacher.id, updatedTeacher)
      },
      offlineHandler: async ({ id, data }) => {
        const updates = { ...data, updatedAt: new Date() }
        updateTeacher(id, updates)
        return updates as Teacher
      }
    }
  )
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()
  const removeTeacher = useAppStore((state) => state.removeTeacher)
  
  return useOfflineMutation(
    (id: string) => apiClient.delete(`/teachers/${id}`),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
        removeTeacher(id)
      },
      offlineHandler: async (id) => {
        removeTeacher(id)
        return undefined
      }
    }
  )
}

// ============================================================================
// CLASS HOOKS
// ============================================================================

export function useClasses() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const classes = useAppStore((state) => state.classes)
  
  return useOfflineQuery(
    queryKeys.classesBySchool(currentSchool?.id || ''),
    () => apiClient.get<Class[]>(`/classes?schoolId=${currentSchool?.id}`),
    {
      enabled: !!currentSchool?.id,
      offlineData: async () => classes,
    }
  )
}

export function useClass(id: string) {
  const classes = useAppStore((state) => state.classes)
  
  return useOfflineQuery(
    queryKeys.class(id),
    () => apiClient.get<Class>(`/classes/${id}`),
    {
      enabled: !!id,
      offlineData: async () => classes.find(c => c.id === id) || null,
    }
  )
}

export function useClassesByTeacher(teacherId: string) {
  const classes = useAppStore((state) => state.classes)
  
  return useOfflineQuery(
    queryKeys.classesByTeacher(teacherId),
    () => apiClient.get<Class[]>(`/classes?teacherId=${teacherId}`),
    {
      enabled: !!teacherId,
      offlineData: async () => classes.filter(c => c.teacherId === teacherId),
    }
  )
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  const addClass = useAppStore((state) => state.addClass)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineMutation(
    (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<Class>('/classes', data),
    {
      onSuccess: (newClass) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.classes })
        if (currentSchool?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.classesBySchool(currentSchool.id) })
        }
        addClass(newClass)
      },
      offlineHandler: async (data) => {
        const classData: Class = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addClass(classData)
        return classData
      }
    }
  )
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  const updateClass = useAppStore((state) => state.updateClass)
  
  return useOfflineMutation(
    ({ id, data }: { id: string; data: Partial<Class> }) =>
      apiClient.put<Class>(`/classes/${id}`, data),
    {
      onSuccess: (updatedClass) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.class(updatedClass.id) })
        queryClient.invalidateQueries({ queryKey: queryKeys.classes })
        updateClass(updatedClass.id, updatedClass)
      },
      offlineHandler: async ({ id, data }) => {
        const updates = { ...data, updatedAt: new Date() }
        updateClass(id, updates)
        return updates as Class
      }
    }
  )
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  const removeClass = useAppStore((state) => state.removeClass)
  
  return useOfflineMutation(
    (id: string) => apiClient.delete(`/classes/${id}`),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.classes })
        removeClass(id)
      },
      offlineHandler: async (id) => {
        removeClass(id)
        return undefined
      }
    }
  )
}

// ============================================================================
// SUBJECT HOOKS
// ============================================================================

export function useSubjects() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const subjects = useAppStore((state) => state.subjects)
  
  return useOfflineQuery(
    queryKeys.subjectsBySchool(currentSchool?.id || ''),
    () => apiClient.get<Subject[]>(`/subjects?schoolId=${currentSchool?.id}`),
    {
      enabled: !!currentSchool?.id,
      offlineData: async () => subjects,
    }
  )
}

export function useSubject(id: string) {
  const subjects = useAppStore((state) => state.subjects)
  
  return useOfflineQuery(
    queryKeys.subject(id),
    () => apiClient.get<Subject>(`/subjects/${id}`),
    {
      enabled: !!id,
      offlineData: async () => subjects.find(s => s.id === id) || null,
    }
  )
}

export function useSubjectsByClass(classId: string) {
  const subjects = useAppStore((state) => state.subjects)
  
  return useOfflineQuery(
    queryKeys.subjectsByClass(classId),
    () => apiClient.get<Subject[]>(`/subjects?classId=${classId}`),
    {
      enabled: !!classId,
      offlineData: async () => subjects.filter(s => s.classIds.includes(classId)),
    }
  )
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  const addSubject = useAppStore((state) => state.addSubject)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineMutation(
    (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<Subject>('/subjects', data),
    {
      onSuccess: (newSubject) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.subjects })
        if (currentSchool?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.subjectsBySchool(currentSchool.id) })
        }
        addSubject(newSubject)
      },
      offlineHandler: async (data) => {
        const subject: Subject = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addSubject(subject)
        return subject
      }
    }
  )
}

// ============================================================================
// EXAM HOOKS
// ============================================================================

export function useExams() {
  const currentSchool = useAppStore((state) => state.currentSchool)
  const exams = useAppStore((state) => state.exams)
  
  return useOfflineQuery(
    queryKeys.examsBySchool(currentSchool?.id || ''),
    () => apiClient.get<Exam[]>(`/exams?schoolId=${currentSchool?.id}`),
    {
      enabled: !!currentSchool?.id,
      offlineData: async () => exams,
    }
  )
}

export function useExam(id: string) {
  const exams = useAppStore((state) => state.exams)
  
  return useOfflineQuery(
    queryKeys.exam(id),
    () => apiClient.get<Exam>(`/exams/${id}`),
    {
      enabled: !!id,
      offlineData: async () => exams.find(e => e.id === id) || null,
    }
  )
}

export function useExamsByClass(classId: string) {
  const exams = useAppStore((state) => state.exams)
  
  return useOfflineQuery(
    queryKeys.examsByClass(classId),
    () => apiClient.get<Exam[]>(`/exams?classId=${classId}`),
    {
      enabled: !!classId,
      offlineData: async () => exams.filter(e => e.classId === classId),
    }
  )
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  const addExam = useAppStore((state) => state.addExam)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineMutation(
    (data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<Exam>('/exams', data),
    {
      onSuccess: (newExam) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.exams })
        if (currentSchool?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.examsBySchool(currentSchool.id) })
        }
        addExam(newExam)
      },
      offlineHandler: async (data) => {
        const exam: Exam = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addExam(exam)
        return exam
      }
    }
  )
}

// ============================================================================
// EXAM RESULTS HOOKS
// ============================================================================

export function useExamResults() {
  const examResults = useAppStore((state) => state.examResults)
  
  return useOfflineQuery(
    queryKeys.examResults,
    () => apiClient.get<ExamResult[]>('/exam-results'),
    {
      offlineData: async () => examResults,
    }
  )
}

export function useExamResultsByExam(examId: string) {
  const examResults = useAppStore((state) => state.examResults)
  
  return useOfflineQuery(
    queryKeys.examResultsByExam(examId),
    () => apiClient.get<ExamResult[]>(`/exam-results?examId=${examId}`),
    {
      enabled: !!examId,
      offlineData: async () => examResults.filter(r => r.examId === examId),
    }
  )
}

export function useExamResultsByStudent(studentId: string) {
  const examResults = useAppStore((state) => state.examResults)
  
  return useOfflineQuery(
    queryKeys.examResultsByStudent(studentId),
    () => apiClient.get<ExamResult[]>(`/exam-results?studentId=${studentId}`),
    {
      enabled: !!studentId,
      offlineData: async () => examResults.filter(r => r.studentId === studentId),
    }
  )
}

export function useCreateExamResult() {
  const queryClient = useQueryClient()
  const addExamResult = useAppStore((state) => state.addExamResult)
  
  return useOfflineMutation(
    (data: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiClient.post<ExamResult>('/exam-results', data),
    {
      onSuccess: (newResult) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.examResults })
        queryClient.invalidateQueries({ queryKey: queryKeys.examResultsByExam(newResult.examId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.examResultsByStudent(newResult.studentId) })
        addExamResult(newResult)
      },
      offlineHandler: async (data) => {
        const result: ExamResult = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        addExamResult(result)
        return result
      }
    }
  )
}

// ============================================================================
// SCHOOL HOOKS
// ============================================================================

export function useCurrentSchool() {
  const currentUser = useAppStore((state) => state.currentUser)
  const currentSchool = useAppStore((state) => state.currentSchool)
  
  return useOfflineQuery(
    queryKeys.currentSchool,
    () => apiClient.get<School>(`/schools/${currentUser?.schoolId}`),
    {
      enabled: !!currentUser?.schoolId,
      offlineData: async () => currentSchool,
    }
  )
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: queryKeys.school(id),
    queryFn: () => apiClient.get<School>(`/schools/${id}`),
    enabled: !!id,
  })
}

// ============================================================================
// REPORT HOOKS
// ============================================================================

export function useStudentReport(studentId: string) {
  return useQuery({
    queryKey: queryKeys.studentReport(studentId),
    queryFn: () => apiClient.get(`/reports/student/${studentId}`),
    enabled: !!studentId,
  })
}

export function useClassReport(classId: string) {
  return useQuery({
    queryKey: queryKeys.classReport(classId),
    queryFn: () => apiClient.get(`/reports/class/${classId}`),
    enabled: !!classId,
  })
}

export function useExamReport(examId: string) {
  return useQuery({
    queryKey: queryKeys.examReport(examId),
    queryFn: () => apiClient.get(`/reports/exam/${examId}`),
    enabled: !!examId,
  })
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export function useBulkCreateStudents() {
  const queryClient = useQueryClient()
  const setStudents = useAppStore((state) => state.setStudents)
  const students = useAppStore((state) => state.students)
  
  return useOfflineMutation(
    (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]) =>
      apiClient.post<Student[]>('/students/bulk', { students: data }),
    {
      onSuccess: (newStudents) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        setStudents([...students, ...newStudents])
      },
      offlineHandler: async (data) => {
        const newStudents: Student[] = data.map(student => ({
          ...student,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        setStudents([...students, ...newStudents])
        return newStudents
      }
    }
  )
}

export function useBulkUpdateExamResults() {
  const queryClient = useQueryClient()
  const setExamResults = useAppStore((state) => state.setExamResults)
  const examResults = useAppStore((state) => state.examResults)
  
  return useOfflineMutation(
    (data: { examId: string; results: Partial<ExamResult>[] }) =>
      apiClient.put<ExamResult[]>(`/exam-results/bulk`, data),
    {
      onSuccess: (updatedResults, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.examResults })
        queryClient.invalidateQueries({ queryKey: queryKeys.examResultsByExam(variables.examId) })
        
        // Update local state
        const updatedExamResults = examResults.map(result => {
          const update = updatedResults.find(r => r.id === result.id)
          return update ? { ...result, ...update } : result
        })
        setExamResults(updatedExamResults)
      },
      offlineHandler: async ({ examId, results }) => {
        // Optimistically update local state
        const updatedResults: ExamResult[] = results.map(result => ({
          id: result.id || crypto.randomUUID(),
          examId,
          studentId: result.studentId || '',
          marksObtained: result.marksObtained || 0,
          grade: result.grade || '',
          percentage: result.percentage || 0,
          remarks: result.remarks,
          isAbsent: result.isAbsent || false,
          submittedAt: result.submittedAt,
          gradedAt: new Date(),
          gradedBy: result.gradedBy || '',
          schoolId: result.schoolId || '',
          createdAt: result.createdAt || new Date(),
          updatedAt: new Date(),
        }))
        
        const updatedExamResults = examResults.map(result => {
          const update = updatedResults.find(r => r.id === result.id)
          return update ? { ...result, ...update } : result
        })
        
        setExamResults(updatedExamResults)
        return updatedResults
      }
    }
  )
}