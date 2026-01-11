import { useState, useEffect } from "react";
import { Save, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface SEOSetting {
  id: string;
  page_name: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
}

export default function SEOSettings() {
  const [settings, setSettings] = useState<SEOSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("page_name");

    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (setting: SEOSetting) => {
    setSaving(setting.id);

    const { error } = await supabase
      .from("seo_settings")
      .update({
        meta_title: setting.meta_title,
        meta_description: setting.meta_description,
        meta_keywords: setting.meta_keywords,
        og_image: setting.og_image,
      })
      .eq("id", setting.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `SEO settings for ${setting.page_name} updated` });
    }
    setSaving(null);
  };

  const handleFieldChange = (id: string, field: keyof SEOSetting, value: string) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          if (field === "meta_keywords") {
            return { ...s, [field]: value.split(",").map((k) => k.trim()) };
          }
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const handleOgImageChange = (id: string, url: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, og_image: url } : s))
    );
  };

  const generateSEO = async (setting: SEOSetting) => {
    setGenerating(setting.id);
    try {
      const response = await supabase.functions.invoke("ai-seo-generator", {
        body: { title: setting.page_name, content: `${setting.page_name} page for engineersTech website` },
      });

      if (response.error) throw new Error(response.error.message);

      const { seoTitle, seoDescription, keywords } = response.data;

      setSettings((prev) =>
        prev.map((s) =>
          s.id === setting.id
            ? {
                ...s,
                meta_title: seoTitle || s.meta_title,
                meta_description: seoDescription || s.meta_description,
                meta_keywords: keywords || s.meta_keywords,
              }
            : s
        )
      );

      toast({ title: "Generated", description: "SEO metadata generated successfully" });
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate SEO",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
          <p className="text-muted-foreground">Manage search engine optimization for each page</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground capitalize">
                    {setting.page_name} Page
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateSEO(setting)}
                      disabled={generating === setting.id}
                      className="gap-1"
                    >
                      <Sparkles size={14} />
                      {generating === setting.id ? "Generating..." : "Generate with AI"}
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleUpdate(setting)}
                      disabled={saving === setting.id}
                      className="gap-1"
                    >
                      <Save size={14} />
                      {saving === setting.id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Meta Title</label>
                      <Input
                        value={setting.meta_title || ""}
                        onChange={(e) => handleFieldChange(setting.id, "meta_title", e.target.value)}
                        placeholder="Page title for search engines"
                        className="bg-secondary border-border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(setting.meta_title?.length || 0)}/60 characters
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Meta Description</label>
                      <Textarea
                        value={setting.meta_description || ""}
                        onChange={(e) => handleFieldChange(setting.id, "meta_description", e.target.value)}
                        placeholder="Description for search engines..."
                        rows={2}
                        className="bg-secondary border-border resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(setting.meta_description?.length || 0)}/160 characters
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Keywords (comma separated)</label>
                      <Input
                        value={setting.meta_keywords?.join(", ") || ""}
                        onChange={(e) => handleFieldChange(setting.id, "meta_keywords", e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">OG Image</label>
                    <ImageUpload
                      value={setting.og_image || ""}
                      onChange={(url) => handleOgImageChange(setting.id, url)}
                      folder="seo"
                      className="h-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Recommended: 1200x630px</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
