import { useState, useEffect, createContext, useContext, ReactNode } from "react";
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

const defaultBranding: BrandingData = {
  id: "",
  logo_url: null,
  logo_text: "engineersTech",
  tagline: "Enterprise Tech Solutions for the Future",
  primary_color: "#90FFA3",
  company_email: "info@engineerstechbd.com",
  company_phone: "+880 1234-567890",
  company_address: "Dhaka, Bangladesh",
  facebook_url: "https://facebook.com/engineerstechbd",
  linkedin_url: "https://linkedin.com/company/engineerstechbd",
  twitter_url: "https://twitter.com/engineerstechbd",
  whatsapp_number: null,
};

// Helper to get value with fallback (treats empty string as null)
const getWithFallback = <T,>(value: T | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && value.trim() === '') return fallback;
  return value;
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  loading: true,
  refetch: async () => {},
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingData | null>(defaultBranding);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      const { data, error } = await supabase
        .from("branding_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setBranding(data);
      }
    } catch (error) {
      console.error("Failed to fetch branding:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

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
