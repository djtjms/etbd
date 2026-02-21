import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBranding } from "@/hooks/useBranding";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().max(20, "Phone number is too long").optional().or(z.literal("")),
  subject: z.string().trim().max(200, "Subject is too long").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export function ContactSection() {
  const { branding } = useBranding();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get contact info from branding
  const email = branding?.company_email || "info@engineerstechbd.com";
  const phone = branding?.company_phone || "+880 1873-722228";
  const address = branding?.company_address || "Dhaka, Bangladesh";
  const whatsappNumber = branding?.whatsapp_number || "+880 1873-722228";
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  const contactCards = [
    {
      icon: Mail,
      title: t("contact.email_us"),
      value: email,
      href: `mailto:${email}`,
      color: "from-blue-500 to-sky-500",
    },
    {
      icon: Phone,
      title: t("contact.whatsapp"),
      value: phone,
      href: `https://wa.me/${cleanWhatsapp}`,
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validatedData = contactSchema.parse(formData);

      // If VITE_USE_PHP_API is set, post to PHP endpoint instead of Supabase
      const usePhp = import.meta.env.VITE_USE_PHP_API === 'true' || import.meta.env.VITE_USE_PHP_API === true;
      if (usePhp) {
        const res = await fetch('/api/contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || null,
            subject: validatedData.subject || null,
            message: validatedData.message,
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Contact API error');
      } else {
        const { error } = await supabase.from("contact_submissions").insert([{
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          subject: validatedData.subject || null,
          message: validatedData.message,
        }]);

        if (error) throw error;
      }

      toast({
        title: t("contact.success_title"),
        description: t("contact.success_desc"),
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: t("contact.error"),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wider uppercase mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("contact.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("contact.title")} <span className="text-gradient">{t("contact.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </ScrollReveal>

        {/* Contact Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16" staggerDelay={0.1}>
          {contactCards.map((card, index) => (
            <StaggerItem key={index}>
              <a
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative bg-gradient-card rounded-2xl border border-border/50 p-7 text-center hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 block h-full"
              >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                <card.icon size={28} className="text-white" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">{card.value}</p>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Contact Form */}
        <ScrollReveal delay={0.2} className="max-w-2xl mx-auto">
          <div className="bg-gradient-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-card">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary">
                <MessageSquare size={26} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{t("contact.form_title")}</h3>
                <p className="text-muted-foreground text-sm">{t("contact.form_subtitle")}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2.5 block">{t("contact.name")}</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={100}
                    className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2.5 block">{t("contact.email")}</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    maxLength={255}
                    className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2.5 block">{t("contact.phone")}</label>
                  <Input
                    placeholder={phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={20}
                    className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1.5">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2.5 block">{t("contact.subject")}</label>
                  <Input
                    placeholder="Project Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    maxLength={200}
                    className="bg-secondary/50 border-border/50 h-12 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {errors.subject && <p className="text-destructive text-xs mt-1.5">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2.5 block">{t("contact.message")}</label>
                <Textarea
                  placeholder={t("contact.message_placeholder")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  maxLength={2000}
                  className="bg-secondary/50 border-border/50 resize-none rounded-xl focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.message && <p className="text-destructive text-xs mt-1.5">{errors.message}</p>}
                <p className="text-xs text-muted-foreground mt-2">{formData.message.length}/2000 {t("contact.characters")}</p>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="xl"
                className="w-full gap-2.5 btn-glow"
                disabled={loading}
              >
                {loading ? t("contact.sending") : t("contact.send")}
                <Send size={20} />
              </Button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
