import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.1) 0%, transparent 60%)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge skeleton */}
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-56 rounded-full" />
          </div>

          {/* Heading skeleton */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="h-12 sm:h-16 md:h-20 w-[80%] max-w-lg rounded-lg" />
            <Skeleton className="h-12 sm:h-16 md:h-20 w-[70%] max-w-md rounded-lg" />
            <Skeleton className="h-12 sm:h-16 md:h-20 w-[85%] max-w-xl rounded-lg" />
          </div>

          {/* Subheading skeleton */}
          <div className="flex flex-col items-center gap-2 mb-10 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-[90%] rounded" />
            <Skeleton className="h-6 w-[75%] rounded" />
          </div>

          {/* CTA buttons skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Skeleton className="h-14 w-full sm:w-48 rounded-lg" />
            <Skeleton className="h-14 w-full sm:w-44 rounded-lg" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-card/50 border border-border/50">
                <Skeleton className="h-10 w-20 mx-auto mb-2 rounded" />
                <Skeleton className="h-4 w-24 mx-auto rounded" />
              </div>
            ))}
          </div>

          {/* Service tags skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-40 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
