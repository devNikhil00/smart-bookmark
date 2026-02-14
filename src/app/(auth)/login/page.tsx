import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginButton } from '@/components/auth/LoginButton'

/**
 * Login Page (/)
 * 
 * Architecture decisions:
 * - Server Component (default in App Router)
 * - Checks auth on server before rendering
 * - Redirects if already logged in
 * 
 * Why Server Component:
 * - Faster initial load (no client JS needed)
 * - SEO friendly
 * - Secure auth check on server
 * 
 * Flow:
 * 1. Server checks if user is authenticated
 * 2. If yes → redirect to /dashboard
 * 3. If no → show login page
 */

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Smart Bookmark
            </h1>
            <p className="text-gray-600 text-base">
              Save and organize your favorite links with real-time sync
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time synchronization across devices</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure cloud storage with Google</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Easy access from anywhere</span>
            </div>
          </div>

          {/* Login Button */}
          <LoginButton />

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
