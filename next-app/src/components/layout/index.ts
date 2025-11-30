// Layout components
export { Sidebar } from './sidebar'

// Additional layout components will be added in later prompts
export function Header({ title }: { title?: string }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {title || 'School Management'}
        </h1>
        {/* User menu will be added later */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Welcome back!</div>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="px-6 py-4">
        <p className="text-sm text-gray-500 text-center">
          © 2024 School Management System. All rights reserved.
        </p>
      </div>
    </footer>
  )
}