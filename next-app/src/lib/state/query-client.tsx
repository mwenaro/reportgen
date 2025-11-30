import { QueryClient, QueryClientProvider, useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { createContext, useContext, useEffect } from 'react'
import { useAppStore } from './store'
import { getHybridAuth } from '../auth/hybrid-auth'
import { getDatabaseUtils } from '../database/utils'

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry validation errors (400-499)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

// ============================================================================
// QUERY PROVIDER COMPONENT
// ============================================================================

interface QueryProviderProps {
  children: React.ReactNode
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const isOffline = useAppStore((state) => state.isOffline)

  useEffect(() => {
    // Configure query client based on online/offline status
    queryClient.setDefaultOptions({
      queries: {
        networkMode: isOffline ? 'offlineFirst' : 'online',
        retry: isOffline ? false : 3,
      },
      mutations: {
        networkMode: isOffline ? 'offlineFirst' : 'online',
        retry: isOffline ? false : 2,
      },
    })
  }, [isOffline])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// ============================================================================
// API CLIENT
// ============================================================================

class APIError extends Error {
  status: number
  statusText: string
  data: any

  constructor(status: number, statusText: string, data: any) {
    super(`API Error: ${status} ${statusText}`)
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

export class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get authentication token
    const hybridAuth = getHybridAuth()
    const authState = hybridAuth.getAuthState()
    
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    // Add auth header if user is logged in
    if (authState.session?.token) {
      headers['Authorization'] = `Bearer ${authState.session.token}`
    }

    // Add school context if available
    if (authState.user?.schoolId) {
      headers['X-School-ID'] = authState.user.schoolId
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(response.status, response.statusText, errorData)
      }

      const contentType = response.headers.get('Content-Type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      } else {
        return response.text() as any
      }
    } catch (error) {
      // Handle offline scenario
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Try to serve from offline storage
        return this.handleOfflineRequest<T>(endpoint, options)
      }
      throw error
    }
  }

  private async handleOfflineRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const addSyncOperation = useAppStore.getState().addSyncOperation
    const isOffline = useAppStore.getState().isOffline

    if (!isOffline) {
      throw new Error('Network error occurred while online')
    }

    // For GET requests, try to serve from offline storage
    if (!options.method || options.method === 'GET') {
      try {
        const offlineData = await this.getOfflineData<T>(endpoint)
        if (offlineData) {
          return offlineData
        }
      } catch (error) {
        console.warn('Failed to get offline data:', error)
      }
    }

    // For mutations, add to sync queue
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      const operation = {
        type: this.getOperationType(options.method),
        entity: this.getEntityFromEndpoint(endpoint),
        entityId: this.getEntityIdFromEndpoint(endpoint),
        data: options.body ? JSON.parse(options.body as string) : null,
      }

      addSyncOperation(operation)

      // Return optimistic response for some operations
      return this.getOptimisticResponse<T>(endpoint, options)
    }

    throw new Error('Request failed and no offline fallback available')
  }

  private async getOfflineData<T>(endpoint: string): Promise<T | null> {
    // This would integrate with your offline storage system
    // For now, return null
    return null
  }

  private getOperationType(method: string): 'create' | 'update' | 'delete' {
    switch (method) {
      case 'POST': return 'create'
      case 'PUT':
      case 'PATCH': return 'update'
      case 'DELETE': return 'delete'
      default: return 'update'
    }
  }

  private getEntityFromEndpoint(endpoint: string): string {
    const parts = endpoint.split('/').filter(Boolean)
    return parts[0] || 'unknown'
  }

  private getEntityIdFromEndpoint(endpoint: string): string {
    const parts = endpoint.split('/').filter(Boolean)
    return parts[1] || ''
  }

  private getOptimisticResponse<T>(endpoint: string, options: RequestInit): T {
    // Return optimistic response based on the request
    // This is a simplified version - you'd want to make this more sophisticated
    return {} as T
  }

  // Convenience methods
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// ============================================================================
// API CLIENT INSTANCE
// ============================================================================

export const apiClient = new APIClient()

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: ['auth', 'current-user'] as const,
  
  // Schools
  schools: ['schools'] as const,
  school: (id: string) => ['schools', id] as const,
  currentSchool: ['schools', 'current'] as const,
  
  // Students
  students: ['students'] as const,
  student: (id: string) => ['students', id] as const,
  studentsByClass: (classId: string) => ['students', 'by-class', classId] as const,
  studentsBySchool: (schoolId: string) => ['students', 'by-school', schoolId] as const,
  
  // Teachers
  teachers: ['teachers'] as const,
  teacher: (id: string) => ['teachers', id] as const,
  teachersBySchool: (schoolId: string) => ['teachers', 'by-school', schoolId] as const,
  teachersBySubject: (subjectId: string) => ['teachers', 'by-subject', subjectId] as const,
  
  // Classes
  classes: ['classes'] as const,
  class: (id: string) => ['classes', id] as const,
  classesBySchool: (schoolId: string) => ['classes', 'by-school', schoolId] as const,
  classesByTeacher: (teacherId: string) => ['classes', 'by-teacher', teacherId] as const,
  
  // Subjects
  subjects: ['subjects'] as const,
  subject: (id: string) => ['subjects', id] as const,
  subjectsBySchool: (schoolId: string) => ['subjects', 'by-school', schoolId] as const,
  subjectsByClass: (classId: string) => ['subjects', 'by-class', classId] as const,
  
  // Exams
  exams: ['exams'] as const,
  exam: (id: string) => ['exams', id] as const,
  examsBySchool: (schoolId: string) => ['exams', 'by-school', schoolId] as const,
  examsByClass: (classId: string) => ['exams', 'by-class', classId] as const,
  examsBySubject: (subjectId: string) => ['exams', 'by-subject', subjectId] as const,
  
  // Exam Results
  examResults: ['exam-results'] as const,
  examResult: (id: string) => ['exam-results', id] as const,
  examResultsByExam: (examId: string) => ['exam-results', 'by-exam', examId] as const,
  examResultsByStudent: (studentId: string) => ['exam-results', 'by-student', studentId] as const,
  
  // Reports
  reports: ['reports'] as const,
  studentReport: (studentId: string) => ['reports', 'student', studentId] as const,
  classReport: (classId: string) => ['reports', 'class', classId] as const,
  examReport: (examId: string) => ['reports', 'exam', examId] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  schoolAnalytics: (schoolId: string) => ['analytics', 'school', schoolId] as const,
  classAnalytics: (classId: string) => ['analytics', 'class', classId] as const,
} as const

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Generic query hook with offline support
export function useOfflineQuery<TData, TError = APIError>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options: {
    enabled?: boolean
    staleTime?: number
    offlineData?: () => Promise<TData | null>
    syncOnMount?: boolean
  } = {}
) {
  const isOffline = useAppStore((state) => state.isOffline)
  
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      if (isOffline && options.offlineData) {
        const offlineResult = await options.offlineData()
        if (offlineResult) {
          return offlineResult
        }
      }
      return queryFn()
    },
    enabled: options.enabled,
    staleTime: options.staleTime,
    networkMode: isOffline ? 'offlineFirst' : 'online',
  })
}

// Generic mutation hook with offline support
export function useOfflineMutation<TData, TError = APIError, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: TError, variables: TVariables) => void
    optimisticUpdate?: (variables: TVariables) => void
    offlineHandler?: (variables: TVariables) => Promise<TData>
  } = {}
) {
  const isOffline = useAppStore((state) => state.isOffline)
  const addSyncOperation = useAppStore((state) => state.addSyncOperation)
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      if (isOffline && options.offlineHandler) {
        return options.offlineHandler(variables)
      }
      return mutationFn(variables)
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
    networkMode: isOffline ? 'offlineFirst' : 'online',
  })
}

// Sync hook for handling offline operations
export function useSyncMutation() {
  const syncQueue = useAppStore((state) => state.syncQueue)
  const removeSyncOperation = useAppStore((state) => state.removeSyncOperation)
  const incrementSyncRetry = useAppStore((state) => state.incrementSyncRetry)
  const setLastSync = useAppStore((state) => state.setLastSync)
  
  return useMutation({
    mutationFn: async () => {
      const results = []
      
      for (const operation of syncQueue) {
        try {
          let result
          
          switch (operation.type) {
            case 'create':
              result = await apiClient.post(`/${operation.entity}`, operation.data)
              break
            case 'update':
              result = await apiClient.put(`/${operation.entity}/${operation.entityId}`, operation.data)
              break
            case 'delete':
              result = await apiClient.delete(`/${operation.entity}/${operation.entityId}`)
              break
          }
          
          results.push({ operation, result, success: true })
          removeSyncOperation(operation.id)
          
        } catch (error) {
          console.error(`Sync failed for operation ${operation.id}:`, error)
          incrementSyncRetry(operation.id, error.message)
          results.push({ operation, error, success: false })
        }
      }
      
      setLastSync(new Date())
      return results
    },
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      
      if (successful > 0) {
        useAppStore.getState().addNotification({
          type: 'success',
          title: 'Sync Completed',
          message: `Successfully synced ${successful} operations`,
          isRead: false
        })
      }
      
      if (failed > 0) {
        useAppStore.getState().addNotification({
          type: 'warning',
          title: 'Partial Sync',
          message: `${failed} operations failed to sync and will be retried`,
          isRead: false
        })
      }
    },
    onError: (error) => {
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Sync Failed',
        message: 'Failed to sync offline operations. Will retry later.',
        isRead: false
      })
    }
  })
}

// Auto-sync hook
export function useAutoSync() {
  const isOffline = useAppStore((state) => state.isOffline)
  const syncQueue = useAppStore((state) => state.syncQueue)
  const syncMutation = useSyncMutation()
  
  useEffect(() => {
    if (!isOffline && syncQueue.length > 0 && !syncMutation.isPending) {
      // Auto-sync when coming back online
      syncMutation.mutate()
    }
  }, [isOffline, syncQueue.length])
  
  // Set up periodic sync
  useEffect(() => {
    if (!isOffline) {
      const interval = setInterval(() => {
        if (syncQueue.length > 0 && !syncMutation.isPending) {
          syncMutation.mutate()
        }
      }, 5 * 60 * 1000) // Every 5 minutes
      
      return () => clearInterval(interval)
    }
  }, [isOffline, syncQueue.length])
  
  return {
    sync: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error,
    hasPendingOperations: syncQueue.length > 0
  }
}

export default QueryProvider