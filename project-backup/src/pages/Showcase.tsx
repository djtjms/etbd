import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PreviewModal } from "@/components/portfolio/PreviewModal";
import { ConsultationPopup } from "@/components/consultation/ConsultationPopup";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoProject {
  id: string;
  title: string;
  description: string | null;
  demo_url: string | null;
  thumbnail: string | null;
  technologies: string[] | null;
  project_type: string;
  slug: string | null;
}

export default function Showcase() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<DemoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setError("No project specified");
        setLoading(false);
        return;
      }

      // Try to find by slug first, then by ID prefix
      let query = supabase
        .from("demo_projects")
        .select("id, title, description, demo_url, thumbnail, technologies, project_type, slug")
        .eq("status", "published");

      const { data: bySlug } = await query.eq("slug", slug).maybeSingle();

      if (bySlug) {
        setProject(bySlug);
        setIsPreviewOpen(true);
        trackView(bySlug);
      } else {
        // Try matching by ID prefix (for short URLs)
        const { data: allProjects } = await supabase
          .from("demo_projects")
          .select("id, title, description, demo_url, thumbnail, technologies, project_type, slug")
          .eq("status", "published");

        const matched = allProjects?.find(
          (p) => p.id.startsWith(slug) || p.slug === slug
        );

        if (matched) {
          setProject(matched);
          setIsPreviewOpen(true);
          trackView(matched);
        } else {
          setError("Project not found");
        }
      }
      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  const trackView = async (proj: DemoProject) => {
    const sessionId = sessionStorage.getItem("session_id") || `session_${Date.now()}`;
    sessionStorage.setItem("session_id", sessionId);

    try {
      await supabase.from("interaction_events").insert({
        session_id: sessionId,
        page_path: `/showcase/${proj.slug || proj.id}`,
        event_type: "project_view",
        element_id: proj.id,
        element_type: "showcase_direct",
        metadata: {
          project_title: proj.title,
          project_type: proj.project_type,
          source: "direct_link",
          timestamp: new Date().toISOString(),
        },
      });

      // Increment view count directly
      const { data: currentData } = await supabase
        .from("demo_projects")
        .select("view_count")
        .eq("id", proj.id)
        .single();
      
      if (currentData) {
        await supabase
          .from("demo_projects")
          .update({ view_count: (currentData.view_count || 0) + 1 })
          .eq("id", proj.id);
      }
    } catch (e) {
      console.log("Tracking error:", e);
    }
  };

  const handleClose = () => {
    setIsPreviewOpen(false);
    // Navigate to demo page after closing
    setTimeout(() => navigate("/demo"), 300);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <SEOHead
          title="Project Not Found"
          description="The requested project could not be found."
        />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Project Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The project you're looking for doesn't exist or has been removed."}
            </p>
            <Button variant="gradient" onClick={() => navigate("/demo")}>
              Browse All Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${project.title} - Project Showcase`}
        description={project.description || `View the live demo of ${project.title}`}
      />

      {/* Background content for when modal closes */}
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Opening {project.title}...</p>
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClose}
        url={project.demo_url || ""}
        title={project.title}
        projectId={project.id}
        thumbnail={project.thumbnail}
        onConsultation={() => setIsConsultationOpen(true)}
      />

      <ConsultationPopup
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        projectContext={project.title}
        source="showcase_direct"
      />
    </Layout>
  );
}
