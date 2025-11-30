import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppStore } from './store'
import { queryKeys } from './query-client'

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

interface WebSocketMessage {
  type: 'update' | 'create' | 'delete' | 'notification' | 'sync'
  entity?: string
  entityId?: string
  data?: any
  timestamp: string
  userId?: string
  schoolId?: string
}

interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

// ============================================================================
// WEBSOCKET MANAGER
// ============================================================================

export class WebSocketManager {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private reconnectAttempts = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private messageHandlers: ((message: WebSocketMessage) => void)[] = []
  private isConnecting = false

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    }
  }

  connect(token?: string) {
    if (this.ws?.readyState === WebSocket.CONNECTING || this.isConnecting) {
      return
    }

    this.isConnecting = true

    try {
      const url = new URL(this.config.url)
      if (token) {
        url.searchParams.set('token', token)
      }

      this.ws = new WebSocket(url.toString(), this.config.protocols)
      
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)

    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  disconnect() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.reconnectAttempts = 0
    this.isConnecting = false
  }

  send(message: Partial<WebSocketMessage>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      }))
    }
  }

  subscribe(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler)
    
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }

  private handleOpen() {
    console.log('WebSocket connected')
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.startHeartbeat()
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      
      // Handle heartbeat responses
      if (message.type === 'ping') {
        this.send({ type: 'pong' })
        return
      }

      // Notify all handlers
      this.messageHandlers.forEach(handler => {
        try {
          handler(message)
        } catch (error) {
          console.error('WebSocket message handler error:', error)
        }
      })

    } catch (error) {
      console.error('WebSocket message parsing error:', error)
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('WebSocket disconnected:', event.code, event.reason)
    this.isConnecting = false
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    // Only reconnect if it wasn't a manual disconnect
    if (event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error)
    this.isConnecting = false
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, this.config.heartbeatInterval)
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error('Max reconnect attempts reached')
      return
    }

    const delay = this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts)
    
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  get readyState() {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// ============================================================================
// WEBSOCKET SINGLETON
// ============================================================================

let wsManager: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-domain.com/ws'
      : 'ws://localhost:3001/ws'

    wsManager = new WebSocketManager({
      url: wsUrl,
      protocols: ['reportgen-v1'],
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
    })
  }
  return wsManager
}

// ============================================================================
// REAL-TIME HOOKS
// ============================================================================

export function useRealTimeUpdates() {
  const queryClient = useQueryClient()
  const wsManagerRef = useRef<WebSocketManager | null>(null)
  const currentUser = useAppStore((state) => state.currentUser)
  const authState = useAppStore((state) => state.auth)
  
  // Store actions
  const {
    addStudent,
    updateStudent,
    removeStudent,
    addTeacher,
    updateTeacher,
    removeTeacher,
    addClass,
    updateClass,
    removeClass,
    addSubject,
    updateSubject,
    removeSubject,
    addExam,
    updateExam,
    removeExam,
    addExamResult,
    updateExamResult,
    removeExamResult,
    addNotification,
  } = useAppStore()

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    // Only process messages for the current school
    if (message.schoolId && currentUser?.schoolId !== message.schoolId) {
      return
    }

    // Don't process messages from the current user (to avoid duplicates)
    if (message.userId === currentUser?.id) {
      return
    }

    console.log('Received real-time update:', message)

    switch (message.entity) {
      case 'student':
        handleStudentUpdate(message)
        break
      case 'teacher':
        handleTeacherUpdate(message)
        break
      case 'class':
        handleClassUpdate(message)
        break
      case 'subject':
        handleSubjectUpdate(message)
        break
      case 'exam':
        handleExamUpdate(message)
        break
      case 'exam-result':
        handleExamResultUpdate(message)
        break
      case 'notification':
        handleNotificationUpdate(message)
        break
      default:
        console.log('Unknown entity type:', message.entity)
    }
  }, [currentUser, addStudent, updateStudent, removeStudent, addTeacher, updateTeacher, removeTeacher, addClass, updateClass, removeClass, addSubject, updateSubject, removeSubject, addExam, updateExam, removeExam, addExamResult, updateExamResult, removeExamResult, addNotification])

  const handleStudentUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addStudent(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        showUpdateNotification('New student added', message.data?.firstName)
        break
      case 'update':
        updateStudent(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.student(message.entityId!) })
        showUpdateNotification('Student updated', message.data?.firstName)
        break
      case 'delete':
        removeStudent(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.students })
        showUpdateNotification('Student removed')
        break
    }
  }, [addStudent, updateStudent, removeStudent, queryClient])

  const handleTeacherUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addTeacher(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
        showUpdateNotification('New teacher added', message.data?.firstName)
        break
      case 'update':
        updateTeacher(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.teacher(message.entityId!) })
        showUpdateNotification('Teacher updated', message.data?.firstName)
        break
      case 'delete':
        removeTeacher(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.teachers })
        showUpdateNotification('Teacher removed')
        break
    }
  }, [addTeacher, updateTeacher, removeTeacher, queryClient])

  const handleClassUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addClass(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.classes })
        showUpdateNotification('New class added', message.data?.name)
        break
      case 'update':
        updateClass(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.class(message.entityId!) })
        showUpdateNotification('Class updated', message.data?.name)
        break
      case 'delete':
        removeClass(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.classes })
        showUpdateNotification('Class removed')
        break
    }
  }, [addClass, updateClass, removeClass, queryClient])

  const handleSubjectUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addSubject(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.subjects })
        showUpdateNotification('New subject added', message.data?.name)
        break
      case 'update':
        updateSubject(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.subject(message.entityId!) })
        showUpdateNotification('Subject updated', message.data?.name)
        break
      case 'delete':
        removeSubject(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.subjects })
        showUpdateNotification('Subject removed')
        break
    }
  }, [addSubject, updateSubject, removeSubject, queryClient])

  const handleExamUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addExam(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.exams })
        showUpdateNotification('New exam added', message.data?.title)
        break
      case 'update':
        updateExam(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.exam(message.entityId!) })
        showUpdateNotification('Exam updated', message.data?.title)
        break
      case 'delete':
        removeExam(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.exams })
        showUpdateNotification('Exam removed')
        break
    }
  }, [addExam, updateExam, removeExam, queryClient])

  const handleExamResultUpdate = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'create':
        addExamResult(message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.examResults })
        showUpdateNotification('New exam result added')
        break
      case 'update':
        updateExamResult(message.entityId!, message.data)
        queryClient.invalidateQueries({ queryKey: queryKeys.examResult(message.entityId!) })
        showUpdateNotification('Exam result updated')
        break
      case 'delete':
        removeExamResult(message.entityId!)
        queryClient.invalidateQueries({ queryKey: queryKeys.examResults })
        showUpdateNotification('Exam result removed')
        break
    }
  }, [addExamResult, updateExamResult, removeExamResult, queryClient])

  const handleNotificationUpdate = useCallback((message: WebSocketMessage) => {
    if (message.type === 'create' && message.data) {
      addNotification({
        type: message.data.type || 'info',
        title: message.data.title || 'Notification',
        message: message.data.message || '',
        isRead: false
      })
    }
  }, [addNotification])

  const showUpdateNotification = useCallback((title: string, detail?: string) => {
    addNotification({
      type: 'info',
      title,
      message: detail ? `${detail} has been updated in real-time` : 'Data has been updated in real-time',
      isRead: false
    })
  }, [addNotification])

  useEffect(() => {
    if (!authState?.session?.token) {
      return
    }

    wsManagerRef.current = getWebSocketManager()
    const unsubscribe = wsManagerRef.current.subscribe(handleWebSocketMessage)
    
    // Connect with auth token
    wsManagerRef.current.connect(authState.session.token)

    return () => {
      unsubscribe()
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect()
      }
    }
  }, [authState?.session?.token, handleWebSocketMessage])

  return {
    isConnected: wsManagerRef.current?.isConnected ?? false,
    send: (message: Partial<WebSocketMessage>) => {
      if (wsManagerRef.current?.isConnected) {
        wsManagerRef.current.send(message)
      }
    }
  }
}

// ============================================================================
// BROADCAST HOOKS
// ============================================================================

export function useBroadcastUpdates() {
  const wsManager = getWebSocketManager()
  const currentUser = useAppStore((state) => state.currentUser)

  const broadcast = useCallback((
    type: 'create' | 'update' | 'delete',
    entity: string,
    entityId?: string,
    data?: any
  ) => {
    if (!wsManager.isConnected || !currentUser) {
      return
    }

    wsManager.send({
      type,
      entity,
      entityId,
      data,
      userId: currentUser.id,
      schoolId: currentUser.schoolId,
    })
  }, [wsManager, currentUser])

  return { broadcast }
}

// ============================================================================
// PRESENCE HOOKS
// ============================================================================

interface UserPresence {
  userId: string
  username: string
  isOnline: boolean
  lastSeen: Date
  currentPage?: string
}

export function useUserPresence() {
  const wsManager = getWebSocketManager()
  const currentUser = useAppStore((state) => state.currentUser)
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])

  useEffect(() => {
    if (!wsManager.isConnected || !currentUser) {
      return
    }

    const handlePresenceMessage = (message: WebSocketMessage) => {
      if (message.type === 'presence' && message.data) {
        setOnlineUsers(message.data.onlineUsers || [])
      }
    }

    const unsubscribe = wsManager.subscribe(handlePresenceMessage)

    // Send presence update
    wsManager.send({
      type: 'presence',
      data: {
        userId: currentUser.id,
        username: currentUser.username,
        isOnline: true,
        currentPage: window.location.pathname,
      }
    })

    // Send presence updates on page change
    const handlePageChange = () => {
      wsManager.send({
        type: 'presence',
        data: {
          userId: currentUser.id,
          currentPage: window.location.pathname,
        }
      })
    }

    window.addEventListener('popstate', handlePageChange)

    // Send offline status when leaving
    const handleBeforeUnload = () => {
      wsManager.send({
        type: 'presence',
        data: {
          userId: currentUser.id,
          isOnline: false,
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      unsubscribe()
      window.removeEventListener('popstate', handlePageChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [wsManager, currentUser])

  return { onlineUsers }
}

// ============================================================================
// COLLABORATIVE EDITING HOOKS
// ============================================================================

export function useCollaborativeEditing(entityType: string, entityId: string) {
  const wsManager = getWebSocketManager()
  const currentUser = useAppStore((state) => state.currentUser)
  const [activeEditors, setActiveEditors] = useState<string[]>([])

  useEffect(() => {
    if (!wsManager.isConnected || !currentUser) {
      return
    }

    const handleEditingMessage = (message: WebSocketMessage) => {
      if (
        message.type === 'editing' && 
        message.entity === entityType && 
        message.entityId === entityId
      ) {
        setActiveEditors(message.data?.activeEditors || [])
      }
    }

    const unsubscribe = wsManager.subscribe(handleEditingMessage)

    // Announce that we're editing this entity
    wsManager.send({
      type: 'editing',
      entity: entityType,
      entityId,
      data: {
        action: 'start',
        userId: currentUser.id,
        username: currentUser.username,
      }
    })

    return () => {
      // Announce that we stopped editing
      wsManager.send({
        type: 'editing',
        entity: entityType,
        entityId,
        data: {
          action: 'stop',
          userId: currentUser.id,
        }
      })
      unsubscribe()
    }
  }, [wsManager, currentUser, entityType, entityId])

  return { activeEditors }
}

import { useState } from 'react'