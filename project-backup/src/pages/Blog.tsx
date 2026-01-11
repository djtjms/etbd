import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  published_at: string | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, created_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Blog
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Insights & <span className="text-gradient">Updates</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Stay updated with the latest trends in technology, software development, 
              and digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <p className="text-muted-foreground mb-4">
                No blog posts published yet. Check back soon for updates!
              </p>
              <Link to="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all group"
                >
                  {post.featured_image ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-secondary flex items-center justify-center">
                      <span className="text-4xl font-bold text-gradient">e</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        Admin
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Want to receive updates about new posts and tech insights? Get in touch with us.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg">
                Subscribe to Updates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
