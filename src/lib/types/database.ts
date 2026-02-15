/**
 * Database Types
 */

export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at'>

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark
        Insert: BookmarkInsert
        Update: Partial<Omit<Bookmark, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
