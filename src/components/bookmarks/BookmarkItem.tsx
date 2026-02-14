'use client'

import { useState, useTransition } from 'react'
import { updateBookmarkAction, deleteBookmarkAction } from '@/lib/actions/bookmarks'
import type { Bookmark } from '@/lib/types/database'

interface BookmarkItemProps {
  bookmark: Bookmark
  viewMode?: 'card' | 'table'
  onEdit?: (bookmark: Bookmark) => void
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

export function BookmarkItem({ bookmark, viewMode = 'card', onEdit }: BookmarkItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [imgError, setImgError] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      await deleteBookmarkAction(bookmark.id)
      setShowDeleteConfirm(false)
    })
  }

  const faviconUrl = getFaviconUrl(bookmark.url)

  // Delete confirmation modal
  if (showDeleteConfirm) {
    const confirmContent = (
      <div className="bg-white border-2 border-red-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Bookmark?</h3>
            <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete this bookmark?</p>
            <p className="text-sm font-medium text-gray-900 truncate">{bookmark.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-400 shadow-sm"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isPending}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    )

    if (viewMode === 'table') {
      return (
        <tr>
          <td colSpan={4} className="p-4">
            {confirmContent}
          </td>
        </tr>
      )
    }
    return confirmContent
  }

  if (viewMode === 'table') {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              {faviconUrl && !imgError ? (
                <img src={faviconUrl} alt="" className="w-5 h-5" onError={() => setImgError(true)} />
              ) : (
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              )}
            </div>
            <span className="font-medium text-gray-900 text-sm">{bookmark.title}</span>
          </div>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs"
          >
            {bookmark.url}
          </a>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
          {new Date(bookmark.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </td>
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit?.(bookmark)}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
              title="Edit bookmark"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
              title="Delete bookmark"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          {faviconUrl && !imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-6 h-6 sm:w-8 sm:h-8"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">{bookmark.title}</h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block mb-2"
          >
            {bookmark.url}
          </a>
          <p className="text-xs text-gray-500">
            Added {new Date(bookmark.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onEdit?.(bookmark)}
            className="p-2 sm:p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
            title="Edit bookmark"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
            className="p-2 sm:p-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
            title="Delete bookmark"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
