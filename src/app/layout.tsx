import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Smart Bookmark - Organize Your Links',
    template: '%s | Smart Bookmark'
  },
  description: 'Production-grade bookmark management with real-time sync, Google OAuth authentication, and enterprise-level security. Save, organize, and access your favorite links instantly across all devices.',
  keywords: ['bookmark manager', 'link organizer', 'real-time sync', 'web app', 'productivity tool', 'Google OAuth'],
  authors: [{ name: 'Smart Bookmark Team' }],
  creator: 'Smart Bookmark',
  publisher: 'Smart Bookmark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Smart Bookmark - Organize Your Links',
    description: 'Production-grade bookmark management with real-time sync across all devices',
    siteName: 'Smart Bookmark',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Bookmark - Organize Your Links',
    description: 'Production-grade bookmark management with real-time sync',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {children}
      </body>
    </html>
  )
}
