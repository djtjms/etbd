import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  const location = useLocation();
  const { branding } = useBranding();

  // Treat empty strings as null for proper fallback
  const logoText = branding?.logo_text?.trim() || "engineersTech";
  const logoUrl = branding?.logo_url?.trim() || null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={logoText} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">e</span>
              </div>
            )}
            <span className="text-base sm:text-xl font-bold text-foreground whitespace-nowrap">
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
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <Link to="/contact">
              <Button variant="gradient" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 text-foreground rounded-md hover:bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden py-4 border-t border-border/50 animate-fade-in max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary py-4 px-3 rounded-lg",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border/50">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full h-11">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
