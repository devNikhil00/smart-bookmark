-- Smart Bookmark App Database Setup
-- Run this in Supabase SQL Editor

-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert bookmarks for themselves
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at DESC);
CREATE INDEX bookmarks_url_idx ON bookmarks(url);

-- Enable realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
