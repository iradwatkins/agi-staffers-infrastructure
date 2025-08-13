#!/bin/bash

echo "🚀 SteppersLife Production Fix Deployment Script"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_IP="148.230.93.174"
PROJECT_PATH="/root/stepperslife"

echo -e "${YELLOW}Step 1: Uploading fix script to production server...${NC}"

# Upload the fix script
scp fix-build-extensions.js root@${SERVER_IP}:${PROJECT_PATH}/

echo -e "${YELLOW}Step 2: Executing fix on production server...${NC}"

# Execute the fix on the server
ssh root@${SERVER_IP} << 'EOF'
cd /root/stepperslife

echo "📍 Current location: $(pwd)"
echo "📁 Current files in project:"
ls -la

echo "🔧 Making fix script executable..."
chmod +x fix-build-extensions.js

echo "📦 Updating package.json build script..."
npm pkg set scripts.build="vite build && node fix-build-extensions.js"

echo "🧹 Cleaning old build artifacts..."
rm -rf dist
rm -rf node_modules/.vite

echo "🏗️  Running new build process..."
npm run build

echo "✅ Checking build output:"
echo "Files in dist/assets/:"
ls -la dist/assets/ | head -10

echo "Checking for any remaining .tsx files:"
find dist -name "*.tsx" -type f

echo "🔍 Checking HTML references:"
grep -r "\.tsx" dist/ || echo "No .tsx references found in HTML - Good!"

echo "📊 Build verification complete!"
EOF

echo -e "${GREEN}✅ Deployment script completed!${NC}"
echo -e "${YELLOW}Next: Restart your Docker container/service${NC}"
echo "Run: ssh root@${SERVER_IP} 'cd /root/stepperslife && docker-compose restart'"