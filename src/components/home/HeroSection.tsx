import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Brain, Settings, Zap, Shield, Rocket } from "lucide-react";
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

// Simple grid pattern without blur (mobile-safe)
function GridPattern({ reduced }: { reduced?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${reduced ? 'opacity-10' : 'opacity-20'}`}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
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
      className={`absolute rounded-full blur-3xl animate-float opacity-30 ${className}`}
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
    if (rafRef.current) return; // Skip if already scheduled
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    // Disable mouse tracking on mobile or reduced motion
    if (isMobile || prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, isMobile, prefersReducedMotion]);

  // Use simplified effects on mobile or reduced motion
  const useSimplifiedEffects = isMobile || prefersReducedMotion;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated gradient that follows mouse (desktop only) */}
      {!useSimplifiedEffects && (
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--primary) / 0.15) 0%, transparent 50%)`,
          }}
        />
      )}
      
      {/* Static gradient for mobile */}
      {useSimplifiedEffects && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
          }}
        />
      )}
      
      {/* Grid pattern */}
      <GridPattern reduced={useSimplifiedEffects} />
      
      {/* Floating orbs (desktop only - these use blur which causes mobile GPU issues) */}
      <FloatingOrb 
        className="w-[500px] h-[500px] bg-primary/20 top-0 -left-40" 
        delay={0} 
        disabled={useSimplifiedEffects} 
      />
      <FloatingOrb 
        className="w-[400px] h-[400px] bg-accent/20 bottom-0 -right-32" 
        delay={2} 
        disabled={useSimplifiedEffects} 
      />
      <FloatingOrb 
        className="w-[300px] h-[300px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        delay={1} 
        disabled={useSimplifiedEffects} 
      />
      
      {/* Gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Animated particles (desktop only, reduced count) */}
      {!useSimplifiedEffects && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
              style={{ 
                left: `${20 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + i}s`
              }} 
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm group hover:border-primary/40 transition-all duration-300 cursor-default">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
              <span className="text-sm text-foreground/80 font-medium">
                Innovating Tomorrow, Today
              </span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-6 animate-fade-in leading-[1.1] tracking-tight"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.1s" }}
          >
            <span className="block text-foreground">Transform Your</span>
            <span className="block mt-2">
              <span className="text-gradient">Business</span>
              <span className="text-foreground"> with</span>
            </span>
            <span className="block text-foreground mt-2">Cutting-Edge Tech</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-10 max-w-3xl mx-auto animate-fade-in leading-relaxed"
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
                size="lg" 
                className="gap-2 shadow-primary w-full sm:w-auto text-base px-8 py-6 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 w-full sm:w-auto text-base px-8 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
              >
                <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                View Live Demos
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div 
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-12 animate-fade-in"
            style={{ animationDelay: useSimplifiedEffects ? "0s" : "0.4s" }}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    disabled={prefersReducedMotion}
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
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
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-default"
              >
                <tag.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only) */}
      {!useSimplifiedEffects && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}
