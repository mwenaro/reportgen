// ============================================================================
// STATE MANAGEMENT EXPORTS
// ============================================================================

// Main store and types
export {
  useAppStore,
  initializeAuthSubscription,
  // UI Selectors
  useIsLoading,
  useIsSidebarOpen,
  useActiveTab,
  useTheme,
  useNotifications,
  useUnreadNotifications,
  // Auth Selectors
  useAuthState,
  useCurrentUser,
  useCurrentSchool,
  // Data Selectors
  useStudents,
  useTeachers,
  useClasses,
  useSubjects,
  useExams,
  useExamResults,
  // Offline Selectors
  useIsOffline,
  useSyncQueue,
  useLastSync,
  // Computed Selectors
  useStudentsByClass,
  useTeachersBySubject,
  useExamsByClass,
  useExamResultsByExam,
} from './store'

export type {
  // Core Types
  User,
  School,
  SchoolSettings,
  Term,
  GradingSystem,
  GradeScale,
  ThemeSettings,
  Student,
  Teacher,
  Class,
  Subject,
  Exam,
  ExamResult,
  
  // State Types
  AppState,
  AppActions,
  Notification,
  NotificationAction,
  SyncOperation,
} from './store'

// Query client and providers
export {
  QueryProvider,
  queryClient,
  APIClient,
  apiClient,
  queryKeys,
  useOfflineQuery,
  useOfflineMutation,
  useSyncMutation,
  useAutoSync,
} from './query-client'

// Data fetching hooks
export {
  // Student hooks
  useStudent,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  
  // Teacher hooks
  useTeacher,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useTeachersBySubject,
  
  // Class hooks
  useClass,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useClassesByTeacher,
  
  // Subject hooks
  useSubject,
  useSubjectsByClass,
  useCreateSubject,
  
  // Exam hooks
  useExam,
  useExamsByClass,
  useCreateExam,
  
  // Exam results hooks
  useExamResultsByExam,
  useExamResultsByStudent,
  useCreateExamResult,
  
  // School hooks
  useSchool,
  
  // Report hooks
  useStudentReport,
  useClassReport,
  useExamReport,
  
  // Bulk operations
  useBulkCreateStudents,
  useBulkUpdateExamResults,
} from './data-hooks'

// Custom specialized hooks
export {
  // Dashboard hooks
  useDashboardStats,
  useRecentActivity,
  
  // Class management hooks
  useClassDetails,
  useStudentPerformance,
  
  // Exam management hooks
  useExamAnalytics,
  useUpcomingExams,
  
  // Search and filter hooks
  useFilteredStudents,
  useFilteredExams,
  
  // Permission hooks
  useCanManageEntity,
  useUserAccessibleData,
} from './custom-hooks'

// ============================================================================
// STORE INITIALIZATION
// ============================================================================

/**
 * Initialize the state management system
 * Call this once in your app root component
 */
export function initializeStateManagement() {
  // Initialize auth subscription to sync with hybrid auth
  initializeAuthSubscription()
  
  // Set up any other global subscriptions here
  console.log('State management system initialized')
}

// ============================================================================
// CONVENIENCE UTILITIES
// ============================================================================

/**
 * Get a snapshot of the current app state (useful for debugging)
 */
export function getStateSnapshot() {
  return useAppStore.getState()
}

/**
 * Reset all application data (useful for logout)
 */
export function resetAppData() {
  useAppStore.getState().resetData()
  
  // Clear query cache
  queryClient.clear()
}

/**
 * Reset entire application state
 */
export function resetAppState() {
  useAppStore.getState().resetApp()
  
  // Clear query cache
  queryClient.clear()
}

/**
 * Force sync all pending operations
 */
export async function forceSyncOperations() {
  const { syncQueue } = useAppStore.getState()
  
  if (syncQueue.length === 0) {
    console.log('No pending sync operations')
    return
  }
  
  console.log(`Syncing ${syncQueue.length} pending operations...`)
  
  // This would trigger the sync mutation
  // The actual implementation would be called from a component
  // that has access to the useSyncMutation hook
}

/**
 * Get offline capabilities status
 */
export function getOfflineStatus() {
  const state = useAppStore.getState()
  
  return {
    isOffline: state.isOffline,
    pendingOperations: state.syncQueue.length,
    lastSync: state.lastSync,
    hasUnsynedData: state.syncQueue.length > 0,
  }
}

/**
 * Export all app data (for backup/migration)
 */
export function exportAppData() {
  const state = useAppStore.getState()
  
  return {
    students: state.students,
    teachers: state.teachers,
    classes: state.classes,
    subjects: state.subjects,
    exams: state.exams,
    examResults: state.examResults,
    syncQueue: state.syncQueue,
    exportDate: new Date().toISOString(),
  }
}

/**
 * Import app data (for restore/migration)
 */
export function importAppData(data: ReturnType<typeof exportAppData>) {
  const {
    setStudents,
    setTeachers,
    setClasses,
    setSubjects,
    setExams,
    setExamResults,
  } = useAppStore.getState()
  
  setStudents(data.students || [])
  setTeachers(data.teachers || [])
  setClasses(data.classes || [])
  setSubjects(data.subjects || [])
  setExams(data.exams || [])
  setExamResults(data.examResults || [])
  
  console.log(`Imported data from ${data.exportDate}`)
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isStudent(user: any): user is Student {
  return user && typeof user.studentId === 'string'
}

export function isTeacher(user: any): user is Teacher {
  return user && typeof user.employeeId === 'string'
}

export function isExam(item: any): item is Exam {
  return item && typeof item.examDate !== 'undefined'
}

export function isExamResult(item: any): item is ExamResult {
  return item && typeof item.examId === 'string' && typeof item.studentId === 'string'
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const STORAGE_KEYS = {
  APP_STATE: 'reportgen-app-store',
  AUTH_STATE: 'reportgen-auth-state',
  OFFLINE_DATA: 'reportgen-offline-data',
} as const

export const SYNC_INTERVALS = {
  AUTO_SYNC: 5 * 60 * 1000, // 5 minutes
  RETRY_SYNC: 30 * 1000,    // 30 seconds
  BACKGROUND_SYNC: 15 * 60 * 1000, // 15 minutes
} as const

export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000,     // 5 minutes
  MEDIUM: 30 * 60 * 1000,   // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  DAY: 24 * 60 * 60 * 1000, // 24 hours
} as const

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export { useAppStore as default } from './store'