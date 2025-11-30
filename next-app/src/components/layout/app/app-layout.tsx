import React from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/state'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Footer } from './footer'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const currentUser = useAppStore((state) => state.currentUser)

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Not Authenticated</h2>
          <p className="text-muted-foreground">Please log in to access the application.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        )}
      >
        {/* Header */}
        <Header />
        
        {/* Main content */}
        <main
          className={cn(
            'flex-1 px-4 py-6 sm:px-6 lg:px-8',
            'min-h-[calc(100vh-4rem)]', // Account for header height
            className
          )}
        >
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

// ============================================================================
// PAGE WRAPPER COMPONENT
// ============================================================================

interface PageWrapperProps {
  title?: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  className?: string
}

export function PageWrapper({
  title,
  description,
  children,
  actions,
  breadcrumbs,
  className
}: PageWrapperProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page header */}
      {(title || description || actions || breadcrumbs) && (
        <div className="space-y-4">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="inline-flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-3 h-3 text-muted-foreground mx-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <div>{children}</div>
    </div>
  )
}

// ============================================================================
// CONTENT CONTAINER
// ============================================================================

interface ContentContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function ContentContainer({
  children,
  size = 'xl',
  className
}: ContentContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// ============================================================================
// GRID LAYOUT COMPONENTS
// ============================================================================

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Grid({ children, cols = 1, gap = 'md', className }: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-12'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// ============================================================================
// FLEX LAYOUT COMPONENTS
// ============================================================================

interface FlexProps {
  children: React.ReactNode
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Flex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

export default AppLayout