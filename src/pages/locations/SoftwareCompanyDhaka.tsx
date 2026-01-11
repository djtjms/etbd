import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "react-router-dom";
import { 
  ArrowRight, MapPin, Phone, Mail, Clock, Building2,
  Code2, Brain, Shield, Users, Award, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/hooks/useBranding";

const services = [
  { icon: Building2, title: "Enterprise Solutions", link: "/services#enterprise" },
  { icon: Code2, title: "Custom Development", link: "/services#custom" },
  { icon: Brain, title: "AI Integration", link: "/services/ai-integration" },
  { icon: Shield, title: "Security Solutions", link: "/services#security" },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const benefits = [
  "Local team understanding Bangladesh business needs",
  "Competitive pricing without compromising quality",
  "Face-to-face meetings and on-site support",
  "Knowledge of local compliance and regulations",
  "Bengali and English language support",
  "Quick turnaround with minimal time zone differences",
];

export default function SoftwareCompanyDhaka() {
  const { branding } = useBranding();
  
  return (
    <Layout>
      <SEOHead 
        title="Best Software Company in Dhaka, Bangladesh | Custom Software Development | engineersTech"
        description="Leading software development company in Dhaka, Bangladesh. We offer custom ERP, web development, mobile apps, and AI solutions. Local team, competitive pricing. Contact us today!"
        keywords={["software company Dhaka", "IT company Bangladesh", "software development Dhaka", "custom software Bangladesh", "tech company Dhaka", "IT services Bangladesh"]}
      />
      <JsonLd type="LocalBusiness" data={{
        name: "engineersTech - Software Company Dhaka",
        "@id": "https://engineerstechbd.com/software-company-dhaka",
        areaServed: {
          "@type": "City",
          name: "Dhaka",
          containedIn: {
            "@type": "Country",
            name: "Bangladesh"
          }
        }
      }} />

      {/* Hero */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <MapPin size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Located in Dhaka, Bangladesh</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Best <span className="text-gradient">Software Company</span> in Dhaka
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              engineersTech is a leading software development company in Dhaka, Bangladesh, 
              delivering enterprise solutions, custom applications, and AI integration services 
              to businesses locally and globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a href={`tel:${branding?.company_phone || "+880 1234-567890"}`}>
                <Button variant="outline" size="lg" className="gap-2">
                  <Phone size={18} />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</span>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose a Local Software Company in Dhaka?
              </h2>
              <p className="text-muted-foreground mb-6">
                Working with a Dhaka-based software company like engineersTech gives you the 
                advantage of local expertise combined with global standards. We understand 
                the unique challenges and opportunities in the Bangladesh market.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Our Services in Dhaka</h3>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.link}
                    className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <service.icon size={20} className="text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{service.title}</span>
                    <ArrowRight size={16} className="text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Visit Our Dhaka Office
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Address</h3>
                <p className="text-muted-foreground text-sm">
                  {branding?.company_address || "Dhaka, Bangladesh"}
                </p>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <a href={`tel:${branding?.company_phone}`} className="text-muted-foreground text-sm hover:text-primary">
                  {branding?.company_phone || "+880 1234-567890"}
                </a>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <a href={`mailto:${branding?.company_email}`} className="text-muted-foreground text-sm hover:text-primary">
                  {branding?.company_email || "info@engineerstechbd.com"}
                </a>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                <p className="text-muted-foreground text-sm">
                  Sun - Thu: 9AM - 6PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact our Dhaka team for a free consultation and quote.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Contact Dhaka Office
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
