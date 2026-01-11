import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { JsonLd, serviceFAQs } from "./JsonLd";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function SEOHead({
  title = "engineersTech - Leading Software Company in Bangladesh",
  description = "Top software development company in Bangladesh offering custom ERP, HRM, CRM, AI integration, web and mobile app development. Get enterprise solutions for your business.",
  keywords = ["software company Bangladesh", "custom software development", "ERP development", "web application development", "AI integration services"],
  ogImage = "https://engineerstechbd.com/og-image.png",
  canonical,
  type = "website",
  author = "engineersTech",
  publishedTime,
  modifiedTime,
  noindex = false
}: SEOHeadProps) {
  const location = useLocation();
  const baseUrl = "https://engineerstechbd.com";
  const currentUrl = canonical || `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };
    
    // Basic meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords.join(", "));
    updateMeta("author", author);
    
    // Robots
    updateMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    
    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", currentUrl, true);
    updateMeta("og:type", type, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "engineersTech", true);
    updateMeta("og:locale", "en_US", true);
    
    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);
    updateMeta("twitter:site", "@engineerstechbd");
    updateMeta("twitter:creator", "@engineerstechbd");
    
    // Article-specific
    if (type === "article" && publishedTime) {
      updateMeta("article:published_time", publishedTime, true);
      if (modifiedTime) {
        updateMeta("article:modified_time", modifiedTime, true);
      }
      updateMeta("article:author", author, true);
    }
    
    // Canonical URL
    let link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute("href", currentUrl);
    } else {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", currentUrl);
      document.head.appendChild(link);
    }
    
    // Cleanup function
    return () => {
      // Reset to defaults when component unmounts
    };
  }, [title, description, keywords, ogImage, currentUrl, type, author, publishedTime, modifiedTime, noindex]);
  
  return (
    <>
      <JsonLd type="Organization" />
      <JsonLd type="WebSite" />
      <JsonLd type="LocalBusiness" />
      <JsonLd type="FAQPage" data={{ faqs: serviceFAQs }} />
    </>
  );
}

// Pre-configured SEO for common pages
export const pageSEO = {
  home: {
    title: "engineersTech - Leading Software Development Company in Bangladesh | Custom ERP, AI, Web Apps",
    description: "Top software company in Bangladesh offering custom ERP, HRM, CRM systems, AI integration, and web/mobile app development. Trusted by 30+ businesses. Get a free consultation today!",
    keywords: ["software company Bangladesh", "custom software development Dhaka", "ERP development Bangladesh", "AI integration services", "web application development company", "mobile app development Bangladesh", "IT company Dhaka", "enterprise software solutions"]
  },
  services: {
    title: "Software Development Services in Bangladesh | ERP, AI, Web & Mobile Apps | engineersTech",
    description: "Comprehensive software development services including custom ERP, HRM, CRM systems, AI integration, web applications, and mobile apps. Enterprise solutions for Bangladesh businesses.",
    keywords: ["software development services Bangladesh", "custom ERP development", "HRM system development", "CRM software Bangladesh", "AI integration", "web development services", "mobile app development"]
  },
  portfolio: {
    title: "Our Work & Case Studies | Software Projects in Bangladesh | engineersTech",
    description: "Explore our portfolio of successful software projects including ERP systems, web applications, and AI solutions delivered to businesses across Bangladesh and globally.",
    keywords: ["software portfolio Bangladesh", "case studies", "ERP projects", "web development portfolio", "successful software implementations"]
  },
  blog: {
    title: "Tech Blog | Software Development Insights & Tips | engineersTech",
    description: "Stay updated with the latest software development trends, tips, and insights. Learn about ERP, AI, web development, and digital transformation in Bangladesh.",
    keywords: ["software development blog", "tech blog Bangladesh", "ERP insights", "AI trends", "web development tips"]
  },
  contact: {
    title: "Contact Us | Get a Free Consultation | engineersTech Bangladesh",
    description: "Contact engineersTech for your software development needs. Get a free consultation for custom ERP, AI integration, web and mobile app development. Located in Dhaka, Bangladesh.",
    keywords: ["contact software company", "free consultation", "software development quote", "IT services Dhaka"]
  },
  about: {
    title: "About engineersTech | Leading IT Company in Bangladesh",
    description: "Learn about engineersTech, a leading software development company in Bangladesh with 8+ years of experience delivering enterprise solutions to 30+ happy clients.",
    keywords: ["about engineersTech", "IT company Bangladesh", "software company history", "team Bangladesh"]
  }
};
