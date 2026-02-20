import { useState, useEffect } from "react";
import { X, ExternalLink, MessageCircle, Monitor, Tablet, Smartphone, AlertTriangle, RefreshCw } from "lucide-react";
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
  onConsultation?: () => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";

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
  onConsultation,
}: PreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { branding } = useBranding();

  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanNumber}?text=Hi! I'm interested in a project similar to "${title}". Can we discuss?`;

  const isValidUrl = !!url && (url.startsWith("http://") || url.startsWith("https://"));

  useEffect(() => {
    if (isOpen && isValidUrl) {
      setIsLoading(true);
      setLoadError(false);
    }
  }, [isOpen, isValidUrl, url, retryCount]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  // Detect if iframe might be blocked (after timeout)
  useEffect(() => {
    if (!isOpen || !isValidUrl) return;
    
    const timer = setTimeout(() => {
      // If still loading after 10 seconds, assume blocked
      if (isLoading && !loadError) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, isValidUrl, isLoading, loadError, retryCount]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[100vw] sm:max-w-[98vw] md:max-w-[95vw] w-full h-[100dvh] sm:h-[95vh] md:h-[90vh] p-0 gap-0 bg-background"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
        onEscapeKeyDown={onClose}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-muted/30 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{title}</h3>
            
            {/* Device Switcher */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-background rounded-lg p-0.5 sm:p-1">
              {(["desktop", "tablet", "mobile"] as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={cn(
                    "p-1.5 sm:p-2 rounded transition-colors",
                    device === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={deviceSizes[d].label}
                >
                  {d === "desktop" && <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {d === "tablet" && <Tablet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {d === "mobile" && <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {onConsultation && (
              <Button
                size="sm"
                variant="default"
                onClick={onConsultation}
                className="gap-1 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 hidden sm:flex"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Get Free Consultation</span>
                <span className="md:hidden">Quote</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open(whatsappLink, "_blank")}
              className="gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => isValidUrl && window.open(url, "_blank")}
              disabled={!isValidUrl}
              className="gap-1 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7 sm:h-8 sm:w-8">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Browser Chrome */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          <div className="bg-muted/50 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 border-b border-border">
            <div className="flex gap-1 sm:gap-1.5">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 max-w-xl bg-background rounded px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-muted-foreground truncate">
              {url || "No URL configured"}
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 flex items-start justify-center overflow-auto p-2 sm:p-4">
            <div
              className={cn(
                "bg-background rounded-lg shadow-xl overflow-hidden transition-all duration-300 h-full relative",
                device !== "desktop" && "border border-border"
              )}
              style={{ width: deviceSizes[device].width, maxWidth: "100%" }}
            >
              {!isValidUrl ? (
                <div className="h-full min-h-[360px] flex items-center justify-center p-6 text-center">
                  <div className="max-w-sm">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm font-medium text-foreground mb-1">Preview unavailable</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      This project doesn't have a valid demo URL configured.
                    </p>
                    {thumbnail && (
                      <img 
                        src={thumbnail} 
                        alt={title} 
                        className="w-full h-auto rounded-lg border border-border"
                      />
                    )}
                  </div>
                </div>
              ) : loadError ? (
                <div className="h-full min-h-[360px] flex items-center justify-center p-6 text-center">
                  <div className="max-w-sm">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-sm font-medium text-foreground mb-2">
                      Preview may be blocked
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      This site may not allow embedding. Click "Open" to view in a new tab.
                    </p>
                    {thumbnail && (
                      <img 
                        src={thumbnail} 
                        alt={title} 
                        className="w-full h-auto rounded-lg border border-border mb-4"
                      />
                    )}
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline" onClick={handleRetry} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </Button>
                      <Button size="sm" variant="gradient" onClick={() => window.open(url, "_blank")}>
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Loading preview...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    key={retryCount}
                    src={url}
                    title={title}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    referrerPolicy="no-referrer"
                    loading="lazy"
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
