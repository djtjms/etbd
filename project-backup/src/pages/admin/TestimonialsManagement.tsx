import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Testimonial {
  id: string;
  client_name: string;
  client_company: string | null;
  client_position: string | null;
  client_avatar: string | null;
  review: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: "",
    client_company: "",
    client_position: "",
    client_avatar: "",
    review: "",
    rating: 5,
    is_featured: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      client_company: item.client_company || "",
      client_position: item.client_position || "",
      client_avatar: item.client_avatar || "",
      review: item.review,
      rating: item.rating,
      is_featured: item.is_featured,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      client_name: formData.client_name,
      client_company: formData.client_company || null,
      client_position: formData.client_position || null,
      client_avatar: formData.client_avatar || null,
      review: formData.review,
      rating: formData.rating,
      is_featured: formData.is_featured,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("testimonials")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Testimonial updated successfully" });
        resetForm();
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert([itemData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Created", description: "Testimonial created successfully" });
        resetForm();
        fetchTestimonials();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_company: "",
      client_position: "",
      client_avatar: "",
      review: "",
      rating: 5,
      is_featured: true,
    });
    setEditingItem(null);
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {editingItem ? "Edit Testimonial" : "Add Testimonial"}
            </h1>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Client Name *</label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
                <Input
                  value={formData.client_company}
                  onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                  placeholder="Tech Corp"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Position</label>
                <Input
                  value={formData.client_position}
                  onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                  placeholder="CEO"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Avatar</label>
                <ImageUpload
                  value={formData.client_avatar}
                  onChange={(url) => setFormData({ ...formData, client_avatar: url })}
                  folder="testimonials"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Review *</label>
              <Textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="What did the client say..."
                rows={4}
                required
                className="bg-secondary border-border resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? "text-primary fill-primary" : "text-muted"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded bg-secondary border-border"
                />
                <label htmlFor="is_featured" className="text-sm text-foreground">
                  Featured (show on homepage)
                </label>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="gap-2 w-full">
              <Save size={18} />
              {editingItem ? "Update Testimonial" : "Add Testimonial"}
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
            <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
            <p className="text-muted-foreground">Manage client reviews</p>
          </div>
          <Button variant="gradient" onClick={() => setShowEditor(true)} className="gap-2">
            <Plus size={18} />
            Add Testimonial
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Button variant="outline" onClick={() => setShowEditor(true)}>
              Add your first testimonial
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-card rounded-2xl border border-border/50 p-6 relative"
              >
                {item.is_featured && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < item.rating ? "text-primary fill-primary" : "text-muted"}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">"{item.review}"</p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    {item.client_avatar ? (
                      <img
                        src={item.client_avatar}
                        alt={item.client_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-bold">
                        {item.client_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.client_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.client_position && `${item.client_position}, `}
                      {item.client_company}
                    </p>
                  </div>
                </div>

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
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
