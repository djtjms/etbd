-- ============================================
-- engineersTech Database Migration
-- MySQL 8.0+ / MariaDB 10.5+
-- ============================================
-- Run this migration to create all required tables
-- Execute: mysql -u username -p database_name < 001_create_all_tables.sql
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. USERS TABLE (Authentication)
-- ============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `remember_token` VARCHAR(100) DEFAULT NULL,
    `last_login_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PROFILES TABLE
-- ============================================
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) DEFAULT NULL,
    `avatar_url` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_profiles_email` (`email`),
    CONSTRAINT `fk_profiles_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. USER ROLES TABLE (RBAC)
-- ============================================
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_roles` (`user_id`, `role`),
    INDEX `idx_user_roles_user_id` (`user_id`),
    INDEX `idx_user_roles_role` (`role`),
    CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BLOG POSTS TABLE
-- ============================================
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `excerpt` TEXT DEFAULT NULL,
    `content` LONGTEXT DEFAULT NULL,
    `featured_image` TEXT DEFAULT NULL,
    `author_id` CHAR(36) DEFAULT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `seo_title` VARCHAR(255) DEFAULT NULL,
    `seo_description` TEXT DEFAULT NULL,
    `seo_keywords` JSON DEFAULT NULL,
    `published_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_blog_posts_slug` (`slug`),
    INDEX `idx_blog_posts_status` (`status`),
    INDEX `idx_blog_posts_published_at` (`published_at`),
    INDEX `idx_blog_posts_author` (`author_id`),
    INDEX `idx_blog_posts_created_at` (`created_at`),
    CONSTRAINT `fk_blog_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. CASE STUDIES TABLE (Portfolio)
-- ============================================
DROP TABLE IF EXISTS `case_studies`;
CREATE TABLE `case_studies` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `client_name` VARCHAR(255) DEFAULT NULL,
    `featured_image` TEXT DEFAULT NULL,
    `gallery_images` JSON DEFAULT NULL,
    `technologies` JSON DEFAULT NULL,
    `results` TEXT DEFAULT NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_case_studies_slug` (`slug`),
    INDEX `idx_case_studies_status` (`status`),
    INDEX `idx_case_studies_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. DEMO PROJECTS TABLE
-- ============================================
DROP TABLE IF EXISTS `demo_projects`;
CREATE TABLE `demo_projects` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(500) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `demo_url` TEXT DEFAULT NULL,
    `thumbnail` TEXT DEFAULT NULL,
    `screenshots` JSON DEFAULT ('[]'),
    `technologies` JSON DEFAULT ('[]'),
    `project_type` ENUM('website', 'webapp', 'mobile', 'desktop', 'erp', 'hrm', 'crm', 'ecommerce', 'other') NOT NULL DEFAULT 'website',
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `allow_interaction` TINYINT(1) DEFAULT 1,
    `preview_mode` ENUM('screenshot', 'iframe', 'video') DEFAULT 'screenshot',
    `view_count` INT UNSIGNED DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_demo_projects_slug` (`slug`),
    INDEX `idx_demo_projects_status` (`status`),
    INDEX `idx_demo_projects_featured` (`is_featured`),
    INDEX `idx_demo_projects_type` (`project_type`),
    INDEX `idx_demo_projects_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. DEMO PROJECT CREDENTIALS TABLE
-- ============================================
DROP TABLE IF EXISTS `demo_project_credentials`;
CREATE TABLE `demo_project_credentials` (
    `project_id` CHAR(36) NOT NULL,
    `access_username` VARCHAR(255) DEFAULT NULL,
    `access_password` VARCHAR(255) DEFAULT NULL,
    `access_code` VARCHAR(255) DEFAULT NULL,
    `access_notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`project_id`),
    CONSTRAINT `fk_demo_credentials_project` FOREIGN KEY (`project_id`) REFERENCES `demo_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. TESTIMONIALS TABLE
-- ============================================
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
    `id` CHAR(36) NOT NULL,
    `client_name` VARCHAR(255) NOT NULL,
    `client_position` VARCHAR(255) DEFAULT NULL,
    `client_company` VARCHAR(255) DEFAULT NULL,
    `client_avatar` TEXT DEFAULT NULL,
    `review` TEXT NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5,
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_testimonials_featured` (`is_featured`),
    INDEX `idx_testimonials_rating` (`rating`),
    INDEX `idx_testimonials_created_at` (`created_at`),
    CONSTRAINT `chk_testimonials_rating` CHECK (`rating` >= 1 AND `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. CONTACT SUBMISSIONS TABLE
-- ============================================
DROP TABLE IF EXISTS `contact_submissions`;
CREATE TABLE `contact_submissions` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `subject` VARCHAR(255) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_contact_is_read` (`is_read`),
    INDEX `idx_contact_email` (`email`),
    INDEX `idx_contact_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. CONSULTATION REQUESTS TABLE
-- ============================================
DROP TABLE IF EXISTS `consultation_requests`;
CREATE TABLE `consultation_requests` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `message` TEXT DEFAULT NULL,
    `interested_project` VARCHAR(255) DEFAULT NULL,
    `source` ENUM('popup', 'form', 'chatbot', 'whatsapp', 'demo') DEFAULT 'popup',
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_consultation_is_read` (`is_read`),
    INDEX `idx_consultation_source` (`source`),
    INDEX `idx_consultation_email` (`email`),
    INDEX `idx_consultation_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. BRANDING SETTINGS TABLE (Single Row)
-- ============================================
DROP TABLE IF EXISTS `branding_settings`;
CREATE TABLE `branding_settings` (
    `id` CHAR(36) NOT NULL,
    `logo_url` TEXT DEFAULT NULL,
    `logo_text` VARCHAR(100) DEFAULT 'engineersTech',
    `tagline` VARCHAR(255) DEFAULT 'Enterprise Tech Solutions for the Future',
    `primary_color` VARCHAR(20) DEFAULT '#90FFA3',
    `secondary_color` VARCHAR(20) DEFAULT '#1a1a2e',
    `company_email` VARCHAR(255) DEFAULT 'info@engineerstechbd.com',
    `company_phone` VARCHAR(50) DEFAULT '+880 1234-567890',
    `company_address` TEXT DEFAULT 'Dhaka, Bangladesh',
    `whatsapp_number` VARCHAR(50) DEFAULT NULL,
    `facebook_url` TEXT DEFAULT NULL,
    `twitter_url` TEXT DEFAULT NULL,
    `linkedin_url` TEXT DEFAULT NULL,
    `instagram_url` TEXT DEFAULT NULL,
    `youtube_url` TEXT DEFAULT NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. SEO SETTINGS TABLE
-- ============================================
DROP TABLE IF EXISTS `seo_settings`;
CREATE TABLE `seo_settings` (
    `id` CHAR(36) NOT NULL,
    `page_name` VARCHAR(100) NOT NULL,
    `meta_title` VARCHAR(255) DEFAULT NULL,
    `meta_description` TEXT DEFAULT NULL,
    `meta_keywords` JSON DEFAULT NULL,
    `og_image` TEXT DEFAULT NULL,
    `canonical_url` TEXT DEFAULT NULL,
    `robots` VARCHAR(50) DEFAULT 'index, follow',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_seo_page_name` (`page_name`),
    INDEX `idx_seo_page_name` (`page_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. CHATBOT CONFIG TABLE
-- ============================================
DROP TABLE IF EXISTS `chatbot_config`;
CREATE TABLE `chatbot_config` (
    `id` CHAR(36) NOT NULL,
    `question_pattern` TEXT NOT NULL,
    `response` TEXT NOT NULL,
    `category` VARCHAR(100) DEFAULT 'general',
    `priority` INT UNSIGNED DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `fallback_to_contact` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_chatbot_active` (`is_active`),
    INDEX `idx_chatbot_category` (`category`),
    INDEX `idx_chatbot_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. VISITOR ANALYTICS TABLE
-- ============================================
DROP TABLE IF EXISTS `visitor_analytics`;
CREATE TABLE `visitor_analytics` (
    `id` CHAR(36) NOT NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `page_path` VARCHAR(500) NOT NULL,
    `referrer` TEXT DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `country` VARCHAR(100) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `device_type` ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    `browser` VARCHAR(100) DEFAULT NULL,
    `os` VARCHAR(100) DEFAULT NULL,
    `scroll_depth` SMALLINT UNSIGNED DEFAULT 0,
    `time_on_page` INT UNSIGNED DEFAULT 0,
    `click_count` SMALLINT UNSIGNED DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_analytics_session` (`session_id`),
    INDEX `idx_analytics_page` (`page_path`(100)),
    INDEX `idx_analytics_device` (`device_type`),
    INDEX `idx_analytics_created_at` (`created_at`),
    INDEX `idx_analytics_country` (`country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 15. INTERACTION EVENTS TABLE
-- ============================================
DROP TABLE IF EXISTS `interaction_events`;
CREATE TABLE `interaction_events` (
    `id` CHAR(36) NOT NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `page_path` VARCHAR(500) NOT NULL,
    `event_type` VARCHAR(50) NOT NULL,
    `element_type` VARCHAR(50) DEFAULT NULL,
    `element_id` VARCHAR(100) DEFAULT NULL,
    `element_class` VARCHAR(255) DEFAULT NULL,
    `element_text` VARCHAR(255) DEFAULT NULL,
    `x_position` SMALLINT UNSIGNED DEFAULT NULL,
    `y_position` SMALLINT UNSIGNED DEFAULT NULL,
    `project_id` CHAR(36) DEFAULT NULL,
    `metadata` JSON DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_events_session` (`session_id`),
    INDEX `idx_events_page` (`page_path`(100)),
    INDEX `idx_events_type` (`event_type`),
    INDEX `idx_events_project` (`project_id`),
    INDEX `idx_events_created_at` (`created_at`),
    CONSTRAINT `fk_events_project` FOREIGN KEY (`project_id`) REFERENCES `demo_projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 16. RATE LIMITS TABLE (Security)
-- ============================================
DROP TABLE IF EXISTS `rate_limits`;
CREATE TABLE `rate_limits` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key_name` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_rate_key_created` (`key_name`, `created_at`),
    INDEX `idx_rate_ip` (`ip_address`),
    INDEX `idx_rate_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 17. PASSWORD RESETS TABLE
-- ============================================
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_resets_email` (`email`),
    INDEX `idx_resets_token` (`token`),
    INDEX `idx_resets_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 18. SESSIONS TABLE (Optional - for DB sessions)
-- ============================================
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` CHAR(36) DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_sessions_user` (`user_id`),
    INDEX `idx_sessions_activity` (`last_activity`),
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 19. ACTIVITY LOG TABLE (Audit Trail)
-- ============================================
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL,
    `table_name` VARCHAR(100) DEFAULT NULL,
    `record_id` CHAR(36) DEFAULT NULL,
    `old_values` JSON DEFAULT NULL,
    `new_values` JSON DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_activity_user` (`user_id`),
    INDEX `idx_activity_action` (`action`),
    INDEX `idx_activity_table` (`table_name`),
    INDEX `idx_activity_record` (`record_id`),
    INDEX `idx_activity_created` (`created_at`),
    CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 20. FILE UPLOADS TABLE (Media Library)
-- ============================================
DROP TABLE IF EXISTS `file_uploads`;
CREATE TABLE `file_uploads` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) DEFAULT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `file_size` INT UNSIGNED NOT NULL,
    `file_path` TEXT NOT NULL,
    `disk` VARCHAR(50) DEFAULT 'local',
    `folder` VARCHAR(100) DEFAULT 'uploads',
    `alt_text` VARCHAR(255) DEFAULT NULL,
    `caption` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_uploads_user` (`user_id`),
    INDEX `idx_uploads_mime` (`mime_type`),
    INDEX `idx_uploads_folder` (`folder`),
    INDEX `idx_uploads_created` (`created_at`),
    CONSTRAINT `fk_uploads_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate UUID
DELIMITER //
CREATE FUNCTION IF NOT EXISTS `uuid_v4`()
RETURNS CHAR(36)
DETERMINISTIC
NO SQL
BEGIN
    RETURN LOWER(CONCAT(
        HEX(RANDOM_BYTES(4)), '-',
        HEX(RANDOM_BYTES(2)), '-',
        CONCAT('4', SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3)), '-',
        CONCAT(HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64) + 8), SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3)), '-',
        HEX(RANDOM_BYTES(6))
    ));
END //
DELIMITER ;

-- Function to check user role
DELIMITER //
CREATE FUNCTION IF NOT EXISTS `has_role`(
    p_user_id CHAR(36),
    p_role VARCHAR(20)
)
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

-- Function to check if user is admin
DELIMITER //
CREATE FUNCTION IF NOT EXISTS `is_admin`(
    p_user_id CHAR(36)
)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN has_role(p_user_id, 'admin');
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile when user is created
DELIMITER //
CREATE TRIGGER `trg_users_after_insert`
AFTER INSERT ON `users`
FOR EACH ROW
BEGIN
    INSERT INTO profiles (id, email)
    VALUES (NEW.id, NEW.email);
END //
DELIMITER ;

-- Update blog post updated_at timestamp
DELIMITER //
CREATE TRIGGER `trg_blog_posts_before_update`
BEFORE UPDATE ON `blog_posts`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Set published_at when status changes to published
DELIMITER //
CREATE TRIGGER `trg_blog_posts_publish`
BEFORE UPDATE ON `blog_posts`
FOR EACH ROW
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
        SET NEW.published_at = CURRENT_TIMESTAMP;
    END IF;
END //
DELIMITER ;

-- Increment view count trigger (call via stored procedure)
DELIMITER //
CREATE PROCEDURE `increment_demo_view_count`(
    IN p_project_id CHAR(36)
)
BEGIN
    UPDATE demo_projects 
    SET view_count = view_count + 1 
    WHERE id = p_project_id;
END //
DELIMITER ;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default branding settings
INSERT INTO `branding_settings` (`id`, `logo_text`, `tagline`, `company_email`, `company_phone`, `company_address`)
VALUES (
    UUID(),
    'engineersTech',
    'Enterprise Tech Solutions for the Future',
    'info@engineerstechbd.com',
    '+880 1234-567890',
    'Dhaka, Bangladesh'
);

-- Insert default SEO settings for main pages
INSERT INTO `seo_settings` (`id`, `page_name`, `meta_title`, `meta_description`) VALUES
(UUID(), 'home', 'engineersTech - Enterprise Software Solutions', 'Leading software development company in Bangladesh specializing in ERP, HRM, CRM, and custom enterprise solutions.'),
(UUID(), 'about', 'About Us - engineersTech', 'Learn about engineersTech, our mission, vision, and the team behind innovative software solutions.'),
(UUID(), 'services', 'Our Services - engineersTech', 'Explore our comprehensive range of software development services including ERP, HRM, CRM, web, and mobile development.'),
(UUID(), 'portfolio', 'Portfolio - engineersTech', 'View our portfolio of successful projects and case studies across various industries.'),
(UUID(), 'blog', 'Blog - engineersTech', 'Stay updated with the latest technology trends, tips, and insights from our experts.'),
(UUID(), 'contact', 'Contact Us - engineersTech', 'Get in touch with engineersTech for your software development needs. We are here to help.'),
(UUID(), 'demo', 'Live Demos - engineersTech', 'Experience our software solutions with interactive live demos.');

-- Insert sample chatbot configurations
INSERT INTO `chatbot_config` (`id`, `question_pattern`, `response`, `category`, `priority`, `is_active`) VALUES
(UUID(), 'hello|hi|hey|greetings', 'Hello! Welcome to engineersTech. How can I help you today?', 'greeting', 100, 1),
(UUID(), 'services|what do you offer|what services', 'We offer a wide range of software development services including:\n\n• ERP Development\n• HRM Solutions\n• CRM Systems\n• Web Development\n• Mobile App Development\n• AI Integration\n\nWould you like to know more about any specific service?', 'services', 90, 1),
(UUID(), 'contact|reach|email|phone', 'You can reach us at:\n\n📧 Email: info@engineerstechbd.com\n📞 Phone: +880 1234-567890\n📍 Address: Dhaka, Bangladesh\n\nOr fill out our contact form and we will get back to you soon!', 'contact', 80, 1),
(UUID(), 'price|cost|quote|pricing', 'Our pricing depends on the project scope and requirements. Would you like to schedule a free consultation to discuss your project? We will provide a detailed quote after understanding your needs.', 'pricing', 70, 1),
(UUID(), 'bye|goodbye|thanks|thank you', 'Thank you for visiting engineersTech! If you have any more questions, feel free to ask. Have a great day!', 'farewell', 60, 1);

-- ============================================
-- VIEWS (Optional - for common queries)
-- ============================================

-- View for published blog posts
CREATE OR REPLACE VIEW `v_published_posts` AS
SELECT 
    bp.*,
    p.full_name AS author_name,
    p.avatar_url AS author_avatar
FROM blog_posts bp
LEFT JOIN profiles p ON bp.author_id = p.id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

-- View for published case studies
CREATE OR REPLACE VIEW `v_published_case_studies` AS
SELECT * FROM case_studies
WHERE status = 'published'
ORDER BY created_at DESC;

-- View for published demos
CREATE OR REPLACE VIEW `v_published_demos` AS
SELECT * FROM demo_projects
WHERE status = 'published'
ORDER BY is_featured DESC, created_at DESC;

-- View for featured testimonials
CREATE OR REPLACE VIEW `v_featured_testimonials` AS
SELECT * FROM testimonials
WHERE is_featured = 1
ORDER BY rating DESC, created_at DESC;

-- View for unread messages
CREATE OR REPLACE VIEW `v_unread_messages` AS
SELECT 
    'contact' AS type,
    id,
    name,
    email,
    message,
    created_at
FROM contact_submissions
WHERE is_read = 0
UNION ALL
SELECT 
    'consultation' AS type,
    id,
    name,
    email,
    message,
    created_at
FROM consultation_requests
WHERE is_read = 0
ORDER BY created_at DESC;

-- View for analytics summary (last 30 days)
CREATE OR REPLACE VIEW `v_analytics_summary` AS
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS page_views,
    COUNT(DISTINCT session_id) AS unique_sessions,
    AVG(time_on_page) AS avg_time_on_page,
    AVG(scroll_depth) AS avg_scroll_depth
FROM visitor_analytics
WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- INDEXES FOR OPTIMIZATION
-- ============================================

-- Full-text search indexes
ALTER TABLE blog_posts ADD FULLTEXT INDEX `ft_blog_search` (`title`, `excerpt`, `content`);
ALTER TABLE case_studies ADD FULLTEXT INDEX `ft_case_studies_search` (`title`, `description`, `results`);
ALTER TABLE demo_projects ADD FULLTEXT INDEX `ft_demos_search` (`title`, `description`);

-- ============================================
-- CLEANUP PROCEDURES
-- ============================================

-- Procedure to clean old rate limit records
DELIMITER //
CREATE PROCEDURE `cleanup_rate_limits`()
BEGIN
    DELETE FROM rate_limits 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR);
END //
DELIMITER ;

-- Procedure to clean old analytics (keep 90 days)
DELIMITER //
CREATE PROCEDURE `cleanup_old_analytics`()
BEGIN
    DELETE FROM visitor_analytics 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    DELETE FROM interaction_events 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END //
DELIMITER ;

-- Procedure to clean expired password reset tokens
DELIMITER //
CREATE PROCEDURE `cleanup_password_resets`()
BEGIN
    DELETE FROM password_resets 
    WHERE expires_at < NOW();
END //
DELIMITER ;

-- ============================================
-- EVENT SCHEDULER (Auto Cleanup)
-- ============================================

-- Enable event scheduler (run once as admin)
-- SET GLOBAL event_scheduler = ON;

-- Daily cleanup event
DELIMITER //
CREATE EVENT IF NOT EXISTS `evt_daily_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL cleanup_rate_limits();
    CALL cleanup_password_resets();
END //
DELIMITER ;

-- Weekly analytics cleanup
DELIMITER //
CREATE EVENT IF NOT EXISTS `evt_weekly_analytics_cleanup`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL cleanup_old_analytics();
END //
DELIMITER ;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS tables_created FROM information_schema.tables WHERE table_schema = DATABASE();
