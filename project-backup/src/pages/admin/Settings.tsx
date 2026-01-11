import { useState, useEffect } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || user.email || "",
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name })
      .eq("id", user?.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated successfully" });
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "New passwords don't match", variant: "destructive" });
      return;
    }

    if (passwords.new.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password updated successfully" });
      setPasswords({ current: "", new: "", confirm: "" });
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleProfileUpdate} className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
            <Input
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Your name"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              value={profile.email}
              disabled
              className="bg-secondary border-border opacity-50"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <Button type="submit" variant="gradient" disabled={loading} className="gap-2">
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
            <Input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="••••••••"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
              className="bg-secondary border-border"
            />
          </div>

          <Button type="submit" variant="outline" disabled={loading} className="gap-2">
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>

        {/* Danger Zone */}
        <div className="bg-gradient-card rounded-2xl border border-destructive/30 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Once you sign out, you'll need to log in again to access the admin panel.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
