import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";
import { useLanguage } from "@/hooks/useLanguage";
import engineersLogo from "@/assets/engineersTech-logo-white.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/portfolio", key: "nav.portfolio" },
  { href: "/demo", key: "nav.demo" },
  { href: "/blog", key: "nav.blog" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { branding } = useBranding();
  const { t, language, setLanguage, languages } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const logoUrl = branding?.logo_url?.trim() || null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isOpen
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 min-w-0 flex-shrink-0 group">
            {logoUrl ? (
              <img src={logoUrl} alt="engineersTech" className="h-8 sm:h-9 object-contain flex-shrink-0" />
            ) : (
              <img src={engineersLogo} alt="engineersTech" className="h-7 sm:h-8 object-contain flex-shrink-0" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navKeys.map((link) => (
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
                {t(link.key)}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Language */}
          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(language === lang.code && "bg-primary/10 text-primary")}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact">
              <Button variant="gradient" size="sm" className="gap-2 btn-glow">
                {t("cta.get_started")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2.5 rounded-xl transition-all duration-200",
              isOpen ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="py-4 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {navKeys.map((link, index) => (
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
                  {t(link.key)}
                  <ChevronRight className={cn("w-4 h-4 transition-transform", location.pathname === link.href && "text-primary")} />
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-3 px-4">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Language</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        language === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border/50">
                <Link to="/contact">
                  <Button variant="gradient" className="w-full h-12 gap-2 text-base">
                    {t("cta.get_started")}
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
