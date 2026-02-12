-- Fix RLS policies for anonymous access
BEGIN;

-- Ensure public schema access (fix for 401 Unauthorized on anon requests)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Products: Allow public read access
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Everyone can view active products" ON products;

CREATE POLICY "everyone_can_view_active_products" 
ON products FOR SELECT 
TO public
USING (is_active = true);

-- Embedded Videos: Allow public read access
DROP POLICY IF EXISTS "Public videos are viewable by everyone" ON embedded_videos;
DROP POLICY IF EXISTS "Everyone can view videos" ON embedded_videos;

CREATE POLICY "everyone_can_view_videos" 
ON embedded_videos FOR SELECT 
TO public
USING (true);

COMMIT;
