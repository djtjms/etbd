import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
  Bot,
  Search,
  Palette,
  Play,
  BarChart3,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { cn } from "@/lib/utils";
import engineersLogo from "@/assets/engineersTech-logo-white.svg";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/services", icon: Layers, label: "Services" },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { href: "/admin/portfolio", icon: Briefcase, label: "Case Studies" },
  { href: "/admin/demo", icon: Play, label: "Project Showcase" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/consultations", icon: MessageSquare, label: "Consultations" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/seo", icon: Search, label: "SEO Settings" },
  { href: "/admin/seo-dashboard", icon: BarChart3, label: "SEO Dashboard" },
  { href: "/admin/chatbot", icon: Bot, label: "Chatbot Config" },
  { href: "/admin/branding", icon: Palette, label: "Branding" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { branding } = useBranding();

  const logoText = branding?.logo_text?.trim() || "engineersTech";
  const logoUrl = branding?.logo_url?.trim() || null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="w-10 h-10 rounded-lg object-contain" />
              ) : (
                <img src={engineersLogo} alt="engineersTech" className="h-8 object-contain" />
              )}
              <span className="text-lg font-bold text-foreground truncate max-w-[120px]">
                {logoText.includes("Tech") ? (
                  <>
                    {logoText.replace("Tech", "")}<span className="text-gradient">Tech</span>
                  </>
                ) : (
                  logoText
                )}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-card border-b border-border lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            View Website →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
