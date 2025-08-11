#!/bin/bash

# Deploy Real-time Metrics System
# This script deploys the complete metrics API and updates the admin dashboard

echo "🚀 Deploying Real-time Metrics System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="148.230.93.174"
SERVER_USER="root"
SERVER_ALIAS="agi-vps"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Build and upload metrics API
print_status "Building and uploading metrics API..."

# Create tarball of metrics API
tar -czf metrics-api.tar.gz -C services/metrics-api .

# Upload to server
scp metrics-api.tar.gz $SERVER_ALIAS:/root/
if [ $? -ne 0 ]; then
    print_error "Failed to upload metrics API"
    exit 1
fi

# Step 2: Extract and build on server
print_status "Setting up metrics API on server..."

ssh $SERVER_ALIAS << 'EOF'
# Create metrics API directory
mkdir -p /root/services/metrics-api
cd /root/services/metrics-api

# Extract files
tar -xzf /root/metrics-api.tar.gz

# Build Docker image
docker build -t metrics-api:latest .

# Check if container exists and stop it
if docker ps -a --format 'table {{.Names}}' | grep -q '^metrics-api$'; then
    echo "Stopping existing metrics-api container..."
    docker stop metrics-api
    docker rm metrics-api
fi

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

# Clean up
rm /root/metrics-api.tar.gz
EOF

if [ $? -ne 0 ]; then
    print_error "Failed to setup metrics API on server"
    exit 1
fi

print_success "Metrics API deployed successfully"

# Step 3: Update admin dashboard
print_status "Updating admin dashboard with real-time metrics..."

# Build updated dashboard
cd admin-dashboard-local
docker build -t admin-dashboard:latest .

# Upload new dashboard image
docker save admin-dashboard:latest | gzip | ssh $SERVER_ALIAS 'gunzip | docker load'

# Restart admin dashboard container
ssh $SERVER_ALIAS << 'EOF'
# Stop and restart admin dashboard
docker stop admin-dashboard
docker rm admin-dashboard

# Run updated dashboard
docker run -d \
  --name admin-dashboard \
  --restart unless-stopped \
  -p 3007:80 \
  admin-dashboard:latest

echo "✅ Admin dashboard updated"
EOF

if [ $? -ne 0 ]; then
    print_error "Failed to update admin dashboard"
    exit 1
fi

print_success "Admin dashboard updated successfully"

# Step 4: Update Caddy configuration
print_status "Updating Caddy configuration..."

# Upload updated Caddy config
scp caddy-push-api.conf $SERVER_ALIAS:/root/

# Update Caddy configuration
ssh $SERVER_ALIAS << 'EOF'
# Backup current Caddyfile
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)

# Update with new configuration
cp /root/caddy-push-api.conf /etc/caddy/Caddyfile

# Reload Caddy
caddy reload --config /etc/caddy/Caddyfile

echo "✅ Caddy configuration updated"
EOF

if [ $? -ne 0 ]; then
    print_warning "Caddy configuration update failed, but continuing..."
fi

# Step 5: Update Docker Compose for future deployments
print_status "Updating Docker Compose configuration..."

scp docker-compose-optimized.yml $SERVER_ALIAS:/root/docker-compose.yml

print_success "Docker Compose configuration updated"

# Step 6: Verify deployment
print_status "Verifying deployment..."

sleep 10

# Check API health
API_STATUS=$(ssh $SERVER_ALIAS 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3008/api/health')

if [ "$API_STATUS" = "200" ]; then
    print_success "Metrics API is responding (HTTP $API_STATUS)"
else
    print_error "Metrics API health check failed (HTTP $API_STATUS)"
fi

# Check dashboard
DASHBOARD_STATUS=$(ssh $SERVER_ALIAS 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3007')

if [ "$DASHBOARD_STATUS" = "200" ]; then
    print_success "Admin dashboard is responding (HTTP $DASHBOARD_STATUS)"
else
    print_error "Admin dashboard health check failed (HTTP $DASHBOARD_STATUS)"
fi

# Display container status
print_status "Container status:"
ssh $SERVER_ALIAS 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(metrics-api|admin-dashboard)"'

# Clean up local files
rm -f metrics-api.tar.gz

print_success "🎉 Real-time Metrics System deployed successfully!"
print_status "Accessible at:"
echo "  🔗 Admin Dashboard: https://admin.agistaffers.com"
echo "  🔗 Metrics API: https://admin.agistaffers.com/metrics-api/api/metrics"
echo "  🔗 WebSocket: wss://admin.agistaffers.com/ws"
echo ""
print_status "The system will now provide:"
echo "  ✅ Real-time metrics via WebSocket"
echo "  ✅ System resource monitoring"
echo "  ✅ Container performance tracking"
echo "  ✅ Automatic alerts and notifications"
echo "  ✅ Fallback to API polling if WebSocket fails"