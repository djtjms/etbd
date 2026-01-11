import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
    <section className="py-24 md:py-36 bg-card relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wider uppercase mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Don't just take our word for it. Here's what our clients have to say 
            about working with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-gradient-card rounded-3xl border border-border/50 p-8 lg:p-10 hover:border-primary/50 hover-lift transition-all duration-500 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={56} className="text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      "transition-transform",
                      i < testimonial.rating 
                        ? "text-primary fill-primary" 
                        : "text-muted/50"
                    )}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-muted-foreground mb-8 leading-relaxed text-base lg:text-lg italic">
                "{testimonial.review}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary overflow-hidden">
                  {testimonial.client_avatar ? (
                    <img
                      src={testimonial.client_avatar}
                      alt={testimonial.client_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground font-bold text-xl">
                      {testimonial.client_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-lg">
                    {testimonial.client_name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.client_position && `${testimonial.client_position}, `}
                    <span className="text-primary">{testimonial.client_company}</span>
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
