#!/bin/bash

# AGI Staffers Cloudflare Workers Deployment Script
# Deploys all workers to production

echo "🚀 Starting Cloudflare Workers deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed!${NC}"
    echo "Please install it with: npm install -g wrangler"
    exit 1
fi

# Check if logged in
echo "Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare${NC}"
    echo "Please run: wrangler login"
    exit 1
fi

echo -e "${GREEN}✅ Authenticated with Cloudflare${NC}"

# Function to deploy a worker
deploy_worker() {
    local worker_dir=$1
    local worker_name=$2
    
    echo -e "\n${YELLOW}📦 Deploying ${worker_name}...${NC}"
    
    if [ -d "$worker_dir" ]; then
        cd "$worker_dir" || exit
        
        # Check if wrangler.toml exists
        if [ ! -f "wrangler.toml" ]; then
            echo -e "${RED}❌ wrangler.toml not found in $worker_dir${NC}"
            cd ..
            return 1
        fi
        
        # Check for placeholder KV IDs
        if grep -q "YOUR_.*_KV_ID" wrangler.toml; then
            echo -e "${RED}❌ Please update KV namespace IDs in $worker_dir/wrangler.toml${NC}"
            echo "Run 'wrangler kv:namespace create' commands first"
            cd ..
            return 1
        fi
        
        # Deploy the worker
        if wrangler deploy; then
            echo -e "${GREEN}✅ Successfully deployed ${worker_name}${NC}"
        else
            echo -e "${RED}❌ Failed to deploy ${worker_name}${NC}"
            cd ..
            return 1
        fi
        
        cd ..
    else
        echo -e "${RED}❌ Directory $worker_dir not found${NC}"
        return 1
    fi
}

# Deploy all workers
echo -e "\n${YELLOW}🔧 Deploying all workers...${NC}"

deploy_worker "api-gateway" "API Gateway"
deploy_worker "metrics-cache" "Metrics Cache"
deploy_worker "push-router" "Push Router"

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up Cloudflare Pages for the admin dashboard"
echo "2. Configure Page Rules in Cloudflare dashboard"
echo "3. Test your endpoints:"
echo "   - https://api.agistaffers.com/api/metrics"
echo "   - https://api.agistaffers.com/api/push/subscriptions"
echo ""
echo "Check the dashboard for analytics and logs."