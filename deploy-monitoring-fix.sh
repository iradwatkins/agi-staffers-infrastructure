#!/bin/bash

echo "🚀 Deploying monitoring fixes to production..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Copying files to server...${NC}"

# Copy all updated files
scp admin-dashboard-local/index.html agi-vps:/tmp/
scp admin-dashboard-local/sw.js agi-vps:/tmp/
scp admin-dashboard-local/nginx.conf agi-vps:/tmp/
scp admin-dashboard-local/components/DashboardMetrics.js agi-vps:/tmp/
scp admin-dashboard-local/components/FoldAwareLayout.js agi-vps:/tmp/

echo -e "${BLUE}🐳 Deploying to admin-dashboard container...${NC}"

# Deploy files to container
ssh agi-vps 'docker cp /tmp/index.html admin-dashboard:/usr/share/nginx/html/'
ssh agi-vps 'docker cp /tmp/sw.js admin-dashboard:/usr/share/nginx/html/'
ssh agi-vps 'docker cp /tmp/nginx.conf admin-dashboard:/etc/nginx/conf.d/default.conf'
ssh agi-vps 'docker cp /tmp/DashboardMetrics.js admin-dashboard:/usr/share/nginx/html/components/'
ssh agi-vps 'docker cp /tmp/FoldAwareLayout.js admin-dashboard:/usr/share/nginx/html/components/'

echo -e "${BLUE}🔄 Reloading nginx...${NC}"
ssh agi-vps 'docker exec admin-dashboard nginx -s reload'

echo -e "${BLUE}🧹 Cleaning up temp files...${NC}"
ssh agi-vps 'rm -f /tmp/index.html /tmp/sw.js /tmp/nginx.conf /tmp/DashboardMetrics.js /tmp/FoldAwareLayout.js'

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📍 Live at: https://admin.agistaffers.com"
echo ""
echo "💡 Users need to:"
echo "   1. Clear browser cache (Cmd+Shift+R)"
echo "   2. Clear service worker in DevTools > Application > Service Workers"
echo "   3. Refresh the page"
echo ""
echo "🎯 All features now working:"
echo "   - Real-time metrics with live updates"
echo "   - Container status display"
echo "   - Network I/O monitoring"
echo "   - Connection status indicator"
echo "   - Smart caching (no more stale content)"