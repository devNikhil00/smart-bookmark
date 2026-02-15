export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* Animated loader */}
        <div className="inline-block relative w-20 h-20 mb-4">
          <div className="absolute border-4 border-indigo-200 rounded-full w-20 h-20"></div>
          <div className="absolute border-4 border-indigo-600 rounded-full w-20 h-20 animate-spin border-t-transparent"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  )
}
