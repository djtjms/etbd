import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Monitor, Smartphone, Code2, Filter, Search, Briefcase, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { LivePreview } from "@/components/portfolio/LivePreview";
import { PreviewModal } from "@/components/portfolio/PreviewModal";
import { ConsultationPopup } from "@/components/consultation/ConsultationPopup";
import { useBranding } from "@/hooks/useBranding";
import { useLanguage } from "@/hooks/useLanguage";

interface DemoProject {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  demo_url: string | null;
  thumbnail: string | null;
  technologies: string[] | null;
  is_featured: boolean;
  preview_mode: string | null;
  allow_interaction: boolean | null;
  view_count: number | null;
}

const typeIcons: Record<string, typeof Monitor> = {
  website: Monitor,
  app: Smartphone,
  software: Code2,
};

const typeLabels: Record<string, string> = {
  website: "Website",
  app: "Mobile App",
  software: "Software",
};

// Generate fingerprint for tracking
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const nav = navigator;
  const screen = window.screen;
  const data = [
    nav.userAgent,
    nav.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export default function Demo() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<DemoProject | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const { branding } = useBranding();
  const { t } = useLanguage();
  
  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("demo_projects")
        .select("id, title, description, project_type, demo_url, thumbnail, technologies, is_featured, preview_mode, allow_interaction, view_count")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
        
        const projectParam = searchParams.get("project");
        const idParam = searchParams.get("id");
        
        if (projectParam || idParam) {
          const matchedProject = data.find(p => {
            if (idParam && p.id.startsWith(idParam)) return true;
            if (projectParam) {
              const maskedTitle = p.title.toLowerCase().replace(/\s+/g, '-');
              return maskedTitle === projectParam.toLowerCase();
            }
            return false;
          });
          
          if (matchedProject) {
            handleExpand(matchedProject);
          }
        }
      }
      setLoading(false);
    }

    fetchProjects();
  }, [searchParams]);

  const filteredProjects = projects.filter(p => {
    const matchesType = filter === "all" || p.project_type === filter;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const projectTypes = ["all", ...new Set(projects.map(p => p.project_type))];

  const handleExpand = async (project: DemoProject) => {
    setSelectedProject(project);
    setIsPreviewModalOpen(true);
    
    const fingerprint = generateFingerprint();
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}_${fingerprint}`;
    sessionStorage.setItem('session_id', sessionId);

    try {
      await supabase.from('interaction_events').insert({
        session_id: sessionId,
        page_path: `/showcase/${project.id}`,
        event_type: 'project_view',
        element_id: project.id,
        element_type: 'project_card',
        metadata: {
          project_title: project.title,
          project_type: project.project_type,
          fingerprint,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.log('Tracking error:', error);
    }
    
    if (project.id) {
      await supabase
        .from("demo_projects")
        .update({ view_count: (project.view_count || 0) + 1 })
        .eq("id", project.id);
    }
  };

  const handleWhatsAppClick = async (project: DemoProject) => {
    const fingerprint = generateFingerprint();
    const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}_${fingerprint}`;
    sessionStorage.setItem('session_id', sessionId);

    try {
      await supabase.from('interaction_events').insert({
        session_id: sessionId,
        page_path: `/showcase`,
        event_type: 'whatsapp_click',
        element_id: project.id,
        element_type: 'project_whatsapp',
        metadata: {
          project_title: project.title,
          project_type: project.project_type,
          fingerprint,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.log('Tracking error:', error);
    }

    const message = `Hi! I'm interested in a project similar to "${project.title}" (${typeLabels[project.project_type] || project.project_type}).\n\nTechnologies used: ${project.technologies?.join(', ') || 'N/A'}\n\nPlease provide a quote and timeline for a similar solution.`;
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleConsultation = () => {
    setIsConsultationOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Briefcase size={16} className="text-primary" />
              <span className="text-primary text-sm font-medium">{t("demo.badge")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 leading-tight">
              {t("demo.title")} <span className="text-gradient">{t("demo.title_highlight")}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 max-w-2xl mx-auto">
              {t("demo.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground sm:w-[18px] sm:h-[18px]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("demo.search_placeholder")}
                className="pl-9 sm:pl-10 bg-secondary border-border text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8 md:mb-12">
              <Filter size={16} className="text-muted-foreground hidden sm:block" />
              {projectTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="capitalize text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9"
                >
                  {type === "all" ? t("demo.all") : typeLabels[type] || type}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                <Briefcase size={40} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? t("demo.no_match") : t("demo.no_demos")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? t("demo.no_match_desc")
                  : t("demo.custom_desc")}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  {t("demo.clear_search")}
                </Button>
              ) : (
                <Link to="/contact">
                  <Button variant="gradient">{t("demo.request_demo")}</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredProjects.map((project) => {
                const TypeIcon = typeIcons[project.project_type] || Monitor;
                const hasLivePreview = project.demo_url && project.preview_mode !== 'external';
                
                return (
                  <article
                    key={project.id}
                    className={`bg-gradient-card rounded-2xl border overflow-hidden hover:border-primary/50 transition-all ${
                      project.is_featured ? "border-primary/30" : "border-border/50"
                    }`}
                  >
                    {hasLivePreview ? (
                      <LivePreview
                        url={project.demo_url!}
                        title={project.title}
                        thumbnail={project.thumbnail || undefined}
                        allowInteraction={project.allow_interaction ?? false}
                        onExpand={() => handleExpand(project)}
                        onView={() => {}}
                      />
                    ) : project.thumbnail ? (
                      <div className="aspect-video overflow-hidden relative group">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {project.is_featured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            {t("demo.featured")}
                          </span>
                        )}
                        {project.demo_url && (
                          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="gradient"
                              onClick={() => handleExpand(project)}
                            >
                              {t("demo.view_demo")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWhatsAppClick(project)}
                              className="gap-1"
                            >
                              <MessageCircle size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <TypeIcon size={48} className="text-primary/50" />
                        {project.is_featured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            {t("demo.featured")}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <TypeIcon size={16} className="text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {typeLabels[project.project_type] || project.project_type}
                          </span>
                        </div>
                        {project.view_count !== null && project.view_count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {project.view_count} {t("demo.views")}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2">
                        {project.title}
                      </h2>
                      
                      {project.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded-full">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {project.demo_url && (
                          <Button
                            size="sm"
                            variant="gradient"
                            onClick={() => handleExpand(project)}
                            className="flex-1"
                          >
                            {t("demo.view_demo")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsAppClick(project)}
                          className="gap-1"
                        >
                          <MessageCircle size={14} />
                          {t("demo.quote")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-xl sm:rounded-2xl md:rounded-3xl border border-border/50 p-5 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
              {t("demo.custom_title")}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-lg mx-auto">
              {t("demo.custom_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gradient" size="default" className="gap-2 h-10 sm:h-11 text-sm sm:text-base" onClick={handleConsultation}>
                {t("demo.schedule")}
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                className="gap-2 h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => {
                  const message = "Hi! I visited your Project Showcase and I'm interested in discussing a custom solution for my business. Please contact me with more details.";
                  window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
                }}
              >
                <MessageCircle size={16} />
                {t("demo.chat_whatsapp")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {selectedProject && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          url={selectedProject.demo_url || ""}
          title={selectedProject.title}
          projectId={selectedProject.id}
          thumbnail={selectedProject.thumbnail}
          onConsultation={handleConsultation}
        />
      )}

      {/* Consultation Popup */}
      <ConsultationPopup
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        projectContext={selectedProject?.title}
        source="showcase"
      />
    </Layout>
  );
}
