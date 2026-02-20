import { useBranding } from "@/hooks/useBranding";
import { cn } from "@/lib/utils";
import whatsappIcon from "@/assets/whatsapp-icon.png";

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
        "fixed bottom-24 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group overflow-hidden",
        "bg-[#25D366] hover:bg-[#128C7E]",
        className
      )}
      aria-label="Chat on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8 md:w-9 md:h-9 object-contain mx-auto" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
        Chat on WhatsApp
      </span>
    </button>
  );
}
