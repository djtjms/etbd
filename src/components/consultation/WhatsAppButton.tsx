import { MessageCircle } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export function WhatsAppButton({ message, className }: WhatsAppButtonProps) {
  const { branding } = useBranding();
  
  const whatsappNumber = branding?.whatsapp_number || "+880-1873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const defaultMessage = "Hi! I'd like to discuss a project with engineersTech.";
  
  const handleClick = () => {
    const text = message || defaultMessage;
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group",
        "bg-[#25D366] text-white hover:bg-[#128C7E]",
        className
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
        Chat on WhatsApp
      </span>
    </button>
  );
}
