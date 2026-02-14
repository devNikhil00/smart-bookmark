'use client'

import { useState } from 'react'
import { BookmarkForm } from '@/components/bookmarks/BookmarkForm'
import { BookmarkList } from '@/components/bookmarks/BookmarkList'
import type { Bookmark } from '@/lib/types/database'

interface DashboardClientProps {
  initialBookmarks: Bookmark[]
}

export function DashboardClient({ initialBookmarks }: DashboardClientProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  return (
    <div className="space-y-6">
      <BookmarkForm 
        editingBookmark={editingBookmark} 
        onCancelEdit={() => setEditingBookmark(null)}
      />
      <BookmarkList 
        initialBookmarks={initialBookmarks}
        onEdit={(bookmark) => setEditingBookmark(bookmark)}
      />
    </div>
  )
}
