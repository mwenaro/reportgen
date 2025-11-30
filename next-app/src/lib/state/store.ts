import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'
import { getHybridAuth, AuthState } from '../auth/hybrid-auth'
import { UserRole } from '../auth/config'

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  schoolId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface School {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  principalId?: string
  isActive: boolean
  settings: SchoolSettings
  createdAt: Date
  updatedAt: Date
}

export interface SchoolSettings {
  academicYear: string
  terms: Term[]
  gradingSystem: GradingSystem
  currency: string
  timezone: string
  dateFormat: string
  theme: ThemeSettings
}

export interface Term {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
}

export interface GradingSystem {
  type: 'percentage' | 'letter' | 'points'
  scale: GradeScale[]
  passingGrade: number
}

export interface GradeScale {
  min: number
  max: number
  letter: string
  description: string
  gpa: number
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  logo?: string
  favicon?: string
  darkMode: boolean
}

export interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  classId: string
  parentIds: string[]
  address: string
  phone: string
  email?: string
  enrollmentDate: Date
  isActive: boolean
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface Teacher {
  id: string
  employeeId: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjects: string[]
  classIds: string[]
  hireDate: Date
  isActive: boolean
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface Class {
  id: string
  name: string
  level: number
  section: string
  teacherId: string
  studentIds: string[]
  subjects: Subject[]
  academicYear: string
  isActive: boolean
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  name: string
  code: string
  description: string
  teacherId: string
  classIds: string[]
  isActive: boolean
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface Exam {
  id: string
  title: string
  description: string
  subjectId: string
  classId: string
  teacherId: string
  examDate: Date
  duration: number // minutes
  totalMarks: number
  passingMarks: number
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'practical'
  isPublished: boolean
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

export interface ExamResult {
  id: string
  examId: string
  studentId: string
  marksObtained: number
  grade: string
  percentage: number
  remarks?: string
  isAbsent: boolean
  submittedAt?: Date
  gradedAt?: Date
  gradedBy: string
  schoolId: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// GLOBAL APP STATE
// ============================================================================

export interface AppState {
  // UI State
  isLoading: boolean
  isSidebarOpen: boolean
  activeTab: string
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Auth State
  auth: AuthState | null
  currentUser: User | null
  currentSchool: School | null
  
  // Data State
  students: Student[]
  teachers: Teacher[]
  classes: Class[]
  subjects: Subject[]
  exams: Exam[]
  examResults: ExamResult[]
  
  // Offline State
  isOffline: boolean
  syncQueue: SyncOperation[]
  lastSync: Date | null
  
  // Cache State
  cache: Record<string, any>
  cacheExpiry: Record<string, Date>
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
}

export interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: string
  entityId: string
  data: any
  timestamp: Date
  retries: number
  error?: string
}

// ============================================================================
// ACTIONS
// ============================================================================

export interface AppActions {
  // UI Actions
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  // Auth Actions
  setAuth: (auth: AuthState) => void
  setCurrentUser: (user: User | null) => void
  setCurrentSchool: (school: School | null) => void
  
  // Data Actions
  setStudents: (students: Student[]) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  removeStudent: (id: string) => void
  
  setTeachers: (teachers: Teacher[]) => void
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (id: string, updates: Partial<Teacher>) => void
  removeTeacher: (id: string) => void
  
  setClasses: (classes: Class[]) => void
  addClass: (classData: Class) => void
  updateClass: (id: string, updates: Partial<Class>) => void
  removeClass: (id: string) => void
  
  setSubjects: (subjects: Subject[]) => void
  addSubject: (subject: Subject) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  removeSubject: (id: string) => void
  
  setExams: (exams: Exam[]) => void
  addExam: (exam: Exam) => void
  updateExam: (id: string, updates: Partial<Exam>) => void
  removeExam: (id: string) => void
  
  setExamResults: (results: ExamResult[]) => void
  addExamResult: (result: ExamResult) => void
  updateExamResult: (id: string, updates: Partial<ExamResult>) => void
  removeExamResult: (id: string) => void
  
  // Offline Actions
  setOffline: (offline: boolean) => void
  addSyncOperation: (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retries'>) => void
  removeSyncOperation: (id: string) => void
  incrementSyncRetry: (id: string, error?: string) => void
  clearSyncQueue: () => void
  setLastSync: (date: Date) => void
  
  // Cache Actions
  setCache: (key: string, data: any, expiryMinutes?: number) => void
  getCache: (key: string) => any
  clearCache: (key?: string) => void
  
  // Reset Actions
  resetApp: () => void
  resetData: () => void
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AppState = {
  // UI State
  isLoading: false,
  isSidebarOpen: true,
  activeTab: 'dashboard',
  theme: 'light',
  notifications: [],
  
  // Auth State
  auth: null,
  currentUser: null,
  currentSchool: null,
  
  // Data State
  students: [],
  teachers: [],
  classes: [],
  subjects: [],
  exams: [],
  examResults: [],
  
  // Offline State
  isOffline: false,
  syncQueue: [],
  lastSync: null,
  
  // Cache State
  cache: {},
  cacheExpiry: {}
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // UI Actions
        setLoading: (loading) => set((state) => {
          state.isLoading = loading
        }),
        
        toggleSidebar: () => set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen
        }),
        
        setSidebarOpen: (open) => set((state) => {
          state.isSidebarOpen = open
        }),
        
        setActiveTab: (tab) => set((state) => {
          state.activeTab = tab
        }),
        
        setTheme: (theme) => set((state) => {
          state.theme = theme
        }),
        
        addNotification: (notification) => set((state) => {
          state.notifications.push({
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date()
          })
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id)
        }),
        
        markNotificationRead: (id) => set((state) => {
          const notification = state.notifications.find(n => n.id === id)
          if (notification) {
            notification.isRead = true
          }
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = []
        }),
        
        // Auth Actions
        setAuth: (auth) => set((state) => {
          state.auth = auth
        }),
        
        setCurrentUser: (user) => set((state) => {
          state.currentUser = user
        }),
        
        setCurrentSchool: (school) => set((state) => {
          state.currentSchool = school
        }),
        
        // Data Actions
        setStudents: (students) => set((state) => {
          state.students = students
        }),
        
        addStudent: (student) => set((state) => {
          state.students.push(student)
        }),
        
        updateStudent: (id, updates) => set((state) => {
          const index = state.students.findIndex(s => s.id === id)
          if (index !== -1) {
            state.students[index] = { ...state.students[index], ...updates }
          }
        }),
        
        removeStudent: (id) => set((state) => {
          state.students = state.students.filter(s => s.id !== id)
        }),
        
        setTeachers: (teachers) => set((state) => {
          state.teachers = teachers
        }),
        
        addTeacher: (teacher) => set((state) => {
          state.teachers.push(teacher)
        }),
        
        updateTeacher: (id, updates) => set((state) => {
          const index = state.teachers.findIndex(t => t.id === id)
          if (index !== -1) {
            state.teachers[index] = { ...state.teachers[index], ...updates }
          }
        }),
        
        removeTeacher: (id) => set((state) => {
          state.teachers = state.teachers.filter(t => t.id !== id)
        }),
        
        setClasses: (classes) => set((state) => {
          state.classes = classes
        }),
        
        addClass: (classData) => set((state) => {
          state.classes.push(classData)
        }),
        
        updateClass: (id, updates) => set((state) => {
          const index = state.classes.findIndex(c => c.id === id)
          if (index !== -1) {
            state.classes[index] = { ...state.classes[index], ...updates }
          }
        }),
        
        removeClass: (id) => set((state) => {
          state.classes = state.classes.filter(c => c.id !== id)
        }),
        
        setSubjects: (subjects) => set((state) => {
          state.subjects = subjects
        }),
        
        addSubject: (subject) => set((state) => {
          state.subjects.push(subject)
        }),
        
        updateSubject: (id, updates) => set((state) => {
          const index = state.subjects.findIndex(s => s.id === id)
          if (index !== -1) {
            state.subjects[index] = { ...state.subjects[index], ...updates }
          }
        }),
        
        removeSubject: (id) => set((state) => {
          state.subjects = state.subjects.filter(s => s.id !== id)
        }),
        
        setExams: (exams) => set((state) => {
          state.exams = exams
        }),
        
        addExam: (exam) => set((state) => {
          state.exams.push(exam)
        }),
        
        updateExam: (id, updates) => set((state) => {
          const index = state.exams.findIndex(e => e.id === id)
          if (index !== -1) {
            state.exams[index] = { ...state.exams[index], ...updates }
          }
        }),
        
        removeExam: (id) => set((state) => {
          state.exams = state.exams.filter(e => e.id !== id)
        }),
        
        setExamResults: (results) => set((state) => {
          state.examResults = results
        }),
        
        addExamResult: (result) => set((state) => {
          state.examResults.push(result)
        }),
        
        updateExamResult: (id, updates) => set((state) => {
          const index = state.examResults.findIndex(r => r.id === id)
          if (index !== -1) {
            state.examResults[index] = { ...state.examResults[index], ...updates }
          }
        }),
        
        removeExamResult: (id) => set((state) => {
          state.examResults = state.examResults.filter(r => r.id !== id)
        }),
        
        // Offline Actions
        setOffline: (offline) => set((state) => {
          state.isOffline = offline
        }),
        
        addSyncOperation: (operation) => set((state) => {
          state.syncQueue.push({
            ...operation,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            retries: 0
          })
        }),
        
        removeSyncOperation: (id) => set((state) => {
          state.syncQueue = state.syncQueue.filter(op => op.id !== id)
        }),
        
        incrementSyncRetry: (id, error) => set((state) => {
          const operation = state.syncQueue.find(op => op.id === id)
          if (operation) {
            operation.retries += 1
            if (error) {
              operation.error = error
            }
          }
        }),
        
        clearSyncQueue: () => set((state) => {
          state.syncQueue = []
        }),
        
        setLastSync: (date) => set((state) => {
          state.lastSync = date
        }),
        
        // Cache Actions
        setCache: (key, data, expiryMinutes = 60) => set((state) => {
          state.cache[key] = data
          state.cacheExpiry[key] = new Date(Date.now() + expiryMinutes * 60 * 1000)
        }),
        
        getCache: (key) => {
          const state = get()
          const expiry = state.cacheExpiry[key]
          if (!expiry || new Date() > expiry) {
            // Cache expired, remove it
            set((draft) => {
              delete draft.cache[key]
              delete draft.cacheExpiry[key]
            })
            return null
          }
          return state.cache[key]
        },
        
        clearCache: (key) => set((state) => {
          if (key) {
            delete state.cache[key]
            delete state.cacheExpiry[key]
          } else {
            state.cache = {}
            state.cacheExpiry = {}
          }
        }),
        
        // Reset Actions
        resetApp: () => set(() => ({
          ...initialState
        })),
        
        resetData: () => set((state) => {
          state.students = []
          state.teachers = []
          state.classes = []
          state.subjects = []
          state.exams = []
          state.examResults = []
          state.cache = {}
          state.cacheExpiry = {}
        })
      })),
      {
        name: 'reportgen-app-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist UI preferences and offline data
          theme: state.theme,
          isSidebarOpen: state.isSidebarOpen,
          isOffline: state.isOffline,
          syncQueue: state.syncQueue,
          lastSync: state.lastSync,
          // Don't persist sensitive auth or user data
          // Don't persist cache data as it's temporary
        }),
        version: 1,
        migrate: (persistedState: any, version) => {
          // Handle store migrations if needed
          if (version === 0) {
            // Migrate from v0 to v1
            return {
              ...persistedState,
              // Add new fields or transform existing ones
            }
          }
          return persistedState
        }
      }
    )
  )
)

// ============================================================================
// STORE SELECTORS
// ============================================================================

// UI Selectors
export const useIsLoading = () => useAppStore((state) => state.isLoading)
export const useIsSidebarOpen = () => useAppStore((state) => state.isSidebarOpen)
export const useActiveTab = () => useAppStore((state) => state.activeTab)
export const useTheme = () => useAppStore((state) => state.theme)
export const useNotifications = () => useAppStore((state) => state.notifications)
export const useUnreadNotifications = () => useAppStore((state) => 
  state.notifications.filter(n => !n.isRead)
)

// Auth Selectors
export const useAuthState = () => useAppStore((state) => state.auth)
export const useCurrentUser = () => useAppStore((state) => state.currentUser)
export const useCurrentSchool = () => useAppStore((state) => state.currentSchool)

// Data Selectors
export const useStudents = () => useAppStore((state) => state.students)
export const useTeachers = () => useAppStore((state) => state.teachers)
export const useClasses = () => useAppStore((state) => state.classes)
export const useSubjects = () => useAppStore((state) => state.subjects)
export const useExams = () => useAppStore((state) => state.exams)
export const useExamResults = () => useAppStore((state) => state.examResults)

// Offline Selectors
export const useIsOffline = () => useAppStore((state) => state.isOffline)
export const useSyncQueue = () => useAppStore((state) => state.syncQueue)
export const useLastSync = () => useAppStore((state) => state.lastSync)

// Computed Selectors
export const useStudentsByClass = (classId: string) => useAppStore((state) =>
  state.students.filter(student => student.classId === classId)
)

export const useTeachersBySubject = (subjectId: string) => useAppStore((state) =>
  state.teachers.filter(teacher => teacher.subjects.includes(subjectId))
)

export const useExamsByClass = (classId: string) => useAppStore((state) =>
  state.exams.filter(exam => exam.classId === classId)
)

export const useExamResultsByExam = (examId: string) => useAppStore((state) =>
  state.examResults.filter(result => result.examId === examId)
)

// ============================================================================
// STORE SUBSCRIPTIONS
// ============================================================================

// Subscribe to auth state changes
let authUnsubscribe: (() => void) | null = null

export const initializeAuthSubscription = () => {
  if (authUnsubscribe) {
    authUnsubscribe()
  }

  const hybridAuth = getHybridAuth()
  
  authUnsubscribe = hybridAuth.subscribe((authState) => {
    useAppStore.getState().setAuth(authState)
    
    if (authState.user) {
      useAppStore.getState().setCurrentUser({
        id: authState.user.id,
        username: authState.user.username,
        email: authState.user.email,
        firstName: authState.user.firstName,
        lastName: authState.user.lastName,
        role: authState.user.role as UserRole,
        schoolId: authState.user.schoolId,
        isActive: authState.user.isActive,
        createdAt: authState.user.createdAt,
        updatedAt: authState.user.updatedAt
      })
    } else {
      useAppStore.getState().setCurrentUser(null)
    }
  })
}

// Subscribe to online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOffline(false)
  })
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOffline(true)
  })
  
  // Set initial online status
  useAppStore.getState().setOffline(!navigator.onLine)
}

export default useAppStore