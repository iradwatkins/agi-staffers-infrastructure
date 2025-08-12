#!/bin/bash

# Deploy Workers using OAuth authentication
echo "🚀 Deploying Cloudflare Workers with OAuth authentication"
echo ""
echo "This will open a browser window to authenticate with Cloudflare."
echo "Please login when prompted."
echo ""

# Remove API token to use OAuth
unset CLOUDFLARE_API_TOKEN

# Login to Wrangler
echo "Logging in to Cloudflare..."
wrangler login

echo ""
echo "Now deploying Workers..."

# Deploy API Gateway
echo "📦 Deploying API Gateway..."
cd api-gateway
wrangler deploy --env production
cd ..

# Deploy Metrics Cache  
echo "📦 Deploying Metrics Cache..."
cd metrics-cache
wrangler deploy --env production
cd ..

# Deploy Push Router
echo "📦 Deploying Push Router..."
cd push-router
wrangler deploy --env production
cd ..

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your Workers are now live at:"
echo "- API Gateway: https://api.agistaffers.com"
echo "- Metrics endpoint: https://api.agistaffers.com/api/metrics"
echo "- Push endpoint: https://api.agistaffers.com/api/push"