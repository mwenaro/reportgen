# State Management & Data Fetching Implementation

## Overview

This implementation provides a complete state management and data fetching solution for the multi-tenant school management system using:

- **Zustand** for global state management
- **TanStack Query** for server state and caching
- **Real-time updates** with WebSocket integration
- **Offline-first** architecture with sync capabilities
- **Type-safe** implementations throughout

## Architecture

```
src/lib/state/
├── store.ts           # Main Zustand store with all app state
├── query-client.tsx   # TanStack Query setup and offline support
├── data-hooks.ts      # Entity-specific data fetching hooks
├── custom-hooks.ts    # Specialized hooks for common use cases
├── realtime.ts        # WebSocket integration for real-time updates
└── index.ts           # Unified exports
```

## Features Implemented

### 1. Global State Management (Zustand)

**Store Structure:**
```typescript
interface AppState {
  // UI State
  isLoading: boolean
  isSidebarOpen: boolean
  activeTab: string
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Auth State (synced with hybrid auth)
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
```

**Key Features:**
- Immer middleware for immutable updates
- Persist middleware for localStorage persistence
- Subscriptions for real-time auth state sync
- Type-safe actions and selectors
- Computed selectors for derived data

### 2. Data Fetching (TanStack Query)

**Query Client Configuration:**
- 5-minute stale time
- 10-minute garbage collection
- Intelligent retry logic (no retry on 401/403)
- Offline-first query mode when offline

**API Client Features:**
- Automatic authentication headers
- School context injection
- Offline request handling
- Optimistic updates support

### 3. Entity-Specific Hooks

**Available for each entity (Students, Teachers, Classes, etc.):**
```typescript
// Fetch hooks
useStudents() - Get all students
useStudent(id) - Get single student
useStudentsByClass(classId) - Get students by class

// Mutation hooks
useCreateStudent() - Create new student
useUpdateStudent() - Update existing student
useDeleteStudent() - Delete student

// Bulk operations
useBulkCreateStudents() - Create multiple students
```

**Offline Support:**
- All hooks work offline using local state
- Mutations are queued for sync when online
- Optimistic updates for better UX

### 4. Specialized Custom Hooks

**Dashboard Analytics:**
```typescript
useDashboardStats() - Overall system statistics
useRecentActivity() - Recent system activity
```

**Student Management:**
```typescript
useStudentPerformance(studentId) - Comprehensive student analytics
useFilteredStudents(filters) - Advanced student filtering
```

**Exam Analytics:**
```typescript
useExamAnalytics(examId) - Detailed exam statistics
useUpcomingExams() - Get upcoming exams
```

**Permission-based Data:**
```typescript
useCanManageEntity(entityType) - Check management permissions
useUserAccessibleData() - Get data based on user role
```

### 5. Real-time Updates (WebSocket)

**WebSocket Manager:**
- Automatic reconnection with exponential backoff
- Heartbeat mechanism for connection health
- Message type routing and handling
- Authentication token integration

**Real-time Features:**
```typescript
useRealTimeUpdates() - Subscribe to all real-time updates
useBroadcastUpdates() - Broadcast changes to other users
useUserPresence() - Track online users
useCollaborativeEditing() - Collaborative editing indicators
```

**Message Types:**
- Entity updates (create/update/delete)
- User presence updates
- Collaborative editing status
- System notifications

### 6. Offline-First Architecture

**Sync Operations:**
- All mutations work offline
- Operations queued in `syncQueue`
- Automatic sync when connection restored
- Retry mechanism with error handling

**Offline Features:**
- Local state serves as offline cache
- Optimistic updates for immediate feedback
- Background sync every 5 minutes
- Manual sync trigger available

### 7. Type Safety

**Comprehensive Types:**
- All entities fully typed
- State actions and selectors typed
- API responses and errors typed
- WebSocket messages typed

**Type Guards:**
```typescript
isStudent(user) - Check if user is student
isTeacher(user) - Check if user is teacher
isExam(item) - Check if item is exam
```

## Integration with Authentication

The state management system integrates seamlessly with the hybrid authentication system:

```typescript
// Auth state is automatically synced
const authState = useAuthState()
const currentUser = useCurrentUser()

// Permission-based data access
const accessibleData = useUserAccessibleData()
```

## Usage Examples

### Basic Data Fetching
```typescript
function StudentsPage() {
  const { data: students, isLoading } = useStudents()
  const createStudent = useCreateStudent()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {students?.map(student => (
        <div key={student.id}>{student.firstName}</div>
      ))}
    </div>
  )
}
```

### Real-time Updates
```typescript
function Dashboard() {
  const { isConnected } = useRealTimeUpdates()
  const stats = useDashboardStats()
  
  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Offline'}</div>
      <div>Students: {stats.totalStudents}</div>
    </div>
  )
}
```

### Offline Operations
```typescript
function CreateStudentForm() {
  const createStudent = useCreateStudent()
  const isOffline = useIsOffline()
  
  const handleSubmit = async (data) => {
    // Works both online and offline
    await createStudent.mutateAsync(data)
    
    if (isOffline) {
      // Show offline message
      toast.info('Student created offline. Will sync when online.')
    }
  }
}
```

### Permission-based Access
```typescript
function ExamManagement() {
  const canManage = useCanManageEntity('exams')
  const exams = useExams()
  
  if (!canManage) {
    return <div>Access denied</div>
  }
  
  return <ExamList exams={exams.data} />
}
```

## Performance Optimizations

1. **Selective Persistence**: Only UI preferences and offline data persisted
2. **Query Deduplication**: TanStack Query prevents duplicate requests
3. **Background Updates**: Stale data updated in background
4. **Optimistic Updates**: Immediate UI feedback for better UX
5. **Computed Selectors**: Memoized derived state calculations
6. **Connection Management**: Efficient WebSocket connection handling

## Error Handling

1. **API Errors**: Comprehensive error types and handling
2. **Offline Scenarios**: Graceful fallback to local state
3. **Sync Failures**: Retry mechanism with backoff
4. **WebSocket Issues**: Automatic reconnection
5. **Data Validation**: Type-safe operations throughout

## Next Steps

This state management implementation is ready for integration with the UI components. The system provides:

- Complete offline capabilities
- Real-time collaborative features
- Type-safe data operations
- Role-based access control
- Comprehensive error handling

The next prompt should focus on **UI Components & Layout System** to complete the frontend infrastructure.