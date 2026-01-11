-- ============================================
-- EngineersTech Database Seed Data
-- Run this after 001_create_all_tables.sql
-- ============================================

USE engineerstech;

-- ============================================
-- Admin User (password: Admin@123456)
-- ============================================
SET @admin_id = UUID();
INSERT INTO users (id, email, password, full_name, is_active, created_at, updated_at) VALUES
(@admin_id, 'admin@engineerstechbd.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4T1M8.Cq5QMaYXKi', 'Admin User', 1, NOW(), NOW());

INSERT INTO user_roles (id, user_id, role) VALUES
(UUID(), @admin_id, 'admin');

INSERT INTO profiles (id, user_id, email, full_name, created_at, updated_at) VALUES
(UUID(), @admin_id, 'admin@engineerstechbd.com', 'Admin User', NOW(), NOW());

-- ============================================
-- Branding Settings
-- ============================================
INSERT INTO branding_settings (id, logo_text, tagline, primary_color, company_email, company_phone, company_address, facebook_url, linkedin_url, whatsapp_number, updated_at) VALUES
(UUID(), 'engineersTech', 'Enterprise Tech Solutions for the Future', '#90FFA3', 'info@engineerstechbd.com', '+880 1873-722228', 'Dhaka, Bangladesh', 'https://facebook.com/engineerstechbd', 'https://linkedin.com/company/engineerstechbd', '+8801873722228', NOW());

-- ============================================
-- Sample Blog Posts
-- ============================================
INSERT INTO blog_posts (id, title, slug, excerpt, content, featured_image, status, author_id, seo_title, seo_description, published_at, created_at, updated_at) VALUES
(UUID(), 'The Future of AI in Business', 'future-of-ai-in-business', 'Explore how artificial intelligence is transforming the way businesses operate and compete in the modern market.', '<p>Artificial Intelligence is no longer just a buzzword—it''s a fundamental shift in how businesses operate. From automating routine tasks to providing deep insights through data analysis, AI is reshaping every industry.</p><h2>Key AI Trends for 2024</h2><p>Machine learning, natural language processing, and computer vision are becoming standard tools in the enterprise toolkit. Companies that embrace these technologies early are seeing significant competitive advantages.</p><h2>Getting Started with AI</h2><p>The first step is identifying where AI can add the most value to your business. Whether it''s customer service chatbots, predictive maintenance, or personalized marketing, there''s an AI solution for almost every challenge.</p>', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 'published', @admin_id, 'The Future of AI in Business | EngineersTech', 'Discover how AI is transforming businesses and learn how to leverage artificial intelligence for competitive advantage.', NOW(), NOW(), NOW()),

(UUID(), 'Building Scalable Web Applications', 'building-scalable-web-applications', 'Learn the best practices for creating web applications that can handle millions of users without breaking a sweat.', '<p>Scalability is one of the most critical aspects of modern web development. As your user base grows, your application needs to grow with it.</p><h2>Architecture Patterns</h2><p>Microservices, serverless computing, and container orchestration are key patterns for building scalable systems. Each has its pros and cons, and the right choice depends on your specific needs.</p><h2>Database Considerations</h2><p>Choosing the right database and implementing proper indexing, caching, and sharding strategies can make or break your application''s performance at scale.</p>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'published', @admin_id, 'Building Scalable Web Applications | EngineersTech', 'Master the art of building web applications that scale to millions of users with these proven techniques.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),

(UUID(), 'Mobile App Development Trends 2024', 'mobile-app-development-trends-2024', 'Stay ahead of the curve with the latest trends in mobile app development for iOS and Android platforms.', '<p>The mobile app landscape continues to evolve rapidly. Cross-platform development, 5G capabilities, and enhanced security features are shaping the future of mobile applications.</p><h2>Cross-Platform Solutions</h2><p>React Native and Flutter have matured significantly, offering near-native performance with a single codebase. This approach is becoming the standard for many organizations.</p><h2>Security First</h2><p>With increasing concerns about data privacy, implementing robust security measures from day one is no longer optional—it''s essential.</p>', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'published', @admin_id, 'Mobile App Development Trends 2024 | EngineersTech', 'Explore the latest mobile app development trends and technologies for iOS and Android in 2024.', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY);

-- ============================================
-- Sample Demo Projects
-- ============================================
INSERT INTO demo_projects (id, title, slug, description, demo_url, thumbnail, screenshots, project_type, technologies, status, is_featured, preview_mode, allow_interaction, view_count, created_at, updated_at) VALUES
(UUID(), 'E-Commerce Platform', 'ecommerce-platform', 'A full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management.', 'https://demo.engineerstechbd.com/ecommerce', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"]', 'website', '["React", "Node.js", "PostgreSQL", "Stripe"]', 'published', 1, 'iframe', 1, 150, NOW(), NOW()),

(UUID(), 'Banking Mobile App', 'banking-mobile-app', 'A secure mobile banking application with account management, transfers, bill payments, and transaction history.', 'https://demo.engineerstechbd.com/banking', 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800', '["https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800"]', 'mobile', '["React Native", "Node.js", "MongoDB", "AWS"]', 'published', 1, 'screenshot', 0, 89, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),

(UUID(), 'HR Management System', 'hr-management-system', 'Complete HR management solution with employee profiles, attendance tracking, leave management, and payroll.', 'https://demo.engineerstechbd.com/hrms', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', '["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"]', 'website', '["Vue.js", "Laravel", "MySQL", "Redis"]', 'published', 1, 'iframe', 1, 67, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),

(UUID(), 'CRM Dashboard', 'crm-dashboard', 'Customer relationship management dashboard with lead tracking, sales pipeline, and analytics.', 'https://demo.engineerstechbd.com/crm', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"]', 'website', '["React", "TypeScript", "GraphQL", "PostgreSQL"]', 'published', 0, 'iframe', 1, 45, NOW() - INTERVAL 14 DAY, NOW() - INTERVAL 14 DAY);

-- ============================================
-- Sample Testimonials
-- ============================================
INSERT INTO testimonials (id, client_name, client_company, client_position, client_avatar, review, rating, is_featured, created_at) VALUES
(UUID(), 'Ahmed Rahman', 'TechStart BD', 'CEO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'EngineersTech delivered our e-commerce platform ahead of schedule with exceptional quality. Their team understood our requirements perfectly and provided innovative solutions. Highly recommended!', 5, 1, NOW()),

(UUID(), 'Sarah Khan', 'FinTech Solutions', 'CTO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Working with EngineersTech on our banking app was a fantastic experience. Their attention to security and user experience was impressive. The app has received excellent feedback from our customers.', 5, 1, NOW() - INTERVAL 5 DAY),

(UUID(), 'Mohammad Ali', 'Global Logistics', 'Operations Director', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'The ERP system developed by EngineersTech transformed our operations. We''ve seen a 40% improvement in efficiency. Their support team is responsive and professional.', 5, 1, NOW() - INTERVAL 10 DAY),

(UUID(), 'Fatima Begum', 'HealthCare Plus', 'Managing Director', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'EngineersTech built our telemedicine platform during challenging times. The solution is robust, scalable, and user-friendly. They truly care about their clients'' success.', 4, 1, NOW() - INTERVAL 15 DAY),

(UUID(), 'Karim Hassan', 'EduTech Academy', 'Founder', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Our learning management system exceeded expectations. The team''s expertise in EdTech and their agile approach made the development process smooth and efficient.', 5, 1, NOW() - INTERVAL 20 DAY);

-- ============================================
-- Sample SEO Settings
-- ============================================
INSERT INTO seo_settings (id, page_name, meta_title, meta_description, meta_keywords, og_image, updated_at) VALUES
(UUID(), 'home', 'EngineersTech - Enterprise Software Development Company in Bangladesh', 'Leading software development company in Bangladesh specializing in web apps, mobile apps, AI integration, and enterprise solutions.', '["software development", "web development", "mobile app", "Bangladesh", "enterprise solutions"]', 'https://engineerstechbd.com/og-image.jpg', NOW()),

(UUID(), 'services', 'Our Services - EngineersTech', 'Explore our comprehensive software development services including web development, mobile apps, AI integration, CRM, ERP, and HRM solutions.', '["web development services", "mobile app development", "AI solutions", "CRM development"]', NULL, NOW()),

(UUID(), 'portfolio', 'Our Portfolio - EngineersTech', 'View our portfolio of successful projects including e-commerce platforms, banking apps, and enterprise solutions.', '["software portfolio", "case studies", "project showcase"]', NULL, NOW()),

(UUID(), 'about', 'About Us - EngineersTech', 'Learn about EngineersTech, a leading software development company in Bangladesh with expertise in cutting-edge technologies.', '["about us", "software company", "tech company Bangladesh"]', NULL, NOW()),

(UUID(), 'contact', 'Contact Us - EngineersTech', 'Get in touch with EngineersTech for your software development needs. We are based in Dhaka, Bangladesh.', '["contact", "software development", "Dhaka Bangladesh"]', NULL, NOW());

-- ============================================
-- Sample Chatbot Config
-- ============================================
INSERT INTO chatbot_config (id, question_pattern, response, is_active, fallback_to_contact, created_at) VALUES
(UUID(), 'hello|hi|hey|greetings', 'Hello! Welcome to EngineersTech. How can I help you today? I can assist you with information about our services, pricing, or connect you with our team.', 1, 0, NOW()),

(UUID(), 'pricing|cost|price|quote|budget', 'Our pricing varies based on project requirements. For a custom quote, please contact us through our contact form or WhatsApp. We offer competitive rates and flexible payment options.', 1, 1, NOW()),

(UUID(), 'services|what do you do|offerings', 'We offer a wide range of services including: Web Development, Mobile App Development, AI & Automation, CRM/ERP/HRM Solutions, and Cloud Services. Would you like details about any specific service?', 1, 0, NOW()),

(UUID(), 'contact|reach|phone|email|address', 'You can reach us at: Email: info@engineerstechbd.com, Phone: +880 1873-722228. We are located in Dhaka, Bangladesh. You can also use our contact form for inquiries.', 1, 0, NOW()),

(UUID(), 'timeline|how long|duration|delivery', 'Project timelines depend on scope and complexity. A typical website takes 2-4 weeks, while complex applications may take 2-6 months. We''ll provide a detailed timeline after understanding your requirements.', 1, 1, NOW());

-- ============================================
-- Case Studies
-- ============================================
INSERT INTO case_studies (id, title, slug, client_name, description, results, technologies, featured_image, gallery_images, status, created_at, updated_at) VALUES
(UUID(), 'E-Commerce Transformation for RetailMax', 'ecommerce-transformation-retailmax', 'RetailMax Bangladesh', 'RetailMax needed to transition from their legacy system to a modern e-commerce platform. We delivered a complete solution with inventory management, multi-vendor support, and mobile-first design.', '200% increase in online sales, 50% reduction in cart abandonment, 99.9% uptime', '["React", "Node.js", "PostgreSQL", "Redis", "AWS"]', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"]', 'published', NOW(), NOW()),

(UUID(), 'Digital Banking Solution for SecureBank', 'digital-banking-securebank', 'SecureBank Ltd', 'SecureBank required a secure, scalable mobile banking application. We developed a comprehensive solution with biometric authentication, real-time transactions, and advanced fraud detection.', '1M+ active users, 99.99% transaction success rate, Zero security breaches', '["React Native", "Java", "Oracle", "AWS", "Kubernetes"]', 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800', '["https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800"]', 'published', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY);

SELECT 'Seed data inserted successfully!' as status;
