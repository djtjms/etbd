import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";

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
  status: string;
  created_at: string;
}

export default function PortfolioManagement() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    client_name: "",
    technologies: "",
    featured_image: "",
    gallery_images: [] as string[],
    results: "",
    status: "draft",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleEdit = (item: CaseStudy) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      client_name: item.client_name || "",
      technologies: item.technologies?.join(", ") || "",
      featured_image: item.featured_image || "",
      gallery_images: item.gallery_images || [],
      results: item.results || "",
      status: item.status,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    const { error } = await supabase.from("case_studies").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Case study deleted successfully" });
      fetchItems();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      description: formData.description || null,
      client_name: formData.client_name || null,
      technologies: formData.technologies ? formData.technologies.split(",").map((t) => t.trim()) : null,
      featured_image: formData.featured_image || null,
      gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : null,
      results: formData.results || null,
      status: formData.status,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("case_studies")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Case study updated successfully" });
        resetForm();
        fetchItems();
      }
    } else {
      const { error } = await supabase.from("case_studies").insert([itemData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Created", description: "Case study created successfully" });
        resetForm();
        fetchItems();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      client_name: "",
      technologies: "",
      featured_image: "",
      gallery_images: [],
      results: "",
      status: "draft",
    });
    setEditingItem(null);
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {editingItem ? "Edit Case Study" : "Add Case Study"}
            </h1>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="Project title"
                  required
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="project-slug"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                rows={4}
                className="bg-secondary border-border resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Client Name</label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Client company"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Technologies (comma separated)</label>
                <Input
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Featured Image</label>
              <ImageUpload
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                folder="portfolio"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Gallery Images</label>
              <GalleryUpload
                value={formData.gallery_images}
                onChange={(urls) => setFormData({ ...formData, gallery_images: urls })}
                folder="portfolio/gallery"
                maxImages={8}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Results/Impact</label>
              <Textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                placeholder="What was achieved..."
                rows={3}
                className="bg-secondary border-border resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="gap-2 w-full">
              <Save size={18} />
              {editingItem ? "Update Case Study" : "Add Case Study"}
            </Button>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Case Studies</h1>
            <p className="text-muted-foreground">Manage your portfolio</p>
          </div>
          <Button variant="gradient" onClick={() => setShowEditor(true)} className="gap-2">
            <Plus size={18} />
            Add Case Study
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No case studies yet</p>
            <Button variant="outline" onClick={() => setShowEditor(true)}>
              Add your first case study
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden"
              >
                {item.featured_image && (
                  <div className="aspect-video bg-secondary">
                    <img
                      src={item.featured_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status === "published" ? <Eye size={10} /> : <EyeOff size={10} />}
                      {item.status}
                    </span>
                  </div>
                  {item.client_name && (
                    <p className="text-sm text-muted-foreground mb-2">Client: {item.client_name}</p>
                  )}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="flex-1">
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
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
