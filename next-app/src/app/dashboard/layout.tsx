'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  BarChart3,
  Settings,
  Home
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Students', href: '/dashboard/students', icon: Users },
  { name: 'Teachers', href: '/dashboard/teachers', icon: UserCheck },
  { name: 'Classes', href: '/dashboard/classes', icon: GraduationCap },
  { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card shadow-sm border-r">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              ReportGen
            </Link>
            <p className="text-sm text-muted-foreground mt-1">School Management</p>
          </div>
          
          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <DashboardHeader />
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}