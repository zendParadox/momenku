-- MomenKu Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free','basic','premium','enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. TEMPLATES (bawaan themes)
-- ============================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'wedding' CHECK (category IN ('wedding','birthday','aqiqah','engagement','corporate','other')),
  thumbnail_url TEXT,
  preview_url TEXT,
  -- default sections JSON structure
  default_sections JSONB DEFAULT '[]'::jsonb,
  -- styling defaults
  primary_color TEXT DEFAULT '#059669',
  font_heading TEXT DEFAULT 'Cormorant Garamond',
  font_body TEXT DEFAULT 'Plus Jakarta Sans',
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. INVITATIONS (undangan yang dibuat user)
-- ============================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  
  -- basic info
  title TEXT NOT NULL DEFAULT 'Undangan Saya',
  slug TEXT UNIQUE,
  event_type TEXT DEFAULT 'wedding' CHECK (event_type IN ('wedding','birthday','aqiqah','engagement','corporate','other')),
  
  -- event details
  event_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  event_location TEXT,
  event_address TEXT,
  event_maps_url TEXT,
  
  -- couple info (wedding)
  groom_name TEXT,
  bride_name TEXT,
  groom_full_name TEXT,
  bride_full_name TEXT,
  groom_parents TEXT,
  bride_parents TEXT,
  
  -- media
  cover_image_url TEXT,
  photo_gallery JSONB DEFAULT '[]'::jsonb,
  background_music_url TEXT,
  
  -- sections (the actual editor data)
  sections JSONB DEFAULT '[]'::jsonb,
  -- example section structure:
  -- [
  --   { "id": "hero-1", "type": "hero", "order": 0, "visible": true, "data": { "title": "...", "subtitle": "...", "image": "..." } },
  --   { "id": "gallery-1", "type": "gallery", "order": 1, "visible": true, "data": { "images": [] } },
  --   { "id": "rsvp-1", "type": "rsvp", "order": 2, "visible": true, "data": { "message": "...", "fields": [] } }
  -- ]
  
  -- theme overrides (user customizations on top of template)
  theme_overrides JSONB DEFAULT '{}'::jsonb,
  -- example: { "primaryColor": "#EC4899", "fontHeading": "Playfair Display" }
  
  -- settings
  custom_css TEXT,
  custom_domain TEXT,
  custom_url_slug TEXT,
  password_protected BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  
  -- stats
  view_count INT DEFAULT 0,
  rsvp_count INT DEFAULT 0,
  
  -- status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. GUESTS (daftar tamu)
-- ============================================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  
  -- attendance
  attendance_status TEXT DEFAULT 'pending' CHECK (attendance_status IN ('pending','attending','not_attending','maybe')),
  guest_count INT DEFAULT 1,
  companion_names TEXT,
  
  -- message
  wish_message TEXT,
  
  -- tracking
  invite_sent BOOLEAN DEFAULT FALSE,
  invite_sent_at TIMESTAMPTZ,
  page_viewed BOOLEAN DEFAULT FALSE,
  page_viewed_at TIMESTAMPTZ,
  qr_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. RSVPs (respons dari tamu)
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  
  guest_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending','not_attending','maybe')),
  guest_count INT DEFAULT 1,
  companion_names TEXT,
  wish_message TEXT,
  
  -- tracking
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. INVITATION_VIEWS (analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS invitation_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  
  -- scroll depth tracking (0-100)
  max_scroll_depth INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_guests_invitation ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_views_invitation ON invitation_views(invitation_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON invitation_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated ON profiles;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS invitations_updated ON invitations;
CREATE TRIGGER invitations_updated BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS guests_updated ON guests;
CREATE TRIGGER guests_updated BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Invitations: owner full access, public can view published
CREATE POLICY "Users can CRUD own invitations"
  ON invitations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view published invitations"
  ON invitations FOR SELECT USING (status = 'published');

-- Guests: owner can manage, public can view via invitation
CREATE POLICY "Users can manage own guests"
  ON guests FOR ALL USING (
    invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid())
  );

-- RSVPs: owner can read, anyone can insert (public RSVP)
CREATE POLICY "Users can view own RSVPs"
  ON rsvps FOR SELECT USING (
    invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid())
  );
CREATE POLICY "Anyone can submit RSVP"
  ON rsvps FOR INSERT WITH CHECK (true);

-- Templates: everyone can read active templates
CREATE POLICY "Public can view active templates"
  ON templates FOR SELECT USING (is_active = true);

-- Views: owner can read, anyone can insert
CREATE POLICY "Users can view own invitation analytics"
  ON invitation_views FOR SELECT USING (
    invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid())
  );
CREATE POLICY "Anyone can record view"
  ON invitation_views FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED DATA (10 default templates)
-- ============================================================
INSERT INTO templates (name, slug, category, primary_color, font_heading, font_body, is_premium, sort_order) VALUES
  ('Elegant Wedding', 'elegant-wedding', 'wedding', '#B8860B', 'Playfair Display', 'Lora', false, 1),
  ('Modern Minimal', 'modern-minimal', 'wedding', '#111827', 'Inter', 'Inter', false, 2),
  ('Rose Garden', 'rose-garden', 'wedding', '#EC4899', 'Cormorant Garamond', 'Crimson Text', false, 3),
  ('Royal Gold', 'royal-gold', 'wedding', '#D4AF37', 'Cinzel', 'Cormorant Garamond', true, 4),
  ('Sakura Blossom', 'sakura-blossom', 'wedding', '#F472B6', 'Zen Maru Gothic', 'Noto Sans JP', true, 5),
  ('Sweet Birthday', 'sweet-birthday', 'birthday', '#F59E0B', 'Fredoka', 'Nunito', false, 6),
  ('Party Celebration', 'party-celebration', 'birthday', '#8B5CF6', 'Poppins', 'Poppins', false, 7),
  ('Baby Aqiqah', 'baby-aqiqah', 'aqiqah', '#34D399', 'Quicksand', 'Nunito', false, 8),
  ('Engagement Bliss', 'engagement-bliss', 'engagement', '#F43F5E', 'Playfair Display', 'Source Serif 4', true, 9),
  ('Corporate Event', 'corporate-event', 'corporate', '#1E40AF', 'IBM Plex Sans', 'IBM Plex Sans', false, 10)
ON CONFLICT (slug) DO NOTHING;
