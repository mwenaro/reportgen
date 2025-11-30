import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export interface ModalHeaderProps {
  title?: string
  description?: string
  onClose?: () => void
  showCloseButton?: boolean
  children?: React.ReactNode
  className?: string
}

export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOverlayClick ? onClose : undefined}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        {(title || description || showCloseButton) && (
          <ModalHeader
            title={title}
            description={description}
            onClose={onClose}
            showCloseButton={showCloseButton}
          />
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export function ModalHeader({
  title,
  description,
  onClose,
  showCloseButton = true,
  children,
  className,
}: ModalHeaderProps) {
  return (
    <DialogHeader className={cn('relative', className)}>
      {children || (
        <>
          {title && <DialogTitle className="pr-8">{title}</DialogTitle>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </>
      )}
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </DialogHeader>
  )
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn('py-4', className)}>{children}</div>
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2 pt-4 border-t', className)}>
      {children}
    </div>
  )
}

// ============================================================================
// SPECIALIZED MODALS
// ============================================================================

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader title={title} description={description} />
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          ) : null}
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])
  
  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<{
    title?: string
    description?: string
    onConfirm: () => void | Promise<void>
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
  } | null>(null)

  const confirm = React.useCallback((options: {
    title?: string
    description?: string
    onConfirm: () => void | Promise<void>
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
  }) => {
    setConfig(options)
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
    setConfig(null)
  }, [])

  const ConfirmModalComponent = React.useCallback(() => {
    if (!config) return null

    return (
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        onConfirm={config.onConfirm}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
      />
    )
  }, [isOpen, close, config])

  return {
    confirm,
    ConfirmModal: ConfirmModalComponent,
  }
}

export default Modal