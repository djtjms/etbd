import { useEffect, ReactNode } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useConsent } from "@/hooks/useConsent";

interface InteractionTrackerProps {
  children: ReactNode;
}

export function InteractionTracker({ children }: InteractionTrackerProps) {
  const { trackClick } = useAnalytics();
  const { hasConsent } = useConsent();

  useEffect(() => {
    if (!hasConsent("analytics")) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find the closest interactive element
      const interactive = target.closest("button, a, [role='button'], [data-track]");
      if (!interactive) return;

      const elementId =
        interactive.id ||
        interactive.getAttribute("data-track") ||
        interactive.textContent?.slice(0, 50) ||
        "unknown";

      const elementType =
        interactive.tagName.toLowerCase() === "a"
          ? "link"
          : interactive.tagName.toLowerCase() === "button"
          ? "button"
          : interactive.getAttribute("role") || "element";

      trackClick(elementId, elementType, e.clientX, e.clientY);
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, [hasConsent, trackClick]);

  return <>{children}</>;
}
