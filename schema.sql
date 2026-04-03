-- supabase schema for Quran Collection

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Videos Table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: You also need to create a storage bucket in Supabase called "videos" 
-- and make it public.

-- Set up RLS (Row Level Security) - we are allowing an open dashboard for everyone in this project.
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies for fully public access (since the user requested a global open dashboard)
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON videos FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON videos FOR DELETE USING (true);
