'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookmarkItem } from './BookmarkItem'
import { EmptyState } from './EmptyState'
import type { Bookmark } from '@/lib/types/database'

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  onEdit?: (bookmark: Bookmark) => void
}

type ViewMode = 'card' | 'table'

export function BookmarkList({ initialBookmarks, onEdit }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBookmarks((current) =>
              current.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
            )
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          }
        )
        .subscribe()

      return channel
    }

    let channelPromise = setupSubscription()

    return () => {
      channelPromise.then((channel) => {
        if (channel) supabase.removeChannel(channel)
      })
    }
  }, [supabase])

  if (bookmarks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Bookmarks ({bookmarks.length})
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Card view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Website</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Added</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookmarks.map((bookmark) => (
                  <BookmarkItem key={bookmark.id} bookmark={bookmark} viewMode="table" onEdit={onEdit} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
