#!/bin/bash
# ============================================
# EngineersTech Project Build Script
# Creates a deployment-ready package
# ============================================

echo "🚀 Building EngineersTech Project..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create build directory
BUILD_DIR="build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building frontend...${NC}"
npm run build

echo -e "${YELLOW}📁 Copying files...${NC}"

# Copy built frontend
cp -r dist/* $BUILD_DIR/

# Copy API
mkdir -p $BUILD_DIR/api
cp -r api/* $BUILD_DIR/api/

# Copy migrations
mkdir -p $BUILD_DIR/database
cp -r migrations/* $BUILD_DIR/database/

# Create uploads directory
mkdir -p $BUILD_DIR/api/uploads
chmod 755 $BUILD_DIR/api/uploads

# Create .htaccess for SPA routing
cat > $BUILD_DIR/.htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Don't rewrite API requests
RewriteRule ^api/ - [L]

# Serve existing files directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# SPA fallback
RewriteRule ^ index.html [L]
EOF

# Create setup instructions
cat > $BUILD_DIR/SETUP.md << 'EOF'
# Deployment Instructions

## 1. Upload Files
Upload all files to your web server's public directory (usually `public_html` or `www`).

## 2. Database Setup
1. Create a MySQL database
2. Import `database/001_create_all_tables.sql`
3. Import `database/002_seed_data.sql`

## 3. Configure API
1. Rename `api/.env.example` to `api/.env`
2. Update database credentials
3. Generate a new JWT secret:
   ```
   openssl rand -hex 32
   ```
4. Update CORS_ALLOWED_ORIGINS with your domain

## 4. Set Permissions
```bash
chmod 755 api/uploads
```

## 5. Default Login
- Email: admin@engineerstechbd.com
- Password: Admin@123456

**Change this immediately after first login!**
EOF

echo -e "${YELLOW}📦 Creating ZIP archive...${NC}"
cd $BUILD_DIR
zip -r ../engineerstech-deploy.zip ./*
cd ..

echo -e "${GREEN}✅ Build complete!${NC}"
echo -e "📦 Deployment package: ${GREEN}engineerstech-deploy.zip${NC}"
echo ""
echo "Upload and extract on your web server to deploy."
