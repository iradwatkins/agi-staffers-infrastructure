#!/bin/bash

# Deploy Real-time Metrics System - Fixed Version
echo "🚀 Deploying Real-time Metrics System (Fixed)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
SERVER_ALIAS="agi-vps"

# Step 1: Build and deploy metrics API
print_status "Building and deploying metrics API..."

# Upload metrics API files
scp -r services/metrics-api $SERVER_ALIAS:/root/services/
ssh $SERVER_ALIAS << 'EOF'
cd /root/services/metrics-api

# Build Docker image
docker build -t metrics-api:latest .

# Stop existing container if running
docker stop metrics-api 2>/dev/null || true
docker rm metrics-api 2>/dev/null || true

# Run new container with necessary permissions
docker run -d \
  --name metrics-api \
  --restart unless-stopped \
  -p 3008:3008 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  --privileged \
  metrics-api:latest

echo "✅ Metrics API container started"
EOF

if [ $? -ne 0 ]; then
    print_error "Failed to deploy metrics API"
    exit 1
fi

print_success "Metrics API deployed successfully"

# Step 2: Build and deploy admin dashboard
print_status "Building and deploying admin dashboard..."

# Build dashboard locally first
cd admin-dashboard-local
docker build -t admin-dashboard:latest .
cd ..

# Upload dashboard image
docker save admin-dashboard:latest | gzip | ssh $SERVER_ALIAS 'gunzip | docker load'

# Restart admin dashboard
ssh $SERVER_ALIAS << 'EOF'
# Stop and restart admin dashboard
docker stop admin-dashboard 2>/dev/null || true
docker rm admin-dashboard 2>/dev/null || true

# Run updated dashboard
docker run -d \
  --name admin-dashboard \
  --restart unless-stopped \
  -p 3007:80 \
  admin-dashboard:latest

echo "✅ Admin dashboard updated"
EOF

print_success "Admin dashboard deployed successfully"

# Step 3: Update Caddy configuration for metrics API
print_status "Updating Caddy configuration..."

# Create updated Caddyfile
cat > /tmp/Caddyfile << 'CADDY_EOF'
# AGI Staffers Infrastructure - Complete Configuration
{
    email bobby.watkins@agi-staffers.com
}

# Main website
stepperslife.com {
    reverse_proxy localhost:3006
    encode gzip
}

# Admin Dashboard with Metrics API and Push API
admin.agistaffers.com {
    handle /push-api/* {
        uri strip_prefix /push-api
        reverse_proxy localhost:3011
    }
    handle /metrics-api/* {
        uri strip_prefix /metrics-api
        reverse_proxy localhost:3008
    }
    handle /ws {
        reverse_proxy localhost:3008
    }
    handle {
        reverse_proxy localhost:3007
    }
    encode gzip
}

# Database Management
pgadmin.agistaffers.com {
    reverse_proxy localhost:5050
    encode gzip
}

# Workflow Automation
n8n.agistaffers.com {
    reverse_proxy localhost:5678
    encode gzip
}

# AI Chat Interface
chat.agistaffers.com {
    reverse_proxy localhost:3000
    encode gzip
}

# AI Workflow Builder
flowise.agistaffers.com {
    reverse_proxy localhost:3001
    encode gzip
}

# Container Management
portainer.agistaffers.com {
    reverse_proxy localhost:9000
    encode gzip
}

# Search Engine
searxng.agistaffers.com {
    reverse_proxy localhost:8090
    encode gzip
}
CADDY_EOF

# Upload and apply Caddyfile
scp /tmp/Caddyfile $SERVER_ALIAS:/tmp/
ssh $SERVER_ALIAS << 'EOF'
# Backup current Caddyfile
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Install new Caddyfile
mkdir -p /etc/caddy
cp /tmp/Caddyfile /etc/caddy/Caddyfile

# Find and restart caddy
if docker ps --format 'table {{.Names}}' | grep -q 'caddy'; then
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile || true
elif systemctl is-active --quiet caddy; then
    systemctl reload caddy
elif command -v caddy >/dev/null 2>&1; then
    caddy reload --config /etc/caddy/Caddyfile
else
    echo "⚠️ Could not find caddy to reload configuration"
fi

echo "✅ Caddy configuration updated"
EOF

print_success "Caddy configuration updated"

# Step 4: Verify deployment
print_status "Verifying deployment..."

sleep 5

# Check metrics API
print_status "Checking metrics API..."
API_STATUS=$(ssh $SERVER_ALIAS 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3008/api/health 2>/dev/null || echo "000"')

if [ "$API_STATUS" = "200" ]; then
    print_success "Metrics API is responding (HTTP $API_STATUS)"
else
    print_error "Metrics API health check failed (HTTP $API_STATUS)"
fi

# Check dashboard
print_status "Checking admin dashboard..."
DASHBOARD_STATUS=$(ssh $SERVER_ALIAS 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3007 2>/dev/null || echo "000"')

if [ "$DASHBOARD_STATUS" = "200" ]; then
    print_success "Admin dashboard is responding (HTTP $DASHBOARD_STATUS)"
else
    print_error "Admin dashboard health check failed (HTTP $DASHBOARD_STATUS)"
fi

# Display container status
print_status "Container status:"
ssh $SERVER_ALIAS 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(metrics-api|admin-dashboard|caddy)" | head -10'

# Clean up
rm -f /tmp/Caddyfile

print_success "🎉 Real-time Metrics System deployment completed!"
print_status "Access points:"
echo "  🔗 Admin Dashboard: https://admin.agistaffers.com"
echo "  🔗 Metrics API: https://admin.agistaffers.com/metrics-api/api/metrics"
echo "  🔗 WebSocket: wss://admin.agistaffers.com/ws"
echo ""
print_status "New features available:"
echo "  ✅ Real-time system metrics via WebSocket"
echo "  ✅ Container performance monitoring"
echo "  ✅ Configurable alert thresholds"
echo "  ✅ Browser and push notifications"
echo "  ✅ Automatic fallback to API polling"
echo ""
print_status "Next steps:"
echo "  1. Visit https://admin.agistaffers.com"
echo "  2. Click 'Alert Settings' to configure thresholds"  
echo "  3. Enable notifications for real-time alerts"
echo "  4. Monitor your infrastructure in real-time!"