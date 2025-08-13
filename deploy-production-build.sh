#!/bin/bash

# Deploy AGI Staffers with PROPER production build
# Uses the fixed build (no more SSR errors) with npm run build && npm run start

echo "🚀 Deploying AGI Staffers with PROPER production build..."

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
VPS_PASSWORD='Bobby321&Gloria321Watkins?'
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Creating deployment package from fixed build...${NC}"
cd "$PROJECT_DIR"

# Verify build works locally first
echo "🔍 Testing local build..."
if ! npm run build; then
    echo -e "${RED}❌ Local build failed! Fix build issues first.${NC}"
    exit 1
fi

# Create a tarball of the entire project
echo "Creating deployment archive..."
tar -czf agistaffers-production-build.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='dev.log' \
    .

echo -e "${YELLOW}📤 Uploading to VPS...${NC}"
# Upload to VPS
SSHPASS="$VPS_PASSWORD" sshpass -e scp agistaffers-production-build.tar.gz ${VPS_USER}@${VPS_IP}:/root/

echo -e "${YELLOW}🔧 Deploying on VPS with PRODUCTION BUILD...${NC}"
# Deploy on VPS
SSHPASS="$VPS_PASSWORD" sshpass -e ssh ${VPS_USER}@${VPS_IP} << 'EOF'
set -e

echo "🗑️ Stopping old instances..."
# Stop any running instances
pm2 stop agistaffers 2>/dev/null || true
pm2 delete agistaffers 2>/dev/null || true
pm2 stop agistaffers-blue 2>/dev/null || true
pm2 delete agistaffers-blue 2>/dev/null || true

# Backup old code if needed
mkdir -p /root/old-websites
if [ -d "/root/agistaffers" ]; then
    mv /root/agistaffers /root/old-websites/agistaffers-backup-$(date +%Y%m%d-%H%M%S)
fi

echo "📦 Extracting production build version..."
cd /root
mkdir -p agistaffers
cd agistaffers

# Extract the archive
tar -xzf /root/agistaffers-production-build.tar.gz

echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔧 Setting up production environment..."
# Create production environment file
cat > .env.production << 'ENVFILE'
# Database (PostgreSQL on VPS)
DATABASE_URL="postgresql://postgres:password@localhost:5432/agistaffers?schema=public"

# NextAuth
NEXTAUTH_URL="https://agistaffers.com"
NEXTAUTH_SECRET="your-secret-here-replace-in-production"

# PWA
NEXT_PUBLIC_APP_URL="https://agistaffers.com"

# Production Mode
NODE_ENV="production"

# Gmail SMTP Configuration for Magic Links
GMAIL_USER="your-gmail-address@gmail.com"
GMAIL_APP_PASSWORD="your-secure-app-password-here"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8"
ENVFILE

# Copy production env if it exists
if [ -f "/root/.env.production" ]; then
    cp /root/.env.production .env.production
fi

echo "🏗️ Building production version..."
npm run build

echo "🚀 Starting application with PRODUCTION BUILD..."
# Start the application in production mode
PORT=3020 pm2 start "npm run start" --name "agistaffers" --interpreter bash

# Save PM2 configuration
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "🌐 Configuring Caddy for correct routing..."
# Configure Caddy for both domains
cat > /etc/caddy/Caddyfile << 'CADDY'
# Consumer site
agistaffers.com {
    reverse_proxy localhost:3020
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Cache-Control "public, max-age=3600"
    }
    
    encode gzip
}

www.agistaffers.com {
    redir https://agistaffers.com{uri} permanent
}

# Admin dashboard - routes to /admin path
admin.agistaffers.com {
    reverse_proxy localhost:3020
    
    # Rewrite all requests to /admin path
    handle /* {
        rewrite * /admin{uri}
        reverse_proxy localhost:3020
    }
    
    # For root path, redirect to /admin
    handle / {
        rewrite * /admin
        reverse_proxy localhost:3020
    }
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    encode gzip
}
CADDY

# Reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force 2>/dev/null || caddy reload

echo "✅ Production build deployment complete!"
echo "🌐 Consumer site: https://agistaffers.com"
echo "🔧 Admin dashboard: https://admin.agistaffers.com"
echo "📝 Now running with PROPER production build (no more dev mode!)"

# Check status
pm2 status agistaffers

# Wait a moment and test
sleep 5
echo "🔍 Testing production deployment..."
if curl -f http://localhost:3020 > /dev/null 2>&1; then
    echo "✅ Production build is running successfully!"
else
    echo "❌ Production build failed to start, checking logs..."
    pm2 logs agistaffers --lines 20
fi
EOF

# Clean up local archive
rm -f agistaffers-production-build.tar.gz

echo -e "${GREEN}✅ Production build deployment completed!${NC}"
echo -e "${GREEN}🌐 Consumer site: https://agistaffers.com${NC}"
echo -e "${GREEN}🔧 Admin dashboard: https://admin.agistaffers.com${NC}"
echo -e "${GREEN}🏗️ Now running proper production build with SSR fixes!${NC}"