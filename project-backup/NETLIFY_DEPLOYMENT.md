# Netlify Deployment Guide

Complete step-by-step guide to deploy your engineersTech project on Netlify with custom domain configuration.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Method 1: Deploy via GitHub](#method-1-deploy-via-github-recommended)
3. [Method 2: Manual Deploy](#method-2-manual-deploy)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed locally
- [ ] A Netlify account (free tier works)
- [ ] Your Supabase project credentials
- [ ] (Optional) A custom domain registered

---

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to main branch
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your repository

### Step 3: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Node version** | `18` (set in Environment Variables) |

### Step 4: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
NODE_VERSION=18
```

### Step 5: Deploy

Click **"Deploy site"** - Netlify will automatically build and deploy.

---

## Method 2: Manual Deploy

### Step 1: Build Locally

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

### Step 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (first time - creates new site)
netlify deploy --prod --dir=dist

# Or link to existing site first
netlify link
netlify deploy --prod --dir=dist
```

### Step 3: Drag and Drop (Alternative)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your `dist` folder onto the page
3. Your site will be deployed instantly

---

## Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | `eyJhbGc...` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | `abc123` |

### Setting in Netlify

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add each variable with its value
4. Redeploy for changes to take effect

### Using netlify.toml (Alternative)

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Custom Domain Configuration

### Step 1: Add Domain in Netlify

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `www.yourdomain.com`)
4. Click **Verify** → **Add domain**

### Step 2: Configure DNS Records

#### Option A: Using Netlify DNS (Recommended)

1. In Domain management, click **Set up Netlify DNS**
2. Follow prompts to add nameservers at your registrar
3. Update nameservers at your domain registrar:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

#### Option B: Using External DNS

Add these DNS records at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `75.2.60.5` | 3600 |
| **CNAME** | `www` | `your-site-name.netlify.app` | 3600 |

**Netlify Load Balancer IPs (for A records):**
```
75.2.60.5
```

### Step 3: Set Primary Domain

1. In Domain management, find your custom domain
2. Click **Options** → **Set as primary domain**

### Step 4: Configure www Redirect

1. Add both `yourdomain.com` and `www.yourdomain.com`
2. Set your preferred version as primary
3. The other will automatically redirect

---

## SSL Certificate Setup

### Automatic SSL (Let's Encrypt)

Netlify provides free SSL certificates automatically:

1. Go to **Site settings** → **Domain management** → **HTTPS**
2. Click **Verify DNS configuration**
3. Once verified, click **Provision certificate**
4. Wait 24-48 hours for propagation

### Force HTTPS

1. In HTTPS settings, enable **Force HTTPS**
2. All HTTP requests will redirect to HTTPS

### Troubleshooting SSL

If certificate provisioning fails:

1. Verify DNS records are correct
2. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
3. Wait 24-48 hours for DNS propagation
4. Try re-provisioning the certificate

---

## Post-Deployment Checklist

### Functionality Checks

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Authentication (login/signup) works
- [ ] Admin dashboard accessible
- [ ] Blog posts display correctly
- [ ] Portfolio/Demo pages load
- [ ] Chatbot functions properly
- [ ] WhatsApp button works

### SEO Checks

- [ ] Meta titles and descriptions render
- [ ] Open Graph images show in social shares
- [ ] robots.txt accessible at `/robots.txt`
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] JSON-LD structured data present

### Performance Checks

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test on mobile devices
- [ ] Verify images are optimized
- [ ] Check Core Web Vitals

### Security Checks

- [ ] HTTPS forced
- [ ] Security headers present
- [ ] API keys not exposed in source
- [ ] RLS policies active in Supabase

---

## Troubleshooting

### Common Issues

#### 1. "Page Not Found" on Refresh

**Cause:** SPA routing not configured

**Solution:** Add `netlify.toml` with redirect rule:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Or add `_redirects` file in `public/` folder:
```
/*    /index.html   200
```

#### 2. Environment Variables Not Working

**Cause:** Variables not prefixed with `VITE_` or not set

**Solutions:**
- Ensure all client-side variables start with `VITE_`
- Redeploy after adding/changing variables
- Check for typos in variable names

#### 3. Build Failed

**Common causes and solutions:**

```bash
# Clear cache and retry
netlify build --clear

# Check Node version
node --version  # Should be 18+

# Verify dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Supabase Connection Issues

**Solutions:**
- Verify Supabase URL and key are correct
- Check if Supabase project is active
- Ensure RLS policies allow access
- Check browser console for errors

#### 5. Custom Domain Not Working

**Solutions:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check for conflicting records
- Use [DNS Checker](https://dnschecker.org) to verify

#### 6. SSL Certificate Issues

**Solutions:**
- Ensure DNS is pointing to Netlify
- Remove any CAA records blocking Let's Encrypt
- Try re-provisioning certificate
- Contact Netlify support if persistent

---

## Continuous Deployment

### Auto-Deploy from GitHub

Once connected, Netlify automatically deploys when you push to the main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Netlify automatically builds and deploys
```

### Deploy Previews

Netlify creates preview URLs for pull requests:

1. Create a pull request on GitHub
2. Netlify builds a preview
3. Preview URL appears in PR comments
4. Merge PR to deploy to production

### Branch Deploys

Deploy different branches to different URLs:

1. Go to **Site settings** → **Build & deploy** → **Branches**
2. Enable **Branch deploys**
3. Each branch gets: `branch-name--your-site.netlify.app`

---

## Build Optimization

### Speed Up Builds

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Cache node_modules
[build.processing]
  skip_processing = false
```

### Reduce Bundle Size

```bash
# Analyze bundle
npm run build -- --report

# Check for large dependencies
npx source-map-explorer dist/assets/*.js
```

---

## Support Resources

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Supabase Docs](https://supabase.com/docs)

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Check deploy status
netlify status

# Open site
netlify open

# View deploy logs
netlify logs
```
