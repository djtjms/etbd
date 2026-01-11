import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff, Upload, Search, Key, Copy, Check, Images, Play } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { LivePreview } from "@/components/portfolio/LivePreview";

interface DemoProject {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  demo_url: string | null;
  thumbnail: string | null;
  screenshots: string[] | null;
  technologies: string[] | null;
  is_featured: boolean;
  status: string;
  slug: string | null;
  created_at: string;
}

interface DemoProjectCredentials {
  project_id: string;
  access_username: string | null;
  access_password: string | null;
  access_code: string | null;
  access_notes: string | null;
}

const defaultFormData = {
  title: "",
  description: "",
  project_type: "website",
  demo_url: "",
  thumbnail: "",
  screenshots: [] as string[],
  technologies: "",
  is_featured: false,
  status: "draft",
  access_username: "",
  access_password: "",
  access_code: "",
  access_notes: "",
};

export default function DemoManagement() {
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [credentialsByProjectId, setCredentialsByProjectId] = useState<Record<string, DemoProjectCredentials>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkData, setBulkData] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("demo_projects")
      .select("id, title, description, project_type, demo_url, thumbnail, screenshots, technologies, is_featured, status, slug, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const list = (data || []) as DemoProject[];
    setProjects(list);

    // Fetch credentials (admin-only table) for UI indicators + edit form
    if (list.length) {
      const ids = list.map((p) => p.id);
      const { data: credData } = await supabase
        .from("demo_project_credentials")
        .select("project_id, access_username, access_password, access_code, access_notes")
        .in("project_id", ids);

      const map: Record<string, DemoProjectCredentials> = {};
      (credData || []).forEach((c) => {
        map[c.project_id] = c as DemoProjectCredentials;
      });
      setCredentialsByProjectId(map);
    } else {
      setCredentialsByProjectId({});
    }

    setLoading(false);
  };

  // Filter projects by search query (title, description, or ID)
  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: formData.title,
      description: formData.description || null,
      project_type: formData.project_type,
      demo_url: formData.demo_url || null,
      thumbnail: formData.thumbnail || null,
      screenshots: formData.screenshots.length > 0 ? formData.screenshots : null,
      technologies: formData.technologies ? formData.technologies.split(",").map(t => t.trim()).filter(Boolean) : [],
      is_featured: formData.is_featured,
      status: formData.status,
    };

    let error;
    let projectId = editingProject?.id;

    if (editingProject) {
      const { error: updateError } = await supabase
        .from("demo_projects")
        .update(projectData)
        .eq("id", editingProject.id);
      error = updateError;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("demo_projects")
        .insert([projectData])
        .select("id")
        .single();
      error = insertError;
      projectId = inserted?.id;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    // Save credentials to separate protected table
    if (projectId) {
      const credentialData = {
        project_id: projectId,
        access_username: formData.access_username || null,
        access_password: formData.access_password || null,
        access_code: formData.access_code || null,
        access_notes: formData.access_notes || null,
      };

      // Upsert credentials
      await supabase
        .from("demo_project_credentials")
        .upsert(credentialData, { onConflict: "project_id" });
    }

    toast({ title: "Success", description: `Demo project ${editingProject ? "updated" : "created"} successfully` });
    setIsDialogOpen(false);
    resetForm();
    fetchProjects();
    setSaving(false);
  };

  const handleEdit = (project: DemoProject) => {
    setEditingProject(project);
    const creds = credentialsByProjectId[project.id];
    setFormData({
      title: project.title,
      description: project.description || "",
      project_type: project.project_type,
      demo_url: project.demo_url || "",
      thumbnail: project.thumbnail || "",
      screenshots: project.screenshots || [],
      technologies: project.technologies?.join(", ") || "",
      is_featured: project.is_featured,
      status: project.status,
      access_username: creds?.access_username || "",
      access_password: creds?.access_password || "",
      access_code: creds?.access_code || "",
      access_notes: creds?.access_notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo project?")) return;

    const { error } = await supabase.from("demo_projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Demo project deleted successfully" });
      fetchProjects();
    }
  };

  const toggleStatus = async (project: DemoProject) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("demo_projects")
      .update({ status: newStatus })
      .eq("id", project.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Project ${newStatus === "published" ? "published" : "unpublished"}` });
      fetchProjects();
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingProject(null);
  };

  const copyProjectLink = (project: DemoProject) => {
    // Use SEO-friendly slug URL if available, otherwise fallback to ID
    const slug = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const showcaseUrl = `${window.location.origin}/showcase/${slug}`;
    navigator.clipboard.writeText(showcaseUrl);
    setCopiedId(project.id);
    toast({ title: "Copied!", description: "Shareable link copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle bulk import
  const handleBulkImport = async () => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(bulkData);
      } catch {
        // Try CSV parsing
        const lines = bulkData.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        parsedData = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim());
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || "";
          });
          return obj;
        });
      }

      if (!Array.isArray(parsedData)) {
        parsedData = [parsedData];
      }

      // Prepare project data (without credentials)
      const projectsToInsert = parsedData.map((item: Record<string, string>) => ({
        title: item.title || "Untitled Project",
        description: item.description || null,
        project_type: item.project_type || item.type || "website",
        demo_url: item.demo_url || item.url || null,
        thumbnail: item.thumbnail || null,
        technologies: item.technologies ? (typeof item.technologies === 'string' ? item.technologies.split(",").map((t: string) => t.trim()) : item.technologies) : [],
        status: item.status || "draft",
      }));

      // Extract credentials from parsed data
      const credentialsList = parsedData.map((item: Record<string, string>) => ({
        access_username: item.access_username || item.username || null,
        access_password: item.access_password || item.password || null,
        access_code: item.access_code || item.code || null,
        access_notes: item.access_notes || item.notes || null,
      }));

      const { data: insertedProjects, error } = await supabase
        .from("demo_projects")
        .insert(projectsToInsert)
        .select("id");
      
      if (error) throw error;

      // Insert credentials for each project
      if (insertedProjects && insertedProjects.length > 0) {
        const credsToInsert = insertedProjects.map((p, idx) => ({
          project_id: p.id,
          ...credentialsList[idx],
        })).filter(c => c.access_username || c.access_password || c.access_code || c.access_notes);

        if (credsToInsert.length > 0) {
          await supabase.from("demo_project_credentials").insert(credsToInsert);
        }
      }

      toast({ title: "Success", description: `Imported ${projectsToInsert.length} demo project(s)` });
      setIsBulkDialogOpen(false);
      setBulkData("");
      fetchProjects();
    } catch (error) {
      toast({ title: "Error", description: "Invalid JSON or CSV format", variant: "destructive" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setBulkData(event.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Showcase</h1>
            <p className="text-muted-foreground">Manage your projects and live demos</p>
          </div>
          <div className="flex gap-2">
            {/* Bulk Import Dialog */}
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload size={18} />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Import Demo Projects</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Upload a JSON or CSV file, or paste the data directly. Each project should have at least a title and demo_url.
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                      <Upload size={16} />
                      Upload File
                    </Button>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-xs">
                    <p className="font-semibold mb-2">JSON Format:</p>
                    <pre className="whitespace-pre-wrap text-muted-foreground">
{`[
  {
    "title": "Project Name",
    "demo_url": "https://example.com",
    "project_type": "website",
    "technologies": "React, Node.js",
    "access_username": "admin",
    "access_password": "demo123"
  }
]`}
                    </pre>
                    <p className="font-semibold mt-4 mb-2">CSV Format:</p>
                    <pre className="whitespace-pre-wrap text-muted-foreground">
{`title,demo_url,project_type,technologies,access_username,access_password
My Project,https://example.com,website,"React, Node.js",admin,demo123`}
                    </pre>
                  </div>

                  <Textarea
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    placeholder="Paste JSON or CSV data here..."
                    rows={10}
                    className="bg-secondary border-border font-mono text-sm"
                  />

                  <div className="flex gap-3">
                    <Button onClick={handleBulkImport} variant="gradient" className="flex-1" disabled={!bulkData.trim()}>
                      Import Projects
                    </Button>
                    <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Demo Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button variant="gradient" className="gap-2">
                  <Plus size={18} />
                  Add Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProject ? "Edit Demo Project" : "Add New Demo Project"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Project Type</label>
                      <Select
                        value={formData.project_type}
                        onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="app">Mobile App</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Demo URL</label>
                    <Input
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      placeholder="https://demo.example.com"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Thumbnail</label>
                    <ImageUpload
                      value={formData.thumbnail}
                      onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                      folder="demo-projects"
                    />
                  </div>

                  {/* Screenshots Gallery */}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Images size={18} className="text-primary" />
                      <h4 className="font-semibold text-foreground">Project Screenshots</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload multiple screenshots. Drag to reorder. First image becomes the hero.
                    </p>
                    <GalleryUpload
                      value={formData.screenshots}
                      onChange={(urls) => setFormData({ ...formData, screenshots: urls })}
                      folder="demo-screenshots"
                      maxImages={10}
                    />
                  </div>

                  {/* Live Preview */}
                  {formData.demo_url && (
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Play size={18} className="text-primary" />
                        <h4 className="font-semibold text-foreground">Live Preview</h4>
                      </div>
                      <LivePreview
                        url={formData.demo_url}
                        title={formData.title || "Demo Preview"}
                        thumbnail={formData.thumbnail || undefined}
                        allowInteraction={false}
                        onExpand={() => window.open(formData.demo_url, "_blank")}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Technologies (comma separated)</label>
                    <Input
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, Node.js, PostgreSQL"
                      className="bg-secondary border-border"
                    />
                  </div>

                  {/* Access Credentials Section */}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Key size={18} className="text-primary" />
                      <h4 className="font-semibold text-foreground">Demo Access Credentials</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share these credentials with users to access the demo. They will be shown in the demo preview.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Username</label>
                        <Input
                          value={formData.access_username}
                          onChange={(e) => setFormData({ ...formData, access_username: e.target.value })}
                          placeholder="admin"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                        <Input
                          value={formData.access_password}
                          onChange={(e) => setFormData({ ...formData, access_password: e.target.value })}
                          placeholder="demo123"
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-foreground mb-2 block">Access Code (if any)</label>
                      <Input
                        value={formData.access_code}
                        onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
                        placeholder="ABC123"
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-foreground mb-2 block">Access Notes</label>
                      <Textarea
                        value={formData.access_notes}
                        onChange={(e) => setFormData({ ...formData, access_notes: e.target.value })}
                        placeholder="Additional instructions for accessing the demo..."
                        rows={2}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-foreground">
                      Featured Project
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" variant="gradient" disabled={saving} className="flex-1">
                      {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar with URL Masking */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, description, or ID..."
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No projects match your search." : "No demo projects yet. Add your first demo!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {project.thumbnail && (
                  <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">{project.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          project.status === "published" 
                            ? "bg-primary/20 text-primary" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {project.status}
                        </span>
                        {project.is_featured && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent-foreground">
                            Featured
                          </span>
                        )}
                        {(() => {
                          const creds = credentialsByProjectId[project.id];
                          return (creds?.access_username || creds?.access_password) && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                              <Key size={10} />
                              Has Credentials
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize mb-2">{project.project_type}</p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      )}
                      {/* Show credentials if available */}
                      {(() => {
                        const creds = credentialsByProjectId[project.id];
                        return (creds?.access_username || creds?.access_password || creds?.access_code) && (
                          <div className="mt-2 p-2 bg-muted/30 rounded text-xs space-y-1">
                            {creds?.access_username && (
                              <p><span className="text-muted-foreground">Username:</span> <span className="text-foreground font-mono">{creds.access_username}</span></p>
                            )}
                            {creds?.access_password && (
                              <p><span className="text-muted-foreground">Password:</span> <span className="text-foreground font-mono">{creds.access_password}</span></p>
                            )}
                            {creds?.access_code && (
                              <p><span className="text-muted-foreground">Code:</span> <span className="text-foreground font-mono">{creds.access_code}</span></p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyProjectLink(project)} 
                    title="Copy masked demo link"
                  >
                    {copiedId === project.id ? <Check size={18} className="text-primary" /> : <Copy size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(project)} title={project.status === "published" ? "Unpublish" : "Publish"}>
                    {project.status === "published" ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                    <Edit size={18} />
                  </Button>
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <ExternalLink size={18} />
                      </Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive hover:text-destructive">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
