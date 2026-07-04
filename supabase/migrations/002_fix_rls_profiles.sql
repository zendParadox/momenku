-- Fix RLS policies for profiles + invitations
-- Run this in Supabase SQL Editor

-- Allow authenticated users to insert their own profile
-- (for users registered before the trigger was set up)
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read their own invitations
-- (the existing policy uses FOR ALL which should work, but let's be explicit)
DROP POLICY IF EXISTS "Users can CRUD own invitations" ON invitations;
CREATE POLICY "Users can view own invitations"
  ON invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invitations"
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations"
  ON invitations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations"
  ON invitations FOR DELETE
  USING (auth.uid() = user_id);
