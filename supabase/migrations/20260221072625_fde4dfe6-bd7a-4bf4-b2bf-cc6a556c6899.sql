
-- Add RLS policies to the uploads storage bucket

-- Ensure the bucket exists and is public (for reading only)
UPDATE storage.buckets SET public = true WHERE id = 'uploads';

-- Drop any existing permissive policies on storage.objects for uploads bucket to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access on uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update uploads" ON storage.objects;

-- Allow public read access (images need to be viewable on the site)
CREATE POLICY "Allow public read access on uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Only authenticated admin users can upload files
CREATE POLICY "Allow authenticated admin uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'admin')
);

-- Only authenticated admin users can update files
CREATE POLICY "Allow admin update uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'uploads'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'admin')
);

-- Only authenticated admin users can delete files
CREATE POLICY "Allow admin delete uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads'
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'admin')
);
