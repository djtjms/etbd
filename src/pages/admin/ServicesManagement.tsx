import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Save, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  features: ServiceFeature[];
  created_at: string;
  updated_at: string;
}

const defaultFeature: ServiceFeature = { icon: "Code2", title: "", description: "" };

const emptyService = {
  title: "",
  description: "",
  icon: "Code2",
  image: "",
  sort_order: 0,
  is_active: true,
  features: [{ ...defaultFeature }],
};

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const seedDefaultServices = async () => {
    const defaults = [
      { title: "Enterprise Solutions", description: "Comprehensive business management systems tailored for your organization.", icon: "Building2", sort_order: 0, is_active: true, features: JSON.parse(JSON.stringify([{ icon: "Users", title: "HRM System", description: "Complete human resource management with payroll, attendance, and performance tracking." }, { icon: "BarChart3", title: "CRM System", description: "Customer relationship management to boost sales and improve customer retention." }, { icon: "Layers", title: "ERP System", description: "Enterprise resource planning for seamless business operations across departments." }])) },
      { title: "Custom Development", description: "Bespoke software solutions built to match your unique business requirements.", icon: "Code2", sort_order: 1, is_active: true, features: JSON.parse(JSON.stringify([{ icon: "Code2", title: "Web Applications", description: "Modern, responsive web applications using cutting-edge technologies." }, { icon: "Layers", title: "Mobile Apps", description: "Native and cross-platform mobile applications for iOS and Android." }, { icon: "BarChart3", title: "API Development", description: "Robust APIs and backend services for seamless integration." }])) },
      { title: "Security & Finance", description: "Secure financial systems and compliance-ready security solutions.", icon: "Shield", sort_order: 2, is_active: true, features: JSON.parse(JSON.stringify([{ icon: "Shield", title: "Payment Systems", description: "Secure payment gateways and financial transaction processing." }, { icon: "Building2", title: "Banking Solutions", description: "Core banking systems and financial management platforms." }, { icon: "Users", title: "Compliance Tools", description: "Regulatory compliance and audit management systems." }])) },
      { title: "AI Integration", description: "Leverage artificial intelligence to automate and optimize your business.", icon: "Brain", sort_order: 3, is_active: true, features: JSON.parse(JSON.stringify([{ icon: "Brain", title: "Machine Learning", description: "Custom ML models for predictive analytics and automation." }, { icon: "BarChart3", title: "Data Analytics", description: "AI-powered business intelligence and data visualization." }, { icon: "Code2", title: "Chatbots & NLP", description: "Intelligent chatbots and natural language processing solutions." }])) },
    ];
    const { error } = await supabase.from("services").insert(defaults);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Default services imported" });
      fetchServices();
    }
  };
  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    
    if (!error && data) {
      setServices(data.map(s => ({
        ...s,
        features: Array.isArray(s.features) ? s.features as unknown as ServiceFeature[] : [],
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setEditingService(null);
    setForm({ ...emptyService, sort_order: services.length });
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "Code2",
      image: service.image || "",
      sort_order: service.sort_order,
      is_active: service.is_active,
      features: service.features.length > 0 ? service.features : [{ ...defaultFeature }],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      icon: form.icon || "Code2",
      image: form.image || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
      features: JSON.parse(JSON.stringify(form.features.filter(f => f.title.trim()))),
    };

    let error;
    if (editingService) {
      ({ error } = await supabase.from("services").update(payload).eq("id", editingService.id));
    } else {
      ({ error } = await supabase.from("services").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Service ${editingService ? "updated" : "created"} successfully` });
      setDialogOpen(false);
      fetchServices();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Service deleted successfully" });
      fetchServices();
    }
  };

  const toggleActive = async (service: Service) => {
    await supabase.from("services").update({ is_active: !service.is_active }).eq("id", service.id);
    fetchServices();
  };

  const addFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, { ...defaultFeature }] }));
  };

  const updateFeature = (index: number, field: keyof ServiceFeature, value: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? { ...f, [field]: value } : f),
    }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">Manage homepage service sections</p>
          </div>
          <Button variant="gradient" onClick={openCreate} className="gap-2">
            <Plus size={18} /> Add Service
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-lg mb-4">No services yet</p>
            <p className="text-muted-foreground text-sm mb-6">The homepage is showing default fallback services. Add your own to replace them.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="gradient" onClick={openCreate} className="gap-2">
                <Plus size={18} /> Create First Service
              </Button>
              <Button variant="outline" onClick={seedDefaultServices} className="gap-2">
                Import Defaults
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all"
              >
                {service.image && (
                  <div className="relative aspect-video">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{service.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${service.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {service.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.features.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-lg">
                          {f.title}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(service)} className="gap-1.5">
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(service)} className="gap-1.5">
                      {service.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      {service.is_active ? "Hide" : "Show"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)} className="gap-1.5">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div>
                <Label>Service Image</Label>
                <ImageUpload value={form.image} onChange={(url) => setForm(p => ({ ...p, image: url }))} folder="services" className="mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Enterprise Solutions" className="mt-1.5" />
                </div>
                <div>
                  <Label>Icon Name</Label>
                  <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Building2" className="mt-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">Lucide icon name (e.g. Building2, Code2, Shield)</p>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe this service..." rows={3} className="mt-1.5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="mt-1.5" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
                  <Label>Active</Label>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Features</Label>
                  <Button variant="outline" size="sm" onClick={addFeature} className="gap-1.5">
                    <Plus size={14} /> Add Feature
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.features.map((feature, index) => (
                    <div key={index} className="bg-secondary/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Feature {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                          <X size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input value={feature.title} onChange={e => updateFeature(index, "title", e.target.value)} placeholder="Feature title" />
                        <Input value={feature.icon} onChange={e => updateFeature(index, "icon", e.target.value)} placeholder="Icon name" />
                      </div>
                      <Input value={feature.description} onChange={e => updateFeature(index, "description", e.target.value)} placeholder="Feature description" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="gradient" onClick={handleSave} disabled={saving} className="gap-2 flex-1">
                  <Save size={16} /> {saving ? "Saving..." : "Save Service"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
