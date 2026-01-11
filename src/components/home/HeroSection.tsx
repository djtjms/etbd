import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Brain, Settings, Zap, Shield, Rocket, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useIsMobile";

const serviceTags = [
  { icon: Code2, label: "Software Development" },
  { icon: Brain, label: "AI Solutions" },
  { icon: Settings, label: "IT Consulting" },
  { icon: Zap, label: "Cloud Services" },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 50, suffix: "+", label: "Team Experts" },
];

function AnimatedCounter({ value, suffix, disabled }: { value: number; suffix: string; disabled?: boolean }) {
  const [count, setCount] = useState(disabled ? value : 0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (disabled) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [disabled, value]);

  useEffect(() => {
    if (!isVisible || disabled) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible, disabled]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// Premium grid pattern
function GridPattern({ reduced }: { reduced?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${reduced ? 'opacity-5' : 'opacity-10'}`}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

// Desktop-only floating orb with blur
function FloatingOrb({ className, delay = 0, disabled }: { className?: string; delay?: number; disabled?: boolean }) {
  if (disabled) return null;
  
  return (
    <div 
      className={`absolute rounded-full blur-3xl animate-float opacity-20 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafRef = useRef<number | null>(null);

  // Throttled mouse move handler (desktop only)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, isMobile, prefersReducedMotion]);

  const useSimplifiedEffects = isMobile || prefersReducedMotion;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      
      {/* Animated gradient that follows mouse (desktop only) */}
      {!useSimplifiedEffects && (
        <div 
          className="absolute inset-0 opacity-50 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--primary) / 0.12) 0%, transparent 45%)`,
          }}
        />
      )}
      
      {/* Static gradient for mobile */}
      {useSimplifiedEffects && (
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
          }}
        />
      )}
      
      {/* Grid pattern */}
      <GridPattern reduced={useSimplifiedEffects} />
      
      {/* Floating orbs */}
      <FloatingOrb 
        className="w-[600px] h-[600px] bg-primary/30 -top-40 -left-40" 
        delay={0} 
        disabled={useSimplifiedEffects} 
      />
      <FloatingOrb 
        className="w-[500px] h-[500px] bg-accent/25 -bottom-20 -right-32" 
        delay={2} 
        disabled={useSimplifiedEffects} 
      />
      <FloatingOrb 
        className="w-[350px] h-[350px] bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        delay={1} 
        disabled={useSimplifiedEffects} 
      />
      
      {/* Gradient lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
      <div className="absolute top-1/4 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
      
      {/* Animated particles (desktop only) */}
      {!useSimplifiedEffects && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary/50 rounded-full animate-float"
              style={{ 
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${6 + i * 0.5}s`
              }} 
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-sm group hover:border-primary/40 hover:bg-primary/15 transition-all duration-300 cursor-default">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
              <span className="text-sm text-foreground/90 font-medium">
                Innovating Tomorrow, Today
              </span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-8 animate-fade-in leading-[1.05] tracking-tight"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.1s" }}
          >
            <span className="block text-foreground">Transform Your</span>
            <span className="block mt-2 sm:mt-3">
              <span className="text-gradient">Business</span>
              <span className="text-foreground"> with</span>
            </span>
            <span className="block text-foreground mt-2 sm:mt-3">Cutting-Edge Tech</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.2s" }}
          >
            We deliver innovative software solutions, AI-powered systems, and expert IT consulting to help businesses thrive in the digital age.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.3s" }}
          >
            <Link to="/contact" className="w-full sm:w-auto">
              <Button 
                variant="gradient" 
                size="xl" 
                className="gap-2.5 w-full sm:w-auto group relative overflow-hidden btn-glow"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="xl" 
                className="gap-2.5 w-full sm:w-auto group"
              >
                <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                View Live Demos
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div 
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mb-14 animate-fade-in"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.4s" }}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm hover:border-primary/40 hover:bg-card/80 transition-all duration-300 group"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-105 transition-transform">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    disabled={prefersReducedMotion}
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Service Tags */}
          <div 
            className="flex flex-wrap items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.5s" }}
          >
            {serviceTags.map((tag, index) => (
              <div 
                key={index} 
                className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-secondary/60 border border-border/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 cursor-default"
              >
                <tag.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm text-foreground/80 group-hover:text-foreground font-medium transition-colors">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only) */}
      {!useSimplifiedEffects && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden sm:flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}
