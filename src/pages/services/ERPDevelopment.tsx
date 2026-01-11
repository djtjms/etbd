import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd, serviceSchemas, serviceFAQs } from "@/components/seo/JsonLd";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Check, Building2, BarChart3, Package, 
  Users, DollarSign, FileText, Settings, Shield,
  Clock, TrendingUp, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Package, title: "Inventory Management", description: "Real-time stock tracking, automated reordering, and warehouse management." },
  { icon: DollarSign, title: "Financial Management", description: "Complete accounting, budgeting, invoicing, and financial reporting." },
  { icon: Users, title: "HR Integration", description: "Employee management, payroll processing, and attendance tracking." },
  { icon: BarChart3, title: "Sales & CRM", description: "Lead management, sales pipeline, and customer relationship tools." },
  { icon: FileText, title: "Document Management", description: "Centralized document storage, version control, and collaboration." },
  { icon: Settings, title: "Workflow Automation", description: "Automate repetitive tasks and streamline business processes." },
];

const benefits = [
  { icon: Clock, title: "Save 40% Time", description: "Automate manual processes and reduce administrative overhead." },
  { icon: TrendingUp, title: "Increase Efficiency", description: "Streamlined operations lead to faster decision-making." },
  { icon: Shield, title: "Data Security", description: "Enterprise-grade security with role-based access control." },
  { icon: Zap, title: "Real-time Insights", description: "Live dashboards and analytics for informed decisions." },
];

const faqs = [
  {
    question: "How long does it take to implement a custom ERP system?",
    answer: "Implementation typically takes 3-6 months depending on complexity. We follow an agile approach with phased rollouts, so you can start using core modules within weeks while we continue development."
  },
  {
    question: "Can your ERP integrate with our existing systems?",
    answer: "Yes! Our ERP solutions are built with API-first architecture, allowing seamless integration with your existing accounting software, e-commerce platforms, and third-party tools."
  },
  {
    question: "What is the cost of custom ERP development in Bangladesh?",
    answer: "ERP costs vary based on modules and complexity. Basic systems start from $15,000, while comprehensive enterprise solutions range from $30,000-$100,000. Contact us for a detailed quote."
  },
  {
    question: "Do you provide training and support after deployment?",
    answer: "Absolutely! We provide comprehensive training for your team, detailed documentation, and ongoing support packages including bug fixes, updates, and 24/7 emergency support."
  },
];

export default function ERPDevelopment() {
  return (
    <Layout>
      <SEOHead 
        title="Custom ERP Development Company in Bangladesh | Enterprise Resource Planning | engineersTech"
        description="Leading ERP development company in Bangladesh. Build custom Enterprise Resource Planning systems with inventory, finance, HR, and CRM modules. Get a free consultation today!"
        keywords={["ERP development Bangladesh", "custom ERP system", "enterprise resource planning", "ERP software Dhaka", "business management software", "inventory management system"]}
      />
      <JsonLd type="Service" data={serviceSchemas.erp} />
      <JsonLd type="FAQPage" data={{ 
        faqs: faqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }} />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-primary">Services</Link>
              <span>/</span>
              <span className="text-foreground">ERP Development</span>
            </nav>
            
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Enterprise Resource Planning
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Custom <span className="text-gradient">ERP Development</span> in Bangladesh
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Transform your business operations with a tailored ERP system. We build comprehensive 
              solutions that integrate inventory, finance, HR, and sales into one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View ERP Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete ERP Modules
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our ERP solutions cover all aspects of your business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-card rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Our ERP Solutions?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our custom ERP systems are designed specifically for Bangladesh businesses, 
                understanding local compliance requirements, tax regulations, and market needs.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <benefit.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Industries We Serve</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Manufacturing", "Retail & E-commerce", "Healthcare", "Education", "Real Estate", "Logistics", "Hospitality", "Finance"].map((industry) => (
                  <div key={industry} className="flex items-center gap-2">
                    <Check size={16} className="text-primary" />
                    <span className="text-muted-foreground text-sm">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gradient-card rounded-xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Streamline Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get a free consultation and discover how our ERP solutions can transform your operations.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Request Free Demo
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
