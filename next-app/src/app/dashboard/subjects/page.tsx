export default function SubjectsPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage learning areas, curriculum, and subject assignments.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Subject
          </button>
        </div>
      </div>

      <div className="mt-8">
        {/* Subject management interface will be implemented later */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <div className="p-6 text-center text-gray-500">
            Subject management interface coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}