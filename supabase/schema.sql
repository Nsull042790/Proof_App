-- PROOF App Database Schema
-- Run this in your Supabase SQL Editor (SQL Editor tab in dashboard)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PLAYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT 'Player',
  nickname TEXT DEFAULT '',
  handicap INTEGER DEFAULT 20,
  avatar TEXT,
  challenge_points INTEGER DEFAULT 0,
  prediction_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default 12 players
INSERT INTO players (number, name, nickname, handicap) VALUES
  (1, 'Player 1', '', 20),
  (2, 'Player 2', '', 20),
  (3, 'Player 3', '', 20),
  (4, 'Player 4', '', 20),
  (5, 'Player 5', '', 20),
  (6, 'Player 6', '', 20),
  (7, 'Player 7', '', 20),
  (8, 'Player 8', '', 20),
  (9, 'Player 9', '', 20),
  (10, 'Player 10', '', 20),
  (11, 'Player 11', '', 20),
  (12, 'Player 12', '', 20)
ON CONFLICT DO NOTHING;

-- ============================================
-- SCORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 4),
  hole_scores INTEGER[] DEFAULT '{}',
  total INTEGER DEFAULT 0,
  blooper_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, round_number)
);

-- ============================================
-- PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID REFERENCES players(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT 'Proof.',
  proof_type TEXT DEFAULT 'glory' CHECK (proof_type IN ('glory', 'disaster', 'lies', 'life', 'challenge')),
  tagged_players UUID[] DEFAULT '{}',
  reactions_fire INTEGER DEFAULT 0,
  reactions_dead INTEGER DEFAULT 0,
  reactions_laugh INTEGER DEFAULT 0,
  reactions_cap INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  category TEXT NOT NULL,
  proof_required BOOLEAN DEFAULT true,
  witness_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'verified')),
  claimed_by UUID REFERENCES players(id) ON DELETE SET NULL,
  verified_by UUID[] DEFAULT '{}',
  disputed_by UUID[] DEFAULT '{}',
  proof_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  players_involved UUID[] NOT NULL,
  stakes TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'settled')),
  winner UUID REFERENCES players(id) ON DELETE SET NULL,
  created_by UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  reactions_fire INTEGER DEFAULT 0,
  reactions_dead INTEGER DEFAULT 0,
  reactions_laugh INTEGER DEFAULT 0,
  reactions_cap INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  said_by UUID REFERENCES players(id) ON DELETE SET NULL,
  context TEXT DEFAULT '',
  reactions_fire INTEGER DEFAULT 0,
  reactions_dead INTEGER DEFAULT 0,
  reactions_laugh INTEGER DEFAULT 0,
  reactions_cap INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PREDICTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 4),
  predicted_winner UUID REFERENCES players(id) ON DELETE SET NULL,
  own_over_under INTEGER DEFAULT 90,
  first_water UUID REFERENCES players(id) ON DELETE SET NULL,
  most_3_putts UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, round_number)
);

-- ============================================
-- TIME CAPSULE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS time_capsule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  trip_winner UUID REFERENCES players(id) ON DELETE SET NULL,
  trip_last UUID REFERENCES players(id) ON DELETE SET NULL,
  secret_goal TEXT DEFAULT '',
  prediction TEXT DEFAULT '',
  message_to_self TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FOURSOMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS foursomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 4) UNIQUE,
  group_1 UUID[] DEFAULT '{}',
  group_2 UUID[] DEFAULT '{}',
  group_3 UUID[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default foursomes
INSERT INTO foursomes (round_number, group_1, group_2, group_3) VALUES
  (1, '{}', '{}', '{}'),
  (2, '{}', '{}', '{}'),
  (3, '{}', '{}', '{}'),
  (4, '{}', '{}', '{}')
ON CONFLICT (round_number) DO NOTHING;

-- ============================================
-- TRIP INFO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trip_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_address TEXT DEFAULT '123 Golf Lane, Hot Springs Village, AR',
  door_code TEXT DEFAULT '1234',
  wifi_password TEXT DEFAULT 'golfboys2025',
  emergency_contact TEXT DEFAULT 'Trip Organizer: 555-123-4567',
  nearest_hospital TEXT DEFAULT 'CHI St. Vincent Hot Springs',
  local_pizza TEXT DEFAULT 'Dominos: 501-555-1234',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default trip info
INSERT INTO trip_info (id) VALUES (uuid_generate_v4())
ON CONFLICT DO NOTHING;

-- ============================================
-- ITINERARY NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS itinerary_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day TEXT NOT NULL UNIQUE CHECK (day IN ('thursday', 'friday', 'saturday', 'sunday', 'monday')),
  notes TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default itinerary
INSERT INTO itinerary_notes (day, notes) VALUES
  ('thursday', ARRAY['Arrive whenever', 'Claim your room', 'Fridge inventory', 'Welcome beers']),
  ('friday', ARRAY['AM: Ponce de Leon', 'PM: Balboa', 'Evening: Dinner TBD']),
  ('saturday', ARRAY['AM: Free time', 'PM: Isabella', 'Evening: Whatever happens']),
  ('sunday', ARRAY['AM: Granada (Championship)', 'PM: Free time', 'Evening: Awards ceremony']),
  ('monday', ARRAY['Check-out', 'Same time next year?'])
ON CONFLICT (day) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_capsule ENABLE ROW LEVEL SECURITY;
ALTER TABLE foursomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a group app without auth)
-- Everyone can read and write everything

CREATE POLICY "Allow all access to players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to scores" ON scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to photos" ON photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to challenges" ON challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to bets" ON bets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to predictions" ON predictions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to time_capsule" ON time_capsule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to foursomes" ON foursomes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to trip_info" ON trip_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to itinerary_notes" ON itinerary_notes FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE scores;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE bets;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE time_capsule;
ALTER PUBLICATION supabase_realtime ADD TABLE foursomes;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_info;
ALTER PUBLICATION supabase_realtime ADD TABLE itinerary_notes;

-- ============================================
-- STORAGE BUCKET FOR PHOTOS
-- ============================================
-- Run this separately in Storage section or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to photos bucket
CREATE POLICY "Allow public read access to photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Allow public upload to photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow public update to photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'photos');

CREATE POLICY "Allow public delete from photos" ON storage.objects
FOR DELETE USING (bucket_id = 'photos');
