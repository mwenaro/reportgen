import React from 'react'
import { Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useAppStore, useUnreadNotifications } from '@/lib/state'
import { formatRelativeTime, cn } from '@/lib/utils'

interface NotificationDropdownProps {
  children: React.ReactNode
}

export function NotificationDropdown({ children }: NotificationDropdownProps) {
  const notifications = useAppStore((state) => state.notifications)
  const unreadNotifications = useUnreadNotifications()
  const markNotificationRead = useAppStore((state) => state.markNotificationRead)
  const removeNotification = useAppStore((state) => state.removeNotification)
  const clearNotifications = useAppStore((state) => state.clearNotifications)

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id)
  }

  const handleRemove = (id: string) => {
    removeNotification(id)
  }

  const handleClearAll = () => {
    clearNotifications()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success' as const
      case 'warning':
        return 'warning' as const
      case 'error':
        return 'destructive' as const
      default:
        return 'info' as const
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadNotifications.length} new
              </Badge>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-6 px-2"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                    !notification.isRead && 'bg-muted/30'
                  )}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(notification.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant={getNotificationBadgeVariant(notification.type)}
                        className="text-xs"
                      >
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              action.action()
                              handleMarkAsRead(notification.id)
                            }}
                            className="h-7 px-3 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-center text-xs"
              onClick={() => window.location.href = '/notifications'}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown