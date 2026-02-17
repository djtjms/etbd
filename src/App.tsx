import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { BrandingProvider } from "@/hooks/useBranding";
import { ConsentProvider } from "@/hooks/useConsent";
import { LanguageProvider } from "@/hooks/useLanguage";
import { CookieConsent } from "@/components/gdpr/CookieConsent";
import { WhatsAppButton } from "@/components/consultation/WhatsAppButton";
import { InteractionTracker } from "@/components/analytics/InteractionTracker";
import { PageTransition } from "@/components/animations/PageTransition";
import Analytics from "./pages/admin/Analytics";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ConsultationTrigger } from "@/components/consultation/ConsultationTrigger";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Demo from "./pages/Demo";
import Showcase from "./pages/Showcase";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ERPDevelopment from "./pages/services/ERPDevelopment";
import HRMDevelopment from "./pages/services/HRMDevelopment";
import CRMDevelopment from "./pages/services/CRMDevelopment";
import AIIntegration from "./pages/services/AIIntegration";
import WebDevelopment from "./pages/services/WebDevelopment";
import MobileDevelopment from "./pages/services/MobileDevelopment";
import SoftwareCompanyDhaka from "./pages/locations/SoftwareCompanyDhaka";
import ITServicesBangladesh from "./pages/locations/ITServicesBangladesh";
import SEODashboard from "./pages/admin/SEODashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import PortfolioManagement from "./pages/admin/PortfolioManagement";
import DemoManagement from "./pages/admin/DemoManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SEOSettings from "./pages/admin/SEOSettings";
import ChatbotConfig from "./pages/admin/ChatbotConfig";
import BrandingSettings from "./pages/admin/BrandingSettings";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  return (
    <PageTransition>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/erp-development" element={<ERPDevelopment />} />
        <Route path="/services/hrm-development" element={<HRMDevelopment />} />
        <Route path="/services/crm-development" element={<CRMDevelopment />} />
        <Route path="/services/ai-integration" element={<AIIntegration />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/mobile-development" element={<MobileDevelopment />} />
        <Route path="/locations/software-company-dhaka" element={<SoftwareCompanyDhaka />} />
        <Route path="/locations/it-services-bangladesh" element={<ITServicesBangladesh />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/showcase/:slug" element={<Showcase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
        <Route path="/admin/portfolio" element={<ProtectedRoute><PortfolioManagement /></ProtectedRoute>} />
        <Route path="/admin/demo" element={<ProtectedRoute><DemoManagement /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialsManagement /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><MessagesManagement /></ProtectedRoute>} />
        <Route path="/admin/seo" element={<ProtectedRoute><SEOSettings /></ProtectedRoute>} />
        <Route path="/admin/seo-dashboard" element={<ProtectedRoute><SEODashboard /></ProtectedRoute>} />
        <Route path="/admin/chatbot" element={<ProtectedRoute><ChatbotConfig /></ProtectedRoute>} />
        <Route path="/admin/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/admin/consultations" element={<ProtectedRoute><ConsultationManagement /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandingProvider>
        <LanguageProvider>
          <ConsentProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <InteractionTracker>
                  <AnimatedRoutes />
                  <WhatsAppButton />
                  <CookieConsent />
                  <ConsultationTrigger />
                </InteractionTracker>
              </BrowserRouter>
            </TooltipProvider>
          </ConsentProvider>
        </LanguageProvider>
      </BrandingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
