export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="text-gray-400 mb-8">
          <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The organization blog you're looking for doesn't exist or may have been moved.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Check the URL and try again, or contact the organization administrator.
          </p>
        </div>
      </div>
    </div>
  );
} 