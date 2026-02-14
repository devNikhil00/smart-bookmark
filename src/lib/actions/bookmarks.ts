'use server'

import { revalidatePath } from 'next/cache'
import * as bookmarkService from '@/lib/services/bookmarks'

export async function addBookmarkAction(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const url = formData.get('url') as string

    await bookmarkService.createBookmark(title, url)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add bookmark' 
    }
  }
}

export async function updateBookmarkAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const url = formData.get('url') as string

    await bookmarkService.updateBookmark(id, title, url)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update bookmark' 
    }
  }
}

export async function deleteBookmarkAction(id: string) {
  try {
    await bookmarkService.deleteBookmark(id)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete bookmark' 
    }
  }
}
