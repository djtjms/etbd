import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { JsonLd, serviceSchemas } from "@/components/seo/JsonLd";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Brain, Cpu, MessageSquare, BarChart3,
  Sparkles, Eye, Bot, Workflow, Shield, Zap, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Bot, title: "AI Chatbots", description: "Intelligent conversational agents that handle customer queries, support tickets, and lead qualification 24/7." },
  { icon: BarChart3, title: "Predictive Analytics", description: "Machine learning models that forecast sales, customer behavior, and market trends." },
  { icon: Eye, title: "Computer Vision", description: "Image recognition, quality control automation, and visual data analysis solutions." },
  { icon: MessageSquare, title: "Natural Language Processing", description: "Text analysis, sentiment detection, document processing, and language translation." },
  { icon: Workflow, title: "Process Automation", description: "AI-powered workflow automation that learns and improves over time." },
  { icon: Sparkles, title: "Recommendation Systems", description: "Personalized product recommendations and content suggestions for your users." },
];

const useCases = [
  { title: "Customer Service Automation", description: "Reduce support costs by 60% with AI chatbots handling routine queries.", stat: "60%" },
  { title: "Sales Forecasting", description: "Improve forecast accuracy by 35% with machine learning models.", stat: "35%" },
  { title: "Document Processing", description: "Process documents 10x faster with intelligent OCR and extraction.", stat: "10x" },
  { title: "Quality Control", description: "Detect defects with 99% accuracy using computer vision.", stat: "99%" },
];

const faqs = [
  {
    question: "What AI services do you offer for businesses in Bangladesh?",
    answer: "We offer comprehensive AI services including chatbot development, predictive analytics, natural language processing, computer vision, and process automation. Our solutions are tailored for Bangladesh businesses with local language support."
  },
  {
    question: "How can AI benefit my business?",
    answer: "AI can automate repetitive tasks, provide data-driven insights, improve customer service, reduce operational costs, and help you make better decisions. Most businesses see 30-50% efficiency improvements."
  },
  {
    question: "Do I need a lot of data to implement AI?",
    answer: "While more data generally leads to better AI performance, we can start with existing data and use pre-trained models. We also help you establish data collection strategies for continuous improvement."
  },
  {
    question: "What is the cost of AI integration?",
    answer: "AI project costs depend on complexity and scope. Simple chatbot implementations start from $5,000, while comprehensive AI solutions range from $20,000-$100,000. Contact us for a detailed assessment."
  },
];

export default function AIIntegration() {
  return (
    <Layout>
      <SEOHead 
        title="AI Integration Services Bangladesh | Machine Learning, Chatbots & Automation | engineersTech"
        description="Leading AI integration company in Bangladesh. We develop custom AI solutions including chatbots, predictive analytics, NLP, and process automation for business growth."
        keywords={["AI integration Bangladesh", "machine learning services", "AI chatbot development", "predictive analytics", "business automation AI", "artificial intelligence Dhaka"]}
      />
      <JsonLd type="Service" data={serviceSchemas.ai} />
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
              <span className="text-foreground">AI Integration</span>
            </nav>
            
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Artificial Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-gradient">AI Integration</span> Services for Modern Business
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Harness the power of artificial intelligence to automate processes, gain insights, 
              and create competitive advantages for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  Start AI Journey
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  See AI Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI Solutions We Build
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From intelligent chatbots to advanced analytics, we deliver AI that drives results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-card rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases / Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Business Impact
            </h2>
            <p className="text-muted-foreground">
              See how AI transforms business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
                <span className="text-4xl font-bold text-gradient block mb-2">{useCase.stat}</span>
                <h3 className="font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our AI Implementation Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Discovery", desc: "Understand your business needs and data" },
                { step: "02", title: "Design", desc: "Create AI solution architecture" },
                { step: "03", title: "Develop", desc: "Build and train AI models" },
                { step: "04", title: "Deploy", desc: "Launch, monitor, and optimize" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <span className="text-4xl font-bold text-primary/30">{item.step}</span>
                  <h3 className="font-semibold text-foreground mt-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
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
            <Brain size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Embrace AI?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how AI can transform your business operations.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Get AI Consultation
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
