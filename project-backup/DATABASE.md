# Database Documentation

Complete database schema documentation for engineersTech webapp. This guide covers the Supabase/PostgreSQL schema and provides equivalent MySQL/PHP implementations.

---

## Table of Contents
1. [Database Overview](#database-overview)
2. [Schema Diagrams](#schema-diagrams)
3. [Tables Reference](#tables-reference)
4. [Row-Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [MySQL/PHP Migration Guide](#mysqlphp-migration-guide)
6. [PHP Database Connection](#php-database-connection)
7. [CRUD Operations in PHP](#crud-operations-in-php)
8. [Security Best Practices](#security-best-practices)

---

## Database Overview

### Technology Stack
- **Original**: PostgreSQL (via Supabase)
- **Alternative**: MySQL 8.0+ / MariaDB 10.5+
- **PHP Version**: 8.0+ recommended

### Tables Summary

| Table | Purpose | Records Expected |
|-------|---------|------------------|
| `profiles` | User profile information | 1 per user |
| `user_roles` | Role assignments (admin/user) | 1+ per user |
| `blog_posts` | Blog articles | Unlimited |
| `case_studies` | Portfolio/case study projects | Unlimited |
| `demo_projects` | Live demo showcases | Unlimited |
| `demo_project_credentials` | Demo access credentials | 1 per demo |
| `testimonials` | Client reviews | Unlimited |
| `contact_submissions` | Contact form entries | Unlimited |
| `consultation_requests` | Consultation bookings | Unlimited |
| `branding_settings` | Site branding config | 1 row |
| `seo_settings` | Page SEO metadata | 1 per page |
| `chatbot_config` | Chatbot Q&A patterns | Unlimited |
| `visitor_analytics` | Page view tracking | Unlimited |
| `interaction_events` | User interaction tracking | Unlimited |

---

## Schema Diagrams

```
┌─────────────────┐     ┌─────────────────┐
│   auth.users    │     │    profiles     │
│   (Supabase)    │────>│                 │
│                 │     │  - id (FK)      │
│  - id (PK)      │     │  - email        │
│  - email        │     │  - full_name    │
│  - ...          │     │  - avatar_url   │
└─────────────────┘     └─────────────────┘
        │
        │
        ▼
┌─────────────────┐
│   user_roles    │
│                 │
│  - user_id (FK) │
│  - role (enum)  │
└─────────────────┘

┌─────────────────┐     ┌─────────────────────────┐
│  demo_projects  │────>│ demo_project_credentials│
│                 │     │                         │
│  - id (PK)      │     │  - project_id (FK)      │
│  - title        │     │  - access_username      │
│  - demo_url     │     │  - access_password      │
│  - status       │     │  - access_code          │
└─────────────────┘     └─────────────────────────┘
```

---

## Tables Reference

### 1. profiles

Stores additional user information beyond authentication.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. user_roles

Role-based access control (RBAC) table.

```sql
-- PostgreSQL (Supabase)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- MySQL Equivalent
CREATE TABLE user_roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    UNIQUE KEY unique_user_role (user_id, role),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. blog_posts

Blog/article content management.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE blog_posts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image TEXT,
    author_id CHAR(36),
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords JSON,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. case_studies

Portfolio/project case studies.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    client_name TEXT,
    featured_image TEXT,
    gallery_images TEXT[],
    technologies TEXT[],
    results TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE case_studies (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    description TEXT,
    client_name VARCHAR(255),
    featured_image TEXT,
    gallery_images JSON,
    technologies JSON,
    results TEXT,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. demo_projects

Live demo project showcases.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.demo_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    demo_url TEXT,
    thumbnail TEXT,
    screenshots TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    project_type TEXT NOT NULL DEFAULT 'website',
    status TEXT NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    allow_interaction BOOLEAN DEFAULT TRUE,
    preview_mode TEXT DEFAULT 'screenshot',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE demo_projects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE,
    description TEXT,
    demo_url TEXT,
    thumbnail TEXT,
    screenshots JSON DEFAULT ('[]'),
    technologies JSON DEFAULT ('[]'),
    project_type ENUM('website', 'webapp', 'mobile', 'desktop', 'other') NOT NULL DEFAULT 'website',
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    allow_interaction BOOLEAN DEFAULT TRUE,
    preview_mode ENUM('screenshot', 'iframe', 'video') DEFAULT 'screenshot',
    view_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. demo_project_credentials

Secure storage for demo access credentials.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.demo_project_credentials (
    project_id UUID PRIMARY KEY REFERENCES demo_projects(id) ON DELETE CASCADE,
    access_username TEXT,
    access_password TEXT,
    access_code TEXT,
    access_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE demo_project_credentials (
    project_id CHAR(36) PRIMARY KEY,
    access_username VARCHAR(255),
    access_password VARCHAR(255),
    access_code VARCHAR(255),
    access_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES demo_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. testimonials

Client testimonials and reviews.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_position TEXT,
    client_company TEXT,
    client_avatar TEXT,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE testimonials (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_name VARCHAR(255) NOT NULL,
    client_position VARCHAR(255),
    client_company VARCHAR(255),
    client_avatar TEXT,
    review TEXT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_featured (is_featured),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. contact_submissions

Contact form submissions.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE contact_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. consultation_requests

Consultation booking requests.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    interested_project TEXT,
    source TEXT DEFAULT 'popup',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE consultation_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    interested_project VARCHAR(255),
    source ENUM('popup', 'form', 'chatbot', 'whatsapp') DEFAULT 'popup',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. branding_settings

Site branding configuration (single row).

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.branding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logo_url TEXT,
    logo_text TEXT DEFAULT 'engineersTech',
    tagline TEXT DEFAULT 'Enterprise Tech Solutions for the Future',
    primary_color TEXT DEFAULT '#90FFA3',
    company_email TEXT DEFAULT 'info@engineerstechbd.com',
    company_phone TEXT DEFAULT '+880 1234-567890',
    company_address TEXT DEFAULT 'Dhaka, Bangladesh',
    whatsapp_number TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE branding_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    logo_url TEXT,
    logo_text VARCHAR(100) DEFAULT 'engineersTech',
    tagline VARCHAR(255) DEFAULT 'Enterprise Tech Solutions for the Future',
    primary_color VARCHAR(20) DEFAULT '#90FFA3',
    company_email VARCHAR(255) DEFAULT 'info@engineerstechbd.com',
    company_phone VARCHAR(50) DEFAULT '+880 1234-567890',
    company_address TEXT DEFAULT 'Dhaka, Bangladesh',
    whatsapp_number VARCHAR(50),
    facebook_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default row
INSERT INTO branding_settings (id) VALUES (UUID());
```

### 11. seo_settings

Page-specific SEO metadata.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    og_image TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE seo_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_name VARCHAR(100) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords JSON,
    og_image TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_name (page_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 12. chatbot_config

Chatbot question/answer patterns.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.chatbot_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_pattern TEXT NOT NULL,
    response TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    fallback_to_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE chatbot_config (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question_pattern TEXT NOT NULL,
    response TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    fallback_to_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 13. visitor_analytics

Page view and session tracking.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.visitor_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    scroll_depth INTEGER DEFAULT 0,
    time_on_page INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE visitor_analytics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(500) NOT NULL,
    referrer TEXT,
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    scroll_depth SMALLINT UNSIGNED DEFAULT 0,
    time_on_page INT UNSIGNED DEFAULT 0,
    click_count SMALLINT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_page_path (page_path(100)),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 14. interaction_events

Detailed user interaction tracking.

```sql
-- PostgreSQL (Supabase)
CREATE TABLE public.interaction_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    event_type TEXT NOT NULL,
    element_type TEXT,
    element_id TEXT,
    x_position INTEGER,
    y_position INTEGER,
    project_id UUID REFERENCES demo_projects(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MySQL Equivalent
CREATE TABLE interaction_events (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(500) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    element_type VARCHAR(50),
    element_id VARCHAR(100),
    x_position SMALLINT UNSIGNED,
    y_position SMALLINT UNSIGNED,
    project_id CHAR(36),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (project_id) REFERENCES demo_projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Row-Level Security (RLS) Policies

### Overview

Supabase uses PostgreSQL RLS for data access control. For MySQL/PHP, you'll implement these at the application level.

### Policy Summary

| Table | Public Read | Public Write | Admin Only |
|-------|-------------|--------------|------------|
| `profiles` | Own only | Own only | - |
| `user_roles` | Own only | No | No |
| `blog_posts` | Published only | No | Full access |
| `case_studies` | Published only | No | Full access |
| `demo_projects` | Published only | No | Full access |
| `demo_project_credentials` | No | No | Full access |
| `testimonials` | Featured only | No | Full access |
| `contact_submissions` | No | Validated insert | Full access |
| `consultation_requests` | No | Validated insert | Full access |
| `branding_settings` | Yes | No | Update only |
| `seo_settings` | Yes | No | Full access |
| `chatbot_config` | Active only | No | Full access |
| `visitor_analytics` | No | Validated insert | Read only |
| `interaction_events` | No | Validated insert | Read only |

### PostgreSQL RLS Examples

```sql
-- Example: Blog posts policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Anyone can view published blog posts" 
ON blog_posts FOR SELECT 
USING (status = 'published');

-- Admins can view all posts
CREATE POLICY "Admins can view all blog posts" 
ON blog_posts FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert/update/delete
CREATE POLICY "Admins can manage blog posts" 
ON blog_posts FOR ALL 
USING (has_role(auth.uid(), 'admin'));
```

---

## MySQL/PHP Migration Guide

### Step 1: Create Database

```sql
CREATE DATABASE engineerstech
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE engineerstech;
```

### Step 2: Create Users Table (Authentication)

```sql
-- Replace Supabase auth with custom users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 3: Run All Table Creation Scripts

Execute all the MySQL table creation scripts from the [Tables Reference](#tables-reference) section above.

### Step 4: Create Helper Function for Role Check

```sql
DELIMITER //

CREATE FUNCTION has_role(p_user_id CHAR(36), p_role VARCHAR(20))
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE role_exists BOOLEAN DEFAULT FALSE;
    
    SELECT EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = p_user_id AND role = p_role
    ) INTO role_exists;
    
    RETURN role_exists;
END //

DELIMITER ;
```

---

## PHP Database Connection

### config/database.php

```php
<?php
/**
 * Database Configuration
 */

return [
    'driver' => 'mysql',
    'host' => getenv('DB_HOST') ?: 'localhost',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_DATABASE') ?: 'engineerstech',
    'username' => getenv('DB_USERNAME') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => true,
    'engine' => 'InnoDB',
];
```

### includes/Database.php

```php
<?php
/**
 * Database Connection Class
 */

class Database
{
    private static ?PDO $instance = null;
    private array $config;

    public function __construct()
    {
        $this->config = require __DIR__ . '/../config/database.php';
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $db = new self();
            self::$instance = $db->connect();
        }
        return self::$instance;
    }

    private function connect(): PDO
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $this->config['host'],
            $this->config['port'],
            $this->config['database'],
            $this->config['charset']
        );

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->config['charset']} COLLATE {$this->config['collation']}"
        ];

        try {
            return new PDO($dsn, $this->config['username'], $this->config['password'], $options);
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
}
```

---

## CRUD Operations in PHP

### includes/Model.php (Base Model)

```php
<?php
/**
 * Base Model Class
 */

abstract class Model
{
    protected PDO $db;
    protected string $table;
    protected string $primaryKey = 'id';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function find(string $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1"
        );
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function all(array $conditions = [], string $orderBy = 'created_at DESC', int $limit = 100): array
    {
        $sql = "SELECT * FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $where = [];
            foreach ($conditions as $column => $value) {
                $where[] = "{$column} = :{$column}";
                $params[$column] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        $sql .= " ORDER BY {$orderBy} LIMIT {$limit}";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function create(array $data): string
    {
        $data['id'] = $this->generateUuid();
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})"
        );
        $stmt->execute($data);

        return $data['id'];
    }

    public function update(string $id, array $data): bool
    {
        $set = [];
        foreach (array_keys($data) as $column) {
            $set[] = "{$column} = :{$column}";
        }
        $data['id'] = $id;

        $stmt = $this->db->prepare(
            "UPDATE {$this->table} SET " . implode(', ', $set) . " WHERE {$this->primaryKey} = :id"
        );
        return $stmt->execute($data);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare(
            "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id"
        );
        return $stmt->execute(['id' => $id]);
    }

    protected function generateUuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
```

### models/BlogPost.php

```php
<?php
/**
 * Blog Post Model
 */

require_once __DIR__ . '/../includes/Model.php';

class BlogPost extends Model
{
    protected string $table = 'blog_posts';

    public function getPublished(int $limit = 10): array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} 
             WHERE status = 'published' 
             ORDER BY published_at DESC 
             LIMIT :limit"
        );
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} WHERE slug = :slug LIMIT 1"
        );
        $stmt->execute(['slug' => $slug]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function publish(string $id): bool
    {
        return $this->update($id, [
            'status' => 'published',
            'published_at' => date('Y-m-d H:i:s')
        ]);
    }
}
```

### models/ContactSubmission.php

```php
<?php
/**
 * Contact Submission Model
 */

require_once __DIR__ . '/../includes/Model.php';

class ContactSubmission extends Model
{
    protected string $table = 'contact_submissions';

    public function submit(array $data): string|false
    {
        // Validate input
        if (!$this->validate($data)) {
            return false;
        }

        // Sanitize
        $clean = [
            'name' => htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'),
            'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
            'phone' => isset($data['phone']) ? htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8') : null,
            'subject' => isset($data['subject']) ? htmlspecialchars(trim($data['subject']), ENT_QUOTES, 'UTF-8') : null,
            'message' => htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8'),
        ];

        return $this->create($clean);
    }

    private function validate(array $data): bool
    {
        // Name validation (2-100 chars)
        if (empty($data['name']) || strlen($data['name']) < 2 || strlen($data['name']) > 100) {
            return false;
        }

        // Email validation
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        if (strlen($data['email']) < 5 || strlen($data['email']) > 255) {
            return false;
        }

        // Message validation (10-5000 chars)
        if (empty($data['message']) || strlen($data['message']) < 10 || strlen($data['message']) > 5000) {
            return false;
        }

        return true;
    }

    public function getUnread(): array
    {
        return $this->all(['is_read' => false], 'created_at DESC');
    }

    public function markAsRead(string $id): bool
    {
        return $this->update($id, ['is_read' => true]);
    }
}
```

### api/contact.php (API Endpoint Example)

```php
<?php
/**
 * Contact Form API Endpoint
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/Database.php';
require_once __DIR__ . '/../models/ContactSubmission.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed', 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input', 400);
    }

    $contact = new ContactSubmission();
    $id = $contact->submit($input);

    if ($id === false) {
        throw new Exception('Validation failed', 422);
    }

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Contact submission received',
        'id' => $id
    ]);

} catch (Exception $e) {
    $code = $e->getCode() ?: 500;
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
```

---

## Security Best Practices

### 1. Input Validation (PHP)

```php
<?php
/**
 * Input Validation Helper
 */

class Validator
{
    public static function email(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false
            && preg_match('/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', $email);
    }

    public static function length(string $value, int $min, int $max): bool
    {
        $len = mb_strlen($value);
        return $len >= $min && $len <= $max;
    }

    public static function uuid(string $value): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $value);
    }

    public static function sanitize(string $value): string
    {
        return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }
}
```

### 2. Authentication Middleware

```php
<?php
/**
 * Authentication Middleware
 */

class AuthMiddleware
{
    public static function authenticate(): ?array
    {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            return null;
        }

        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $_SESSION['user_id']]);
        
        return $stmt->fetch() ?: null;
    }

    public static function requireAuth(): array
    {
        $user = self::authenticate();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        return $user;
    }

    public static function requireAdmin(): array
    {
        $user = self::requireAuth();
        
        $db = Database::getInstance();
        $stmt = $db->prepare(
            "SELECT 1 FROM user_roles WHERE user_id = :id AND role = 'admin' LIMIT 1"
        );
        $stmt->execute(['id' => $user['id']]);
        
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden - Admin access required']);
            exit;
        }

        return $user;
    }
}
```

### 3. Password Hashing

```php
<?php
/**
 * Password Handling
 */

class Password
{
    public static function hash(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);
    }

    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_ARGON2ID);
    }
}
```

### 4. CSRF Protection

```php
<?php
/**
 * CSRF Token Protection
 */

class CSRF
{
    public static function generateToken(): string
    {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validateToken(?string $token): bool
    {
        if (!$token || !isset($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    public static function requireValidToken(): void
    {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $_POST['_token'] ?? null;
        
        if (!self::validateToken($token)) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid CSRF token']);
            exit;
        }
    }
}
```

### 5. Rate Limiting

```php
<?php
/**
 * Simple Rate Limiter
 */

class RateLimiter
{
    private PDO $db;
    private string $key;
    private int $maxAttempts;
    private int $decayMinutes;

    public function __construct(string $key, int $maxAttempts = 5, int $decayMinutes = 1)
    {
        $this->db = Database::getInstance();
        $this->key = $key;
        $this->maxAttempts = $maxAttempts;
        $this->decayMinutes = $decayMinutes;
    }

    public function tooManyAttempts(): bool
    {
        $this->clearOldAttempts();
        return $this->attempts() >= $this->maxAttempts;
    }

    public function hit(): void
    {
        $stmt = $this->db->prepare(
            "INSERT INTO rate_limits (key_name, created_at) VALUES (:key, NOW())"
        );
        $stmt->execute(['key' => $this->key]);
    }

    private function attempts(): int
    {
        $stmt = $this->db->prepare(
            "SELECT COUNT(*) FROM rate_limits 
             WHERE key_name = :key 
             AND created_at > DATE_SUB(NOW(), INTERVAL :minutes MINUTE)"
        );
        $stmt->execute(['key' => $this->key, 'minutes' => $this->decayMinutes]);
        return (int) $stmt->fetchColumn();
    }

    private function clearOldAttempts(): void
    {
        $stmt = $this->db->prepare(
            "DELETE FROM rate_limits 
             WHERE created_at < DATE_SUB(NOW(), INTERVAL :minutes MINUTE)"
        );
        $stmt->execute(['minutes' => $this->decayMinutes]);
    }
}

// Rate limits table
/*
CREATE TABLE rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_key_created (key_name, created_at)
) ENGINE=InnoDB;
*/
```

---

## Quick Reference

### Environment Variables (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=engineerstech
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

### File Structure

```
/
├── api/
│   ├── auth.php
│   ├── blog.php
│   ├── contact.php
│   └── ...
├── config/
│   └── database.php
├── includes/
│   ├── Database.php
│   └── Model.php
├── models/
│   ├── BlogPost.php
│   ├── ContactSubmission.php
│   ├── User.php
│   └── ...
├── migrations/
│   └── create_tables.sql
└── .env
```

---

## Support

For questions about this database schema:
- Review this documentation
- Check the original Supabase schema in `src/integrations/supabase/types.ts`
- Contact: info@engineerstechbd.com
