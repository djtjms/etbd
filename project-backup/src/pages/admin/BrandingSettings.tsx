import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useBranding } from "@/hooks/useBranding";

export default function BrandingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState({
    id: "",
    logo_url: "",
    logo_text: "engineersTech",
    tagline: "",
    primary_color: "#90FFA3",
    company_email: "",
    company_phone: "",
    company_address: "",
    facebook_url: "",
    linkedin_url: "",
    twitter_url: "",
    whatsapp_number: "",
  });
  const { toast } = useToast();
  const { refetch } = useBranding();

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    const { data } = await supabase.from("branding_settings").select("*").limit(1).maybeSingle();
    if (data) {
      setBranding(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Prepare data without id for insert
    const { id, ...brandingData } = branding;
    
    let error;
    
    if (id) {
      // Update existing record
      const result = await supabase.from("branding_settings").update(brandingData).eq("id", id);
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase.from("branding_settings").insert([brandingData]).select().single();
      error = result.error;
      if (!error && result.data) {
        setBranding(result.data);
      }
    }
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Branding updated successfully" });
      await refetch();
    }
    setSaving(false);
  };

  if (loading) return <AdminLayout><div className="text-center py-12 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branding & Company Info</h1>
          <p className="text-muted-foreground">Update logo, contact info, and social links</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Brand Identity</h2>
            
            {/* Logo Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company Logo</label>
              <ImageUpload
                value={branding.logo_url || ""}
                onChange={(url) => setBranding({ ...branding, logo_url: url })}
                folder="branding"
              />
              <p className="text-xs text-muted-foreground mt-2">Recommended: 200x200px PNG or SVG with transparent background</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Logo Text</label>
                <Input value={branding.logo_text || ""} onChange={(e) => setBranding({ ...branding, logo_text: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Primary Color</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={branding.primary_color || "#90FFA3"} 
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })} 
                    className="w-14 h-10 p-1 bg-secondary border-border cursor-pointer" 
                  />
                  <Input 
                    value={branding.primary_color || ""} 
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })} 
                    placeholder="#90FFA3" 
                    className="bg-secondary border-border flex-1" 
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tagline</label>
              <Input value={branding.tagline || ""} onChange={(e) => setBranding({ ...branding, tagline: e.target.value })} className="bg-secondary border-border" />
            </div>
          </div>

          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input value={branding.company_email || ""} onChange={(e) => setBranding({ ...branding, company_email: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                <Input value={branding.company_phone || ""} onChange={(e) => setBranding({ ...branding, company_phone: e.target.value })} className="bg-secondary border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
              <Input value={branding.company_address || ""} onChange={(e) => setBranding({ ...branding, company_address: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">WhatsApp Number</label>
              <Input value={branding.whatsapp_number || ""} onChange={(e) => setBranding({ ...branding, whatsapp_number: e.target.value })} placeholder="+8801234567890" className="bg-secondary border-border" />
            </div>
          </div>

          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Facebook</label>
                <Input value={branding.facebook_url || ""} onChange={(e) => setBranding({ ...branding, facebook_url: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">LinkedIn</label>
                <Input value={branding.linkedin_url || ""} onChange={(e) => setBranding({ ...branding, linkedin_url: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Twitter/X</label>
                <Input value={branding.twitter_url || ""} onChange={(e) => setBranding({ ...branding, twitter_url: e.target.value })} className="bg-secondary border-border" />
              </div>
            </div>
          </div>

          <Button type="submit" variant="gradient" size="lg" className="gap-2 w-full" disabled={saving}>
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}