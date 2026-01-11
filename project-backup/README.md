# engineersTech - Complete Project Backup

## Project Overview
This is a complete backup of the engineersTech enterprise software solution website/webapp built with React, TypeScript, Vite, and Tailwind CSS with Lovable Cloud (Supabase) backend.

## Quick Start

### Prerequisites
- Node.js 18+ and npm/bun
- Supabase account (for backend features)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
project-backup/
├── public/                    # Static assets
│   ├── logo.jpg              # Brand logo
│   ├── favicon.ico           # Favicon
│   ├── robots.txt            # SEO robots file
│   ├── sitemap.xml           # SEO sitemap
│   └── .htaccess             # Apache configuration
├── src/
│   ├── assets/               # Imported assets
│   │   ├── logo.jpg
│   │   └── services/         # Service images
│   ├── components/           # React components
│   │   ├── admin/           # Admin panel components
│   │   ├── analytics/       # Analytics tracking
│   │   ├── animations/      # Animation wrappers
│   │   ├── auth/            # Authentication
│   │   ├── chatbot/         # AI Chatbot
│   │   ├── consultation/    # Consultation features
│   │   ├── gdpr/            # GDPR compliance
│   │   ├── home/            # Homepage sections
│   │   ├── layout/          # Layout components
│   │   ├── portfolio/       # Portfolio components
│   │   ├── seo/             # SEO components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party integrations
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── locations/       # Location-based SEO pages
│   │   └── services/        # Service detail pages
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles & design tokens
├── supabase/
│   ├── config.toml          # Supabase configuration
│   └── functions/           # Edge functions
│       ├── ai-chatbot/
│       ├── ai-content-generator/
│       └── ai-seo-generator/
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── .env.example             # Environment template
```

## Features

### Public Website
- Responsive design with dark theme
- Service pages (ERP, HRM, CRM, AI, Web, Mobile)
- Portfolio showcase with live previews
- Blog with AI content generation
- AI-powered chatbot
- WhatsApp integration
- Contact form with Supabase storage
- SEO optimized with JSON-LD

### Admin Dashboard
- Analytics overview
- Blog management
- Portfolio management
- Demo project management
- SEO settings
- Branding customization
- Testimonials management
- Message inbox

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **State**: TanStack Query
- **Routing**: React Router DOM v7

## Environment Variables

Create `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Deployment

### Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy

### cPanel/Traditional Hosting
1. Run `npm run build`
2. Upload `dist/` contents to public_html
3. Ensure `.htaccess` is included for SPA routing

## Database Tables
- `profiles` - User profiles
- `blog_posts` - Blog content
- `case_studies` - Portfolio items
- `demo_projects` - Live demos
- `testimonials` - Client reviews
- `contact_submissions` - Contact form entries
- `consultation_requests` - Consultation bookings
- `branding_settings` - Site branding
- `seo_settings` - Page SEO config
- `chatbot_config` - Chatbot responses
- `visitor_analytics` - Analytics data

## License
Proprietary - engineersTech © 2026
