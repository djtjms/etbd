import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Building2, Users, Target, Award, Globe, Zap, Heart, ArrowRight, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: Target, titleKey: "about.value_innovation", descKey: "about.value_innovation_desc" },
    { icon: Users, titleKey: "about.value_client", descKey: "about.value_client_desc" },
    { icon: Award, titleKey: "about.value_excellence", descKey: "about.value_excellence_desc" },
    { icon: Heart, titleKey: "about.value_integrity", descKey: "about.value_integrity_desc" },
  ];

  const stats = [
    { value: "100+", labelKey: "about.stat_projects" },
    { value: "50+", labelKey: "about.stat_clients" },
    { value: "5+", labelKey: "about.stat_years" },
    { value: "24/7", labelKey: "about.stat_support" },
  ];

  const team = [
    { name: "Md. Engineer", position: "CEO & Founder", description: "Visionary leader with 10+ years in enterprise software development." },
    { name: "Tech Lead", position: "CTO", description: "Expert in cloud architecture and scalable system design." },
    { name: "Project Manager", position: "Head of Operations", description: "Ensuring seamless project delivery and client satisfaction." },
  ];

  const missionItems = [
    t("about.mission_1"), t("about.mission_2"), t("about.mission_3"), t("about.mission_4"),
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("about.badge")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {t("about.title")} <span className="text-gradient">{t("about.title_highlight")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4 block">
                {t("about.mission_badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                {t("about.mission_title")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("about.mission_desc")}</p>
              <ul className="space-y-3">
                {missionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Building2 size={64} className="text-primary-foreground" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-card rounded-2xl border border-border/50 p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <Globe size={32} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">Global</p>
                    <p className="text-sm text-muted-foreground">Reach & Impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gradient-card rounded-2xl border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("about.values_badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("about.values_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <value.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t(value.titleKey)}</h3>
                <p className="text-muted-foreground text-sm">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              {t("about.team_badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("about.team_title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-gradient-card rounded-2xl border border-border/50 p-6 text-center hover:border-primary/50 transition-all">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.position}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <Zap size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("about.cta_title")}</h2>
            <p className="text-muted-foreground mb-8">{t("about.cta_desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="gap-2">
                  {t("about.cta_button")}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">{t("about.cta_services")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
