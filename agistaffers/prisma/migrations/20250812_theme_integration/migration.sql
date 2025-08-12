-- Migration: Theme Integration with Multi-Tenant Architecture
-- Create theme-related tables to support the existing customer structure

-- Extend customer_sites table with theme functionality  
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS theme_type VARCHAR(50) DEFAULT 'dawn';
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{}';
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}';
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS container_id VARCHAR(255);
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS container_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE customer_sites ADD COLUMN IF NOT EXISTS ssl_enabled BOOLEAN DEFAULT false;

-- Create theme_templates table to manage available themes
CREATE TABLE IF NOT EXISTS theme_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL,
    description TEXT,
    template_config JSONB NOT NULL,
    docker_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default theme templates
INSERT INTO theme_templates (template_name, template_type, description, template_config, docker_config) VALUES
(
    'Dawn E-commerce',
    'dawn',
    'Complete e-commerce solution with shopping cart, product management, and checkout',
    '{
        "sections": ["header", "hero", "collections", "product-details", "cart", "footer", "featured-products"],
        "features": ["shopping_cart", "product_catalog", "checkout", "user_accounts"],
        "category": "ecommerce"
    }',
    '{
        "image": "node:18-alpine",
        "resources": {"memory": "512MB", "cpu": "0.5", "storage": "2GB"},
        "env": ["THEME_TYPE=dawn", "NODE_ENV=production"],
        "ports": {"3000": "http"}
    }'
),
(
    'Service Business',
    'service-business', 
    'Professional services website with booking, team profiles, and contact forms',
    '{
        "sections": ["service-hero", "services-showcase", "team-profiles", "contact-form"],
        "features": ["booking_system", "team_management", "contact_forms", "service_catalog"],
        "category": "business"
    }',
    '{
        "image": "node:18-alpine",
        "resources": {"memory": "512MB", "cpu": "0.5", "storage": "2GB"},
        "env": ["THEME_TYPE=service-business", "NODE_ENV=production"],
        "ports": {"3000": "http"}
    }'
),
(
    'Landing Page',
    'landing-page',
    'High-conversion landing page with urgency messaging and social proof',
    '{
        "sections": ["conversion-hero", "benefits-features", "social-proof"],
        "features": ["conversion_optimization", "lead_capture", "social_proof", "urgency_messaging"],
        "category": "marketing"
    }',
    '{
        "image": "node:18-alpine", 
        "resources": {"memory": "256MB", "cpu": "0.25", "storage": "1GB"},
        "env": ["THEME_TYPE=landing-page", "NODE_ENV=production"],
        "ports": {"3000": "http"}
    }'
),
(
    'Blog Website',
    'blog',
    'Content-focused blog with article management, search, and categorization',
    '{
        "sections": ["blog-hero", "article-listing", "article-content"],
        "features": ["content_management", "article_search", "categorization", "author_profiles"],
        "category": "content"
    }',
    '{
        "image": "node:18-alpine",
        "resources": {"memory": "512MB", "cpu": "0.5", "storage": "2GB"},
        "env": ["THEME_TYPE=blog", "NODE_ENV=production"],
        "ports": {"3000": "http"}
    }'
),
(
    'Corporate Website',
    'corporate',
    'Enterprise website with company information, timeline, and leadership profiles',
    '{
        "sections": ["corporate-hero", "about-company"],
        "features": ["company_info", "leadership_profiles", "company_timeline", "investor_relations"],
        "category": "corporate"
    }',
    '{
        "image": "node:18-alpine",
        "resources": {"memory": "512MB", "cpu": "0.5", "storage": "2GB"},
        "env": ["THEME_TYPE=corporate", "NODE_ENV=production"],
        "ports": {"3000": "http"}
    }'
);

-- Create container_metrics table for monitoring
CREATE TABLE IF NOT EXISTS container_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_site_id UUID REFERENCES customer_sites(id) ON DELETE CASCADE,
    container_id VARCHAR(255) NOT NULL,
    cpu_usage DECIMAL(5,2) DEFAULT 0.00,
    memory_usage BIGINT DEFAULT 0,
    network_rx BIGINT DEFAULT 0,
    network_tx BIGINT DEFAULT 0,
    disk_usage BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'unknown',
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for container_metrics
CREATE INDEX IF NOT EXISTS idx_container_metrics_customer_site_id ON container_metrics(customer_site_id);
CREATE INDEX IF NOT EXISTS idx_container_metrics_container_id ON container_metrics(container_id);
CREATE INDEX IF NOT EXISTS idx_container_metrics_recorded_at ON container_metrics(recorded_at);

-- Create theme_customizations table for version control of customizations
CREATE TABLE IF NOT EXISTS theme_customizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_site_id UUID REFERENCES customer_sites(id) ON DELETE CASCADE,
    customization_data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for theme_customizations
CREATE INDEX IF NOT EXISTS idx_theme_customizations_customer_site_id ON theme_customizations(customer_site_id);
CREATE INDEX IF NOT EXISTS idx_theme_customizations_version ON theme_customizations(customer_site_id, version);
CREATE INDEX IF NOT EXISTS idx_theme_customizations_active ON theme_customizations(customer_site_id, is_active);

-- Create deployment_logs table for tracking deployments
CREATE TABLE IF NOT EXISTS deployment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_site_id UUID REFERENCES customer_sites(id) ON DELETE CASCADE,
    deployment_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'restart', 'delete'
    status VARCHAR(50) NOT NULL, -- 'pending', 'in_progress', 'completed', 'failed'
    container_id VARCHAR(255),
    logs TEXT,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Create indexes for deployment_logs
CREATE INDEX IF NOT EXISTS idx_deployment_logs_customer_site_id ON deployment_logs(customer_site_id);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_status ON deployment_logs(status);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_started_at ON deployment_logs(started_at);

-- Update indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_sites_theme_type ON customer_sites(theme_type);
CREATE INDEX IF NOT EXISTS idx_customer_sites_container_status ON customer_sites(container_status);
CREATE INDEX IF NOT EXISTS idx_customer_sites_customer_id ON customer_sites(customer_id);

-- Add constraints
ALTER TABLE customer_sites ADD CONSTRAINT chk_theme_type 
CHECK (theme_type IN ('dawn', 'service-business', 'landing-page', 'blog', 'corporate'));

ALTER TABLE customer_sites ADD CONSTRAINT chk_container_status
CHECK (container_status IN ('pending', 'creating', 'running', 'stopped', 'error'));