import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ConsentCategory = "necessary" | "analytics" | "marketing";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  hasResponded: boolean;
}

interface ConsentContextType {
  consent: ConsentState;
  hasConsent: (category: ConsentCategory) => boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  updateConsent: (category: ConsentCategory, value: boolean) => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CONSENT_STORAGE_KEY = "gdpr_consent";

const defaultConsent: ConsentState = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  hasResponded: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Load consent from localStorage
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent({ ...parsed, necessary: true }); // Ensure necessary is always true
        setShowBanner(false);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: ConsentState) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
  };

  const hasConsent = (category: ConsentCategory): boolean => {
    if (category === "necessary") return true;
    return consent.hasResponded && consent[category];
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      hasResponded: true,
    });
  };

  const acceptNecessaryOnly = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      hasResponded: true,
    });
  };

  const updateConsent = (category: ConsentCategory, value: boolean) => {
    if (category === "necessary") return; // Can't disable necessary
    const newConsent = { ...consent, [category]: value, hasResponded: true };
    saveConsent(newConsent);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasConsent,
        acceptAll,
        acceptNecessaryOnly,
        updateConsent,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
