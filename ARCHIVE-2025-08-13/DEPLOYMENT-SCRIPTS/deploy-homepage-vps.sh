#!/bin/bash

# VPS deployment script for AGI Staffers Homepage
# This script will be uploaded and executed on the VPS

set -e

echo "🚀 Starting AGI Staffers Homepage deployment on VPS..."

# Configuration
PROJECT_NAME="agistaffers-homepage"
CONTAINER_NAME="agistaffers-homepage"
CONTAINER_PORT="3008"
DEPLOYMENT_DIR="/root/agistaffers-homepage"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up deployment directory...${NC}"
mkdir -p $DEPLOYMENT_DIR
cd $DEPLOYMENT_DIR

echo -e "${YELLOW}Cloning from GitHub...${NC}"
# Remove existing directory if it exists
rm -rf agistaffers-temp
# Clone the repository
git clone https://github.com/watkinslabs/agi-staffers.git agistaffers-temp || {
    echo -e "${RED}Failed to clone repository. Please check GitHub access.${NC}"
    exit 1
}

# Copy only the agistaffers Next.js app
cp -r agistaffers-temp/agistaffers/* $DEPLOYMENT_DIR/
rm -rf agistaffers-temp

echo -e "${YELLOW}Creating production Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
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

# Generate Prisma client if needed
RUN if [ -f "prisma/schema.prisma" ]; then pnpm prisma generate; fi

RUN pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files - using Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3008
ENV PORT 3008
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

echo -e "${YELLOW}Creating .env.production file...${NC}"
cat > .env.production << 'EOF'
# Production environment variables
NODE_ENV=production
NEXTAUTH_URL=https://agistaffers.com
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agistaffers
EOF

echo -e "${YELLOW}Stopping existing container if running...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $CONTAINER_NAME:latest .

echo -e "${YELLOW}Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    --network host \
    -p $CONTAINER_PORT:$CONTAINER_PORT \
    -e DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agistaffers" \
    -e NEXTAUTH_URL="https://agistaffers.com" \
    -e NEXTAUTH_SECRET="your-secret-here" \
    $CONTAINER_NAME:latest

echo -e "${YELLOW}Updating Caddy configuration...${NC}"
# Ensure sites directory exists
mkdir -p /etc/caddy/sites

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
    
    # Handle API routes
    handle /api/* {
        reverse_proxy localhost:3008
    }
}

www.agistaffers.com {
    redir https://agistaffers.com{uri} permanent
}
EOF

echo -e "${YELLOW}Reloading Caddy...${NC}"
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force

echo -e "${YELLOW}Checking deployment status...${NC}"
sleep 5
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Container is running!${NC}"
    docker ps | grep $CONTAINER_NAME
else
    echo -e "${RED}❌ Container failed to start. Checking logs...${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo -e "${GREEN}🎉 AGI Staffers Homepage deployed successfully!${NC}"
echo -e "${GREEN}Website is now live at: https://agistaffers.com${NC}"
echo ""
echo "Useful commands:"
echo "- Check logs: docker logs $CONTAINER_NAME"
echo "- Monitor: docker stats $CONTAINER_NAME"
echo "- Restart: docker restart $CONTAINER_NAME"