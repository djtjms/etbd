import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Users,
} from "lucide-react";

interface AnalyticsData {
  totalPageViews: number;
  uniqueSessions: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  avgScrollDepth: number;
  deviceBreakdown: { desktop: number; tablet: number; mobile: number };
  topPages: { page_path: string; views: number }[];
  recentEvents: { event_type: string; element_type: string; created_at: string }[];
  topEventTypes: { event_type: string; count: number }[];
  topCategories: { category: string; count: number }[];
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      // Fetch visitor analytics
      const { data: analytics, error: analyticsError } = await supabase
        .from("visitor_analytics")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (analyticsError) throw analyticsError;

      // Fetch interaction events
      const { data: events, error: eventsError } = await supabase
        .from("interaction_events")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Process analytics data
      const uniqueSessions = new Set(analytics?.map((a) => a.session_id)).size;
      // Unique visitors (using session_id as proxy since fingerprint not in schema)
      const uniqueVisitors = uniqueSessions;
      const totalPageViews = analytics?.length || 0;
      
      const timeOnPage = analytics?.filter((a) => a.time_on_page > 0) || [];
      const avgTimeOnPage = timeOnPage.length > 0
        ? timeOnPage.reduce((sum, a) => sum + (a.time_on_page || 0), 0) / timeOnPage.length
        : 0;

      const scrollDepths = analytics?.filter((a) => a.scroll_depth > 0) || [];
      const avgScrollDepth = scrollDepths.length > 0
        ? scrollDepths.reduce((sum, a) => sum + (a.scroll_depth || 0), 0) / scrollDepths.length
        : 0;

      // Device breakdown
      const deviceBreakdown = { desktop: 0, tablet: 0, mobile: 0 };
      analytics?.forEach((a) => {
        const device = a.device_type as keyof typeof deviceBreakdown;
        if (device in deviceBreakdown) {
          deviceBreakdown[device]++;
        }
      });

      // Top pages
      const pageCounts: Record<string, number> = {};
      analytics?.forEach((a) => {
        pageCounts[a.page_path] = (pageCounts[a.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([page_path, views]) => ({ page_path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Recent events
      const recentEvents = (events || []).slice(0, 10).map((e) => ({
        event_type: e.event_type,
        element_type: e.element_type || "unknown",
        created_at: e.created_at,
      }));

      // Categorized report: top event types and categories
      const eventTypeCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};
      interface EventWithMetadata {
        event_type: string;
        metadata?: { category?: string } | null;
      }
      (events || []).forEach((ev: EventWithMetadata) => {
        eventTypeCounts[ev.event_type] = (eventTypeCounts[ev.event_type] || 0) + 1;
        const cat = ev.metadata?.category || "uncategorized";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const topEventTypes = Object.entries(eventTypeCounts)
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setData({
        totalPageViews,
        uniqueSessions,
        uniqueVisitors,
        avgTimeOnPage: Math.round(avgTimeOnPage),
        avgScrollDepth: Math.round(avgScrollDepth),
        deviceBreakdown,
        topPages,
        recentEvents,
        topEventTypes,
        topCategories,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Page Views",
      value: data?.totalPageViews || 0,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      label: "Unique Sessions",
      value: data?.uniqueSessions || 0,
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Unique Visitors",
      value: data?.uniqueVisitors || 0,
      icon: Users,
      color: "text-teal-500",
    },
    {
      label: "Avg. Time on Page",
      value: `${data?.avgTimeOnPage || 0}s`,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Avg. Scroll Depth",
      value: `${data?.avgScrollDepth || 0}%`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Track visitor behavior and interactions
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Device Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Desktop", icon: Monitor, count: data?.deviceBreakdown.desktop || 0 },
                      { type: "Tablet", icon: Tablet, count: data?.deviceBreakdown.tablet || 0 },
                      { type: "Mobile", icon: Smartphone, count: data?.deviceBreakdown.mobile || 0 },
                    ].map((device) => {
                      const total = (data?.deviceBreakdown.desktop || 0) + 
                                   (data?.deviceBreakdown.tablet || 0) + 
                                   (data?.deviceBreakdown.mobile || 0);
                      const percentage = total > 0 ? (device.count / total) * 100 : 0;
                      
                      return (
                        <div key={device.type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <device.icon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{device.type}</span>
                            </div>
                            <span className="text-sm font-medium">
                              {device.count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.topPages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No data available</p>
                    ) : (
                      data?.topPages.map((page, i) => (
                        <div
                          key={page.page_path}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground w-6">
                              {i + 1}.
                            </span>
                            <span className="text-sm font-medium truncate max-w-[200px]">
                              {page.page_path}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {page.views} views
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Interactions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointerClick className="w-5 h-5" />
                    Recent Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data?.recentEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No interactions recorded yet</p>
                    ) : (
                      data?.recentEvents.map((event, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {event.event_type}
                            </span>
                            <span className="text-sm">{event.element_type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
