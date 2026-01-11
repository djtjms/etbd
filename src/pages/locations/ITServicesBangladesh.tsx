import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Users, 
  Award,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  MapPin,
  Building2,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom web applications, e-commerce solutions, and enterprise portals built with modern technologies.",
    link: "/services/web-development"
  },
  {
    icon: Building2,
    title: "ERP Development",
    description: "Tailored ERP solutions for manufacturing, retail, and service industries in Bangladesh.",
    link: "/services/erp-development"
  },
  {
    icon: Users,
    title: "HRM Systems",
    description: "Complete HR management software with payroll, attendance, and performance tracking.",
    link: "/services/hrm-development"
  },
  {
    icon: TrendingUp,
    title: "CRM Solutions",
    description: "Sales automation and customer management systems for growing businesses.",
    link: "/services/crm-development"
  },
  {
    icon: Zap,
    title: "AI Integration",
    description: "Artificial intelligence and machine learning solutions for business automation.",
    link: "/services/ai-integration"
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Security audits, penetration testing, and compliance solutions for enterprises.",
    link: "/services"
  },
];

const advantages = [
  "Cost-effective development without compromising quality",
  "English-speaking technical teams",
  "Same timezone as major Asian markets",
  "Government incentives for IT sector",
  "Growing pool of skilled developers",
  "Competitive hourly rates (60-80% lower than Western markets)",
];

const stats = [
  { value: "700K+", label: "IT Professionals" },
  { value: "$1.4B", label: "IT Export Revenue" },
  { value: "4,500+", label: "IT Companies" },
  { value: "30%", label: "Annual Growth" },
];

const cities = [
  { name: "Dhaka", role: "IT Hub & Capital" },
  { name: "Chittagong", role: "Second Largest City" },
  { name: "Sylhet", role: "Emerging Tech Center" },
  { name: "Rajshahi", role: "University Town" },
];

export default function ITServicesBangladesh() {
  return (
    <Layout>
      <SEOHead
        title="IT Services Bangladesh | Software Development Company | engineersTech"
        description="Leading IT services provider in Bangladesh offering custom software development, web applications, mobile apps, ERP, CRM, and AI solutions. Cost-effective offshore development with quality assurance."
        keywords={["IT services Bangladesh", "software company Bangladesh", "offshore development Bangladesh", "IT outsourcing Bangladesh", "software development company"]}
        canonical="/locations/it-services-bangladesh"
      />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              IT Services in Bangladesh
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Premium <span className="text-gradient">IT Solutions</span> from Bangladesh
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bangladesh is emerging as a global IT hub. Partner with engineersTech 
              for world-class software development at competitive rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gradient-card rounded-2xl border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our IT Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive Technology Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="bg-gradient-card rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bangladesh Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
                Why Bangladesh
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Next IT Destination
              </h2>
              <p className="text-muted-foreground mb-8">
                Bangladesh offers a unique combination of talent, cost-effectiveness, 
                and quality that makes it an ideal destination for IT outsourcing. 
                Our developers are trained in global standards and deliver excellence.
              </p>
              <ul className="space-y-4">
                {advantages.map((advantage, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <div className="w-40 h-40 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Globe size={80} className="text-primary-foreground" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-card rounded-2xl border border-border/50 p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <Award size={32} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">ISO 27001</p>
                    <p className="text-sm text-muted-foreground">Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Reach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tech Hubs Across Bangladesh
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {cities.map((city, i) => (
              <div
                key={i}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <MapPin size={24} className="text-primary mx-auto mb-2" />
                <span className="text-foreground font-medium block">{city.name}</span>
                <span className="text-xs text-muted-foreground">{city.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-8 md:p-12">
            <Clock size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground mb-8">
              Partner with Bangladesh's leading IT services provider. 
              Get a free consultation and project estimate today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Contact Us Today
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  View Live Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
