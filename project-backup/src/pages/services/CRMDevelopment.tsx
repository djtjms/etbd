import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Users, 
  BarChart3, 
  Mail, 
  Phone,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  ArrowRight,
  CheckCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const crmFeatures = [
  {
    icon: Users,
    title: "Contact Management",
    description: "Centralized customer database with complete interaction history, notes, and relationship mapping.",
  },
  {
    icon: TrendingUp,
    title: "Sales Pipeline",
    description: "Visual sales funnel with drag-and-drop stages, forecasting, and automated follow-ups.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Integrated email campaigns with templates, automation, A/B testing, and analytics.",
  },
  {
    icon: Phone,
    title: "Call Center Integration",
    description: "Click-to-call, call recording, IVR integration, and automatic call logging.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Real-time dashboards, custom reports, and AI-powered insights for data-driven decisions.",
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Support",
    description: "Unified inbox for email, chat, social media, and WhatsApp communications.",
  },
];

const benefits = [
  "Increase sales conversion by up to 40%",
  "360-degree view of customer relationships",
  "Automate repetitive sales tasks",
  "Improve customer retention rates",
  "Real-time sales and performance tracking",
  "Seamless integration with existing tools",
];

const integrations = [
  "WhatsApp Business",
  "Google Workspace",
  "Microsoft 365",
  "Zoom",
  "Slack",
  "QuickBooks",
  "Stripe",
  "Custom APIs",
];

export default function CRMDevelopment() {
  return (
    <Layout>
      <SEOHead
        title="CRM Software Development Company Bangladesh | Customer Management System"
        description="Custom CRM development services in Bangladesh. Build powerful customer relationship management systems with sales automation, marketing tools, and analytics."
        keywords={["CRM software Bangladesh", "customer management system", "sales CRM development", "customer relationship management", "CRM integration services"]}
        canonical="/services/crm-development"
      />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              CRM Development Services
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Custom <span className="text-gradient">CRM Solutions</span> for Growth
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build powerful Customer Relationship Management systems that drive sales, 
              improve customer engagement, and accelerate business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  View CRM Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Core Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive CRM Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crmFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <div className="w-40 h-40 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Target size={80} className="text-primary-foreground" />
                </div>
              </div>
            </div>
            <div>
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
                Business Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Supercharge Your Sales Process
              </h2>
              <p className="text-muted-foreground mb-8">
                Our custom CRM solutions are tailored to your unique sales process 
                and customer journey, ensuring maximum adoption and ROI.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Seamless Integrations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Connect Your Business Tools
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {integrations.map((integration, i) => (
              <div
                key={i}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <Zap size={24} className="text-primary mx-auto mb-2" />
                <span className="text-foreground text-sm font-medium">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-8 md:p-12">
            <TrendingUp size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Boost Your Sales?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's build a CRM that aligns with your sales process and scales with your business. 
              Get a free consultation and custom quote today.
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
