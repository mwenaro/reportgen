export default function SettingsPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure school settings, academic year, and system preferences.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {/* Settings interface will be implemented later */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="p-6 text-center text-gray-500">
            Settings interface coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}