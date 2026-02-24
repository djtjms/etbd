import { useState, useEffect, useCallback } from "react";
import { X, ExternalLink, MessageCircle, Monitor, Tablet, Smartphone, AlertTriangle, RefreshCw, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  projectId?: string;
  thumbnail?: string | null;
  screenshots?: string[] | null;
  onConsultation?: () => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";
type ViewMode = "iframe" | "screenshot";

const deviceSizes: Record<DeviceType, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

export function PreviewModal({
  isOpen,
  onClose,
  url,
  title,
  projectId,
  thumbnail,
  screenshots,
  onConsultation,
}: PreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("iframe");
  const { branding } = useBranding();

  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanNumber}?text=Hi! I'm interested in a project similar to "${title}". Can we discuss?`;

  const isValidUrl = !!url && (url.startsWith("http://") || url.startsWith("https://"));
  const hasScreenshots = (screenshots && screenshots.length > 0) || !!thumbnail;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setLoadError(false);
      setViewMode("iframe");
      setDevice("desktop");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isValidUrl && viewMode === "iframe") {
      setIsLoading(true);
      setLoadError(false);
    }
  }, [retryCount, url]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setLoadError(true);
  }, []);

  const handleRetry = () => setRetryCount((c) => c + 1);

  const switchToScreenshot = () => setViewMode("screenshot");

  // Timeout: if still loading after 8s, show error with fallback
  useEffect(() => {
    if (!isOpen || !isValidUrl || viewMode !== "iframe") return;
    const timer = setTimeout(() => {
      if (isLoading && !loadError) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, isValidUrl, isLoading, loadError, retryCount, viewMode]);

  const renderErrorFallback = () => (
    <div className="h-full min-h-[300px] flex items-center justify-center p-4 sm:p-6 text-center">
      <div className="max-w-md w-full">
        <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mx-auto mb-3 sm:mb-4" />
        <p className="text-sm font-medium text-foreground mb-1.5">
          This site restricts embedded previews
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Many sites block iframe embedding for security. Use the options below instead.
        </p>
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-auto rounded-lg border border-border mb-4 max-h-[40vh] object-cover"
          />
        )}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={handleRetry} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
          {hasScreenshots && (
            <Button size="sm" variant="outline" onClick={switchToScreenshot} className="gap-1.5">
              <Image className="w-3.5 h-3.5" />
              Screenshots
            </Button>
          )}
          <Button size="sm" variant="default" onClick={() => window.open(url, "_blank")} className="gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Tab
          </Button>
        </div>
      </div>
    </div>
  );

  const renderScreenshotView = () => {
    const images = screenshots && screenshots.length > 0 ? screenshots : thumbnail ? [thumbnail] : [];
    return (
      <div className="h-full overflow-y-auto p-2 sm:p-4 space-y-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${title} - Screenshot ${i + 1}`}
            className="w-full h-auto rounded-lg border border-border shadow-md"
            loading="lazy"
          />
        ))}
        {images.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
            No screenshots available
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[100vw] w-full h-[100dvh] sm:max-w-[98vw] sm:h-[95dvh] md:max-w-[95vw] md:h-[92dvh] p-0 gap-0 bg-background rounded-none sm:rounded-xl"
        onPointerDownOutside={(e) => { e.preventDefault(); onClose(); }}
        onEscapeKeyDown={onClose}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-border bg-muted/30 gap-1 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{title}</h3>

            {/* Device Switcher */}
            <div className="flex items-center gap-0.5 bg-background rounded-md p-0.5">
              {(["desktop", "tablet", "mobile"] as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={cn(
                    "p-1 sm:p-1.5 rounded transition-colors",
                    device === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title={deviceSizes[d].label}
                >
                  {d === "desktop" && <Monitor className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {d === "tablet" && <Tablet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {d === "mobile" && <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            {hasScreenshots && (
              <div className="hidden sm:flex items-center gap-0.5 bg-background rounded-md p-0.5">
                <button
                  onClick={() => setViewMode("iframe")}
                  className={cn("px-2 py-1 rounded text-xs transition-colors", viewMode === "iframe" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  Live
                </button>
                <button
                  onClick={() => setViewMode("screenshot")}
                  className={cn("px-2 py-1 rounded text-xs transition-colors", viewMode === "screenshot" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  Screenshots
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onConsultation && (
              <Button size="sm" variant="default" onClick={onConsultation} className="gap-1 text-xs h-7 px-2 hidden md:flex">
                <MessageCircle className="w-3 h-3" />
                Consultation
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open(whatsappLink, "_blank")}
              className="gap-1 bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => isValidUrl && window.open(url, "_blank")}
              disabled={!isValidUrl}
              className="gap-1 text-xs h-7 px-2"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Browser Chrome */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/10 min-h-0">
          <div className="bg-muted/40 px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-2 border-b border-border shrink-0">
            <div className="flex gap-1">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 max-w-xl bg-background rounded px-2 py-0.5 text-[10px] sm:text-xs text-muted-foreground truncate">
              {url || "No URL configured"}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-start justify-center overflow-auto p-1 sm:p-2 md:p-3 min-h-0">
            <div
              className={cn(
                "bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-full relative",
                device !== "desktop" && "border border-border"
              )}
              style={{ width: deviceSizes[device].width, maxWidth: "100%" }}
            >
              {viewMode === "screenshot" ? (
                renderScreenshotView()
              ) : !isValidUrl ? (
                renderErrorFallback()
              ) : loadError ? (
                renderErrorFallback()
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-muted-foreground">Loading preview...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    key={`${url}-${retryCount}`}
                    src={url}
                    title={title}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                    referrerPolicy="no-referrer-when-downgrade"
                    loading="eager"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
