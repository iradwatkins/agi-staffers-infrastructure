#!/bin/bash
# BMAD Method - Multi-Tenant Platform Deployment
# Deploys the existing Next.js application to production
# Generated: August 12, 2025

set -e

echo "================================================"
echo "   DEPLOYING AGI STAFFERS MULTI-TENANT PLATFORM"
echo "   From: 0% Deployed → 100% Operational"
echo "================================================"

# Configuration
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
VPS_IP="72.60.28.175"
VPS_USER="root"

# Step 1: Build Next.js Application Locally
echo ""
echo "📦 Step 1: Building Next.js Production Application"
echo "--------------------------------------------------"
cd "$PROJECT_DIR"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build production application
echo "Building production app..."
npm run build

echo "✅ Next.js build complete"

# Step 2: Create Dockerfile for Production
echo ""
echo "🐳 Step 2: Creating Production Dockerfile"
echo "-----------------------------------------"
cat > Dockerfile.production << 'DOCKERFILE'
# Multi-stage build for Next.js application
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml* ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
DOCKERFILE

echo "✅ Dockerfile created"

# Step 3: Create Environment Configuration
echo ""
echo "🔧 Step 3: Setting Up Environment Variables"
echo "-------------------------------------------"
cat > .env.production << 'ENV'
# Database
DATABASE_URL="postgresql://postgres:StrongPassword2024!@localhost:5432/agistaffers"

# NextAuth
NEXTAUTH_URL="https://admin.agistaffers.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Redis
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_URL="redis://localhost:6379"

# Docker
DOCKER_HOST="unix:///var/run/docker.sock"

# Monitoring
METRICS_API_URL="https://admin.agistaffers.com/api/metrics"

# Email (optional)
EMAIL_FROM="noreply@agistaffers.com"
EMAIL_SERVER="smtp://localhost:25"

# Storage
MINIO_ENDPOINT="minio.agistaffers.com"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Feature Flags
ENABLE_2FA="true"
ENABLE_RATE_LIMITING="true"
ENABLE_MULTI_TENANT="true"
ENV

echo "✅ Environment variables configured"

# Step 4: Create Database Migration Script
echo ""
echo "🗄️ Step 4: Preparing Database Migrations"
echo "-----------------------------------------"
cat > migrate-database.sh << 'MIGRATE'
#!/bin/bash
# Database migration script

echo "Running Prisma migrations..."

# Set production database URL
export DATABASE_URL="postgresql://postgres:StrongPassword2024!@localhost:5432/agistaffers"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (templates)
cat > prisma/seed.ts << 'SEED'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create initial templates
  const templates = [
    {
      templateName: 'business-professional',
      displayName: 'Business Professional',
      category: 'business',
      description: 'Clean, modern business website with all essential pages',
      features: ['Contact Form', 'Service Pages', 'About Section', 'Testimonials'],
      isActive: true
    },
    {
      templateName: 'portfolio-showcase',
      displayName: 'Portfolio Showcase',
      category: 'portfolio',
      description: 'Creative portfolio for showcasing work and projects',
      features: ['Gallery', 'Project Details', 'Contact', 'Bio'],
      isActive: true
    },
    {
      templateName: 'blog-content',
      displayName: 'Blog & Content',
      category: 'blog',
      description: 'Content-focused blog with SEO optimization',
      features: ['Article Management', 'Categories', 'Comments', 'RSS'],
      isActive: true
    },
    {
      templateName: 'ecommerce-starter',
      displayName: 'E-commerce Starter',
      category: 'ecommerce',
      description: 'Basic online store with product catalog',
      features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Inventory'],
      isActive: true
    }
  ];

  for (const template of templates) {
    await prisma.siteTemplate.upsert({
      where: { templateName: template.templateName },
      update: template,
      create: template
    });
  }

  console.log('✅ Templates seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEED

# Run seed
npx ts-node prisma/seed.ts

echo "✅ Database migrations complete"
MIGRATE

chmod +x migrate-database.sh

# Step 5: Create Deployment Package
echo ""
echo "📦 Step 5: Creating Deployment Package"
echo "---------------------------------------"
tar -czf agistaffers-deploy.tar.gz \
    .next \
    public \
    prisma \
    package*.json \
    Dockerfile.production \
    .env.production \
    migrate-database.sh

echo "✅ Deployment package created: agistaffers-deploy.tar.gz"

# Step 6: Create Remote Deployment Script
echo ""
echo "🚀 Step 6: Creating Remote Deployment Script"
echo "--------------------------------------------"
cat > deploy-remote.sh << 'REMOTE'
#!/bin/bash
# Remote deployment script to run on VPS

echo "Deploying Multi-Tenant Platform on VPS..."

# Stop current admin dashboard
docker stop admin-dashboard 2>/dev/null || true
docker stop admin-dashboard-blue 2>/dev/null || true

# Extract deployment package
cd /root
tar -xzf agistaffers-deploy.tar.gz -C /root/agistaffers/

# Build Docker image
cd /root/agistaffers
docker build -f Dockerfile.production -t agistaffers-app:latest .

# Run database migrations
docker run --rm \
    --network host \
    -e DATABASE_URL="postgresql://postgres:StrongPassword2024!@localhost:5432/agistaffers" \
    agistaffers-app:latest \
    npx prisma migrate deploy

# Start new container
docker run -d \
    --name agistaffers-multitenant \
    --network agi-network \
    -p 3000:3000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /root/customer-sites:/app/customer-sites \
    --env-file .env.production \
    --restart unless-stopped \
    agistaffers-app:latest

# Update Caddy configuration
cat >> /root/Caddyfile << 'CADDY'

# Multi-tenant platform
admin.agistaffers.com {
    reverse_proxy localhost:3000
}
CADDY

# Reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile

echo "✅ Multi-tenant platform deployed successfully!"
echo ""
echo "Access at: https://admin.agistaffers.com"
echo ""
echo "Next steps:"
echo "1. Create first customer account"
echo "2. Deploy a test site"
echo "3. Configure billing integration"
REMOTE

echo "✅ Remote deployment script created"

# Step 7: Deployment Instructions
echo ""
echo "================================================"
echo "        DEPLOYMENT PACKAGE READY"
echo "================================================"
echo ""
echo "📋 MANUAL DEPLOYMENT STEPS:"
echo ""
echo "1. Copy files to VPS:"
echo "   scp agistaffers-deploy.tar.gz deploy-remote.sh root@${VPS_IP}:/root/"
echo ""
echo "2. SSH to VPS and deploy:"
echo "   ssh root@${VPS_IP}"
echo "   chmod +x deploy-remote.sh"
echo "   ./deploy-remote.sh"
echo ""
echo "3. Verify deployment:"
echo "   curl https://admin.agistaffers.com"
echo "   docker ps | grep agistaffers-multitenant"
echo ""
echo "4. Test functionality:"
echo "   - Visit https://admin.agistaffers.com"
echo "   - Create a test customer"
echo "   - Deploy a test site"
echo ""
echo "Estimated deployment time: 30-45 minutes"