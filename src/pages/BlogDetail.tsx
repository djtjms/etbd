import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, Calendar, User, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  created_at: string;
  published_at: string | null;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!error && data) {
        setPost(data);
        fetchRelatedPosts(data.id, data.seo_keywords);
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  const fetchRelatedPosts = async (currentId: string, keywords: string[] | null) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, created_at, published_at")
      .eq("status", "published")
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(3);

    if (data) {
      setRelatedPosts(data as BlogPost[]);
    }
  };

  useEffect(() => {
    if (post) {
      document.title = post.seo_title || post.title;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.seo_description || post.excerpt || '');
    }
    return () => { document.title = 'engineersTech'; };
  }, [post]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post?.title || '';

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">{t("blog.loading")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t("blog.not_found")}</h1>
            <p className="text-muted-foreground mb-6">{t("blog.not_found_desc")}</p>
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} />
                {t("blog.back")}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft size={16} />
              {t("blog.back")}
            </Link>

            {post.featured_image ? (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-8">
                <span className="text-8xl font-bold text-gradient">e</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <User size={14} />
                {t("blog.team")}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{post.title}</h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            )}

            {post.seo_keywords && post.seo_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.seo_keywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-secondary text-xs text-muted-foreground rounded-full">{keyword}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {post.content || t("blog.no_content")}
              </div>
            </article>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Share2 size={18} />
                  <span className="font-medium">{t("blog.share")}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Share on Twitter"><Twitter size={18} /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Share on Facebook"><Facebook size={18} /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn"><Linkedin size={18} /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{t("blog.related")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all">
                    {relatedPost.featured_image ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={relatedPost.featured_image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gradient">e</span>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(relatedPost.published_at || relatedPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{relatedPost.title}</h3>
                      {relatedPost.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{relatedPost.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("blog.want_more")}</h2>
            <p className="text-muted-foreground mb-6">{t("blog.subscribe_desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact"><Button variant="gradient" size="lg">{t("blog.contact_us")}</Button></Link>
              <Link to="/blog"><Button variant="outline" size="lg">{t("blog.more_articles")}</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
