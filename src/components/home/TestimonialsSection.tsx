import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  client_name: string;
  client_company: string | null;
  client_position: string | null;
  client_avatar: string | null;
  review: string;
  rating: number;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setTestimonials(data);
      }
      setLoading(false);
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 p-8 animate-pulse">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-5 h-5 bg-muted rounded" />
                  ))}
                </div>
                <div className="h-20 bg-muted rounded mb-8" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-2" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-card relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're building amazing relationships with our clients. 
              Testimonials coming soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-card relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our clients have to say 
            about working with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-gradient-card rounded-2xl border border-border/50 p-8 hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote size={48} className="text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-primary fill-primary" : "text-muted"}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  {testimonial.client_avatar ? (
                    <img
                      src={testimonial.client_avatar}
                      alt={testimonial.client_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground font-bold text-lg">
                      {testimonial.client_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-foreground font-semibold">
                    {testimonial.client_name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.client_position && `${testimonial.client_position}, `}
                    {testimonial.client_company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
