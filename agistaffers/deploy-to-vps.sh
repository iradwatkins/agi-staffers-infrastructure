#!/bin/bash

# AGI Staffers VPS Deployment Script
# This script deploys the new React/Next.js website to replace agistaffers.com

echo "🚀 Starting deployment to AGI Staffers VPS..."

# Configuration
VPS_HOST="72.60.28.175"
VPS_USER="root"
PROJECT_NAME="agistaffers"
REMOTE_PATH="/root/agistaffers-nextjs"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Build the production version locally
echo -e "${YELLOW}Building production version...${NC}"
pnpm build
check_success "Production build"

# Step 2: Create deployment archive
echo -e "${YELLOW}Creating deployment archive...${NC}"
tar --exclude='node_modules' --exclude='.git' -czf deployment.tar.gz \
    .next \
    app \
    components \
    hooks \
    lib \
    public \
    package.json \
    pnpm-lock.yaml \
    next.config.js \
    tsconfig.json \
    postcss.config.mjs \
    components.json \
    Dockerfile \
    docker-compose.yml \
    prisma \
    .env.production
check_success "Archive creation"

# Step 3: Upload to VPS
echo -e "${YELLOW}Uploading to VPS...${NC}"
scp deployment.tar.gz ${VPS_USER}@${VPS_HOST}:~/
check_success "File upload"

# Step 4: Deploy on VPS
echo -e "${YELLOW}Deploying on VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    # Create directory if it doesn't exist
    mkdir -p /root/agistaffers-nextjs
    cd /root/agistaffers-nextjs
    
    # Extract files
    tar -xzf ~/deployment.tar.gz
    rm ~/deployment.tar.gz
    
    # Stop existing container if running
    docker stop agistaffers-web 2>/dev/null || true
    docker rm agistaffers-web 2>/dev/null || true
    
    # Build new image
    docker build -t agistaffers-web:latest .
    
    # Run with docker-compose
    docker-compose up -d
    
    # Update Caddy configuration if needed
    cat > /etc/caddy/sites-enabled/agistaffers.com << 'EOF'
agistaffers.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Enable compression
    encode gzip
    
    # Handle Next.js specific routes
    handle /_next/static/* {
        header Cache-Control "public, max-age=31536000, immutable"
    }
}

www.agistaffers.com {
    redir https://agistaffers.com{uri} permanent
}
EOF
    
    # Reload Caddy
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile
    
    echo "✓ Deployment complete!"
ENDSSH

check_success "VPS deployment"

# Step 5: Clean up local files
echo -e "${YELLOW}Cleaning up...${NC}"
rm deployment.tar.gz
check_success "Cleanup"

echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo -e "${GREEN}Website is now live at: https://agistaffers.com${NC}"
echo ""
echo "Next steps:"
echo "1. Test the website at https://agistaffers.com"
echo "2. Check container logs: ssh ${VPS_USER}@${VPS_HOST} 'docker logs agistaffers-web'"
echo "3. Monitor performance: ssh ${VPS_USER}@${VPS_HOST} 'docker stats agistaffers-web'"