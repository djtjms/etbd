import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd, serviceSchemas } from "@/components/seo/JsonLd";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Globe, Code2, Smartphone, ShoppingCart,
  Gauge, Shield, Search, Palette, Server, Database, Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Globe, title: "Corporate Websites", description: "Professional, SEO-optimized websites that establish your brand presence online." },
  { icon: ShoppingCart, title: "E-commerce Platforms", description: "Scalable online stores with payment integration, inventory management, and analytics." },
  { icon: Code2, title: "Custom Web Applications", description: "Complex business applications built with React, Next.js, and modern frameworks." },
  { icon: Server, title: "API Development", description: "RESTful and GraphQL APIs for seamless system integration and data exchange." },
  { icon: Database, title: "Database Design", description: "Efficient, scalable database architecture using PostgreSQL, MongoDB, and more." },
  { icon: Cloud, title: "Cloud Deployment", description: "AWS, Google Cloud, and Azure deployment with CI/CD pipelines." },
];

const technologies = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
];

const features = [
  { icon: Gauge, title: "Fast Performance", description: "Optimized for speed with 90+ Lighthouse scores" },
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security and 99.9% uptime" },
  { icon: Search, title: "SEO Optimized", description: "Built-in SEO best practices for better rankings" },
  { icon: Palette, title: "Modern Design", description: "Beautiful, responsive UI/UX that converts" },
];

const faqs = [
  {
    question: "What technologies do you use for web development?",
    answer: "We primarily use React, Next.js, and TypeScript for frontend development, Node.js for backend, and PostgreSQL or MongoDB for databases. We choose the best stack based on your project requirements."
  },
  {
    question: "How long does it take to build a website?",
    answer: "Simple websites take 2-4 weeks, while complex web applications may take 2-4 months. We provide detailed timelines during the discovery phase based on your specific requirements."
  },
  {
    question: "Do you provide website maintenance and support?",
    answer: "Yes, we offer comprehensive maintenance packages including security updates, bug fixes, content updates, and performance optimization. Our support team is available during business hours."
  },
  {
    question: "What is the cost of web development in Bangladesh?",
    answer: "Website costs depend on complexity. Basic websites start from $2,000, e-commerce platforms from $5,000, and custom web applications from $10,000. Contact us for a detailed quote."
  },
];

export default function WebDevelopment() {
  return (
    <Layout>
      <SEOHead 
        title="Web Development Company Bangladesh | React, Next.js, Custom Web Apps | engineersTech"
        description="Leading web development company in Bangladesh. We build fast, secure, SEO-optimized websites and web applications using React, Next.js, and modern technologies."
        keywords={["web development Bangladesh", "web application development", "React development Dhaka", "Next.js development", "custom website Bangladesh", "e-commerce development"]}
      />
      <JsonLd type="Service" data={serviceSchemas.web} />

      {/* Hero */}
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
              <span className="text-foreground">Web Development</span>
            </nav>
            
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Web Development
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-gradient">Web Development</span> That Drives Results
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              From stunning corporate websites to complex web applications, we build 
              digital experiences that engage users and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Services */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Web Development Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Full-stack web development from concept to deployment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-card rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <service.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Our Web Development?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <feature.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Technologies We Use</h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span key={tech.name} className="px-4 py-2 bg-secondary rounded-full text-sm text-foreground">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's Build Something Amazing
            </h2>
            <p className="text-muted-foreground mb-8">
              Get a free consultation and quote for your web project.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Get Free Quote
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
