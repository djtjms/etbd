import { useEffect, useState } from "react";
import { FileText, Briefcase, MessageSquare, Mail, TrendingUp, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  blogPosts: number;
  caseStudies: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    blogPosts: 0,
    caseStudies: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [blogRes, caseRes, testRes, msgRes, unreadRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("case_studies").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);

      setStats({
        blogPosts: blogRes.count || 0,
        caseStudies: caseRes.count || 0,
        testimonials: testRes.count || 0,
        messages: msgRes.count || 0,
        unreadMessages: unreadRes.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: "Blog Posts", value: stats.blogPosts, icon: FileText, color: "from-green-500 to-teal-500" },
    { label: "Case Studies", value: stats.caseStudies, icon: Briefcase, color: "from-teal-500 to-cyan-500" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "from-cyan-500 to-blue-500" },
    { label: "Messages", value: stats.messages, icon: Mail, color: "from-blue-500 to-purple-500", badge: stats.unreadMessages },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to engineersTech admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-card rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                {stat.badge !== undefined && stat.badge > 0 && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {stat.badge} new
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/blog?action=new"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <FileText size={20} className="text-primary" />
              <span className="text-foreground font-medium">Create Blog Post</span>
            </a>
            <a
              href="/admin/portfolio?action=new"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <Briefcase size={20} className="text-primary" />
              <span className="text-foreground font-medium">Add Case Study</span>
            </a>
            <a
              href="/admin/testimonials?action=new"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <MessageSquare size={20} className="text-primary" />
              <span className="text-foreground font-medium">Add Testimonial</span>
            </a>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-foreground">All systems operational</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <TrendingUp size={20} className="text-primary" />
              <span className="text-muted-foreground">Website is live and running</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <Users size={20} className="text-primary" />
              <span className="text-muted-foreground">Admin access enabled</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
