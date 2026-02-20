-- Remove the simpler/redundant INSERT policy on contact_submissions
-- Keep only the stricter one with regex email validation
DROP POLICY IF EXISTS "Public can submit contact with rate limit awareness" ON public.contact_submissions;