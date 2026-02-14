'use client'

import { useRef, useState, useTransition, useEffect } from 'react'
import { addBookmarkAction, updateBookmarkAction } from '@/lib/actions/bookmarks'
import type { Bookmark } from '@/lib/types/database'

interface BookmarkFormProps {
  editingBookmark?: Bookmark | null
  onCancelEdit?: () => void
}

export function BookmarkForm({ editingBookmark, onCancelEdit }: BookmarkFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title)
      setUrl(editingBookmark.url)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setTitle('')
      setUrl('')
    }
  }, [editingBookmark])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      let result
      if (editingBookmark) {
        result = await updateBookmarkAction(editingBookmark.id, formData)
      } else {
        result = await addBookmarkAction(formData)
      }

      if (result.success) {
        setSuccess(true)
        setTitle('')
        setUrl('')
        formRef.current?.reset()
        onCancelEdit?.()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || `Failed to ${editingBookmark ? 'update' : 'add'} bookmark`)
      }
    })
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200"
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Bookmark {editingBookmark ? 'updated' : 'added'} successfully!
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isPending}
            className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="My favorite website"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={isPending}
            className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{editingBookmark ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : (
              editingBookmark ? 'Update Bookmark' : 'Add Bookmark'
            )}
          </button>
          {editingBookmark && (
            <button
              type="button"
              onClick={() => {
                setTitle('')
                setUrl('')
                onCancelEdit?.()
              }}
              disabled={isPending}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-lg transition-colors border border-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
