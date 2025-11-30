'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Students', href: '/dashboard/students', icon: '👥' },
  { name: 'Teachers', href: '/dashboard/teachers', icon: '👨‍🏫' },
  { name: 'Classes', href: '/dashboard/classes', icon: '🏫' },
  { name: 'Subjects', href: '/dashboard/subjects', icon: '📚' },
  { name: 'Examinations', href: '/dashboard/exams', icon: '📝' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📄' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-blue-600">
              SchoolMS
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* User menu placeholder */}
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">School Administrator</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    🔔
                  </button>
                  <div className="relative">
                    <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">A</span>
                      </div>
                    </button>
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