import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ConsultationPopup } from "./ConsultationPopup";
import { useIsMobile } from "@/hooks/useIsMobile";

const STORAGE_KEY = "consultation_popup_dismissed";
const SESSION_KEY = "consultation_popup_shown_this_session";
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Routes where auto-trigger should be disabled
const EXCLUDED_ROUTES = ["/demo", "/showcase", "/admin", "/auth"];

interface ConsultationTriggerProps {
  timeOnPageThreshold?: number; // seconds
  scrollDepthThreshold?: number; // percentage (0-100)
  enableExitIntent?: boolean;
}

export function ConsultationTrigger({
  timeOnPageThreshold = 120, // 2 minutes
  scrollDepthThreshold = 80, // 80%
  enableExitIntent = false, // Disabled by default
}: ConsultationTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if current route is excluded
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  // Disable auto-trigger on mobile and excluded routes
  const shouldAutoTrigger = !isMobile && !isExcludedRoute;

  const shouldShowPopup = useCallback(() => {
    // Never trigger on mobile or excluded routes
    if (!shouldAutoTrigger) return false;
    
    // Never trigger twice in same render cycle
    if (hasTriggered) return false;
    
    // Check if already shown this session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        return false;
      }
    } catch {
      // sessionStorage might not be available
    }
    
    // Check 24-hour dismissal
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        if (!isNaN(dismissedTime) && Date.now() - dismissedTime < DISMISS_DURATION) {
          return false;
        }
      }
    } catch {
      // localStorage might not be available
    }
    
    return true;
  }, [hasTriggered, shouldAutoTrigger]);

  const triggerPopup = useCallback(() => {
    if (shouldShowPopup()) {
      setIsOpen(true);
      setHasTriggered(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Ignore storage errors
      }
    }
  }, [shouldShowPopup]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Failsafe: auto-close if dialog stays open too long (prevents black screen)
  useEffect(() => {
    if (!isOpen) return;
    
    const failsafeTimer = setTimeout(() => {
      // If still open after 30 seconds, something might be wrong
      console.log("[ConsultationTrigger] Failsafe close triggered");
      handleClose();
    }, 30000);

    return () => clearTimeout(failsafeTimer);
  }, [isOpen, handleClose]);

  // Time on page trigger (desktop only)
  useEffect(() => {
    if (hasTriggered || !shouldAutoTrigger) return;
    
    const timer = setTimeout(() => {
      triggerPopup();
    }, timeOnPageThreshold * 1000);

    return () => clearTimeout(timer);
  }, [timeOnPageThreshold, triggerPopup, hasTriggered, shouldAutoTrigger]);

  // Scroll depth trigger (desktop only)
  useEffect(() => {
    if (hasTriggered || !shouldAutoTrigger) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Prevent division by zero
      if (docHeight <= 0) return;
      
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= scrollDepthThreshold) {
        triggerPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDepthThreshold, triggerPopup, hasTriggered, shouldAutoTrigger]);

  // Exit intent trigger (desktop only) - disabled by default
  useEffect(() => {
    if (!enableExitIntent || hasTriggered || !shouldAutoTrigger) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [enableExitIntent, triggerPopup, hasTriggered, shouldAutoTrigger]);

  // Don't render anything on mobile or excluded routes
  if (!shouldAutoTrigger && !isOpen) return null;

  return (
    <ConsultationPopup
      isOpen={isOpen}
      onClose={handleClose}
      source="auto_trigger"
    />
  );
}
