/**
 * Database Types
 * 
 * Why this exists:
 * - Type safety across the entire application
 * - Autocomplete in IDE
 * - Catch errors at compile time, not runtime
 * - Self-documenting code
 * 
 * Best practice:
 * - Generate these types from Supabase CLI: `supabase gen types typescript`
 * - For now, manually defined based on schema
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
