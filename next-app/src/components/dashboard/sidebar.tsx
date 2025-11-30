// Dashboard sidebar navigation component
// This will be enhanced in later prompts

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
}

interface SidebarProps {
  navigation: NavItem[]
}

export function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">
          School Management
        </h2>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}