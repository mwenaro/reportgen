import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  School,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppStore } from '@/lib/state'
import { UserRole } from '@/lib/auth/config'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: UserRole[]
  badge?: string | number
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Students',
    href: '/students',
    icon: Users,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER, UserRole.TEACHER],
    children: [
      { name: 'All Students', href: '/students', icon: Users },
      { name: 'Add Student', href: '/students/new', icon: Users },
      { name: 'Student Reports', href: '/students/reports', icon: FileText },
    ],
  },
  {
    name: 'Teachers',
    href: '/teachers',
    icon: UserCheck,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER],
    children: [
      { name: 'All Teachers', href: '/teachers', icon: UserCheck },
      { name: 'Add Teacher', href: '/teachers/new', icon: UserCheck },
      { name: 'Teacher Schedule', href: '/teachers/schedule', icon: Calendar },
    ],
  },
  {
    name: 'Classes',
    href: '/classes',
    icon: School,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER, UserRole.TEACHER],
    children: [
      { name: 'All Classes', href: '/classes', icon: School },
      { name: 'Create Class', href: '/classes/new', icon: School },
      { name: 'Class Schedules', href: '/classes/schedules', icon: Calendar },
    ],
  },
  {
    name: 'Subjects',
    href: '/subjects',
    icon: BookOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER, UserRole.TEACHER],
    children: [
      { name: 'All Subjects', href: '/subjects', icon: BookOpen },
      { name: 'Add Subject', href: '/subjects/new', icon: BookOpen },
    ],
  },
  {
    name: 'Exams',
    href: '/exams',
    icon: GraduationCap,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER, UserRole.TEACHER],
    children: [
      { name: 'All Exams', href: '/exams', icon: GraduationCap },
      { name: 'Create Exam', href: '/exams/new', icon: GraduationCap },
      { name: 'Exam Results', href: '/exams/results', icon: FileText },
      { name: 'Grade Results', href: '/exams/grading', icon: FileText },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    children: [
      { name: 'Student Reports', href: '/reports/students', icon: FileText },
      { name: 'Class Reports', href: '/reports/classes', icon: FileText },
      { name: 'Exam Reports', href: '/reports/exams', icon: FileText },
      { name: 'Performance Analytics', href: '/reports/analytics', icon: BarChart3 },
    ],
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN, UserRole.HEAD_TEACHER],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const currentUser = useAppStore((state) => state.currentUser)
  const currentSchool = useAppStore((state) => state.currentSchool)

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true
    return currentUser?.role && item.roles.includes(currentUser.role)
  })

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background border-r transition-all duration-300 ease-in-out',
          !isSidebarOpen && 'w-16'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <School className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">ReportGen</span>
                {currentSchool && (
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {currentSchool.name}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
              <School className="h-4 w-4" />
            </div>
          )}

          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                <NavigationItem
                  item={item}
                  isActive={isItemActive(item.href)}
                  isCollapsed={!isSidebarOpen}
                />
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          {!isSidebarOpen ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="w-8 h-8 mx-auto"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 ReportGen
              </p>
              <p className="text-xs text-muted-foreground">
                v1.0.0
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

interface NavigationItemProps {
  item: NavigationItem
  isActive: boolean
  isCollapsed: boolean
}

function NavigationItem({ item, isActive, isCollapsed }: NavigationItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  const toggleExpanded = () => {
    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded)
    }
  }

  const ItemContent = () => (
    <>
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight
              className={cn(
                'ml-auto h-4 w-4 shrink-0 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </>
      )}
    </>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 px-3',
                isActive && 'bg-secondary text-secondary-foreground'
              )}
            >
              <ItemContent />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div>
      {hasChildren ? (
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-3 px-3',
            isActive && 'bg-secondary text-secondary-foreground'
          )}
          onClick={toggleExpanded}
        >
          <ItemContent />
        </Button>
      ) : (
        <Link href={item.href}>
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 px-3',
              isActive && 'bg-secondary text-secondary-foreground'
            )}
          >
            <ItemContent />
          </Button>
        </Link>
      )}

      {/* Submenu */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-6 mt-1 space-y-1 border-l pl-4">
          {item.children?.map((child) => (
            <Link key={child.name} href={child.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2 px-2 text-sm',
                  isItemActive(child.href) && 'bg-muted text-muted-foreground'
                )}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  function isItemActive(href: string) {
    if (href === '/dashboard') {
      return window.location.pathname === '/dashboard' || window.location.pathname === '/'
    }
    return window.location.pathname.startsWith(href)
  }
}

export default Sidebar