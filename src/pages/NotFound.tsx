import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/hooks/useLanguage";

const quickLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.portfolio", href: "/portfolio" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.contact", href: "/contact" },
];

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showChatbot={false}>
      <section className="min-h-[calc(100vh-10rem)] flex items-center relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center mb-6 shadow-primary">
                <FileQuestion size={48} className="text-primary-foreground" />
              </div>
              <span className="text-8xl md:text-9xl font-bold text-gradient opacity-30">404</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t("notfound.title")}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t("notfound.desc")}
            </p>
            <p className="text-sm text-muted-foreground/60 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <code className="bg-secondary px-2 py-1 rounded text-primary">{location.pathname}</code>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/">
                <Button variant="gradient" size="lg" className="gap-2 w-full sm:w-auto shadow-primary">
                  <Home size={18} />
                  {t("notfound.home")}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} />
                {t("notfound.back")}
              </Button>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-sm text-muted-foreground mb-4">{t("notfound.looking_for")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
