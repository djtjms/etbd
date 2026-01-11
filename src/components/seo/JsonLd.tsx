import { useBranding } from "@/hooks/useBranding";

interface JsonLdProps {
  type: "Organization" | "WebSite" | "SoftwareApplication" | "Service" | "FAQPage" | "BreadcrumbList" | "LocalBusiness";
  data?: Record<string, unknown>;
}

export function JsonLd({ type, data = {} }: JsonLdProps) {
  const { branding } = useBranding();
  
  const baseUrl = "https://engineerstechbd.com";
  const logoUrl = branding?.logo_url || `${baseUrl}/logo.png`;
  const companyName = branding?.logo_text || "engineersTech";
  
  const schemas: Record<string, object> = {
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: companyName,
      url: baseUrl,
      logo: logoUrl,
      description: branding?.tagline || "Enterprise Tech Solutions for the Future",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "Bangladesh",
        streetAddress: branding?.company_address || "Dhaka, Bangladesh"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: branding?.company_phone || "+880 1234-567890",
        contactType: "sales",
        email: branding?.company_email || "info@engineerstechbd.com",
        availableLanguage: ["English", "Bengali"]
      },
      sameAs: [
        branding?.facebook_url,
        branding?.linkedin_url,
        branding?.twitter_url
      ].filter(Boolean),
      ...data
    },
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: companyName,
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      ...data
    },
    SoftwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: data.name || "Custom Software Solution",
      applicationCategory: data.category || "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: "https://schema.org/InStock"
      },
      provider: {
        "@type": "Organization",
        name: companyName,
        url: baseUrl
      },
      ...data
    },
    Service: {
      "@context": "https://schema.org",
      "@type": "Service",
      provider: {
        "@type": "Organization",
        name: companyName,
        url: baseUrl
      },
      areaServed: {
        "@type": "Country",
        name: "Bangladesh"
      },
      serviceType: data.serviceType || "Software Development",
      ...data
    },
    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs || [],
      ...data
    },
    BreadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.items || [],
      ...data
    },
    LocalBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": baseUrl,
      name: companyName,
      image: logoUrl,
      url: baseUrl,
      telephone: branding?.company_phone || "+880 1234-567890",
      email: branding?.company_email || "info@engineerstechbd.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: branding?.company_address || "Dhaka, Bangladesh",
        addressLocality: "Dhaka",
        addressCountry: "BD"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 23.8103,
        longitude: 90.4125
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00"
      },
      priceRange: "$$",
      ...data
    }
  };

  const schema = schemas[type];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service-specific schemas
export const serviceSchemas = {
  erp: {
    name: "Custom ERP Development",
    description: "Enterprise Resource Planning solutions tailored for Bangladesh businesses. Streamline operations, inventory, finance, and HR in one integrated system.",
    serviceType: "ERP Development",
    areaServed: ["Bangladesh", "South Asia"],
    keywords: ["ERP Bangladesh", "custom ERP development", "enterprise resource planning"]
  },
  hrm: {
    name: "HRM System Development",
    description: "Complete Human Resource Management systems with payroll, attendance, leave management, and performance tracking for Bangladesh companies.",
    serviceType: "HRM Development",
    keywords: ["HRM system Bangladesh", "HR software development", "payroll system"]
  },
  crm: {
    name: "CRM System Development",
    description: "Customer Relationship Management solutions to boost sales, track leads, and improve customer retention for businesses in Bangladesh.",
    serviceType: "CRM Development",
    keywords: ["CRM Bangladesh", "customer management software", "sales automation"]
  },
  ai: {
    name: "AI Integration Services",
    description: "Artificial Intelligence and Machine Learning solutions for business automation, predictive analytics, and intelligent decision-making.",
    serviceType: "AI Integration",
    keywords: ["AI Bangladesh", "machine learning services", "AI integration"]
  },
  web: {
    name: "Web Application Development",
    description: "Modern, responsive web applications using React, Next.js, and cutting-edge technologies for businesses worldwide.",
    serviceType: "Web Development",
    keywords: ["web development Bangladesh", "React development", "web application company"]
  },
  mobile: {
    name: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android, delivering exceptional user experiences.",
    serviceType: "Mobile Development",
    keywords: ["mobile app Bangladesh", "iOS development", "Android development"]
  }
};

// FAQ schemas for services
export const serviceFAQs = [
  {
    "@type": "Question",
    name: "What is the cost of custom software development in Bangladesh?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Custom software development costs vary based on project scope, complexity, and features. At engineersTech, we offer competitive pricing starting from $5,000 for basic applications to $50,000+ for enterprise solutions. Contact us for a free consultation and detailed quote."
    }
  },
  {
    "@type": "Question",
    name: "How long does it take to develop a custom ERP system?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "A custom ERP system typically takes 3-6 months for development, depending on modules required. We follow agile methodology with regular deliverables, ensuring you see progress throughout the development process."
    }
  },
  {
    "@type": "Question",
    name: "Do you provide ongoing support and maintenance?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes, we provide comprehensive support and maintenance packages including bug fixes, updates, security patches, and feature enhancements. Our support team is available during business hours with 24/7 emergency support for critical issues."
    }
  },
  {
    "@type": "Question",
    name: "Can you integrate AI into existing business systems?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Absolutely! We specialize in AI integration for existing systems, including chatbots, predictive analytics, automated reporting, and intelligent automation. Our team assesses your current infrastructure and recommends the best AI solutions."
    }
  },
  {
    "@type": "Question",
    name: "What technologies do you use for web development?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "We use modern technologies including React, Next.js, TypeScript, Node.js, PostgreSQL, and cloud platforms like AWS and Google Cloud. We choose the best tech stack based on your project requirements and scalability needs."
    }
  }
];
