import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationProps {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  dismissible?: boolean
  autoClose?: boolean
  duration?: number // in milliseconds
  onDismiss?: (id?: string) => void
  className?: string
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }[]
}

export interface NotificationContextType {
  notifications: NotificationProps[]
  addNotification: (notification: Omit<NotificationProps, 'id'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

// ============================================================================
// STYLING CONFIGURATIONS
// ============================================================================

const notificationStyles = {
  success: {
    container: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300',
  },
  error: {
    container: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    container: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
  },
}

const iconComponents = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

// ============================================================================
// NOTIFICATION COMPONENT
// ============================================================================

export function Notification({
  id,
  type,
  title,
  message,
  dismissible = true,
  autoClose = true,
  duration = 5000,
  onDismiss,
  className,
  actions = [],
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const IconComponent = iconComponents[type]
  const styles = notificationStyles[type]

  // Auto close functionality
  React.useEffect(() => {
    if (autoClose && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleDismiss()
      }, duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [autoClose, duration])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.(id)
    }, 150) // Wait for fade out animation
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 shadow-sm transition-all duration-150',
        styles.container,
        !isVisible && 'opacity-0 translate-x-full',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <IconComponent className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-medium mb-1', styles.title)}>{title}</h4>
          )}
          <p className={cn('text-sm', styles.message)}>{message}</p>
          
          {actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="h-7 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// NOTIFICATION CONTAINER
// ============================================================================

export function NotificationContainer({
  notifications,
  position = 'top-right',
  className,
}: {
  notifications: NotificationProps[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  className?: string
}) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 max-w-sm w-full',
        positionClasses[position],
        className
      )}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  )
}

// ============================================================================
// NOTIFICATION CONTEXT
// ============================================================================

const NotificationContext = React.createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>([])

  const addNotification = React.useCallback((notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newNotification = { ...notification, id }
    
    setNotifications((prev) => [...prev, newNotification])
    
    return id
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearAllNotifications = React.useCallback(() => {
    setNotifications([])
  }, [])

  const contextValue = React.useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  }), [notifications, addNotification, removeNotification, clearAllNotifications])

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications.map(notification => ({
          ...notification,
          onDismiss: removeNotification,
        }))} 
      />
    </NotificationContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  
  return context
}

export function useNotify() {
  const { addNotification } = useNotifications()
  
  return React.useMemo(() => ({
    success: (message: string, options?: Partial<NotificationProps>) => 
      addNotification({ type: 'success', message, ...options }),
    
    error: (message: string, options?: Partial<NotificationProps>) => 
      addNotification({ type: 'error', message, ...options }),
    
    warning: (message: string, options?: Partial<NotificationProps>) => 
      addNotification({ type: 'warning', message, ...options }),
    
    info: (message: string, options?: Partial<NotificationProps>) => 
      addNotification({ type: 'info', message, ...options }),
    
    custom: (notification: Omit<NotificationProps, 'id'>) => 
      addNotification(notification),
  }), [addNotification])
}

// ============================================================================
// TOAST VARIANTS (Alternative API)
// ============================================================================

export const toast = {
  success: (message: string, options?: Partial<NotificationProps>) => {
    // This would need to be implemented with a global notification manager
    // For now, it's a placeholder for the API we want
    console.log('Toast success:', message, options)
  },
  error: (message: string, options?: Partial<NotificationProps>) => {
    console.log('Toast error:', message, options)
  },
  warning: (message: string, options?: Partial<NotificationProps>) => {
    console.log('Toast warning:', message, options)
  },
  info: (message: string, options?: Partial<NotificationProps>) => {
    console.log('Toast info:', message, options)
  },
}

export default Notification