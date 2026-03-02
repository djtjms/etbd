import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  name: "",
  logo_url: "",
  sort_order: 0,
  is_active: true,
};

const defaultLogos = [
  { name: "TechCorp", sort_order: 0 },
  { name: "FinanceHub", sort_order: 1 },
  { name: "CloudNine", sort_order: 2 },
  { name: "DataFlow", sort_order: 3 },
  { name: "SecureNet", sort_order: 4 },
  { name: "SmartBiz", sort_order: 5 },
  { name: "InnoVate", sort_order: 6 },
  { name: "ScaleUp", sort_order: 7 },
  { name: "DevStack", sort_order: 8 },
  { name: "AppForge", sort_order: 9 },
  { name: "NextGen", sort_order: 10 },
  { name: "ByteWise", sort_order: 11 },
];

export default function ClientLogosManagement() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchLogos = async () => {
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setLogos(data as ClientLogo[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogos(); }, []);

  const seedDefaults = async () => {
    const payload = defaultLogos.map(l => ({ name: l.name, sort_order: l.sort_order, is_active: true }));
    const { error } = await supabase.from("client_logos").insert(payload);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Default logos imported" });
      fetchLogos();
    }
  };

  const openCreate = () => {
    setEditingLogo(null);
    setForm({ ...emptyForm, sort_order: logos.length });
    setDialogOpen(true);
  };

  const openEdit = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setForm({
      name: logo.name,
      logo_url: logo.logo_url || "",
      sort_order: logo.sort_order,
      is_active: logo.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      logo_url: form.logo_url || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    let error;
    if (editingLogo) {
      ({ error } = await supabase.from("client_logos").update(payload).eq("id", editingLogo.id));
    } else {
      ({ error } = await supabase.from("client_logos").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Logo ${editingLogo ? "updated" : "created"} successfully` });
      setDialogOpen(false);
      fetchLogos();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client logo?")) return;
    const { error } = await supabase.from("client_logos").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Client logo removed" });
      fetchLogos();
    }
  };

  const toggleActive = async (logo: ClientLogo) => {
    await supabase.from("client_logos").update({ is_active: !logo.is_active }).eq("id", logo.id);
    fetchLogos();
  };

  const getInitials = (name: string) => {
    return name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Logos</h1>
            <p className="text-muted-foreground mt-1">Manage homepage client logo marquee</p>
          </div>
          <Button variant="gradient" onClick={openCreate} className="gap-2">
            <Plus size={18} /> Add Logo
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 p-6 animate-pulse h-36" />
            ))}
          </div>
        ) : logos.length === 0 ? (
          <div className="text-center py-20 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-lg mb-4">No client logos yet</p>
            <p className="text-muted-foreground text-sm mb-6">The homepage is showing default fallback logos.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="gradient" onClick={openCreate} className="gap-2">
                <Plus size={18} /> Add First Logo
              </Button>
              <Button variant="outline" onClick={seedDefaults} className="gap-2">
                Import Defaults
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="bg-gradient-card rounded-2xl border border-border/50 p-4 hover:border-primary/50 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center mb-3 overflow-hidden">
                  {logo.logo_url ? (
                    <img src={logo.logo_url} alt={logo.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-lg font-bold text-primary">{getInitials(logo.name)}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground truncate w-full">{logo.name}</p>
                <span className={`text-xs mt-1 ${logo.is_active ? "text-primary" : "text-muted-foreground"}`}>
                  {logo.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-1.5 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(logo)} className="h-7 w-7 p-0">
                    <Pencil size={12} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(logo)} className="h-7 w-7 p-0">
                    {logo.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(logo.id)} className="h-7 w-7 p-0">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLogo ? "Edit Client Logo" : "Add Client Logo"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Logo Image</Label>
                <ImageUpload
                  value={form.logo_url}
                  onChange={(url) => setForm(p => ({ ...p, logo_url: url }))}
                  folder="client-logos"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Client Name *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Company name"
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="gradient" onClick={handleSave} disabled={saving} className="gap-2 flex-1">
                  <Save size={16} /> {saving ? "Saving..." : "Save"}
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
