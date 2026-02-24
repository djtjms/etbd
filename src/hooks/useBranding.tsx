import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BrandingData {
  id: string;
  logo_url: string | null;
  logo_text: string | null;
  tagline: string | null;
  primary_color: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_number: string | null;
}

interface BrandingContextType {
  branding: BrandingData | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CACHE_KEY = "etbd_branding_cache";

const defaultBranding: BrandingData = {
  id: "",
  logo_url: null,
  logo_text: "engineersTech",
  tagline: "Enterprise Tech Solutions for the Future",
  primary_color: "#1877F2",
  company_email: "info@engineerstechbd.com",
  company_phone: "+880 1234-567890",
  company_address: "Dhaka, Bangladesh",
  facebook_url: null,
  linkedin_url: null,
  twitter_url: null,
  whatsapp_number: null,
};

function loadCachedBranding(): BrandingData {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.id) return parsed;
    }
  } catch {}
  return defaultBranding;
}

function saveBrandingCache(data: BrandingData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  loading: true,
  refetch: async () => {},
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingData>(loadCachedBranding);
  const [loading, setLoading] = useState(true);

  const fetchBranding = useCallback(async (retries = 2) => {
    try {
      const { data, error } = await supabase
        .from("branding_settings")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setBranding(data);
        saveBrandingCache(data);
      } else if (error && retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return fetchBranding(retries - 1);
      }
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return fetchBranding(retries - 1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  return (
    <BrandingContext.Provider value={{ branding, loading, refetch: fetchBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
