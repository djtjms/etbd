import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Clock,
  FileText,
  Shield,
  Settings,
  ArrowRight,
  CheckCircle,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const hrmFeatures = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Complete employee lifecycle management from onboarding to offboarding with comprehensive profiles.",
  },
  {
    icon: Clock,
    title: "Attendance & Time Tracking",
    description: "Automated attendance tracking with biometric integration, leave management, and shift scheduling.",
  },
  {
    icon: DollarSign,
    title: "Payroll Processing",
    description: "Automated payroll calculation with tax compliance, deductions, and multi-currency support.",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Streamlined leave requests, approvals, and balance tracking with customizable policies.",
  },
  {
    icon: BarChart3,
    title: "Performance Appraisal",
    description: "360-degree feedback, goal setting, KPI tracking, and automated performance reviews.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure storage and management of employee documents, contracts, and certifications.",
  },
];

const industries = [
  "Manufacturing",
  "Retail & E-commerce",
  "Healthcare",
  "IT & Technology",
  "Education",
  "Banking & Finance",
  "Hospitality",
  "Construction",
];

const benefits = [
  "Reduce HR administrative tasks by 70%",
  "Improve employee satisfaction and retention",
  "Ensure compliance with labor laws",
  "Data-driven workforce analytics",
  "Seamless integration with existing systems",
  "Mobile-first approach for remote teams",
];

export default function HRMDevelopment() {
  return (
    <Layout>
      <SEOHead
        title="HRM Software Development Company Bangladesh | HR Management System"
        description="Custom HRM software development services in Bangladesh. Build powerful HR management systems with payroll, attendance, leave management, and performance tracking."
        keywords={["HRM software Bangladesh", "HR management system", "payroll software development", "attendance management system", "employee management software"]}
        canonical="/services/hrm-development"
      />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              HRM Development Services
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Custom <span className="text-gradient">HRM Software</span> Development
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build powerful Human Resource Management systems that streamline HR operations, 
              improve employee experience, and drive organizational growth.
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
                  View HRM Demo
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
              Core Modules
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive HRM Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hrmFeatures.map((feature, index) => (
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
            <div>
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
                Why Choose Our HRM
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transform Your HR Operations
              </h2>
              <p className="text-muted-foreground mb-8">
                Our custom HRM solutions are designed to handle the unique challenges of 
                managing human resources in Bangladesh and beyond. We understand local 
                labor laws, cultural nuances, and business practices.
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
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <div className="w-40 h-40 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Users size={80} className="text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Industries We Serve
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              HRM Solutions for Every Industry
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, i) => (
              <div
                key={i}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <Building2 size={24} className="text-primary mx-auto mb-2" />
                <span className="text-foreground text-sm font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-8 md:p-12">
            <Shield size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Modernize Your HR?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's build an HRM system that grows with your organization. 
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
