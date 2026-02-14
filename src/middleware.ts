import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware - Route Protection
 * 
 * Why middleware:
 * - Runs before page loads (faster than client-side checks)
 * - Centralized auth logic
 * - Protects all routes in one place
 * - Runs on Edge (globally distributed, fast)
 * 
 * How it works:
 * 1. Intercepts every request
 * 2. Checks if user is authenticated
 * 3. Redirects if needed
 * 4. Updates auth cookies
 * 
 * Protected routes:
 * - /dashboard → requires auth
 * 
 * Public routes:
 * - /login → accessible to all
 * - /auth/callback → OAuth callback
 */

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
