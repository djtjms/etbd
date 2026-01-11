import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/demo", label: "Demo" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { branding } = useBranding();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Treat empty strings as null for proper fallback
  const logoText = branding?.logo_text?.trim() || "engineersTech";
  const logoUrl = branding?.logo_url?.trim() || null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "glass border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 min-w-0 flex-shrink-0 group"
          >
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={logoText} 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all" 
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-primary group-hover:shadow-primary-lg transition-all">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">e</span>
              </div>
            )}
            <span className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
              {logoText.includes("Tech") ? (
                <>
                  {logoText.replace("Tech", "")}<span className="text-gradient">Tech</span>
                </>
              ) : (
                logoText
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact">
              <Button variant="gradient" size="sm" className="gap-2 btn-glow">
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2.5 rounded-xl transition-all duration-200",
              isOpen 
                ? "bg-primary text-primary-foreground" 
                : "text-foreground hover:bg-secondary"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="py-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center justify-between text-base font-medium py-3.5 px-4 rounded-xl transition-all duration-200",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    location.pathname === link.href && "text-primary"
                  )} />
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border/50">
                <Link to="/contact">
                  <Button variant="gradient" className="w-full h-12 gap-2 text-base">
                    Get Started
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
