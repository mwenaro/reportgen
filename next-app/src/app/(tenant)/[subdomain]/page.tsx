export default function TenantPage({
  params,
}: {
  params: { subdomain: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {params.subdomain} School
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          This is the tenant-specific page for {params.subdomain}.
        </p>
      </div>
    </div>
  )
}