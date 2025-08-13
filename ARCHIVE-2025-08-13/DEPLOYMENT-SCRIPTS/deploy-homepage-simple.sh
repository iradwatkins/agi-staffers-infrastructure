#!/bin/bash

# Simple deployment script for AGI Staffers Homepage
# Uses pre-built standalone output

echo "🚀 Deploying AGI Staffers Homepage (Simple Method)..."

# SSH to VPS and deploy
ssh root@72.60.28.175 << 'EOF'
set -e

echo "📦 Preparing deployment..."

# Stop and remove existing container
docker stop agistaffers-homepage 2>/dev/null || true
docker rm agistaffers-homepage 2>/dev/null || true

# Create deployment directory
mkdir -p /root/agistaffers-deploy
cd /root/agistaffers-deploy

# Pull the agistaffers-web image (already has the app)
echo "🐳 Using existing agistaffers-web image..."

# Run the container on port 3008
docker run -d \
  --name agistaffers-homepage \
  --restart unless-stopped \
  -p 3008:3000 \
  agistaffers-web:latest

# Configure Caddy for main domain
cat > /etc/caddy/sites/agistaffers.com << 'CADDY'
agistaffers.com {
    reverse_proxy localhost:3008
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    encode gzip
}

www.agistaffers.com {
    redir https://agistaffers.com{uri} permanent
}
CADDY

# Reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force

echo "✅ Deployment complete!"
echo "🌐 Homepage available at https://agistaffers.com"

# Check status
docker ps | grep agistaffers-homepage
EOF

echo "🎉 Done! Visit https://agistaffers.com"