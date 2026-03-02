import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/animations";
import { supabase } from "@/integrations/supabase/client";

interface LogoItem {
  name: string;
  initials: string;
  logo_url?: string | null;
}

const fallbackClients: LogoItem[] = [
  { name: "TechCorp", initials: "TC" },
  { name: "FinanceHub", initials: "FH" },
  { name: "CloudNine", initials: "C9" },
  { name: "DataFlow", initials: "DF" },
  { name: "SecureNet", initials: "SN" },
  { name: "SmartBiz", initials: "SB" },
  { name: "InnoVate", initials: "IV" },
  { name: "ScaleUp", initials: "SU" },
  { name: "DevStack", initials: "DS" },
  { name: "AppForge", initials: "AF" },
  { name: "NextGen", initials: "NG" },
  { name: "ByteWise", initials: "BW" },
];

function getInitials(name: string) {
  return name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function ClientLogo({ name, initials, logo_url }: LogoItem) {
  return (
    <div className="flex items-center gap-3 px-8 shrink-0 select-none">
      <div className="w-10 h-10 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center overflow-hidden">
        {logo_url ? (
          <img src={logo_url} alt={name} className="w-full h-full object-contain p-0.5" />
        ) : (
          <span className="text-sm font-bold text-primary">{initials}</span>
        )}
      </div>
      <span className="text-muted-foreground/60 font-medium text-sm whitespace-nowrap tracking-wide">
        {name}
      </span>
    </div>
  );
}

export function ClientsLogoSection() {
  const [clients, setClients] = useState<LogoItem[]>(fallbackClients);

  useEffect(() => {
    supabase
      .from("client_logos")
      .select("name, logo_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setClients(data.map(d => ({
            name: d.name,
            initials: getInitials(d.name),
            logo_url: d.logo_url,
          })));
        }
      });
  }, []);

  const logos = [...clients, ...clients];

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden border-y border-border/30">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <ScrollReveal className="text-center mb-10 relative z-10">
        <p className="text-muted-foreground/70 text-sm font-semibold tracking-widest uppercase">
          Trusted by industry leaders
        </p>
      </ScrollReveal>

      <div className="relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee" aria-hidden="false">
          {logos.map((client, i) => (
            <ClientLogo key={`${client.name}-${i}`} {...client} />
          ))}
        </div>
      </div>
    </section>
  );
}
