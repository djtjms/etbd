# engineersTech - Enterprise Software Solutions

A modern, full-stack web application for engineersTech BD - Bangladesh's leading software development company. Built with React, TypeScript, and Lovable Cloud featuring AI-powered SEO, live demo management, and comprehensive admin dashboard.

**Live Site**: [engineerstechbd.com](https://engineerstechbd.com)

---

## 🚀 Features

### Public Website
- **Service Pages**: ERP, HRM, CRM, AI Integration, Web & Mobile Development
- **Location Pages**: Software Company Dhaka, IT Services Bangladesh
- **Portfolio/Case Studies**: Project showcases with image galleries
- **Live Demos**: Interactive iframe previews with device switching
- **Blog**: SEO-optimized articles with AI content generation
- **AI Chatbot**: Intelligent customer support widget
- **WhatsApp Integration**: Floating contact button
- **Consultation Popup**: Smart lead capture triggered by user behavior

### Admin Dashboard
Access via URL: `/admin` (no public link on website)

- **Dashboard**: Overview with stats and quick actions
- **Blog Management**: Full CRUD with SEO metadata
- **Portfolio Management**: Case studies with galleries
- **Demo Management**: 
  - Bulk import via JSON/CSV
  - Access credentials (username/password/code)
  - Masked shareable URLs
  - View count tracking
- **SEO Dashboard**: AI content generator, keyword tracking
- **Analytics**: Page views, sessions, device breakdown
- **Branding**: Logo, colors, contact info, social links
- **Testimonials**: Client reviews management
- **Messages**: Contact form submissions
- **Consultations**: Lead management

### SEO Features
- **JSON-LD Structured Data**: Organization, Service, LocalBusiness, FAQPage
- **Dynamic Meta Tags**: Per-page SEO settings
- **Sitemap**: Auto-generated XML sitemap at `/sitemap.xml`
- **AI Content Generator**: Blog posts, service pages, location content

### Security Features
- **RLS Policies**: Row-level security with input validation
- **Email Validation**: Regex validation on form submissions
- **Length Limits**: Character limits on all user inputs
- **Admin Protection**: Role-based access control

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase-powered)
- **AI**: Lovable AI for content generation
- **Deployment**: GitHub Actions → cPanel

---

## 📋 Quick Start

### Prerequisites
- Node.js 20+
- npm

### Development

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:8080`

---

## 🚀 Deployment to cPanel

### Step 1: Configure GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |

### Step 2: Push to Deploy

```bash
git add .
git commit -m "Deploy update"
git push origin main
```

GitHub Actions automatically:
1. ✅ Builds the React app with optimizations
2. ✅ Updates browserslist database
3. ✅ Creates `.htaccess` with:
   - SPA routing
   - HTTPS redirect
   - Security headers
   - Asset caching (1 year for static files)
   - Gzip compression
4. ✅ Packages everything into `deploy-cpanel.zip`
5. ✅ Uploads as downloadable artifact

### Step 3: Upload to cPanel

1. Go to **GitHub Actions** → Select latest run → Download `deploy-cpanel` artifact
2. Login to **cPanel** → **File Manager**
3. Navigate to `public_html`
4. **Upload** `deploy-cpanel.zip`
5. Right-click → **Extract**
6. **Delete** the ZIP file after extraction

**Done!** Site is live at engineerstechbd.com

### .htaccess Features

The generated `.htaccess` includes:
- **SPA Routing**: All routes serve `index.html`
- **HTTPS Redirect**: Forces secure connections
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection
- **Caching**: 1 year cache for images, fonts, CSS, JS
- **Compression**: Gzip for text-based files
- **Protected Files**: Blocks access to .env, .git, package.json

---

## 🔐 Environment Variables

Auto-configured by Lovable Cloud (do not edit manually):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

## 👤 Admin Access

### Accessing Admin Panel
Navigate directly to: `https://engineerstechbd.com/admin`  
(No public link on website for security)

### Default Admin Emails
- `ceo@engineerstechbd.com`
- `admin@engineerstechbd.com`
- `info@engineerstechbd.com`

### Creating Admin Users
1. Sign up at `/auth`
2. Add user to `user_roles` table with `admin` role in database

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── admin/          # Admin components
│   │   ├── analytics/      # Tracking
│   │   ├── chatbot/        # AI chatbot
│   │   ├── consultation/   # Popup & WhatsApp
│   │   ├── gdpr/           # Cookie consent
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, Footer
│   │   ├── portfolio/      # Preview components
│   │   ├── seo/            # JsonLd, SEOHead
│   │   └── ui/             # shadcn/ui
│   ├── hooks/              # Custom React hooks
│   ├── pages/
│   │   ├── admin/          # Dashboard pages
│   │   ├── services/       # Service pages
│   │   └── locations/      # Location pages
│   └── integrations/       # Supabase client
├── supabase/
│   ├── functions/          # Edge functions
│   └── config.toml
├── .github/workflows/      # CI/CD pipeline
└── public/                 # Static assets
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `branding_settings` | Logo, colors, contact info |
| `blog_posts` | Blog articles with SEO |
| `case_studies` | Portfolio projects |
| `demo_projects` | Live demos with credentials |
| `testimonials` | Client reviews |
| `chatbot_config` | AI responses |
| `seo_settings` | Per-page SEO |
| `contact_submissions` | Form entries |
| `consultation_requests` | Lead submissions |
| `visitor_analytics` | Page views, engagement |
| `interaction_events` | Click tracking |

---

## 🔧 Customization

### Branding
Admin → Branding Settings → Update logo, colors, contact info

### SEO
Admin → SEO Settings → Configure meta tags per page  
Admin → SEO Dashboard → Use AI to generate content

### Live Demos
Admin → Demo Management → Add projects with:
- Demo URL for iframe preview
- Access credentials (username/password)
- Bulk import from JSON/CSV

---

## 🐛 Troubleshooting

### 404 on Routes
- Verify `.htaccess` is in `public_html`
- Ensure `mod_rewrite` is enabled in cPanel

### Demo Preview Not Loading
- Site may block iframe embedding (X-Frame-Options)
- Use "external" preview mode for such sites

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Resources

- [Lovable Docs](https://docs.lovable.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📄 License

Proprietary. All rights reserved by engineersTech.

---

Built with ❤️ using [Lovable](https://lovable.dev)
