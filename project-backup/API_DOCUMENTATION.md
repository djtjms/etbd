# EngineersTech PHP API Documentation

## Overview

This is a complete RESTful PHP API for the EngineersTech web application. It provides JWT-based authentication, CORS handling, rate limiting, and CRUD endpoints for all major resources.

## Base URL

```
https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "admin"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 3600
  }
}
```

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "secure_password",
  "password_confirmation": "secure_password",
  "full_name": "Jane Doe"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer your_access_token
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer your_access_token
```

---

## Blog Posts

### List Posts

```http
GET /api/blog?page=1&per_page=10
```

**Admin with auth:**
```http
GET /api/blog?page=1&per_page=10&status=draft
Authorization: Bearer your_access_token
```

### Get Single Post

```http
GET /api/blog/{slug}
```

### Create Post (Admin)

```http
POST /api/blog
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "My New Blog Post",
  "excerpt": "A brief description...",
  "content": "<p>Full HTML content...</p>",
  "featured_image": "https://example.com/image.jpg",
  "status": "published",
  "seo_title": "SEO Title",
  "seo_description": "SEO Description",
  "seo_keywords": ["keyword1", "keyword2"]
}
```

### Update Post (Admin)

```http
PUT /api/blog/{id}
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}
```

### Delete Post (Admin)

```http
DELETE /api/blog/{id}
Authorization: Bearer your_access_token
```

---

## Contact Form

### Submit Contact Form (Public)

```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880 1234-567890",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a new project..."
}
```

### List Submissions (Admin)

```http
GET /api/contact?page=1&per_page=20&unread=true
Authorization: Bearer your_access_token
```

### Mark as Read (Admin)

```http
PUT /api/contact/{id}/read
Authorization: Bearer your_access_token
```

### Delete Submission (Admin)

```http
DELETE /api/contact/{id}
Authorization: Bearer your_access_token
```

---

## Demo Projects

### List Demos

```http
GET /api/demo?page=1&per_page=12&type=website
```

### Get Featured Demos

```http
GET /api/demo/featured?limit=6
```

### Get Single Demo

```http
GET /api/demo/{slug}
```

### Create Demo (Admin)

```http
POST /api/demo
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "E-Commerce Platform",
  "description": "A full-featured online store...",
  "demo_url": "https://demo.example.com",
  "thumbnail": "https://example.com/thumb.jpg",
  "screenshots": ["url1", "url2"],
  "project_type": "website",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "status": "published",
  "is_featured": true,
  "credentials": {
    "access_username": "demo",
    "access_password": "demo123",
    "access_notes": "Use these credentials to log in"
  }
}
```

### Update Demo (Admin)

```http
PUT /api/demo/{id}
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "Updated Title",
  "is_featured": false
}
```

### Delete Demo (Admin)

```http
DELETE /api/demo/{id}
Authorization: Bearer your_access_token
```

---

## Testimonials

### Get Featured Testimonials

```http
GET /api/testimonials/featured?limit=6&random=true
```

### List All Testimonials (Admin)

```http
GET /api/testimonials?page=1&per_page=10
Authorization: Bearer your_access_token
```

### Create Testimonial (Admin)

```http
POST /api/testimonials
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "client_name": "John Smith",
  "client_company": "Tech Corp",
  "client_position": "CEO",
  "client_avatar": "https://example.com/avatar.jpg",
  "review": "Excellent work! They delivered exactly what we needed.",
  "rating": 5,
  "is_featured": true
}
```

### Update Testimonial (Admin)

```http
PUT /api/testimonials/{id}
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "is_featured": false
}
```

### Delete Testimonial (Admin)

```http
DELETE /api/testimonials/{id}
Authorization: Bearer your_access_token
```

---

## Branding Settings

### Get Branding

```http
GET /api/branding
```

### Update Branding (Admin)

```http
PUT /api/branding
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "logo_text": "EngineersTech",
  "tagline": "Building the Future",
  "primary_color": "#90FFA3",
  "company_email": "info@engineerstechbd.com",
  "company_phone": "+880 1234-567890",
  "company_address": "Dhaka, Bangladesh",
  "facebook_url": "https://facebook.com/engineerstech",
  "linkedin_url": "https://linkedin.com/company/engineerstech"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per hour
- **Login**: 5 attempts per 5 minutes
- **Registration**: 3 attempts per hour
- **Contact Form**: 5 submissions per hour

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **CORS** - Configurable cross-origin resource sharing
3. **Rate Limiting** - IP-based request throttling
4. **Input Validation** - All inputs validated and sanitized
5. **SQL Injection Prevention** - Prepared statements throughout
6. **XSS Prevention** - Output encoding and sanitization
7. **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.

---

## Deployment

1. Upload the `api/` folder to your web server
2. Copy `.env.example` to `.env` and configure
3. Run the MySQL migration script
4. Ensure the `uploads/` directory is writable
5. Configure your web server to route all requests to `api/index.php`

### Apache

The included `.htaccess` handles routing automatically.

### Nginx

```nginx
location /api {
    try_files $uri $uri/ /api/api/index.php?$query_string;
}
```

---

## Frontend Integration

Replace Supabase client calls with fetch/axios to this API.

**Before (Supabase):**
```typescript
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
```

**After (PHP API):**
```typescript
const response = await fetch('/api/blog');
const { data } = await response.json();
```

See `FRONTEND_MIGRATION.md` for complete migration guide.
