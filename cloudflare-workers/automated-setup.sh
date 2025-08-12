#!/bin/bash

# Automated Cloudflare Setup Script
# Uses Cloudflare API to set up Workers and KV namespaces

echo "🚀 Automated Cloudflare Setup"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ CLOUDFLARE_API_TOKEN not set${NC}"
    echo ""
    echo "To get your API token:"
    echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use template: 'Edit Cloudflare Workers'"
    echo "4. Add permissions:"
    echo "   - Account: Cloudflare Workers Scripts:Edit"
    echo "   - Account: Workers KV Storage:Edit"
    echo "   - Zone: DNS:Edit (for agistaffers.com)"
    echo "5. Export the token:"
    echo "   export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

# Get account ID
echo -e "${YELLOW}Getting account information...${NC}"
ACCOUNT_INFO=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

ACCOUNT_ID=$(echo $ACCOUNT_INFO | jq -r '.result[0].id')

if [ "$ACCOUNT_ID" == "null" ] || [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ Failed to get account ID${NC}"
    echo "Response: $ACCOUNT_INFO"
    exit 1
fi

echo -e "${GREEN}✅ Account ID: $ACCOUNT_ID${NC}"

# Get zone ID for agistaffers.com
echo -e "${YELLOW}Getting zone information...${NC}"
ZONE_INFO=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=agistaffers.com" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo $ZONE_INFO | jq -r '.result[0].id')

if [ "$ZONE_ID" == "null" ] || [ -z "$ZONE_ID" ]; then
    echo -e "${RED}❌ Failed to get zone ID for agistaffers.com${NC}"
    echo "Make sure agistaffers.com is added to your Cloudflare account"
    exit 1
fi

echo -e "${GREEN}✅ Zone ID: $ZONE_ID${NC}"

# Function to create KV namespace
create_kv_namespace() {
    local name=$1
    echo -e "${YELLOW}Creating KV namespace: $name...${NC}"
    
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "{\"title\":\"$name\"}")
    
    KV_ID=$(echo $RESPONSE | jq -r '.result.id')
    
    if [ "$KV_ID" != "null" ] && [ -n "$KV_ID" ]; then
        echo -e "${GREEN}✅ Created $name: $KV_ID${NC}"
        echo "$KV_ID"
    else
        echo -e "${RED}❌ Failed to create $name${NC}"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Create all KV namespaces
echo ""
echo -e "${BLUE}Creating KV Namespaces...${NC}"
RATE_LIMIT_ID=$(create_kv_namespace "RATE_LIMIT")
AUTH_TOKENS_ID=$(create_kv_namespace "AUTH_TOKENS")
METRICS_CACHE_ID=$(create_kv_namespace "METRICS_CACHE")
PUSH_SUBSCRIPTIONS_ID=$(create_kv_namespace "PUSH_SUBSCRIPTIONS")

# Update wrangler.toml files with actual IDs
echo ""
echo -e "${BLUE}Updating configuration files...${NC}"

# Update api-gateway/wrangler.toml
sed -i.bak "s/YOUR_RATE_LIMIT_KV_ID/$RATE_LIMIT_ID/g" api-gateway/wrangler.toml
sed -i.bak "s/YOUR_AUTH_TOKENS_KV_ID/$AUTH_TOKENS_ID/g" api-gateway/wrangler.toml

# Update metrics-cache/wrangler.toml
sed -i.bak "s/YOUR_METRICS_CACHE_KV_ID/$METRICS_CACHE_ID/g" metrics-cache/wrangler.toml

# Update push-router/wrangler.toml
sed -i.bak "s/YOUR_PUSH_SUBSCRIPTIONS_KV_ID/$PUSH_SUBSCRIPTIONS_ID/g" push-router/wrangler.toml

echo -e "${GREEN}✅ Configuration files updated${NC}"

# Create DNS record for api subdomain
echo ""
echo -e "${BLUE}Creating DNS record for api.agistaffers.com...${NC}"

# Check if record already exists
EXISTING_RECORD=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=api.agistaffers.com" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

RECORD_EXISTS=$(echo $EXISTING_RECORD | jq -r '.result | length')

if [ "$RECORD_EXISTS" -gt "0" ]; then
    echo -e "${YELLOW}⚠️  DNS record already exists for api.agistaffers.com${NC}"
else
    # Create DNS record
    DNS_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data '{
        "type": "A",
        "name": "api",
        "content": "72.60.28.175",
        "ttl": 1,
        "proxied": true
      }')
    
    DNS_SUCCESS=$(echo $DNS_RESPONSE | jq -r '.success')
    
    if [ "$DNS_SUCCESS" == "true" ]; then
        echo -e "${GREEN}✅ Created DNS record for api.agistaffers.com${NC}"
    else
        echo -e "${RED}❌ Failed to create DNS record${NC}"
        echo "Response: $DNS_RESPONSE"
    fi
fi

# Summary
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "KV Namespace IDs:"
echo "  RATE_LIMIT: $RATE_LIMIT_ID"
echo "  AUTH_TOKENS: $AUTH_TOKENS_ID"
echo "  METRICS_CACHE: $METRICS_CACHE_ID"
echo "  PUSH_SUBSCRIPTIONS: $PUSH_SUBSCRIPTIONS_ID"
echo ""
echo "Next steps:"
echo "1. Deploy the workers: ./deploy-all.sh"
echo "2. Set up Cloudflare Pages for admin dashboard"
echo ""
echo "Your API will be available at: https://api.agistaffers.com"