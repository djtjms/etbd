import { useState, useEffect } from "react";
import { Mail, Trash2, Check, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Message deleted successfully" });
      setSelectedMessage(null);
      fetchMessages();
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      markAsRead(msg.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread messages` : "All messages read"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-gradient-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h2 className="font-semibold text-foreground">Inbox</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                      selectedMessage?.id === msg.id ? "bg-secondary/50" : ""
                    } ${!msg.is_read ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          msg.is_read ? "bg-secondary" : "bg-primary/20"
                        }`}
                      >
                        <Mail size={18} className={msg.is_read ? "text-muted-foreground" : "text-primary"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm truncate ${!msg.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                            {msg.name}
                          </p>
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.subject || "No subject"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-gradient-card rounded-2xl border border-border/50 p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{selectedMessage.subject || "No subject"}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-sm text-muted-foreground">Phone: {selectedMessage.phone}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!selectedMessage.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="gap-1"
                      >
                        <Check size={14} />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex"
                  >
                    <Button variant="gradient" className="gap-2">
                      <Mail size={16} />
                      Reply via Email
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Eye size={48} className="text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
