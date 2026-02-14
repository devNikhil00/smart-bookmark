import { createClient } from '@/lib/supabase/server'
import { validateUrl, validateTitle, ValidationError } from '@/lib/utils/validation'
import type { Bookmark, BookmarkInsert } from '@/lib/types/database'

export async function getBookmarks(): Promise<Bookmark[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createBookmark(
  title: string,
  url: string
): Promise<Bookmark> {
  validateTitle(title)
  validateUrl(url)

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('url', url.trim())
    .maybeSingle()

  if (existing) {
    throw new ValidationError('This URL is already bookmarked')
  }

  const { data, error } = await (supabase
    .from('bookmarks')
    .insert as any)({
      title: title.trim(),
      url: url.trim(),
      user_id: user.id
    })
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error('Failed to create bookmark')
  return data as Bookmark
}

export async function updateBookmark(
  id: string,
  title: string,
  url: string
): Promise<Bookmark> {
  validateTitle(title)
  validateUrl(url)

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await (supabase
    .from('bookmarks')
    .update as any)({
      title: title.trim(),
      url: url.trim(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error('Failed to update bookmark')
  return data as Bookmark
}

export async function deleteBookmark(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  if (error) throw error
}
