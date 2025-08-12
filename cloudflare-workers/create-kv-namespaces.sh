#!/bin/bash

# Script to create all required KV namespaces for AGI Staffers

echo "🔧 Creating Cloudflare KV Namespaces..."

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
echo ""

# Create namespaces and capture IDs
echo "Creating KV namespaces..."
echo "Please save these IDs for your wrangler.toml files:"
echo ""

echo -e "${YELLOW}1. Creating RATE_LIMIT namespace...${NC}"
wrangler kv:namespace create "RATE_LIMIT"
echo ""

echo -e "${YELLOW}2. Creating AUTH_TOKENS namespace...${NC}"
wrangler kv:namespace create "AUTH_TOKENS"
echo ""

echo -e "${YELLOW}3. Creating METRICS_CACHE namespace...${NC}"
wrangler kv:namespace create "METRICS_CACHE"
echo ""

echo -e "${YELLOW}4. Creating PUSH_SUBSCRIPTIONS namespace...${NC}"
wrangler kv:namespace create "PUSH_SUBSCRIPTIONS"
echo ""

echo -e "${GREEN}✅ All namespaces created!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy the namespace IDs from above"
echo "2. Update each wrangler.toml file with the corresponding IDs:"
echo "   - api-gateway/wrangler.toml → RATE_LIMIT and AUTH_TOKENS IDs"
echo "   - metrics-cache/wrangler.toml → METRICS_CACHE ID"
echo "   - push-router/wrangler.toml → PUSH_SUBSCRIPTIONS ID"
echo "3. Run ./deploy-all.sh to deploy the workers"