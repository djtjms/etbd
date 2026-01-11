import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, MessageCircle, Check, Eye } from "lucide-react";
import { format } from "date-fns";

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interested_project: string | null;
  message: string | null;
  source: string | null;
  is_read: boolean | null;
  created_at: string | null;
}

const sourceLabels: Record<string, string> = {
  popup: "Popup Form",
  demo: "Demo Page",
  whatsapp: "WhatsApp",
  auto_trigger: "Auto Trigger",
};

export default function ConsultationManagement() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load consultation requests",
        variant: "destructive",
      });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("consultation_requests")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    } else {
      setRequests(requests.map(r => r.id === id ? { ...r, is_read: true } : r));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("consultation_requests")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    } else {
      setRequests(requests.filter(r => r.id !== id));
      toast({
        title: "Deleted",
        description: "Request has been deleted",
      });
    }
  };

  const openEmail = (email: string, name: string) => {
    window.open(`mailto:${email}?subject=Re: Your Consultation Request&body=Hello ${name},%0D%0A%0D%0AThank you for your interest in our services.%0D%0A%0D%0A`);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=Hello ${name}, thank you for your consultation request!`);
  };

  const unreadCount = requests.filter(r => !r.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Consultation Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage consultation requests from visitors
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-sm px-3 py-1">
              {unreadCount} Unread
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Consultation Requests
            </h3>
            <p className="text-muted-foreground">
              Consultation requests will appear here when visitors submit the form.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className={!request.is_read ? "bg-primary/5" : ""}>
                    <TableCell>
                      {request.is_read ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge variant="default">New</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        {request.message && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {request.message}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{request.email}</p>
                        {request.phone && (
                          <p className="text-xs text-muted-foreground">{request.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.interested_project || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {sourceLabels[request.source || "popup"] || request.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.created_at 
                        ? format(new Date(request.created_at), "MMM d, yyyy HH:mm")
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {!request.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(request.id)}
                            title="Mark as read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEmail(request.email, request.name)}
                          title="Send email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {request.phone && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWhatsApp(request.phone!, request.name)}
                            title="WhatsApp"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Request</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this consultation request from {request.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(request.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
