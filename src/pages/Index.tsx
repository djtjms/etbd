import { Suspense, lazy } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroSkeleton } from "@/components/home/HeroSkeleton";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactSection } from "@/components/home/ContactSection";

// Lazy load the hero section for better perceived performance
const HeroSection = lazy(() => 
  import("@/components/home/HeroSection").then(module => ({ 
    default: module.HeroSection 
  }))
);

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
