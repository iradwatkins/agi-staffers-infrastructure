#!/bin/bash

# AGI Staffers Homepage Deployment Script
# Deploys the main agistaffers.com Next.js website to VPS

set -e

echo "🚀 Starting AGI Staffers Homepage deployment..."

# Configuration
VPS_HOST="72.60.28.175"
VPS_USER="root"
VPS_PASS="Gv4!pQ2xR8wz"
PROJECT_NAME="agistaffers-homepage"
CONTAINER_NAME="agistaffers-homepage"
CONTAINER_PORT="3008"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building production version locally...${NC}"
cd agistaffers

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Build the application
pnpm build

echo -e "${YELLOW}Creating deployment archive...${NC}"
# Create a clean deployment package
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env.local' \
    --exclude='deployment.tar.gz' \
    -czf deployment.tar.gz .

echo -e "${YELLOW}Uploading to VPS...${NC}"
sshpass -p "$VPS_PASS" scp deployment.tar.gz ${VPS_USER}@${VPS_HOST}:/root/

echo -e "${YELLOW}Deploying on VPS...${NC}"
sshpass -p "$VPS_PASS" ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    set -e
    
    echo "Creating deployment directory..."
    mkdir -p /root/agistaffers-homepage
    cd /root/agistaffers-homepage
    
    echo "Extracting files..."
    tar -xzf /root/deployment.tar.gz
    rm /root/deployment.tar.gz
    
    echo "Building Docker image..."
    # Create production Dockerfile if it doesn't exist
    cat > Dockerfile.production << 'EOF'
# Production Dockerfile for AGI Staffers Homepage
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3008
ENV PORT 3008
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF
    
    echo "Stopping existing container if running..."
    docker stop agistaffers-homepage 2>/dev/null || true
    docker rm agistaffers-homepage 2>/dev/null || true
    
    echo "Building new Docker image..."
    docker build -f Dockerfile.production -t agistaffers-homepage:latest .
    
    echo "Starting new container..."
    docker run -d \
        --name agistaffers-homepage \
        --restart unless-stopped \
        -p 3008:3008 \
        agistaffers-homepage:latest
    
    echo "Updating Caddy configuration..."
    # Update the main agistaffers.com configuration
    cat > /etc/caddy/sites/agistaffers.com << 'EOF'
agistaffers.com {
    reverse_proxy localhost:3008
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
    }
    
    # Enable compression
    encode gzip
    
    # Handle Next.js specific routes
    handle /_next/static/* {
        header Cache-Control "public, max-age=31536000, immutable"
    }
    
    handle /static/* {
        header Cache-Control "public, max-age=31536000, immutable"
    }
    
    # Service worker
    handle /sw.js {
        header Cache-Control "public, max-age=0, must-revalidate"
        header Service-Worker-Allowed "/"
    }
}

www.agistaffers.com {
    redir https://agistaffers.com{uri} permanent
}
EOF
    
    echo "Reloading Caddy..."
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force
    
    echo "Checking container status..."
    docker ps | grep agistaffers-homepage
    
    echo "✅ Deployment complete!"
ENDSSH

# Clean up local deployment file
rm deployment.tar.gz
cd ..

echo -e "${GREEN}🎉 AGI Staffers Homepage deployed successfully!${NC}"
echo -e "${GREEN}Website is now live at: https://agistaffers.com${NC}"
echo ""
echo "To check the deployment:"
echo "1. Visit https://agistaffers.com"
echo "2. Check logs: sshpass -p '$VPS_PASS' ssh ${VPS_USER}@${VPS_HOST} 'docker logs agistaffers-homepage'"
echo "3. Monitor: sshpass -p '$VPS_PASS' ssh ${VPS_USER}@${VPS_HOST} 'docker stats agistaffers-homepage'"