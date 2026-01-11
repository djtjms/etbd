import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatbotConfig {
  id: string;
  question_pattern: string;
  response: string;
  fallback_to_contact: boolean;
  is_active: boolean;
}

export default function ChatbotConfig() {
  const [configs, setConfigs] = useState<ChatbotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ChatbotConfig | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question_pattern: "",
    response: "",
    fallback_to_contact: false,
    is_active: true,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from("chatbot_config")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setConfigs(data);
    }
    setLoading(false);
  };

  const handleEdit = (item: ChatbotConfig) => {
    setEditingItem(item);
    setFormData({
      question_pattern: item.question_pattern,
      response: item.response,
      fallback_to_contact: item.fallback_to_contact,
      is_active: item.is_active,
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    const { error } = await supabase.from("chatbot_config").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Response deleted successfully" });
      fetchConfigs();
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("chatbot_config")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchConfigs();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const { error } = await supabase
        .from("chatbot_config")
        .update(formData)
        .eq("id", editingItem.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Response updated successfully" });
        resetForm();
        fetchConfigs();
      }
    } else {
      const { error } = await supabase.from("chatbot_config").insert([formData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Created", description: "Response created successfully" });
        resetForm();
        fetchConfigs();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question_pattern: "",
      response: "",
      fallback_to_contact: false,
      is_active: true,
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
              {editingItem ? "Edit Response" : "Add Response"}
            </h1>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-card rounded-2xl border border-border/50 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Keyword/Pattern *
              </label>
              <Input
                value={formData.question_pattern}
                onChange={(e) => setFormData({ ...formData, question_pattern: e.target.value })}
                placeholder="e.g., services, pricing, contact"
                required
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The chatbot will respond when user message contains this keyword
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Response *
              </label>
              <Textarea
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                placeholder="The message the chatbot will send..."
                rows={4}
                required
                className="bg-secondary border-border resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.fallback_to_contact}
                  onChange={(e) => setFormData({ ...formData, fallback_to_contact: e.target.checked })}
                  className="w-4 h-4 rounded bg-secondary border-border"
                />
                <span className="text-sm text-foreground">Include contact info in response</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-secondary border-border"
                />
                <span className="text-sm text-foreground">Active</span>
              </label>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="gap-2 w-full">
              <Save size={18} />
              {editingItem ? "Update Response" : "Add Response"}
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
            <h1 className="text-2xl font-bold text-foreground">Chatbot Configuration</h1>
            <p className="text-muted-foreground">Configure automated chatbot responses</p>
          </div>
          <Button variant="gradient" onClick={() => setShowEditor(true)} className="gap-2">
            <Plus size={18} />
            Add Response
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No chatbot responses configured</p>
            <Button variant="outline" onClick={() => setShowEditor(true)}>
              Add your first response
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`bg-gradient-card rounded-xl border p-4 ${
                  config.is_active ? "border-border/50" : "border-border/30 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">
                        {config.question_pattern}
                      </span>
                      {config.fallback_to_contact && (
                        <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded">
                          + Contact Info
                        </span>
                      )}
                    </div>
                    <p className="text-foreground text-sm">{config.response}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(config.id, config.is_active)}
                      className={config.is_active ? "text-primary" : "text-muted-foreground"}
                    >
                      {config.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(config)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(config.id)}
                    >
                      <Trash2 size={16} />
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
