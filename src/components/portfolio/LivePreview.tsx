import { useState, useRef, useEffect } from "react";
import { ExternalLink, Maximize2, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  url: string;
  title: string;
  thumbnail?: string;
  allowInteraction?: boolean;
  onView?: () => void;
  onExpand?: () => void;
  className?: string;
}

export function LivePreview({
  url,
  title,
  thumbnail,
  allowInteraction = false,
  onView,
  onExpand,
  className,
}: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  // Timeout fallback: if iframe doesn't load in 6s, show thumbnail
  useEffect(() => {
    if (!isLoading || hasError) return;
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [isLoading, hasError, url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onView?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const isValidUrl = url && (url.startsWith("http://") || url.startsWith("https://"));

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden border border-border bg-card shadow-card transition-all duration-300",
        isHovered && "shadow-lg scale-[1.01]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Device Frame */}
      <div className="bg-muted/50 px-2.5 py-1.5 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-background/50 rounded px-2 py-0.5 text-[10px] text-muted-foreground truncate">
          {url || "No URL"}
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-video bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Skeleton className="w-full h-full" />
          </div>
        )}

        {hasError || !isValidUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {thumbnail ? (
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <>
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">Preview unavailable</p>
              </>
            )}
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            className={cn("w-full h-full border-0", !allowInteraction && "pointer-events-none")}
            sandbox="allow-scripts allow-same-origin allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Overlay with actions */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Button size="sm" variant="secondary" onClick={onExpand} className="gap-1.5 text-xs">
            <Maximize2 className="w-3.5 h-3.5" />
            Expand
          </Button>
          {isValidUrl && (
            <Button size="sm" variant="outline" onClick={() => window.open(url, "_blank")} className="gap-1.5 text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </Button>
          )}
        </div>
      </div>

      {/* View indicator */}
      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
        <Eye className="w-2.5 h-2.5" />
        Live
      </div>
    </div>
  );
}
