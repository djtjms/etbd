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
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();

  const whatsappNumber = branding?.whatsapp_number || "+880-1873722228";
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
        title: t("consultation.success"),
        description: t("consultation.success_desc"),
      });

      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast({
        title: t("consultation.error"),
        description: t("consultation.error_desc"),
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

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={onClose} onEscapeKeyDown={onClose}>
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {t("consultation.title")}
          </DialogTitle>
        </DialogHeader>

        {projectContext && (
          <p className="text-sm text-muted-foreground">
            {t("consultation.interested_in")}: <span className="text-primary font-medium">{projectContext}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("consultation.name")} *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.name")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("consultation.email")} *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("consultation.phone")}</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1234-567890" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("consultation.message")}</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("contact.message_placeholder")} rows={3} />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? t("consultation.submitting") : t("consultation.submit")}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t("consultation.or")}</span>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleWhatsApp}
              className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              <Phone className="w-4 h-4" />
              {t("consultation.whatsapp")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
