-- Create rsvps table for public RSVP submissions
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'not_attending', 'maybe')),
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1),
  companion_names TEXT,
  wish_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create wishes table for public wish submissions
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);

-- RLS policies: public read/write for rsvps and wishes
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read rsvps (public data)
CREATE POLICY "Anyone can read rsvps"
  ON rsvps FOR SELECT
  USING (true);

-- Allow anyone to insert rsvps (public form)
CREATE POLICY "Anyone can insert rsvps"
  ON rsvps FOR INSERT
  WITH CHECK (true);

-- Allow invitation owners to read all rsvps for their invitations
CREATE POLICY "Owners can read their rsvps"
  ON rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = rsvps.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

-- Allow anyone to read wishes (public data)
CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  USING (true);

-- Allow anyone to insert wishes (public form)
CREATE POLICY "Anyone can insert wishes"
  ON wishes FOR INSERT
  WITH CHECK (true);

-- Allow invitation owners to read all wishes for their invitations
CREATE POLICY "Owners can read their wishes"
  ON wishes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = wishes.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );
