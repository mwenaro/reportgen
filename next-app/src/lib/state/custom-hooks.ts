import { useMemo } from 'react'
import { useAppStore, Student, Teacher, Class, Subject, Exam, ExamResult } from './store'
import { UserRole } from '../auth/config'

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

export function useDashboardStats() {
  const students = useAppStore((state) => state.students)
  const teachers = useAppStore((state) => state.teachers)
  const classes = useAppStore((state) => state.classes)
  const exams = useAppStore((state) => state.exams)
  const currentUser = useAppStore((state) => state.currentUser)

  return useMemo(() => {
    const totalStudents = students.length
    const totalTeachers = teachers.length
    const totalClasses = classes.length
    const totalExams = exams.length

    // Get stats based on user role
    let userSpecificStats = {}
    
    if (currentUser?.role === UserRole.TEACHER) {
      const teacherClasses = classes.filter(c => c.teacherId === currentUser.id)
      const teacherStudents = students.filter(s => 
        teacherClasses.some(c => c.id === s.classId)
      )
      const teacherExams = exams.filter(e => e.teacherId === currentUser.id)
      
      userSpecificStats = {
        myClasses: teacherClasses.length,
        myStudents: teacherStudents.length,
        myExams: teacherExams.length,
      }
    }

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalExams,
      activeStudents: students.filter(s => s.isActive).length,
      activeTeachers: teachers.filter(t => t.isActive).length,
      activeClasses: classes.filter(c => c.isActive).length,
      publishedExams: exams.filter(e => e.isPublished).length,
      ...userSpecificStats,
    }
  }, [students, teachers, classes, exams, currentUser])
}

export function useRecentActivity() {
  const students = useAppStore((state) => state.students)
  const teachers = useAppStore((state) => state.teachers)
  const exams = useAppStore((state) => state.exams)
  const examResults = useAppStore((state) => state.examResults)

  return useMemo(() => {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentStudents = students.filter(s => s.createdAt > last7Days)
    const recentTeachers = teachers.filter(t => t.createdAt > last7Days)
    const recentExams = exams.filter(e => e.createdAt > last7Days)
    const recentResults = examResults.filter(r => r.createdAt > last7Days)

    return {
      newStudents: recentStudents.length,
      newTeachers: recentTeachers.length,
      newExams: recentExams.length,
      newResults: recentResults.length,
      recentItems: [
        ...recentStudents.map(s => ({ type: 'student', item: s, date: s.createdAt })),
        ...recentTeachers.map(t => ({ type: 'teacher', item: t, date: t.createdAt })),
        ...recentExams.map(e => ({ type: 'exam', item: e, date: e.createdAt })),
        ...recentResults.map(r => ({ type: 'result', item: r, date: r.createdAt })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)
    }
  }, [students, teachers, exams, examResults])
}

// ============================================================================
// CLASS MANAGEMENT HOOKS
// ============================================================================

export function useClassDetails(classId: string) {
  const classes = useAppStore((state) => state.classes)
  const students = useAppStore((state) => state.students)
  const teachers = useAppStore((state) => state.teachers)
  const subjects = useAppStore((state) => state.subjects)
  const exams = useAppStore((state) => state.exams)

  return useMemo(() => {
    const classData = classes.find(c => c.id === classId)
    if (!classData) return null

    const classStudents = students.filter(s => s.classId === classId)
    const classTeacher = teachers.find(t => t.id === classData.teacherId)
    const classSubjects = subjects.filter(s => s.classIds.includes(classId))
    const classExams = exams.filter(e => e.classId === classId)

    return {
      class: classData,
      students: classStudents,
      teacher: classTeacher,
      subjects: classSubjects,
      exams: classExams,
      studentCount: classStudents.length,
      subjectCount: classSubjects.length,
      examCount: classExams.length,
      averageAge: classStudents.length > 0 
        ? classStudents.reduce((sum, s) => {
            const age = new Date().getFullYear() - s.dateOfBirth.getFullYear()
            return sum + age
          }, 0) / classStudents.length
        : 0
    }
  }, [classId, classes, students, teachers, subjects, exams])
}

export function useStudentPerformance(studentId: string) {
  const students = useAppStore((state) => state.students)
  const examResults = useAppStore((state) => state.examResults)
  const exams = useAppStore((state) => state.exams)
  const subjects = useAppStore((state) => state.subjects)

  return useMemo(() => {
    const student = students.find(s => s.id === studentId)
    if (!student) return null

    const studentResults = examResults.filter(r => r.studentId === studentId)
    const studentExams = exams.filter(e => 
      studentResults.some(r => r.examId === e.id)
    )

    // Calculate performance metrics
    const totalMarks = studentResults.reduce((sum, r) => sum + r.marksObtained, 0)
    const totalPossibleMarks = studentResults.reduce((sum, r) => {
      const exam = exams.find(e => e.id === r.examId)
      return sum + (exam?.totalMarks || 0)
    }, 0)

    const overallPercentage = totalPossibleMarks > 0 
      ? (totalMarks / totalPossibleMarks) * 100 
      : 0

    // Performance by subject
    const subjectPerformance = subjects.map(subject => {
      const subjectExams = studentExams.filter(e => e.subjectId === subject.id)
      const subjectResults = studentResults.filter(r => 
        subjectExams.some(e => e.id === r.examId)
      )

      const subjectMarks = subjectResults.reduce((sum, r) => sum + r.marksObtained, 0)
      const subjectPossibleMarks = subjectResults.reduce((sum, r) => {
        const exam = exams.find(e => e.id === r.examId)
        return sum + (exam?.totalMarks || 0)
      }, 0)

      const subjectPercentage = subjectPossibleMarks > 0 
        ? (subjectMarks / subjectPossibleMarks) * 100 
        : 0

      return {
        subject,
        examCount: subjectExams.length,
        totalMarks: subjectMarks,
        totalPossibleMarks: subjectPossibleMarks,
        percentage: subjectPercentage,
        averageGrade: subjectResults.length > 0
          ? subjectResults.reduce((sum, r, _, arr) => {
              return sum + parseFloat(r.grade.replace(/[^\d.]/g, '')) / arr.length
            }, 0)
          : 0
      }
    })

    // Recent performance trend (last 5 exams)
    const recentResults = studentResults
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)

    return {
      student,
      examCount: studentResults.length,
      totalMarks,
      totalPossibleMarks,
      overallPercentage,
      averageGrade: studentResults.length > 0
        ? studentResults.reduce((sum, r, _, arr) => {
            return sum + parseFloat(r.grade.replace(/[^\d.]/g, '')) / arr.length
          }, 0)
        : 0,
      subjectPerformance,
      recentResults,
      attendanceRate: studentResults.length > 0
        ? ((studentResults.length - studentResults.filter(r => r.isAbsent).length) / studentResults.length) * 100
        : 0
    }
  }, [studentId, students, examResults, exams, subjects])
}

// ============================================================================
// EXAM MANAGEMENT HOOKS
// ============================================================================

export function useExamAnalytics(examId: string) {
  const exams = useAppStore((state) => state.exams)
  const examResults = useAppStore((state) => state.examResults)
  const students = useAppStore((state) => state.students)

  return useMemo(() => {
    const exam = exams.find(e => e.id === examId)
    if (!exam) return null

    const results = examResults.filter(r => r.examId === examId)
    const examStudents = students.filter(s => 
      results.some(r => r.studentId === s.id)
    )

    if (results.length === 0) {
      return {
        exam,
        studentCount: 0,
        submissionCount: 0,
        absentCount: 0,
        averageScore: 0,
        averagePercentage: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        gradeDistribution: {},
        results: [],
        students: []
      }
    }

    // Calculate statistics
    const submittedResults = results.filter(r => !r.isAbsent)
    const scores = submittedResults.map(r => r.marksObtained)
    const percentages = submittedResults.map(r => r.percentage)

    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0

    const averagePercentage = percentages.length > 0
      ? percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length
      : 0

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0

    const passedCount = results.filter(r => r.marksObtained >= exam.passingMarks).length
    const passRate = results.length > 0 ? (passedCount / results.length) * 100 : 0

    // Grade distribution
    const gradeDistribution = results.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      exam,
      studentCount: examStudents.length,
      submissionCount: submittedResults.length,
      absentCount: results.filter(r => r.isAbsent).length,
      averageScore,
      averagePercentage,
      highestScore,
      lowestScore,
      passRate,
      gradeDistribution,
      results: results.map(r => ({
        ...r,
        student: students.find(s => s.id === r.studentId)
      })),
      students: examStudents
    }
  }, [examId, exams, examResults, students])
}

export function useUpcomingExams(limit: number = 5) {
  const exams = useAppStore((state) => state.exams)
  const currentUser = useAppStore((state) => state.currentUser)

  return useMemo(() => {
    const now = new Date()
    let upcomingExams = exams.filter(e => e.examDate > now)

    // Filter by user role
    if (currentUser?.role === UserRole.TEACHER) {
      upcomingExams = upcomingExams.filter(e => e.teacherId === currentUser.id)
    } else if (currentUser?.role === UserRole.STUDENT) {
      // For students, filter by their class
      // This would require knowing which class the student is in
      // For now, we'll return all upcoming exams
    }

    return upcomingExams
      .sort((a, b) => a.examDate.getTime() - b.examDate.getTime())
      .slice(0, limit)
  }, [exams, currentUser, limit])
}

// ============================================================================
// SEARCH AND FILTER HOOKS
// ============================================================================

export function useFilteredStudents(filters: {
  search?: string
  classId?: string
  isActive?: boolean
  gender?: string
}) {
  const students = useAppStore((state) => state.students)
  const classes = useAppStore((state) => state.classes)

  return useMemo(() => {
    let filtered = students

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(s => 
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.studentId.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.classId) {
      filtered = filtered.filter(s => s.classId === filters.classId)
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(s => s.isActive === filters.isActive)
    }

    if (filters.gender) {
      filtered = filtered.filter(s => s.gender === filters.gender)
    }

    return filtered.map(student => ({
      ...student,
      className: classes.find(c => c.id === student.classId)?.name || 'Unknown'
    }))
  }, [students, classes, filters])
}

export function useFilteredExams(filters: {
  search?: string
  classId?: string
  subjectId?: string
  examType?: string
  isPublished?: boolean
  dateRange?: { start: Date; end: Date }
}) {
  const exams = useAppStore((state) => state.exams)
  const classes = useAppStore((state) => state.classes)
  const subjects = useAppStore((state) => state.subjects)
  const teachers = useAppStore((state) => state.teachers)

  return useMemo(() => {
    let filtered = exams

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.classId) {
      filtered = filtered.filter(e => e.classId === filters.classId)
    }

    if (filters.subjectId) {
      filtered = filtered.filter(e => e.subjectId === filters.subjectId)
    }

    if (filters.examType) {
      filtered = filtered.filter(e => e.examType === filters.examType)
    }

    if (filters.isPublished !== undefined) {
      filtered = filtered.filter(e => e.isPublished === filters.isPublished)
    }

    if (filters.dateRange) {
      filtered = filtered.filter(e => 
        e.examDate >= filters.dateRange!.start && 
        e.examDate <= filters.dateRange!.end
      )
    }

    return filtered.map(exam => ({
      ...exam,
      className: classes.find(c => c.id === exam.classId)?.name || 'Unknown',
      subjectName: subjects.find(s => s.id === exam.subjectId)?.name || 'Unknown',
      teacherName: teachers.find(t => t.id === exam.teacherId)?.firstName + ' ' + 
                   teachers.find(t => t.id === exam.teacherId)?.lastName || 'Unknown'
    }))
  }, [exams, classes, subjects, teachers, filters])
}

// ============================================================================
// PERMISSION-BASED HOOKS
// ============================================================================

export function useCanManageEntity(entityType: string, entityId?: string) {
  const currentUser = useAppStore((state) => state.currentUser)

  return useMemo(() => {
    if (!currentUser) return false

    // Super admin can manage everything
    if (currentUser.role === UserRole.SUPER_ADMIN) return true

    // School admin can manage everything in their school
    if (currentUser.role === UserRole.SCHOOL_ADMIN) return true

    // Deputy admin has similar permissions to school admin
    if (currentUser.role === UserRole.DEPUTY_ADMIN) return true

    // Head teacher can manage most things
    if (currentUser.role === UserRole.HEAD_TEACHER) {
      return ['students', 'classes', 'subjects', 'exams', 'results'].includes(entityType)
    }

    // Teachers can manage their own classes and exams
    if (currentUser.role === UserRole.TEACHER) {
      if (entityType === 'exams' || entityType === 'results') return true
      if (entityType === 'students') return true // Can manage students in their classes
      return false
    }

    return false
  }, [currentUser, entityType, entityId])
}

export function useUserAccessibleData() {
  const currentUser = useAppStore((state) => state.currentUser)
  const students = useAppStore((state) => state.students)
  const classes = useAppStore((state) => state.classes)
  const exams = useAppStore((state) => state.exams)
  const examResults = useAppStore((state) => state.examResults)

  return useMemo(() => {
    if (!currentUser) {
      return {
        students: [],
        classes: [],
        exams: [],
        examResults: []
      }
    }

    // Super admin and school admin see everything
    if ([UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER].includes(currentUser.role)) {
      return {
        students,
        classes,
        exams,
        examResults
      }
    }

    // Teachers see their classes and related data
    if (currentUser.role === UserRole.TEACHER) {
      const teacherClasses = classes.filter(c => c.teacherId === currentUser.id)
      const teacherClassIds = teacherClasses.map(c => c.id)
      const teacherStudents = students.filter(s => teacherClassIds.includes(s.classId))
      const teacherExams = exams.filter(e => e.teacherId === currentUser.id)
      const teacherExamIds = teacherExams.map(e => e.id)
      const teacherResults = examResults.filter(r => teacherExamIds.includes(r.examId))

      return {
        students: teacherStudents,
        classes: teacherClasses,
        exams: teacherExams,
        examResults: teacherResults
      }
    }

    // Students see only their own data
    if (currentUser.role === UserRole.STUDENT) {
      const student = students.find(s => s.email === currentUser.email)
      if (!student) return { students: [], classes: [], exams: [], examResults: [] }

      const studentClass = classes.find(c => c.id === student.classId)
      const studentExams = exams.filter(e => e.classId === student.classId)
      const studentResults = examResults.filter(r => r.studentId === student.id)

      return {
        students: [student],
        classes: studentClass ? [studentClass] : [],
        exams: studentExams,
        examResults: studentResults
      }
    }

    // Parents see their children's data
    if (currentUser.role === UserRole.PARENT) {
      const childStudents = students.filter(s => s.parentIds.includes(currentUser.id))
      const childClassIds = childStudents.map(s => s.classId)
      const childClasses = classes.filter(c => childClassIds.includes(c.id))
      const childExams = exams.filter(e => childClassIds.includes(e.classId))
      const childResults = examResults.filter(r => 
        childStudents.some(s => s.id === r.studentId)
      )

      return {
        students: childStudents,
        classes: childClasses,
        exams: childExams,
        examResults: childResults
      }
    }

    return {
      students: [],
      classes: [],
      exams: [],
      examResults: []
    }
  }, [currentUser, students, classes, exams, examResults])
}