# engineersTech - Complete File Structure

## Root Configuration Files
```
├── index.html                 # HTML entry with SEO meta tags
├── package.json               # NPM dependencies
├── vite.config.ts             # Vite bundler config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── tsconfig.app.json          # App TypeScript config
├── tsconfig.node.json         # Node TypeScript config
├── postcss.config.js          # PostCSS config
├── eslint.config.js           # ESLint config
├── components.json            # shadcn/ui config
├── .env                       # Environment variables
└── .gitignore                 # Git ignore rules
```

## Public Assets
```
public/
├── logo.jpg                   # Main logo
├── favicon.ico                # Browser favicon
├── placeholder.svg            # Placeholder image
├── robots.txt                 # SEO robots
├── sitemap.xml                # SEO sitemap
└── .htaccess                  # Apache SPA routing
```

## Source Code Structure
```
src/
├── main.tsx                   # React entry point
├── App.tsx                    # App with routing
├── App.css                    # Legacy styles
├── index.css                  # Design system & tokens
├── vite-env.d.ts              # Vite types
└── tailwind.config.lov.json   # Lovable tailwind config
```

## Components
```
src/components/
├── NavLink.tsx                # Navigation link wrapper
├── ErrorBoundary.tsx          # Error handling
│
├── admin/                     # Admin components
│   ├── AdminLayout.tsx        # Admin sidebar layout
│   ├── GalleryUpload.tsx      # Multi-image upload
│   └── ImageUpload.tsx        # Single image upload
│
├── analytics/
│   └── InteractionTracker.tsx # User tracking
│
├── animations/
│   ├── index.ts               # Animation exports
│   ├── PageTransition.tsx     # Page transitions
│   └── ScrollReveal.tsx       # Scroll animations
│
├── auth/
│   └── ProtectedRoute.tsx     # Route protection
│
├── chatbot/
│   └── Chatbot.tsx            # AI chat widget
│
├── consultation/
│   ├── ConsultationPopup.tsx  # Booking popup
│   ├── ConsultationTrigger.tsx# Popup trigger
│   └── WhatsAppButton.tsx     # WhatsApp CTA
│
├── gdpr/
│   └── CookieConsent.tsx      # Cookie banner
│
├── home/
│   ├── HeroSection.tsx        # Homepage hero
│   ├── HeroSkeleton.tsx       # Loading state
│   ├── ServicesSection.tsx    # Services grid
│   ├── TestimonialsSection.tsx# Reviews carousel
│   └── ContactSection.tsx     # Contact form
│
├── layout/
│   ├── Layout.tsx             # Main layout
│   ├── Header.tsx             # Navigation header
│   └── Footer.tsx             # Site footer
│
├── portfolio/
│   ├── LivePreview.tsx        # Demo iframe
│   └── PreviewModal.tsx       # Preview dialog
│
├── seo/
│   ├── SEOHead.tsx            # Dynamic meta tags
│   └── JsonLd.tsx             # Structured data
│
└── ui/                        # shadcn/ui components
    ├── accordion.tsx
    ├── alert.tsx
    ├── alert-dialog.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── carousel.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── popover.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── skeleton.tsx
    ├── switch.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    ├── toast.tsx
    ├── toaster.tsx
    ├── tooltip.tsx
    └── ... (more UI components)
```

## Custom Hooks
```
src/hooks/
├── use-mobile.tsx             # Mobile detection
├── use-toast.ts               # Toast notifications
├── useAnalytics.tsx           # Analytics tracking
├── useAuth.tsx                # Authentication state
├── useBranding.tsx            # Dynamic branding
├── useConsent.tsx             # GDPR consent
└── useIsMobile.tsx            # Responsive hook
```

## Pages
```
src/pages/
├── Index.tsx                  # Homepage
├── About.tsx                  # About page
├── Auth.tsx                   # Login/Register
├── Blog.tsx                   # Blog listing
├── BlogDetail.tsx             # Blog article
├── Contact.tsx                # Contact page
├── Demo.tsx                   # Live demos
├── Portfolio.tsx              # Portfolio grid
├── PortfolioDetail.tsx        # Case study
├── Privacy.tsx                # Privacy policy
├── Showcase.tsx               # Project showcase
├── Services.tsx               # Services overview
├── Terms.tsx                  # Terms of service
├── NotFound.tsx               # 404 page
│
├── admin/                     # Admin dashboard
│   ├── Dashboard.tsx          # Overview
│   ├── Analytics.tsx          # Analytics
│   ├── BlogManagement.tsx     # Blog CRUD
│   ├── BrandingSettings.tsx   # Branding config
│   ├── ChatbotConfig.tsx      # Chatbot setup
│   ├── ConsultationManagement.tsx
│   ├── DemoManagement.tsx     # Demo projects
│   ├── MessagesManagement.tsx # Contact inbox
│   ├── PortfolioManagement.tsx# Portfolio CRUD
│   ├── SEODashboard.tsx       # SEO overview
│   ├── SEOSettings.tsx        # SEO config
│   ├── Settings.tsx           # General settings
│   └── TestimonialsManagement.tsx
│
├── locations/                 # Location SEO pages
│   ├── ITServicesBangladesh.tsx
│   └── SoftwareCompanyDhaka.tsx
│
└── services/                  # Service pages
    ├── AIIntegration.tsx
    ├── CRMDevelopment.tsx
    ├── ERPDevelopment.tsx
    ├── HRMDevelopment.tsx
    ├── MobileDevelopment.tsx
    └── WebDevelopment.tsx
```

## Integrations
```
src/integrations/
└── supabase/
    ├── client.ts              # Supabase client
    └── types.ts               # Generated types
```

## Utilities
```
src/lib/
└── utils.ts                   # Helper functions
```

## Assets
```
src/assets/
├── logo.jpg                   # Logo for imports
└── services/                  # Service images
    ├── ai-automation.png
    ├── banking-app.jpg
    ├── data-security.jpg
    ├── ecommerce-*.jpg
    ├── mobile-financial.jpg
    └── website-mobile-app.jpg
```

## Supabase Backend
```
supabase/
├── config.toml                # Project config
└── functions/                 # Edge functions
    ├── ai-chatbot/
    │   └── index.ts           # Chatbot API
    ├── ai-content-generator/
    │   └── index.ts           # Content AI
    └── ai-seo-generator/
        └── index.ts           # SEO AI
```

## GitHub Actions
```
.github/workflows/
└── deploy.yml                 # CI/CD pipeline
```
