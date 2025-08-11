#!/bin/bash

# Complete Admin Dashboard Deployment Script
# This ensures all files are properly deployed and caches are cleared

echo "🚀 Starting complete admin dashboard deployment..."

# Copy all files to VPS
echo "📦 Copying admin-dashboard-local to VPS..."
scp -r admin-dashboard-local root@72.60.28.175:/root/admin-dashboard-deploy

# SSH to VPS and deploy
ssh root@72.60.28.175 << 'EOF'
echo "🔧 Deploying on VPS..."

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop admin-dashboard 2>/dev/null || true
docker rm admin-dashboard 2>/dev/null || true

# Build new image with cache bust
echo "🏗️ Building new image..."
cd /root/admin-dashboard-deploy

# Update service worker version to force cache refresh
TIMESTAMP=$(date +%s)
sed -i "s/const CACHE_VERSION = '[^']*'/const CACHE_VERSION = '2.5.$TIMESTAMP'/" sw.js

# Build and run container
docker build -t admin-dashboard:latest --no-cache .
docker run -d \
  --name admin-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  admin-dashboard:latest

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check container status
docker ps | grep admin-dashboard

echo "✅ Deployment complete!"
echo "🔍 Verification steps:"
echo "1. Visit https://admin.agistaffers.com"
echo "2. Press Cmd+Shift+R to hard refresh"
echo "3. Clear service worker in DevTools > Application > Service Workers"
echo "4. Look for 'System Performance' section with theme toggle"

# Clean up
rm -rf /root/admin-dashboard-deploy
EOF

echo "🎉 Deployment script completed!"