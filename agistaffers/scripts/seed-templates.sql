-- Default Site Templates for AGI Staffers Multi-Tenant Platform
-- Run this after the main schema is created

-- Insert default site templates
INSERT INTO site_templates (
    id,
    template_name,
    template_type,
    description,
    source_path,
    default_config,
    features,
    preview_url,
    is_active,
    version
) VALUES 
(
    'template_001',
    'Business Portfolio',
    'business',
    'Professional business portfolio template with services, about, and contact sections. Perfect for consultants and service providers.',
    '/templates/business-portfolio',
    '{"theme": "professional", "color_scheme": "blue", "layout": "modern", "sections": ["hero", "about", "services", "portfolio", "contact"]}',
    '["responsive_design", "seo_optimized", "contact_forms", "google_analytics", "ssl_ready"]',
    'https://demo.agistaffers.com/business-portfolio',
    true,
    '1.0.0'
),
(
    'template_002',
    'E-commerce Starter',
    'ecommerce',
    'Complete e-commerce template with product catalog, shopping cart, and payment integration. Ready for online stores.',
    '/templates/ecommerce-starter',
    '{"theme": "modern", "color_scheme": "green", "payment_gateways": ["stripe", "paypal"], "currency": "USD", "layout": "grid"}',
    '["product_catalog", "shopping_cart", "payment_integration", "inventory_management", "order_tracking", "responsive_design"]',
    'https://demo.agistaffers.com/ecommerce-starter',
    true,
    '1.0.0'
),
(
    'template_003',
    'Restaurant Menu',
    'restaurant',
    'Beautiful restaurant template with menu display, online ordering, and reservation system. Perfect for food businesses.',
    '/templates/restaurant-menu',
    '{"theme": "elegant", "color_scheme": "warm", "menu_style": "categorized", "online_ordering": true, "reservations": true}',
    '["menu_management", "online_ordering", "reservation_system", "location_map", "social_media_integration"]',
    'https://demo.agistaffers.com/restaurant-menu',
    true,
    '1.0.0'
),
(
    'template_004',
    'Landing Page Pro',
    'landing',
    'High-converting landing page template with lead capture, testimonials, and call-to-action sections. Ideal for marketing campaigns.',
    '/templates/landing-page-pro',
    '{"theme": "conversion", "color_scheme": "orange", "lead_capture": true, "analytics": "google", "layout": "single_page"}',
    '["lead_capture_forms", "testimonials", "pricing_tables", "video_integration", "a_b_testing_ready"]',
    'https://demo.agistaffers.com/landing-page-pro',
    true,
    '1.0.0'
),
(
    'template_005',
    'Personal Blog',
    'blog',
    'Clean and minimalist blog template with post management, categories, and social sharing. Perfect for personal branding.',
    '/templates/personal-blog',
    '{"theme": "minimal", "color_scheme": "gray", "post_layout": "cards", "comments": true, "social_sharing": true}',
    '["blog_management", "category_system", "comment_system", "social_sharing", "search_functionality", "rss_feed"]',
    'https://demo.agistaffers.com/personal-blog',
    true,
    '1.0.0'
),
(
    'template_006',
    'Agency Showcase',
    'agency',
    'Modern agency template with team profiles, case studies, and client testimonials. Perfect for creative agencies.',
    '/templates/agency-showcase',
    '{"theme": "creative", "color_scheme": "purple", "layout": "portfolio", "team_section": true, "case_studies": true}',
    '["portfolio_gallery", "team_profiles", "case_studies", "client_testimonials", "service_pages", "contact_forms"]',
    'https://demo.agistaffers.com/agency-showcase',
    true,
    '1.0.0'
),
(
    'template_007',
    'SaaS Product',
    'saas',
    'Modern SaaS product template with features showcase, pricing plans, and user dashboard. Perfect for software companies.',
    '/templates/saas-product',
    '{"theme": "tech", "color_scheme": "blue", "pricing_tiers": 3, "user_dashboard": true, "trial_signup": true}',
    '["feature_showcase", "pricing_plans", "user_registration", "dashboard_preview", "integration_showcase", "documentation"]',
    'https://demo.agistaffers.com/saas-product',
    true,
    '1.0.0'
),
(
    'template_008',
    'Event Management',
    'event',
    'Complete event template with schedule, speaker profiles, and ticket booking. Perfect for conferences and events.',
    '/templates/event-management',
    '{"theme": "event", "color_scheme": "red", "ticketing": true, "schedule": true, "speakers": true, "venue_info": true}',
    '["event_schedule", "speaker_profiles", "ticket_booking", "venue_information", "sponsors_section", "registration_forms"]',
    'https://demo.agistaffers.com/event-management',
    true,
    '1.0.0'
),
(
    'template_009',
    'Real Estate',
    'real_estate',
    'Professional real estate template with property listings, search filters, and agent profiles. Perfect for real estate businesses.',
    '/templates/real-estate',
    '{"theme": "professional", "color_scheme": "teal", "property_search": true, "agent_profiles": true, "map_integration": true}',
    '["property_listings", "search_filters", "agent_profiles", "map_integration", "mortgage_calculator", "contact_forms"]',
    'https://demo.agistaffers.com/real-estate',
    true,
    '1.0.0'
),
(
    'template_010',
    'Non-Profit Foundation',
    'nonprofit',
    'Inspiring non-profit template with donation system, volunteer signup, and impact stories. Perfect for charitable organizations.',
    '/templates/nonprofit-foundation',
    '{"theme": "inspiring", "color_scheme": "green", "donations": true, "volunteer_signup": true, "impact_stories": true}',
    '["donation_system", "volunteer_management", "impact_stories", "event_calendar", "newsletter_signup", "social_media_feeds"]',
    'https://demo.agistaffers.com/nonprofit-foundation',
    true,
    '1.0.0'
);

-- Create template categories for easier organization
CREATE TABLE IF NOT EXISTS template_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert template categories
INSERT INTO template_categories (id, name, description) VALUES
('business', 'Business & Professional', 'Templates for businesses, consultants, and professional services'),
('ecommerce', 'E-commerce & Retail', 'Templates for online stores and retail businesses'),
('creative', 'Creative & Portfolio', 'Templates for artists, designers, and creative professionals'),
('tech', 'Technology & SaaS', 'Templates for tech companies and software products'),
('hospitality', 'Food & Hospitality', 'Templates for restaurants, hotels, and hospitality businesses'),
('nonprofit', 'Non-Profit & Community', 'Templates for charitable organizations and community groups'),
('education', 'Education & Training', 'Templates for schools, courses, and educational content'),
('healthcare', 'Healthcare & Medical', 'Templates for medical practices and healthcare services'),
('real_estate', 'Real Estate & Property', 'Templates for real estate agents and property management'),
('event', 'Events & Entertainment', 'Templates for events, conferences, and entertainment');

-- Add some example customers for testing
INSERT INTO customers (
    id,
    company_name,
    contact_name,
    contact_email,
    phone,
    plan_tier,
    status,
    subdomain,
    billing_email,
    notes
) VALUES 
(
    'customer_001',
    'TechFlow Solutions',
    'Sarah Johnson',
    'sarah.johnson@techflow.com',
    '+1-555-0123',
    'premium',
    'active',
    'techflow',
    'billing@techflow.com',
    'Premium customer - requires priority support'
),
(
    'customer_002',
    'Green Valley Organic',
    'Mike Chen',
    'mike@greenvalleyorganic.com',
    '+1-555-0456',
    'basic',
    'active',
    'greenvalley',
    'mike@greenvalleyorganic.com',
    'Organic food business - seasonal traffic spikes'
),
(
    'customer_003',
    'Pixel Perfect Design',
    'Emma Rodriguez',
    'emma@pixelperfect.design',
    '+1-555-0789',
    'enterprise',
    'active',
    'pixelperfect',
    'accounts@pixelperfect.design',
    'Design agency - high bandwidth requirements'
);

-- Update the site_templates table to reference categories
ALTER TABLE site_templates ADD COLUMN IF NOT EXISTS category_id VARCHAR(50);
ALTER TABLE site_templates ADD CONSTRAINT fk_template_category 
    FOREIGN KEY (category_id) REFERENCES template_categories(id);

-- Update existing templates with categories
UPDATE site_templates SET category_id = 'business' WHERE template_type IN ('business', 'agency');
UPDATE site_templates SET category_id = 'ecommerce' WHERE template_type = 'ecommerce';
UPDATE site_templates SET category_id = 'hospitality' WHERE template_type = 'restaurant';
UPDATE site_templates SET category_id = 'creative' WHERE template_type = 'blog';
UPDATE site_templates SET category_id = 'tech' WHERE template_type = 'saas';
UPDATE site_templates SET category_id = 'event' WHERE template_type = 'event';
UPDATE site_templates SET category_id = 'real_estate' WHERE template_type = 'real_estate';
UPDATE site_templates SET category_id = 'nonprofit' WHERE template_type = 'nonprofit';
UPDATE site_templates SET category_id = 'creative' WHERE template_type = 'landing';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON site_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_active ON site_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_type ON site_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_plan ON customers(plan_tier);
CREATE INDEX IF NOT EXISTS idx_sites_status ON customer_sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_customer ON customer_sites(customer_id);

-- Add some usage statistics tracking
CREATE TABLE IF NOT EXISTS template_usage_stats (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(50) REFERENCES site_templates(id),
    customer_id VARCHAR(50) REFERENCES customers(id),
    site_id VARCHAR(50) REFERENCES customer_sites(id),
    action VARCHAR(50), -- 'deployed', 'viewed', 'customized'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_stats_template ON template_usage_stats(template_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_date ON template_usage_stats(created_at);

COMMENT ON TABLE site_templates IS 'Available website templates for multi-tenant deployment';
COMMENT ON TABLE template_categories IS 'Categories for organizing templates';
COMMENT ON TABLE template_usage_stats IS 'Track template usage for analytics and billing';