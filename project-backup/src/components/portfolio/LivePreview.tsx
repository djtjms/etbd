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
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onView?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Check if URL is valid for iframe embedding
  const isValidUrl = url && (url.startsWith("http://") || url.startsWith("https://"));

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden border border-border bg-card shadow-card transition-all duration-300",
        isHovered && "shadow-lg scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Device Frame */}
      <div className="bg-muted/50 px-3 py-2 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-background/50 rounded px-3 py-1 text-xs text-muted-foreground truncate">
          {url || "No URL"}
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-video bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}

        {hasError || !isValidUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Preview unavailable
                </p>
              </>
            )}
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            className={cn(
              "w-full h-full border-0",
              !allowInteraction && "pointer-events-none"
            )}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Overlay with actions */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={onExpand}
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Expand
          </Button>
          {isValidUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(url, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </Button>
          )}
        </div>
      </div>

      {/* View indicator */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        <Eye className="w-3 h-3" />
        Live Preview
      </div>
    </div>
  );
}
