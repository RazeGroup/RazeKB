-- ============================================
-- Offensive Community - Supabase Schema
-- 1. Go to https://supabase.com -> SQL Editor
-- 2. Paste and run this entire script
-- 3. Enable RLS for each table
-- 4. Go to Authentication > Settings > disable "Confirm email" for testing
-- ============================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  reputation INTEGER DEFAULT 0,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'editor', 'admin')),
  website TEXT DEFAULT '',
  github TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULES TABLE (existing content)
CREATE TABLE IF NOT EXISTS modules (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  content TEXT NOT NULL,
  content_ar TEXT,
  domain TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES profiles(id),
  difficulty TEXT DEFAULT 'beginner',
  source_url TEXT,
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FORUM POSTS
CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FORUM COMMENTS
CREATE TABLE IF NOT EXISTS forum_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id BIGINT REFERENCES forum_comments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VOTES
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id BIGINT REFERENCES forum_comments(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- NEWS CACHE
CREATE TABLE IF NOT EXISTS news_cache (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_modules_domain ON modules(domain);
CREATE INDEX IF NOT EXISTS idx_modules_tags ON modules USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_post ON votes(post_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_cache(published_at DESC);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public profiles" ON profiles;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public modules" ON modules;
CREATE POLICY "Public modules" ON modules FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Public forum posts" ON forum_posts;
CREATE POLICY "Public forum posts" ON forum_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public comments" ON forum_comments;
CREATE POLICY "Public comments" ON forum_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public news" ON news_cache;
CREATE POLICY "Public news" ON news_cache FOR SELECT USING (true);

-- AUTH POLICIES
DROP POLICY IF EXISTS "Insert own profile" ON profiles;
CREATE POLICY "Insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Update own profile" ON profiles;
CREATE POLICY "Update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Create forum post" ON forum_posts;
CREATE POLICY "Create forum post" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Update own post" ON forum_posts;
CREATE POLICY "Update own post" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Delete own post" ON forum_posts;
CREATE POLICY "Delete own post" ON forum_posts FOR DELETE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Create comment" ON forum_comments;
CREATE POLICY "Create comment" ON forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Delete own comment" ON forum_comments;
CREATE POLICY "Delete own comment" ON forum_comments FOR DELETE USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Insert vote" ON votes;
CREATE POLICY "Insert vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Update vote" ON votes;
CREATE POLICY "Update vote" ON votes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Delete vote" ON votes;
CREATE POLICY "Delete vote" ON votes FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Insert report" ON reports;
CREATE POLICY "Insert report" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ADMIN POLICIES (admins can do everything)
DROP POLICY IF EXISTS "Admin all profiles" ON profiles;
CREATE POLICY "Admin all profiles" ON profiles FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
DROP POLICY IF EXISTS "Admin all posts" ON forum_posts;
CREATE POLICY "Admin all posts" ON forum_posts FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- AUTO CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
