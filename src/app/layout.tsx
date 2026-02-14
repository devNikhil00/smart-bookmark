import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Bookmark - Save & Organize Your Links',
  description: 'Production-grade bookmark manager with real-time sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
