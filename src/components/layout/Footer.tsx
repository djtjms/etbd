import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import { useLanguage } from "@/hooks/useLanguage";
import engineersLogo from "@/assets/engineersTech-logo-white.svg";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { branding } = useBranding();
  const { t } = useLanguage();

  const logoText = branding?.logo_text || "engineersTech";
  const logoUrl = branding?.logo_url;
  const tagline = branding?.tagline || "Enterprise Tech Solutions for the Future. We deliver cutting-edge software solutions that transform businesses.";
  const email = branding?.company_email || "info@engineerstechbd.com";
  const phone = branding?.company_phone || "+880 1234-567890";
  const address = branding?.company_address || "Dhaka, Bangladesh";

  const socialLinks = [
    { icon: Facebook, href: branding?.facebook_url || "https://facebook.com/engineerstechbd", label: "Facebook" },
    { icon: Linkedin, href: branding?.linkedin_url || "https://linkedin.com/company/engineerstechbd", label: "LinkedIn" },
    { icon: Twitter, href: branding?.twitter_url || "https://twitter.com/engineerstechbd", label: "Twitter" },
  ].filter(s => s.href);

  const serviceLinks = [
    { label: t("footer.enterprise_solutions"), href: "/services#enterprise" },
    { label: t("footer.custom_development"), href: "/services#custom" },
    { label: t("footer.security_finance"), href: "/services#security" },
    { label: t("footer.ai_integration"), href: "/services#ai" },
  ];

  const companyLinks = [
    { label: t("footer.about_us"), href: "/about" },
    { label: t("nav.portfolio"), href: "/portfolio" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("footer.privacy"), href: "/privacy" },
    { label: t("footer.terms"), href: "/terms" },
  ];

  return (
    <footer className="bg-gradient-card border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="h-8 object-contain" />
              ) : (
                <img src={engineersLogo} alt="engineersTech" className="h-7 object-contain" />
              )}
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-xs">{tagline}</p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 border border-border/50 hover:border-primary/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-primary rounded-full" />
              {t("footer.services")}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group text-muted-foreground text-sm hover:text-primary transition-all inline-flex items-center gap-1">
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-primary rounded-full" />
              {t("footer.company")}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group text-muted-foreground text-sm hover:text-primary transition-all inline-flex items-center gap-1">
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-primary rounded-full" />
              {t("footer.contact")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`} className="group flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary border border-border/50 transition-all">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm pt-2">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="group flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary border border-border/50 transition-all">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm pt-2">{phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 border border-border/50">
                  <MapPin size={16} />
                </div>
                <span className="text-sm pt-2">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            © {currentYear} {logoText}. {t("footer.made_with")} <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
