-- ==============================================================================
-- Table Flow: 003_storage.sql
-- Storage bucket for menu item food photography with public access policies
-- ==============================================================================

-- 1. Insert food-images storage bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'food-images',
    'food-images',
    TRUE,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE;

-- 2. Storage Object RLS Policies
CREATE POLICY "Public Food Images Read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'food-images');
