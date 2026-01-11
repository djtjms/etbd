# Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Upload dist/ to Netlify
```

### Option 3: cPanel / Traditional Hosting

1. **Build the project**
```bash
npm install
npm run build
```

2. **Upload files**
- Upload entire `dist/` folder contents to `public_html`
- Ensure `.htaccess` is included

3. **Verify `.htaccess`**
The `.htaccess` file handles SPA routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Environment Setup

### Required Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Supabase Setup
1. Create a Supabase project
2. Run migrations from `supabase/migrations/`
3. Deploy edge functions from `supabase/functions/`
4. Configure authentication

## Post-Deployment Checklist

- [ ] Environment variables set
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Edge functions deployed
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Sitemap submitted to Google
- [ ] Analytics verified

## Common Issues

### 404 on Page Refresh
Ensure `.htaccess` is properly configured for SPA routing.

### API Errors
Check Supabase URL and anon key in environment variables.

### Missing Styles
Verify the build completed without errors.

## Performance Optimization

1. Enable gzip compression on server
2. Set proper cache headers for static assets
3. Use CDN for global distribution
4. Enable HTTP/2 if available
