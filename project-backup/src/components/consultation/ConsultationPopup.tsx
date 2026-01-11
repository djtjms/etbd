import { useState } from "react";
import { MessageCircle, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBranding } from "@/hooks/useBranding";

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectContext?: string;
  source?: string;
}

export function ConsultationPopup({
  isOpen,
  onClose,
  projectContext,
  source = "popup",
}: ConsultationPopupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { branding } = useBranding();

  // Fallback WhatsApp number if branding fails
  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("consultation_requests").insert({
        name,
        email,
        phone: phone || null,
        interested_project: projectContext || null,
        message: message || null,
        source,
      });

      if (error) throw error;

      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });

      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = projectContext
      ? `Hi! I'm interested in "${projectContext}". Can we discuss a similar project?`
      : "Hi! I'd like to get a free consultation for my project.";
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  // Safe close handler that always works
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={onClose} onEscapeKeyDown={onClose}>
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Get Free Consultation
          </DialogTitle>
        </DialogHeader>

        {projectContext && (
          <p className="text-sm text-muted-foreground">
            Interested in: <span className="text-primary font-medium">{projectContext}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1234-567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your project..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <Phone className="w-4 h-4" />
              Chat on WhatsApp
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
