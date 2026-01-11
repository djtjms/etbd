import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  status: string;
  created_at: string;
  published_at: string | null;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [generating, setGenerating] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    status: "draft",
  });

  useEffect(() => {
    fetchPosts();
    if (searchParams.get("action") === "new") {
      setShowEditor(true);
    }
  }, [searchParams]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      seo_keywords: post.seo_keywords?.join(", ") || "",
      status: post.status,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Post deleted successfully" });
      fetchPosts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      featured_image: formData.featured_image || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      seo_keywords: formData.seo_keywords ? formData.seo_keywords.split(",").map((k) => k.trim()) : null,
      status: formData.status,
      author_id: user?.id,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Post updated successfully" });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert([postData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Created", description: "Post created successfully" });
        resetForm();
        fetchPosts();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      status: "draft",
    });
    setEditingPost(null);
    setShowEditor(false);
  };

  const generateSEO = async () => {
    if (!formData.title && !formData.content) {
      toast({ title: "Error", description: "Add title or content first", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke("ai-seo-generator", {
        body: { title: formData.title, content: formData.content },
      });

      if (response.error) throw new Error(response.error.message);

      const { seoTitle, seoDescription, keywords } = response.data;
      setFormData((prev) => ({
        ...prev,
        seo_title: seoTitle || prev.seo_title,
        seo_description: seoDescription || prev.seo_description,
        seo_keywords: keywords?.join(", ") || prev.seo_keywords,
      }));

      toast({ title: "Generated", description: "SEO metadata generated successfully" });
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate SEO",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (showEditor) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h1>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Post Details</h2>

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
                    placeholder="Post title"
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="post-slug"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                  className="bg-secondary border-border resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content..."
                  rows={10}
                  className="bg-secondary border-border resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Featured Image</label>
                <ImageUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url })}
                  folder="blog"
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
            </div>

            <div className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">SEO Settings</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSEO}
                  disabled={generating}
                  className="gap-2"
                >
                  <Sparkles size={16} />
                  {generating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">SEO Title</label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="SEO optimized title"
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">SEO Description</label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Meta description for search engines..."
                  rows={3}
                  className="bg-secondary border-border resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Keywords (comma separated)</label>
                <Input
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="gradient" size="lg" className="gap-2">
                <Save size={18} />
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
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
            <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Button variant="gradient" onClick={() => setShowEditor(true)} className="gap-2">
            <Plus size={18} />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <Button variant="outline" onClick={() => setShowEditor(true)}>
              Create your first post
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-t border-border/50 hover:bg-secondary/30">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {post.status === "published" ? <Eye size={12} /> : <EyeOff size={12} />}
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
