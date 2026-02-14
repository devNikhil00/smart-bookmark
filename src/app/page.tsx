import { redirect } from 'next/navigation'

/**
 * Root Page (/)
 * 
 * Simply redirects to /login
 * This keeps the URL structure clean
 */

export default function RootPage() {
  redirect('/login')
}
