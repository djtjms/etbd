import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Code2, 
  Shield, 
  Brain, 
  ChevronDown, 
  Users,
  BarChart3,
  Layers,
  ArrowRight,
  MessageCircle,
  LucideIcon,
  Zap,
  Globe,
  Server,
  Database,
  Cpu,
  Lock,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

// Import service images as fallbacks
import aiAutomation from "@/assets/services/ai-automation.png";
import bankingApp from "@/assets/services/banking-app.jpg";
import ecommerceWebsite from "@/assets/services/ecommerce-website.jpg";
import websiteMobileApp from "@/assets/services/website-mobile-app.jpg";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  Building2, Code2, Shield, Brain, Users, BarChart3, Layers, Zap, Globe, Server, Database, Cpu, Lock, Smartphone,
};

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface DBService {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  features: ServiceFeature[];
  sort_order: number;
  is_active: boolean;
}

// Hardcoded fallback services
const fallbackServices = [
  {
    id: "enterprise",
    icon: "Building2",
    title: "Enterprise Solutions",
    description: "Comprehensive business management systems tailored for your organization.",
    image: websiteMobileApp,
    features: [
      { icon: "Users", title: "HRM System", description: "Complete human resource management with payroll, attendance, and performance tracking." },
      { icon: "BarChart3", title: "CRM System", description: "Customer relationship management to boost sales and improve customer retention." },
      { icon: "Layers", title: "ERP System", description: "Enterprise resource planning for seamless business operations across departments." },
    ],
  },
  {
    id: "custom",
    icon: "Code2",
    title: "Custom Development",
    description: "Bespoke software solutions built to match your unique business requirements.",
    image: ecommerceWebsite,
    features: [
      { icon: "Code2", title: "Web Applications", description: "Modern, responsive web applications using cutting-edge technologies." },
      { icon: "Layers", title: "Mobile Apps", description: "Native and cross-platform mobile applications for iOS and Android." },
      { icon: "BarChart3", title: "API Development", description: "Robust APIs and backend services for seamless integration." },
    ],
  },
  {
    id: "security",
    icon: "Shield",
    title: "Security & Finance",
    description: "Secure financial systems and compliance-ready security solutions.",
    image: bankingApp,
    features: [
      { icon: "Shield", title: "Payment Systems", description: "Secure payment gateways and financial transaction processing." },
      { icon: "Building2", title: "Banking Solutions", description: "Core banking systems and financial management platforms." },
      { icon: "Users", title: "Compliance Tools", description: "Regulatory compliance and audit management systems." },
    ],
  },
  {
    id: "ai",
    icon: "Brain",
    title: "AI Integration",
    description: "Leverage artificial intelligence to automate and optimize your business.",
    image: aiAutomation,
    features: [
      { icon: "Brain", title: "Machine Learning", description: "Custom ML models for predictive analytics and automation." },
      { icon: "BarChart3", title: "Data Analytics", description: "AI-powered business intelligence and data visualization." },
      { icon: "Code2", title: "Chatbots & NLP", description: "Intelligent chatbots and natural language processing solutions." },
    ],
  },
];

// Generate fingerprint for tracking
const generateFingerprint = () => {
  const nav = navigator;
  const screen = window.screen;
  const data = [nav.userAgent, nav.language, screen.width + 'x' + screen.height, new Date().getTimezoneOffset()].join('|');
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [services, setServices] = useState<typeof fallbackServices>(fallbackServices);
  const { branding } = useBranding();
  const { t } = useLanguage();
  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  // Fetch services from database, fallback to hardcoded
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setServices(data.map((s: any) => ({
          id: s.id,
          icon: s.icon || "Code2",
          title: s.title,
          description: s.description || "",
          image: s.image || null,
          features: Array.isArray(s.features) ? s.features : [],
        })));
      }
      // If no DB services, keep fallback
    }
    fetchServices();
  }, []);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const handleServiceClick = async (service: typeof fallbackServices[0]) => {
    const fingerprint = generateFingerprint();
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}_${fingerprint}`;
    sessionStorage.setItem('session_id', sessionId);

    try {
      await supabase.from('interaction_events').insert({
        session_id: sessionId,
        page_path: `/#services`,
        event_type: 'service_click',
        element_id: service.id,
        element_type: 'service_card',
        metadata: { service_title: service.title, fingerprint, timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.log('Tracking error:', error);
    }

    const message = `Hi! I'm interested in your ${service.title} services. I'd like to discuss how you can help my business with:\n\n${service.features.map(f => `• ${f.title}`).join('\n')}\n\nPlease contact me for more details.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getIcon = (iconName: string): LucideIcon => iconMap[iconName] || Code2;

  return (
    <section id="services" className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wider uppercase mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("services.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("services.title")} <span className="text-gradient">{t("services.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {t("services.subtitle")}
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
          {services.map((service) => {
            const ServiceIcon = getIcon(service.icon);
            return (
              <StaggerItem key={service.id}>
                <div
                  className={cn(
                    "group relative bg-gradient-card rounded-3xl border border-border/50 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:-translate-y-1",
                    expandedService === service.id && "border-primary/50 ring-1 ring-primary/20"
                  )}
                >
                  {/* Service Image */}
                  {service.image && (
                    <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => handleServiceClick(service)}>
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <div className="absolute bottom-4 right-4">
                        <Button variant="gradient" size="sm" className="gap-2 text-xs shadow-primary-lg">
                          <MessageCircle size={14} />
                          {t("services.chat_now")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Service Header */}
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full p-6 lg:p-8 text-left flex items-start gap-5"
                  >
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-primary group-hover:shadow-primary-lg transition-all">
                      <ServiceIcon size={28} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="shrink-0 mt-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        expandedService === service.id 
                          ? "bg-primary text-primary-foreground rotate-180" 
                          : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      )}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {service.features.length > 0 && (
                    <div className={cn(
                      "overflow-hidden transition-all duration-500",
                      expandedService === service.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                        <div className="border-t border-border/50 pt-6 space-y-3">
                          {service.features.map((feature, idx) => {
                            const FeatureIcon = getIcon(feature.icon);
                            return (
                              <div 
                                key={idx} 
                                className="flex items-start gap-4 cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-200"
                                onClick={() => handleServiceClick(service)}
                              >
                                <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0 border border-border/50">
                                  <FeatureIcon size={20} className="text-primary" />
                                </div>
                                <div>
                                  <h4 className="text-foreground font-semibold mb-0.5">{feature.title}</h4>
                                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <ScrollReveal delay={0.3} className="text-center mt-16">
          <Link to="/services">
            <Button variant="outline" size="lg" className="gap-2.5 group">
              {t("services.view_all")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
