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
  Home,
  Bell,
  Search
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Teachers', href: '/teachers', icon: UserCheck },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
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
            <Link href="/" className="text-2xl font-bold text-primary">
              ReportGen
            </Link>
            <p className="text-sm text-muted-foreground mt-1">School Management</p>
          </div>
          
          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
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
          <header className="bg-card shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}