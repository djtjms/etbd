import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";

const footerLinks = {
  services: [
    { label: "Enterprise Solutions", href: "/services#enterprise" },
    { label: "Custom Development", href: "/services#custom" },
    { label: "Security & Finance", href: "/services#security" },
    { label: "AI Integration", href: "/services#ai" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { branding } = useBranding();

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

  return (
    <footer className="bg-card border-t border-border relative">
      {/* Top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-3 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="w-10 h-10 rounded-lg object-contain group-hover:shadow-primary transition-shadow" />
              ) : (
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-primary transition-shadow">
                  <span className="text-primary-foreground font-bold text-xl">e</span>
                </div>
              )}
              <span className="text-xl font-bold text-foreground">
                {logoText.includes("Tech") ? (
                  <>
                    {logoText.replace("Tech", "")}<span className="text-gradient">Tech</span>
                  </>
                ) : (
                  logoText
                )}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {tagline}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50 border border-transparent transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground text-sm hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground text-sm hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Mail size={16} className="text-primary" />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors pt-1"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Phone size={16} className="text-primary" />
                </div>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors pt-1"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground text-sm pt-1">
                  {address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {logoText}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
