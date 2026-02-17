import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { PreviewModal } from "@/components/portfolio/PreviewModal";
import { ConsultationPopup } from "@/components/consultation/ConsultationPopup";
import { useLanguage } from "@/hooks/useLanguage";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  technologies: string[] | null;
  featured_image: string | null;
  results: string | null;
}

export default function Portfolio() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CaseStudy | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase.from("case_studies").select("*").eq("status", "published").order("created_at", { ascending: false });
      if (!error && data) setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  const handlePreview = (item: CaseStudy) => { setSelectedItem(item); setIsPreviewOpen(true); };
  const handleConsultation = () => { setIsConsultationOpen(true); };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">{t("portfolio.badge")}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {t("portfolio.title")} <span className="text-gradient">{t("portfolio.title_highlight")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">{t("portfolio.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-6 md:p-8 space-y-3">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <p className="text-muted-foreground mb-4">{t("portfolio.coming_soon")}</p>
              <Link to="/contact">
                <Button variant="outline">{t("portfolio.discuss_project")}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {items.map((item) => (
                <article key={item.id} className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all group">
                  {item.featured_image ? (
                    <div className="aspect-video overflow-hidden relative">
                      <img src={item.featured_image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handlePreview(item)} className="gap-1">
                          <Eye size={14} />{t("portfolio.preview")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gradient">e</span>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    {item.client_name && <span className="text-primary text-sm font-medium mb-2 block">{item.client_name}</span>}
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h2>
                    {item.description && <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-secondary text-xs text-muted-foreground rounded-full">{tech}</span>
                        ))}
                      </div>
                    )}
                    {item.results && (
                      <div className="p-4 bg-secondary/50 rounded-xl mb-4">
                        <p className="text-sm text-foreground"><span className="font-medium text-primary">Results:</span> {item.results}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Link to={`/portfolio/${item.slug}`} className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                        {t("portfolio.view_case_study")}<ExternalLink size={14} />
                      </Link>
                      <Button size="sm" variant="outline" onClick={handleConsultation}>{t("portfolio.get_quote")}</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("portfolio.cta_title")}</h2>
            <p className="text-muted-foreground mb-8">{t("portfolio.cta_desc")}</p>
            <Button variant="gradient" size="lg" className="gap-2" onClick={handleConsultation}>
              {t("portfolio.cta_start")}<ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {selectedItem && selectedItem.featured_image && (
        <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} url={selectedItem.featured_image} title={selectedItem.title} projectId={selectedItem.id} onConsultation={handleConsultation} />
      )}
      <ConsultationPopup isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} projectContext={selectedItem?.title} source="portfolio" />
    </Layout>
  );
}
