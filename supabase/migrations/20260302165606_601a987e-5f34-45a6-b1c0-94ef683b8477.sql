
-- Create client_logos table
CREATE TABLE public.client_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Public can view active logos
CREATE POLICY "Anyone can view active client logos"
ON public.client_logos FOR SELECT
USING (is_active = true);

-- Admins can view all
CREATE POLICY "Admins can view all client logos"
ON public.client_logos FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create
CREATE POLICY "Admins can create client logos"
ON public.client_logos FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update client logos"
ON public.client_logos FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete client logos"
ON public.client_logos FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER set_client_logos_updated_at
  BEFORE UPDATE ON public.client_logos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
