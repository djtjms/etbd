import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Tablet, 
  Apple,
  Play,
  Code2,
  Zap,
  Shield,
  Gauge,
  ArrowRight,
  CheckCircle,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const mobileServices = [
  {
    icon: Apple,
    title: "iOS App Development",
    description: "Native iOS apps using Swift and SwiftUI for iPhone and iPad with App Store optimization.",
  },
  {
    icon: Play,
    title: "Android App Development",
    description: "Native Android apps using Kotlin with Material Design and Google Play optimization.",
  },
  {
    icon: Code2,
    title: "Cross-Platform Apps",
    description: "React Native and Flutter development for simultaneous iOS and Android deployment.",
  },
  {
    icon: Layers,
    title: "Progressive Web Apps",
    description: "PWAs that work offline, install like native apps, and run on any device.",
  },
  {
    icon: Shield,
    title: "Enterprise Mobile Apps",
    description: "Secure enterprise apps with MDM integration, SSO, and compliance features.",
  },
  {
    icon: Gauge,
    title: "App Performance",
    description: "Optimization for speed, battery efficiency, and smooth user experience.",
  },
];

const technologies = [
  { name: "React Native", category: "Cross-Platform" },
  { name: "Flutter", category: "Cross-Platform" },
  { name: "Swift", category: "iOS" },
  { name: "Kotlin", category: "Android" },
  { name: "Firebase", category: "Backend" },
  { name: "GraphQL", category: "API" },
  { name: "AWS Amplify", category: "Cloud" },
  { name: "Push Notifications", category: "Services" },
];

const benefits = [
  "Reach customers on their preferred devices",
  "Increase customer engagement by 3x",
  "Offline-first capabilities",
  "Native performance and UX",
  "Seamless third-party integrations",
  "Ongoing maintenance and updates",
];

const appTypes = [
  "E-commerce Apps",
  "Social Media Apps",
  "Healthcare Apps",
  "FinTech Apps",
  "Education Apps",
  "Logistics Apps",
  "Real Estate Apps",
  "Entertainment Apps",
];

export default function MobileDevelopment() {
  return (
    <Layout>
      <SEOHead
        title="Mobile App Development Company Bangladesh | iOS & Android Apps"
        description="Professional mobile app development services in Bangladesh. Build native iOS, Android, and cross-platform apps with React Native and Flutter. Get your app to market faster."
        keywords={["mobile app development Bangladesh", "iOS app development", "Android app development", "React Native development", "Flutter app development", "cross-platform mobile apps"]}
        canonical="/services/mobile-development"
      />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Mobile App Development
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Build <span className="text-gradient">Mobile Apps</span> That Users Love
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From concept to App Store, we build high-performance mobile applications 
              for iOS and Android that deliver exceptional user experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Start Your App Project
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View App Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Mobile Development Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileServices.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <service.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Technologies We Use
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {technologies.map((tech, i) => (
              <div
                key={i}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <span className="text-foreground font-medium">{tech.name}</span>
                <p className="text-xs text-muted-foreground mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
                Why Mobile First
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Mobile Apps Drive Business Growth
              </h2>
              <p className="text-muted-foreground mb-8">
                With over 6 billion smartphone users worldwide, mobile apps are 
                essential for reaching and engaging your customers where they spend 
                most of their digital time.
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
                <div className="flex gap-4">
                  <div className="w-24 h-40 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Smartphone size={40} className="text-primary-foreground" />
                  </div>
                  <div className="w-32 h-44 bg-gradient-primary rounded-2xl flex items-center justify-center mt-4">
                    <Tablet size={48} className="text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Types Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Industries
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Apps We Build
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {appTypes.map((type, i) => (
              <div
                key={i}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <Smartphone size={24} className="text-primary mx-auto mb-2" />
                <span className="text-foreground text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-8 md:p-12">
            <Zap size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your App?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's turn your app idea into reality. Get a free consultation 
              and project estimate from our mobile experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Get Free Quote
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  View App Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
