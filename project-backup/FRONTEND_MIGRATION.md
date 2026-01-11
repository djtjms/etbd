# Frontend Migration Guide: Supabase to PHP API

This guide explains how to migrate the frontend from Supabase to the PHP API for traditional hosting.

## Overview

The migration involves replacing Supabase client calls with standard HTTP requests to the PHP API. The API responses are designed to be similar to Supabase for easier migration.

---

## 1. Create API Client

Create a new file `src/lib/api.ts`:

```typescript
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Token storage
const getToken = () => localStorage.getItem('access_token');
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API Request helper
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle 401 - try to refresh token
  if (response.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry request with new token
      headers.Authorization = `Bearer ${getToken()}`;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      return retryResponse.json();
    }
  }
  
  return response.json();
}

// Token refresh
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    const data = await response.json();
    if (data.success) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  clearTokens();
  return false;
}

// Export API client
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  
  post: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Auth helpers
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },
  
  register: async (email: string, password: string, fullName?: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      password_confirmation: password,
      full_name: fullName,
    });
    if (response.success) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },
  
  logout: async () => {
    await api.post('/auth/logout', {});
    clearTokens();
  },
  
  getUser: () => api.get('/auth/me'),
  
  isAuthenticated: () => !!getToken(),
};
```

---

## 2. Replace Supabase Imports

### Before (using Supabase)

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch blog posts
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### After (using PHP API)

```typescript
import { api } from "@/lib/api";

// Fetch blog posts
const response = await api.get('/blog');
const data = response.success ? response.data.items : [];
```

---

## 3. Migration Examples by Feature

### Authentication Hook

**Before (`src/hooks/useAuth.tsx`):**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

**After:**
```typescript
import { auth, api } from "@/lib/api";
import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    if (!auth.isAuthenticated()) {
      setLoading(false);
      return;
    }
    
    const response = await auth.getUser();
    if (response.success) {
      setUser(response.data);
    }
    setLoading(false);
  };
  
  const login = async (email: string, password: string) => {
    const response = await auth.login(email, password);
    if (response.success) {
      setUser(response.data.user);
      return true;
    }
    return false;
  };
  
  const logout = async () => {
    await auth.logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Blog Posts Hook

**Before:**
```typescript
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
```

**After:**
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Fetch blog posts
export function useBlogPosts(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ['blog-posts', page, perPage],
    queryFn: async () => {
      const response = await api.get(`/blog?page=${page}&per_page=${perPage}`);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Fetch single post
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const response = await api.get(`/blog/${slug}`);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!slug,
  });
}

// Create post mutation
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/blog', data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}
```

### Branding Hook

**Before:**
```typescript
const { data } = await supabase
  .from('branding_settings')
  .select('*')
  .single();
```

**After:**
```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useBranding() {
  return useQuery({
    queryKey: ['branding'],
    queryFn: async () => {
      const response = await api.get('/branding');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
```

### Contact Form

**Before:**
```typescript
const { error } = await supabase
  .from('contact_submissions')
  .insert([formData]);
```

**After:**
```typescript
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    }) => {
      const response = await api.post('/contact', data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

// Usage in component
const { mutate: submitContact, isPending } = useSubmitContact();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  submitContact(formData, {
    onSuccess: () => {
      toast.success('Message sent successfully!');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

---

## 4. Environment Variables

Update your `.env` file:

```bash
# Remove Supabase variables
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_PUBLISHABLE_KEY=...

# Add API URL
VITE_API_URL=/api
# Or for different domain:
# VITE_API_URL=https://api.your-domain.com
```

---

## 5. Type Definitions

Create `src/types/api.ts`:

```typescript
// User types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  created_at: string;
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
  view_count: number;
  created_at: string;
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
```

---

## 6. File Upload Changes

For file uploads, you'll need to update to use the PHP API's upload endpoint:

```typescript
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  
  return data.data.url;
}
```

---

## 7. Checklist

- [ ] Create `src/lib/api.ts` with API client
- [ ] Update authentication hook to use PHP API
- [ ] Replace all `supabase.from()` calls with `api.get/post/put/delete()`
- [ ] Update environment variables
- [ ] Add type definitions for API responses
- [ ] Test all CRUD operations
- [ ] Update file upload logic
- [ ] Remove Supabase dependencies from package.json (if not using anywhere else)

---

## 8. Deployment

1. Build the frontend: `npm run build`
2. Upload `dist/` folder to your web server's public directory
3. Ensure the PHP API is deployed at `/api/`
4. Configure your web server to serve the SPA correctly

### Apache (.htaccess in public folder)

```apache
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
```

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api {
    try_files $uri $uri/ /api/api/index.php?$query_string;
}
```
