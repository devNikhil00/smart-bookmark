/**
 * EmptyState Component
 */

export function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <div className="flex justify-center mb-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No bookmarks yet
      </h3>
      <p className="text-gray-600 text-sm">
        Add your first bookmark using the form above
      </p>
    </div>
  )
}
