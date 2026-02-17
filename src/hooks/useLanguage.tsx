import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Language = "en" | "bn" | "ar" | "hi" | "es" | "fr" | "de" | "zh" | "ja" | "ko";

interface Translations {
  [key: string]: string;
}

const translationsMap: Record<Language, Translations> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.demo": "Demo",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.get_started": "Get Started",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.made_with": "Made with",
    "footer.enterprise_solutions": "Enterprise Solutions",
    "footer.custom_development": "Custom Development",
    "footer.security_finance": "Security & Finance",
    "footer.ai_integration": "AI Integration",
    "footer.about_us": "About Us",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
  },
  bn: {
    "nav.home": "হোম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.services": "সেবাসমূহ",
    "nav.portfolio": "পোর্টফোলিও",
    "nav.demo": "ডেমো",
    "nav.blog": "ব্লগ",
    "nav.contact": "যোগাযোগ",
    "cta.get_started": "শুরু করুন",
    "footer.services": "সেবাসমূহ",
    "footer.company": "কোম্পানি",
    "footer.contact": "যোগাযোগ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "footer.made_with": "তৈরি করা হয়েছে",
    "footer.enterprise_solutions": "এন্টারপ্রাইজ সমাধান",
    "footer.custom_development": "কাস্টম ডেভেলপমেন্ট",
    "footer.security_finance": "নিরাপত্তা ও অর্থায়ন",
    "footer.ai_integration": "এআই ইন্টিগ্রেশন",
    "footer.about_us": "আমাদের সম্পর্কে",
    "footer.privacy": "গোপনীয়তা নীতি",
    "footer.terms": "সেবার শর্তাবলী",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "عن الشركة",
    "nav.services": "الخدمات",
    "nav.portfolio": "الأعمال",
    "nav.demo": "عرض تجريبي",
    "nav.blog": "المدونة",
    "nav.contact": "اتصل بنا",
    "cta.get_started": "ابدأ الآن",
    "footer.services": "الخدمات",
    "footer.company": "الشركة",
    "footer.contact": "اتصل بنا",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.made_with": "صنع بـ",
    "footer.enterprise_solutions": "حلول المؤسسات",
    "footer.custom_development": "تطوير مخصص",
    "footer.security_finance": "الأمن والتمويل",
    "footer.ai_integration": "تكامل الذكاء الاصطناعي",
    "footer.about_us": "من نحن",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
  },
  hi: {
    "nav.home": "होम",
    "nav.about": "हमारे बारे में",
    "nav.services": "सेवाएं",
    "nav.portfolio": "पोर्टफोलियो",
    "nav.demo": "डेमो",
    "nav.blog": "ब्लॉग",
    "nav.contact": "संपर्क",
    "cta.get_started": "शुरू करें",
    "footer.services": "सेवाएं",
    "footer.company": "कंपनी",
    "footer.contact": "संपर्क",
    "footer.rights": "सर्वाधिकार सुरक्षित।",
    "footer.made_with": "बनाया गया",
    "footer.enterprise_solutions": "एंटरप्राइज समाधान",
    "footer.custom_development": "कस्टम विकास",
    "footer.security_finance": "सुरक्षा और वित्त",
    "footer.ai_integration": "एआई एकीकरण",
    "footer.about_us": "हमारे बारे में",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा की शर्तें",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.portfolio": "Portafolio",
    "nav.demo": "Demo",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "cta.get_started": "Empezar",
    "footer.services": "Servicios",
    "footer.company": "Empresa",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.made_with": "Hecho con",
    "footer.enterprise_solutions": "Soluciones Empresariales",
    "footer.custom_development": "Desarrollo a Medida",
    "footer.security_finance": "Seguridad y Finanzas",
    "footer.ai_integration": "Integración de IA",
    "footer.about_us": "Sobre Nosotros",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.demo": "Démo",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.get_started": "Commencer",
    "footer.services": "Services",
    "footer.company": "Entreprise",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
    "footer.made_with": "Fait avec",
    "footer.enterprise_solutions": "Solutions d'Entreprise",
    "footer.custom_development": "Développement Sur Mesure",
    "footer.security_finance": "Sécurité & Finance",
    "footer.ai_integration": "Intégration IA",
    "footer.about_us": "À Propos",
    "footer.privacy": "Politique de Confidentialité",
    "footer.terms": "Conditions d'Utilisation",
  },
  de: {
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.services": "Leistungen",
    "nav.portfolio": "Portfolio",
    "nav.demo": "Demo",
    "nav.blog": "Blog",
    "nav.contact": "Kontakt",
    "cta.get_started": "Loslegen",
    "footer.services": "Leistungen",
    "footer.company": "Unternehmen",
    "footer.contact": "Kontakt",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.made_with": "Erstellt mit",
    "footer.enterprise_solutions": "Unternehmenslösungen",
    "footer.custom_development": "Individuelle Entwicklung",
    "footer.security_finance": "Sicherheit & Finanzen",
    "footer.ai_integration": "KI-Integration",
    "footer.about_us": "Über Uns",
    "footer.privacy": "Datenschutzrichtlinie",
    "footer.terms": "Nutzungsbedingungen",
  },
  zh: {
    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.services": "服务",
    "nav.portfolio": "案例",
    "nav.demo": "演示",
    "nav.blog": "博客",
    "nav.contact": "联系",
    "cta.get_started": "开始",
    "footer.services": "服务",
    "footer.company": "公司",
    "footer.contact": "联系",
    "footer.rights": "版权所有。",
    "footer.made_with": "制作",
    "footer.enterprise_solutions": "企业解决方案",
    "footer.custom_development": "定制开发",
    "footer.security_finance": "安全与金融",
    "footer.ai_integration": "AI集成",
    "footer.about_us": "关于我们",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
  },
  ja: {
    "nav.home": "ホーム",
    "nav.about": "会社概要",
    "nav.services": "サービス",
    "nav.portfolio": "実績",
    "nav.demo": "デモ",
    "nav.blog": "ブログ",
    "nav.contact": "お問い合わせ",
    "cta.get_started": "始める",
    "footer.services": "サービス",
    "footer.company": "会社",
    "footer.contact": "お問い合わせ",
    "footer.rights": "全著作権所有。",
    "footer.made_with": "作成",
    "footer.enterprise_solutions": "エンタープライズソリューション",
    "footer.custom_development": "カスタム開発",
    "footer.security_finance": "セキュリティ＆金融",
    "footer.ai_integration": "AI統合",
    "footer.about_us": "会社概要",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
  },
  ko: {
    "nav.home": "홈",
    "nav.about": "소개",
    "nav.services": "서비스",
    "nav.portfolio": "포트폴리오",
    "nav.demo": "데모",
    "nav.blog": "블로그",
    "nav.contact": "문의",
    "cta.get_started": "시작하기",
    "footer.services": "서비스",
    "footer.company": "회사",
    "footer.contact": "문의",
    "footer.rights": "모든 권리 보유.",
    "footer.made_with": "제작",
    "footer.enterprise_solutions": "기업 솔루션",
    "footer.custom_development": "맞춤 개발",
    "footer.security_finance": "보안 및 금융",
    "footer.ai_integration": "AI 통합",
    "footer.about_us": "회사 소개",
    "footer.privacy": "개인정보 처리방침",
    "footer.terms": "이용약관",
  },
};

const languageNames: Record<Language, string> = {
  en: "English",
  bn: "বাংলা",
  ar: "العربية",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

function detectBrowserLanguage(): Language {
  const stored = localStorage.getItem("app-language");
  if (stored && stored in translationsMap) return stored as Language;

  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const code = lang.split("-")[0].toLowerCase() as Language;
    if (code in translationsMap) return code;
  }
  return "en";
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  languages: [],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = useCallback((key: string): string => {
    return translationsMap[language]?.[key] || translationsMap.en[key] || key;
  }, [language]);

  const languages = Object.entries(languageNames).map(([code, name]) => ({
    code: code as Language,
    name,
  }));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
