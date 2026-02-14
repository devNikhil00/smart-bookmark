import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import * as bookmarkService from '@/lib/services/bookmarks'
import { DashboardClient } from '@/components/bookmarks/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch initial bookmarks on server
  const bookmarks = await bookmarkService.getBookmarks()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Smart Bookmark</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">{user.email}</p>
              </div>
            </div>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <DashboardClient initialBookmarks={bookmarks} />
      </main>
    </div>
  )
}
