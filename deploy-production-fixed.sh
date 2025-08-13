#!/bin/bash

# Production Deployment Script with All Fixes
# Deploys AGI Staffers with admin image fixes, theme toggle, and translation fixes

echo "🚀 Production Deployment for AGI Staffers (All Fixes Applied)"

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
VPS_PASSWORD='Bobby321&Gloria321Watkins?'
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd "$PROJECT_DIR"

# Create optimized tarball (exclude heavy directories but include .next build)
tar -czf /tmp/agistaffers-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='.next/trace' \
    --exclude='.next/standalone' \
    --exclude='*.log' \
    --exclude='_COMPLETED*' \
    .

echo -e "${YELLOW}📤 Uploading to VPS...${NC}"
SSHPASS="$VPS_PASSWORD" sshpass -e scp /tmp/agistaffers-deploy.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/

echo -e "${YELLOW}🔧 Deploying on VPS...${NC}"
SSHPASS="$VPS_PASSWORD" sshpass -e ssh ${VPS_USER}@${VPS_IP} << 'DEPLOY'
set -e

echo "📦 Extracting application..."
cd /var/www
rm -rf agistaffers-blue agistaffers-green
mkdir -p agistaffers-blue
cd agistaffers-blue

tar -xzf /tmp/agistaffers-deploy.tar.gz

echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔧 Creating environment file..."
cat > .env.local << 'ENV'
DATABASE_URL="postgresql://postgres:password@localhost:5432/agistaffers?schema=public"
NEXTAUTH_URL="https://agistaffers.com"
NEXTAUTH_SECRET="production-secret-key-2025"
NODE_ENV="production"
PORT=3000
ENV

echo "🚀 Starting with PM2..."
pm2 delete agistaffers-blue 2>/dev/null || true
PORT=3000 pm2 start "npm run start" --name agistaffers-blue

echo "⏳ Waiting for application to start..."
sleep 15

echo "🔍 Health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application running successfully!"
else
    echo "❌ Application failed to start"
    pm2 logs agistaffers-blue --lines 50
    exit 1
fi

echo "🌐 Configuring Caddy with fixed image handling..."
cat > /etc/caddy/Caddyfile << 'CADDY'
agistaffers.com, www.agistaffers.com {
    reverse_proxy localhost:3000
}

admin.agistaffers.com {
    # Handle static assets first (images, icons, etc.)
    handle /_next/* {
        reverse_proxy localhost:3000
    }
    
    handle /icons/* {
        reverse_proxy localhost:3000
    }
    
    handle /favicon.ico {
        reverse_proxy localhost:3000
    }
    
    handle /images/* {
        reverse_proxy localhost:3000
    }
    
    handle /assets/* {
        reverse_proxy localhost:3000
    }
    
    # Handle all other requests with /admin prefix
    handle {
        reverse_proxy localhost:3000 {
            header_up X-Forwarded-Path /admin{path}
        }
        rewrite * /admin{path}
    }
}
CADDY

caddy reload --config /etc/caddy/Caddyfile

echo "✅ Deployment complete!"
echo "🌐 Consumer site: https://agistaffers.com"
echo "🔧 Admin dashboard: https://admin.agistaffers.com"

# Save PM2 configuration
pm2 save
pm2 startup systemd -u root --hp /root || true

DEPLOY

# Clean up
rm -f /tmp/agistaffers-deploy.tar.gz

echo -e "${GREEN}✅ Production deployment completed!${NC}"
echo -e "${GREEN}📝 All fixes applied:${NC}"
echo -e "${GREEN}   - Admin site images fixed${NC}"
echo -e "${GREEN}   - Theme toggle (replaced globe icon)${NC}"
echo -e "${GREEN}   - Navigation translations fixed${NC}"
echo -e "${GREEN}🚀 Sites are live at:${NC}"
echo -e "${GREEN}   - https://agistaffers.com${NC}"
echo -e "${GREEN}   - https://admin.agistaffers.com${NC}"