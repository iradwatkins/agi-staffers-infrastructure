#!/bin/bash

# Deploy AGI Staffers with Spanish Translations
echo "🌐 Deploying AGI Staffers with Spanish Translations..."

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Building production version locally...${NC}"
cd "$PROJECT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build production app
echo "Building Next.js production app..."
npm run build || {
    echo -e "${RED}Build failed. Attempting to fix...${NC}"
    # Try with pnpm if npm fails
    pnpm install
    pnpm build
}

echo -e "${YELLOW}📤 Creating deployment package...${NC}"
# Create deployment archive
tar -czf agistaffers-deploy.tar.gz \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.js \
    prisma \
    app \
    components \
    hooks \
    lib \
    styles \
    postcss.config.js \
    tailwind.config.ts \
    tsconfig.json

echo -e "${YELLOW}🚀 Uploading to VPS...${NC}"
# Upload to VPS using password
SSHPASS='Bobby321&Gloria321Watkins?' sshpass -e scp agistaffers-deploy.tar.gz ${VPS_USER}@${VPS_IP}:/root/

echo -e "${YELLOW}🔧 Deploying on VPS...${NC}"
# Deploy on VPS
SSHPASS='Bobby321&Gloria321Watkins?' sshpass -e ssh ${VPS_USER}@${VPS_IP} << 'EOF'
set -e

echo "📦 Extracting deployment package..."
cd /root
mkdir -p agistaffers-production
cd agistaffers-production

# Extract the archive
tar -xzf /root/agistaffers-deploy.tar.gz

# Install production dependencies
echo "📥 Installing production dependencies..."
npm install --production

# Set up environment
cp /root/agistaffers/.env.production .env 2>/dev/null || true

# Stop existing process
pm2 stop agistaffers 2>/dev/null || true
pm2 delete agistaffers 2>/dev/null || true

# Start with PM2
echo "🚀 Starting application with PM2..."
PORT=3008 pm2 start npm --name "agistaffers" -- start

# Save PM2 configuration
pm2 save
pm2 startup systemd -u root --hp /root

# Configure Caddy for the domain
cat > /etc/caddy/sites/agistaffers.com << 'CADDY'
agistaffers.com {
    reverse_proxy localhost:3008
    
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
CADDY

# Reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force 2>/dev/null || caddy reload

echo "✅ Deployment complete!"
echo "🌐 Website available at https://agistaffers.com"
echo "🇩🇴 Spanish translations active for Dominican Republic users"

# Check status
pm2 status agistaffers
EOF

# Clean up local archive
rm -f agistaffers-deploy.tar.gz

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Visit https://agistaffers.com to see the Spanish translations${NC}"
echo -e "${GREEN}🔄 Language toggle available in the navigation bar${NC}"