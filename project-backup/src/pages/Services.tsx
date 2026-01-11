import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Code2, 
  Shield, 
  Brain, 
  Users,
  BarChart3,
  Layers,
  ArrowRight,
  Smartphone,
  Globe,
  Database,
  Lock,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/hooks/useBranding";
import { supabase } from "@/integrations/supabase/client";

// Import service images
import aiAutomation from "@/assets/services/ai-automation.png";
import bankingApp from "@/assets/services/banking-app.jpg";
import dataSecurityImg from "@/assets/services/data-security.jpg";
import ecommerceWebsite from "@/assets/services/ecommerce-website.jpg";
import websiteMobileApp from "@/assets/services/website-mobile-app.jpg";
import mobileFinancial from "@/assets/services/mobile-financial.jpg";

const services = [
  {
    id: "enterprise",
    icon: Building2,
    title: "Enterprise Solutions",
    description: "Comprehensive business management systems tailored for your organization's unique needs.",
    image: websiteMobileApp,
    features: [
      { icon: Users, title: "HRM System", description: "Complete human resource management with payroll, attendance, leave management, and performance tracking." },
      { icon: BarChart3, title: "CRM System", description: "Customer relationship management to boost sales, track leads, and improve customer retention." },
      { icon: Layers, title: "ERP System", description: "Enterprise resource planning for seamless business operations across all departments." },
    ],
  },
  {
    id: "custom",
    icon: Code2,
    title: "Custom Development",
    description: "Bespoke software solutions built to match your unique business requirements and workflows.",
    image: ecommerceWebsite,
    features: [
      { icon: Globe, title: "Web Applications", description: "Modern, responsive web applications using React, Next.js, and other cutting-edge technologies." },
      { icon: Smartphone, title: "Mobile Apps", description: "Native and cross-platform mobile applications for iOS and Android platforms." },
      { icon: Database, title: "API Development", description: "Robust RESTful and GraphQL APIs for seamless integration with existing systems." },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Finance",
    description: "Secure financial systems and compliance-ready security solutions for sensitive operations.",
    image: bankingApp,
    features: [
      { icon: Lock, title: "Payment Systems", description: "Secure payment gateways, transaction processing, and financial management tools." },
      { icon: Building2, title: "Banking Solutions", description: "Core banking systems, mobile banking apps, and financial reporting platforms." },
      { icon: Shield, title: "Compliance Tools", description: "Regulatory compliance management and audit trail systems for various industries." },
    ],
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Integration",
    description: "Leverage artificial intelligence to automate processes and gain actionable insights.",
    image: aiAutomation,
    features: [
      { icon: Brain, title: "Machine Learning", description: "Custom ML models for predictive analytics, recommendation systems, and automation." },
      { icon: BarChart3, title: "Data Analytics", description: "AI-powered business intelligence, data visualization, and reporting dashboards." },
      { icon: Code2, title: "Chatbots & NLP", description: "Intelligent chatbots, voice assistants, and natural language processing solutions." },
    ],
  },
];

// Generate fingerprint for tracking
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const nav = navigator;
  const screen = window.screen;
  const data = [
    nav.userAgent,
    nav.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export default function Services() {
  const { branding } = useBranding();
  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const handleServiceClick = async (service: typeof services[0]) => {
    const fingerprint = generateFingerprint();
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}_${fingerprint}`;
    sessionStorage.setItem('session_id', sessionId);

    // Track service interaction
    try {
      await supabase.from('interaction_events').insert({
        session_id: sessionId,
        page_path: `/services#${service.id}`,
        event_type: 'service_click',
        element_id: service.id,
        element_type: 'service_card',
        metadata: {
          service_title: service.title,
          fingerprint,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.log('Tracking error:', error);
    }

    // Open WhatsApp with service context
    const message = `Hi! I'm interested in your ${service.title} services. I'd like to discuss how you can help my business with:\n\n${service.features.map(f => `• ${f.title}`).join('\n')}\n\nPlease contact me for more details.`;
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Services
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Enterprise Solutions for <span className="text-gradient">Modern Business</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
              From custom software development to AI integration, we provide comprehensive 
              technology solutions that drive growth and efficiency.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Get a Free Consultation
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  {/* Service Image */}
                  <div className="relative mb-6 rounded-2xl overflow-hidden aspect-video group cursor-pointer" onClick={() => handleServiceClick(service)}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                        <service.icon size={32} className="text-primary-foreground" />
                      </div>
                      <Button variant="gradient" size="sm" className="gap-2">
                        <MessageCircle size={16} />
                        Chat Now
                      </Button>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {service.description}
                  </p>
                  <div className="flex gap-3">
                    <Button variant="gradient" className="gap-2" onClick={() => handleServiceClick(service)}>
                      <MessageCircle size={16} />
                      Discuss on WhatsApp
                    </Button>
                    <Link to="/contact">
                      <Button variant="outline" className="gap-2">
                        Learn More
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-card rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <feature.icon size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how our solutions can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Start Your Project
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
