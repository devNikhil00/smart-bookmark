import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * OAuth Callback Route
 * 
 * Why this exists:
 * - Google redirects here after user authorizes
 * - Exchanges authorization code for session
 * - Sets auth cookies
 * 
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google
 * 3. User authorizes
 * 4. Google redirects here with code
 * 5. Exchange code for session
 * 6. Redirect to dashboard
 * 
 * Security:
 * - Code exchange happens on server (secure)
 * - Session stored in HTTP-only cookies
 * - No client-side token exposure
 */

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard after successful login
  return NextResponse.redirect(`${origin}/dashboard`)
}
