#!/bin/bash

# Deploy Push Notification System Updates
# This script deploys the updated push API and service worker

set -e

echo "🔔 Deploying Push Notification System Updates..."

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
SSH_CMD="ssh ${VPS_USER}@${VPS_IP}"
SCP_CMD="scp"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Upload updated push API server
echo -e "${YELLOW}📤 Uploading updated push API server...${NC}"
$SCP_CMD admin-dashboard-local/push-api/server.js ${VPS_USER}@${VPS_IP}:/root/admin-dashboard-local/push-api/

# Step 2: Upload the new integrated service worker
echo -e "${YELLOW}📤 Uploading integrated service worker...${NC}"
$SCP_CMD agistaffers/public/sw-integrated.js ${VPS_USER}@${VPS_IP}:/root/agistaffers/public/

# Step 3: Create backup of existing service worker
echo -e "${YELLOW}💾 Creating backup of existing service worker...${NC}"
$SSH_CMD "cp /root/agistaffers/public/sw.js /root/agistaffers/public/sw.js.backup-$(date +%Y%m%d-%H%M%S) || true"

# Step 4: Replace service worker with integrated version
echo -e "${YELLOW}🔄 Replacing service worker...${NC}"
$SSH_CMD "cp /root/agistaffers/public/sw-integrated.js /root/agistaffers/public/sw.js"

# Step 5: Update admin dashboard container
echo -e "${YELLOW}🐳 Updating admin dashboard container...${NC}"
$SSH_CMD "docker cp /root/agistaffers/public/sw.js admin-dashboard:/usr/share/nginx/html/"
$SSH_CMD "docker cp /root/agistaffers/public/sw-push-handler.js admin-dashboard:/usr/share/nginx/html/"

# Step 6: Restart push API server
echo -e "${YELLOW}🔄 Restarting push API server...${NC}"
$SSH_CMD "cd /root/admin-dashboard-local/push-api && pm2 restart push-api || pm2 start server.js --name push-api"

# Step 7: Clear service worker cache on clients
echo -e "${YELLOW}📱 Service worker will auto-update on client browsers...${NC}"

# Step 8: Test push API endpoints
echo -e "${YELLOW}🧪 Testing push API endpoints...${NC}"
echo "Testing health endpoint..."
curl -s https://admin.agistaffers.com/api/push/health || echo "Push API proxy not configured yet"

# Step 9: Create notification test script
echo -e "${YELLOW}📝 Creating notification test script on VPS...${NC}"
cat << 'EOF' | $SSH_CMD "cat > /root/test-push-notifications.sh"
#!/bin/bash

# Test Push Notification System
echo "🧪 Testing Push Notification System..."

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3011/health | jq .

# Test high CPU notification (replace with actual user ID)
echo -e "\n2. Testing high CPU notification..."
curl -X POST http://localhost:3011/api/notify/high-cpu \
  -H "Content-Type: application/json" \
  -d '{
    "usage": 85,
    "threshold": 80,
    "containerName": "test-container"
  }'

echo -e "\n✅ Tests complete. Check browser for notifications."
EOF

$SSH_CMD "chmod +x /root/test-push-notifications.sh"

# Step 10: Update Caddy configuration for push API proxy
echo -e "${YELLOW}🔧 Checking Caddy configuration...${NC}"
$SSH_CMD "grep -q 'push-api:3011' /etc/caddy/Caddyfile || echo 'Note: Add push API proxy to Caddy configuration'"

echo -e "${GREEN}✅ Push Notification System deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure Caddy is configured to proxy /api/push/* to push-api:3011"
echo "2. Test notifications using: ssh root@${VPS_IP} ./test-push-notifications.sh"
echo "3. Clear browser cache and re-register for notifications"
echo "4. Monitor push API logs: ssh root@${VPS_IP} 'pm2 logs push-api'"