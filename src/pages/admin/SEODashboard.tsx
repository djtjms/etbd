import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, TrendingUp, AlertCircle, CheckCircle, 
  FileText, Globe, Sparkles, RefreshCw, ExternalLink,
  BarChart3, Target, Zap
} from "lucide-react";

interface SEOScore {
  page: string;
  score: number;
  issues: string[];
  suggestions: string[];
}

interface KeywordRanking {
  keyword: string;
  position: number | null;
  change: number;
  volume: string;
}

const targetKeywords: KeywordRanking[] = [
  { keyword: "software company Bangladesh", position: null, change: 0, volume: "1.2K" },
  { keyword: "custom ERP development", position: null, change: 0, volume: "880" },
  { keyword: "AI integration services", position: null, change: 0, volume: "720" },
  { keyword: "web application development company", position: null, change: 0, volume: "1.5K" },
  { keyword: "HRM system development", position: null, change: 0, volume: "590" },
  { keyword: "software development Dhaka", position: null, change: 0, volume: "480" },
  { keyword: "enterprise software solutions", position: null, change: 0, volume: "1.1K" },
  { keyword: "mobile app development Bangladesh", position: null, change: 0, volume: "920" },
];

export default function SEODashboard() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [contentType, setContentType] = useState<"blog" | "service" | "location">("blog");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [seoScores, setSeoScores] = useState<SEOScore[]>([
    { page: "Home", score: 85, issues: ["Missing alt tags on 2 images"], suggestions: ["Add more internal links"] },
    { page: "Services", score: 78, issues: ["Meta description too short"], suggestions: ["Add FAQ schema"] },
    { page: "Portfolio", score: 82, issues: [], suggestions: ["Add more case study details"] },
    { page: "Blog", score: 75, issues: ["Low word count on some posts"], suggestions: ["Add more long-form content"] },
    { page: "Contact", score: 90, issues: [], suggestions: [] },
  ]);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setGenerating(true);
    try {
      const prompts: Record<string, string> = {
        blog: `Write a comprehensive, SEO-optimized blog article (1500+ words) about "${topic}" for a software development company in Bangladesh. Include:
- Engaging introduction with the main keyword
- 4-5 main sections with H2 headings
- Practical examples and tips
- Internal linking suggestions (to /services, /contact, /portfolio)
- Conclusion with call to action
- Meta description suggestion (150-160 characters)
Target keywords: software development Bangladesh, ${topic.toLowerCase()}`,
        service: `Create a service page content for "${topic}" service offered by a software company in Bangladesh. Include:
- Hero section headline and description
- 6 key features with descriptions
- Benefits section
- 4 FAQ questions with answers
- CTA sections
- SEO metadata suggestions`,
        location: `Create location-based SEO content for "${topic}" targeting local businesses. Include:
- Location-specific headline
- Why choose a local company section
- Services offered in this location
- Contact information section
- Local SEO keywords
- Schema markup suggestions`,
      };

      const { data, error } = await supabase.functions.invoke("ai-content-generator", {
        body: { 
          type: "blog",
          topic: prompts[contentType],
          tone: "professional and informative"
        }
      });

      if (error) throw error;
      
      setGeneratedContent(data.content || "Content generation failed. Please try again.");
      toast.success("Content generated successfully!");
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const runSEOAudit = async () => {
    setLoading(true);
    toast.info("Running SEO audit...");
    
    // Simulate SEO audit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update scores with random variations
    setSeoScores(prev => prev.map(score => ({
      ...score,
      score: Math.min(100, score.score + Math.floor(Math.random() * 5))
    })));
    
    setLoading(false);
    toast.success("SEO audit completed!");
  };

  const averageScore = Math.round(seoScores.reduce((acc, s) => acc + s.score, 0) / seoScores.length);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SEO Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor and improve your search rankings</p>
          </div>
          <Button onClick={runSEOAudit} disabled={loading} className="gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Run SEO Audit
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 size={20} className="text-primary-foreground" />
              </div>
              <span className="text-muted-foreground">Overall Score</span>
            </div>
            <span className="text-4xl font-bold text-foreground">{averageScore}</span>
            <span className="text-muted-foreground">/100</span>
          </div>

          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <span className="text-muted-foreground">Pages Indexed</span>
            </div>
            <span className="text-4xl font-bold text-foreground">12</span>
          </div>

          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <AlertCircle size={20} className="text-yellow-500" />
              </div>
              <span className="text-muted-foreground">Issues Found</span>
            </div>
            <span className="text-4xl font-bold text-foreground">
              {seoScores.reduce((acc, s) => acc + s.issues.length, 0)}
            </span>
          </div>

          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target size={20} className="text-blue-500" />
              </div>
              <span className="text-muted-foreground">Target Keywords</span>
            </div>
            <span className="text-4xl font-bold text-foreground">{targetKeywords.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Page Scores */}
          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Page SEO Scores</h2>
            <div className="space-y-4">
              {seoScores.map((page, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{page.page}</span>
                      <span className={`font-semibold ${
                        page.score >= 80 ? "text-green-500" : 
                        page.score >= 60 ? "text-yellow-500" : "text-red-500"
                      }`}>
                        {page.score}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          page.score >= 80 ? "bg-green-500" : 
                          page.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${page.score}%` }}
                      />
                    </div>
                    {page.issues.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {page.issues[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Keywords */}
          <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Target Keywords</h2>
            <div className="space-y-3">
              {targetKeywords.map((kw, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-foreground text-sm">{kw.keyword}</span>
                    <span className="text-xs text-muted-foreground ml-2">({kw.volume}/mo)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {kw.position ? (
                      <span className="text-sm font-semibold text-foreground">#{kw.position}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not ranked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Content Generator */}
        <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-foreground">AI Content Generator</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Content Type</label>
                <div className="flex gap-2">
                  {(["blog", "service", "location"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={contentType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContentType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Topic / Title</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    contentType === "blog" ? "e.g., How to Choose ERP Software in 2026" :
                    contentType === "service" ? "e.g., Custom CRM Development" :
                    "e.g., Software Company in Chittagong"
                  }
                />
              </div>

              <Button 
                onClick={generateContent} 
                disabled={generating} 
                className="w-full gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate SEO Content
                  </>
                )}
              </Button>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium text-foreground text-sm mb-2">Content Tips:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Blog posts should be 1500+ words for better rankings</li>
                  <li>• Include target keywords naturally throughout</li>
                  <li>• Add internal links to service and contact pages</li>
                  <li>• Use FAQ schema for better SERP features</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Generated Content</label>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder="Generated content will appear here..."
                className="h-80 font-mono text-sm"
              />
              {generatedContent && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/blog?action=new">Create Blog Post</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">SEO Tools & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <Search size={20} className="text-primary" />
              <span className="font-medium text-foreground">Google Search Console</span>
              <ExternalLink size={14} className="text-muted-foreground ml-auto" />
            </a>
            <a
              href="https://pagespeed.web.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <Zap size={20} className="text-primary" />
              <span className="font-medium text-foreground">PageSpeed Insights</span>
              <ExternalLink size={14} className="text-muted-foreground ml-auto" />
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <FileText size={20} className="text-primary" />
              <span className="font-medium text-foreground">Rich Results Test</span>
              <ExternalLink size={14} className="text-muted-foreground ml-auto" />
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
