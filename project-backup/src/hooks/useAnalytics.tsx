import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useConsent } from "@/hooks/useConsent";

const SESSION_KEY = "analytics_session_id";
const FINGERPRINT_KEY = "analytics_fingerprint";

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Simple fingerprint generator using basic client signals
function generateFingerprint(): string {
  try {
    const ua = navigator.userAgent || "";
    const lang = navigator.language || "";
    const platform = navigator.platform || "";
    const screenInfo = `${screen.width}x${screen.height}@${screen.colorDepth}`;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || String(new Date().getTimezoneOffset());
    const raw = `${ua}::${lang}::${platform}::${screenInfo}::${tz}`;

    // djb2 hash
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 33) ^ raw.charCodeAt(i);
    }
    // Convert to positive hex
    return (hash >>> 0).toString(16);
  } catch (e) {
    return Math.random().toString(36).slice(2, 10);
  }
}

function getFingerprint(): string {
  let fp = localStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    fp = generateFingerprint();
    localStorage.setItem(FINGERPRINT_KEY, fp);
  }
  return fp;
}

interface InteractionEvent {
  event_type: string;
  element_id?: string;
  element_type?: string;
  x_position?: number;
  y_position?: number;
  page_path: string;
  project_id?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export function useAnalytics() {
  const location = useLocation();
  const { hasConsent } = useConsent();
  const sessionId = useRef(getSessionId());
  const fingerprint = useRef(getFingerprint());
  const pageStartTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const clickCount = useRef(0);
  const eventQueue = useRef<InteractionEvent[]>([]);
  const flushTimeout = useRef<NodeJS.Timeout | null>(null);

  const canTrack = hasConsent("analytics");

  // Flush events to database
  const flushEvents = useCallback(async () => {
    if (!canTrack || eventQueue.current.length === 0) return;

    const events = [...eventQueue.current];
    eventQueue.current = [];

    try {
      await supabase.from("interaction_events").insert(
        events.map((event) => ({
          session_id: sessionId.current,
          fingerprint: fingerprint.current,
          ...event,
        }))
      );
    } catch (error) {
      console.error("Failed to log interaction events:", error);
    }
  }, [canTrack]);

  // Queue an event for batched sending
  const trackEvent = useCallback(
    (event: Omit<InteractionEvent, "page_path">) => {
      if (!canTrack) return;

      eventQueue.current.push({
        ...event,
        page_path: location.pathname,
      });

      // Debounce flush
      if (flushTimeout.current) {
        clearTimeout(flushTimeout.current);
      }
      flushTimeout.current = setTimeout(flushEvents, 2000);
    },
    [canTrack, location.pathname, flushEvents]
  );

  // Track page view
  const trackPageView = useCallback(async () => {
    if (!canTrack) return;

    try {
      await supabase.from("visitor_analytics").insert({
        session_id: sessionId.current,
        fingerprint: fingerprint.current,
        page_path: location.pathname,
        device_type: getDeviceType(),
        referrer: document.referrer || null,
      });
    } catch (error) {
      console.error("Failed to log page view:", error);
    }
  }, [canTrack, location.pathname]);

  // Track project view
  const trackProjectView = useCallback(
    (projectId: string, projectTitle: string) => {
      trackEvent({
        event_type: "project_view",
        element_type: "project",
        project_id: projectId,
        metadata: { title: projectTitle },
      });
    },
    [trackEvent]
  );

  // Track click
  const trackClick = useCallback(
    (elementId: string, elementType: string, x: number, y: number) => {
      clickCount.current++;
      trackEvent({
        event_type: "click",
        element_id: elementId,
        element_type: elementType,
        x_position: x,
        y_position: y,
      });
    },
    [trackEvent]
  );

  // Update page analytics on unmount
  const updatePageAnalytics = useCallback(async () => {
    if (!canTrack) return;

    const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);

    try {
      // Update the most recent page view with scroll depth and time
      await supabase
        .from("visitor_analytics")
        .update({
          scroll_depth: maxScrollDepth.current,
          time_on_page: timeOnPage,
          click_count: clickCount.current,
        })
        .eq("session_id", sessionId.current)
        .eq("page_path", location.pathname)
        .order("created_at", { ascending: false })
        .limit(1);
    } catch (error) {
      console.error("Failed to update page analytics:", error);
    }
  }, [canTrack, location.pathname]);

  // Setup scroll tracking
  useEffect(() => {
    if (!canTrack) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;
      maxScrollDepth.current = Math.max(maxScrollDepth.current, depth);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [canTrack]);

  // Track page views on route change
  useEffect(() => {
    // Reset counters for new page
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
    clickCount.current = 0;

    trackPageView();

    return () => {
      updatePageAnalytics();
      flushEvents();
    };
  }, [location.pathname, trackPageView, updatePageAnalytics, flushEvents]);

  return {
    trackEvent,
    trackProjectView,
    trackClick,
    sessionId: sessionId.current,
    fingerprint: fingerprint.current,
  };
}
