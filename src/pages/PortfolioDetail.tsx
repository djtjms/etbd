import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, Calendar, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  technologies: string[] | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  results: string | null;
  created_at: string;
}

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchItem() {
      if (!slug) return;
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!error && data) {
        setItem(data);
        setSelectedImage(data.featured_image);
      }
      setLoading(false);
    }
    fetchItem();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">{t("portfolio.loading")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t("portfolio.not_found")}</h1>
            <p className="text-muted-foreground mb-6">{t("portfolio.not_found_desc")}</p>
            <Link to="/portfolio">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} />
                {t("portfolio.back")}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const allImages = [item.featured_image, ...(item.gallery_images || [])].filter(Boolean) as string[];

  return (
    <Layout>
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={16} />
            {t("portfolio.back")}
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
                {selectedImage ? (
                  <img src={selectedImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-gradient">e</span>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(img)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-primary" : "border-transparent"}`}>
                      <img src={img} alt={`${item.title} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {item.client_name && (
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
                  <Building2 size={16} />
                  {item.client_name}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{item.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>

              {item.technologies && item.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-2">{t("portfolio.technologies")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-secondary text-sm text-foreground rounded-full">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {item.results && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 mb-6">
                  <h3 className="text-sm font-medium text-primary mb-2">{t("portfolio.results")}</h3>
                  <p className="text-foreground">{item.results}</p>
                </div>
              )}

              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  {t("portfolio.start_similar")}
                  <ExternalLink size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {item.description && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t("portfolio.overview")}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("portfolio.interested")}</h2>
            <p className="text-muted-foreground mb-6">{t("portfolio.interested_desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact"><Button variant="gradient" size="lg">{t("portfolio.contact")}</Button></Link>
              <Link to="/portfolio"><Button variant="outline" size="lg">{t("portfolio.view_more")}</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
