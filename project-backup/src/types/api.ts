// User types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  status: 'draft' | 'published';
  author_id: string | null;
  author_name?: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Demo project types
export interface DemoProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  demo_url: string | null;
  thumbnail: string | null;
  screenshots: string[];
  project_type: 'website' | 'mobile' | 'desktop' | 'other';
  technologies: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  preview_mode: 'screenshot' | 'iframe' | 'video';
  allow_interaction: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  client_name: string;
  client_company: string | null;
  client_position: string | null;
  client_avatar: string | null;
  review: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

// Contact types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Consultation types
export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interested_project: string | null;
  message: string | null;
  source: string;
  is_read: boolean;
  created_at: string;
}

// Case study types
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  description: string | null;
  results: string | null;
  technologies: string[];
  featured_image: string | null;
  gallery_images: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// Branding types
export interface BrandingSettings {
  id: string;
  logo_text: string | null;
  logo_url: string | null;
  tagline: string | null;
  primary_color: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  updated_at: string;
}

// SEO types
export interface SeoSettings {
  id: string;
  page_name: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
  updated_at: string;
}

// Chatbot types
export interface ChatbotConfig {
  id: string;
  question_pattern: string;
  response: string;
  is_active: boolean;
  fallback_to_contact: boolean;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
