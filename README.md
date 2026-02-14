# Smart Bookmark App

A production-grade bookmark management application with real-time synchronization, built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## 🎯 Overview

Smart Bookmark allows users to save, organize, and manage their favorite links with instant synchronization across devices. The application features Google OAuth authentication, real-time updates via WebSocket, and a clean, responsive interface with both card and table views.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime (WebSocket)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/
│   ├── (auth)/login/          # Public login page
│   ├── (protected)/dashboard/ # Protected dashboard
│   ├── auth/                  # OAuth callback handlers
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── auth/                  # Authentication components
│   └── bookmarks/             # Bookmark CRUD components
├── lib/
│   ├── actions/               # Server actions
│   ├── services/              # Business logic layer
│   ├── supabase/              # Supabase clients
│   ├── types/                 # TypeScript types
│   └── utils/                 # Validation utilities
└── middleware.ts              # Route protection
```

## 🔐 Authentication

### Google OAuth Flow
1. User clicks "Continue with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to `/auth/callback`
4. Callback handler exchanges authorization code for session
5. User redirected to `/dashboard` with active session

### Session Management
- Sessions stored in HTTP-only cookies (secure)
- Middleware validates session on every request
- Automatic session refresh handled by Supabase
- Logout clears session and redirects to login

### Route Protection
Edge middleware intercepts all requests and:
- Checks authentication status server-side
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`
- Runs globally on Vercel Edge Network (fast)

## 🛡️ Security - Row Level Security (RLS)

### Database Security
All data access is protected at the database level using PostgreSQL Row Level Security:

```sql
-- Enable RLS on bookmarks table
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only SELECT their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- Users can only INSERT their own bookmarks
CREATE POLICY "Users can create own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own bookmarks
CREATE POLICY "Users can update own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only DELETE their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);
```

### Why RLS Matters
- **Database-level enforcement**: Even if client code is compromised, users cannot access other users' data
- **Zero-trust architecture**: Every query is validated against user identity
- **No application-level filtering needed**: Database handles all access control
- **Prevents SQL injection**: Parameterized queries with built-in protection

### Security Layers
1. **Edge Middleware**: Validates session before page loads
2. **Server Components**: Auth checks on server before rendering
3. **Server Actions**: Validate user identity in mutations
4. **RLS Policies**: Final enforcement at database level

## ⚡ Real-time Synchronization

### WebSocket Implementation
Bookmarks sync instantly across all open tabs/devices using Supabase Realtime:

```typescript
// Subscribe to database changes
supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    // Update UI instantly
  })
  .subscribe()
```

### How It Works
1. User adds/edits/deletes bookmark in Tab A
2. Change written to PostgreSQL database
3. Database triggers real-time event
4. Supabase broadcasts event via WebSocket
5. Tab B receives event and updates UI instantly
6. No polling, no delays, no manual refresh needed

### Real-time Features
- **Instant updates**: Changes appear in <100ms
- **Filtered subscriptions**: Only receive your own bookmark changes
- **Automatic reconnection**: Handles network interruptions
- **Memory leak prevention**: Proper cleanup on component unmount

## 📚 Features

### Bookmark Management
- **Add**: Create bookmarks with title and URL validation
- **Edit**: Inline editing with save/cancel options
- **Delete**: Remove bookmarks with confirmation
- **View Modes**: Toggle between card and table layouts
- **Favicons**: Automatic website logo fetching
- **Duplicate Prevention**: Warns if URL already bookmarked

### User Interface
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark Gradient**: Professional blue-to-indigo login page
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful prompts when no bookmarks exist

### Data Validation
- **URL Validation**: Ensures valid HTTP/HTTPS URLs
- **Title Validation**: Requires non-empty titles
- **Client-side**: Instant feedback before submission
- **Server-side**: Final validation in server actions

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Cloud Console project (for OAuth)

### 1. Clone Repository
```bash
git clone <repository-url>
cd smart-bookmark
npm install
```

### 2. Configure Supabase

#### Create Project
1. Go to https://supabase.com
2. Create new project
3. Wait for database provisioning

#### Run Database Setup
Execute `supabase-setup.sql` in Supabase SQL Editor:
- Creates `bookmarks` table
- Enables RLS policies
- Creates indexes for performance
- Enables Realtime

#### Configure Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Add authorized redirect URI: `http://localhost:3000/auth/callback`

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 5. Test Application
- Login with Google
- Add bookmarks
- Edit bookmarks
- Delete bookmarks
- Open second tab and verify real-time sync

## 📦 Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Import GitHub repository
3. Add environment variables (same as `.env.local`)
4. Deploy

### 3. Update Supabase
Add production URL to Supabase:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

### 4. Verify Production
Test all features in production environment

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Code Structure
- **Server Components**: Default, used for data fetching
- **Client Components**: Used for interactivity (`'use client'`)
- **Server Actions**: Mutations with `'use server'`
- **Middleware**: Edge runtime for route protection

## 🎨 Design Decisions

### Why Next.js App Router?
- Server Components by default (better performance)
- Built-in middleware for auth
- Streaming and Suspense support
- Modern React features

### Why Supabase?
- PostgreSQL with RLS (enterprise-grade security)
- Built-in authentication
- Real-time subscriptions
- Generous free tier

### Why TypeScript?
- Type safety prevents runtime errors
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

### Why Tailwind CSS?
- Utility-first (fast development)
- No CSS file management
- Responsive design utilities
- Production optimization

## 🚧 Future Enhancements

- [ ] Search and filter bookmarks
- [ ] Categories/tags for organization
- [ ] Bookmark folders
- [ ] Import/export functionality
- [ ] Browser extension
- [ ] Bookmark sharing
- [ ] Dark mode
- [ ] Keyboard shortcuts

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 🚧 Challenges & Solutions

### Challenge 1: Real-time Synchronization
**Problem**: Initial implementation caused memory leaks due to improper WebSocket cleanup.
**Solution**: Used `useMemo` to prevent client recreation and proper cleanup in `useEffect` return function.

### Challenge 2: Row Level Security
**Problem**: Users could potentially access other users' bookmarks through direct API calls.
**Solution**: Implemented RLS policies at the database level, ensuring security even if client code is compromised.

### Challenge 3: Edit Mode State Management
**Problem**: Managing edit state between form and list components.
**Solution**: Lifted state to parent `DashboardClient` component and passed callbacks for clean data flow.

### Challenge 4: TypeScript Type Safety
**Problem**: Supabase client methods had type casting issues.
**Solution**: Created custom `Database` type and used type assertions where necessary while maintaining safety.

---

**Built with ❤️ using Next.js, TypeScript, Supabase, and Tailwind CSS**
