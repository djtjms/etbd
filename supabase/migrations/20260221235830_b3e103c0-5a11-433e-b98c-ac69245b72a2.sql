
-- Create services table for admin-managed homepage services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code2',
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can view active services
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- Admins can view all services
CREATE POLICY "Admins can view all services"
ON public.services
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create services
CREATE POLICY "Admins can create services"
ON public.services
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update services
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete services
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
