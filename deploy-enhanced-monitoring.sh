#!/bin/bash

# Deploy Enhanced Monitoring Dashboard
# This script deploys the enhanced monitoring features to the VPS

set -e

echo "🚀 Deploying Enhanced Monitoring Dashboard..."
echo "=========================================="

# Configuration
VPS_HOST="148.230.93.174"
VPS_USER="root"

# Step 1: Upload enhanced monitoring files
echo "📤 Uploading enhanced monitoring module..."
scp admin-dashboard-local/monitoring-enhanced.js ${VPS_USER}@${VPS_HOST}:/var/www/admin-dashboard/

# Step 2: Upload enhanced metrics API
echo "📤 Uploading enhanced metrics API..."
scp services/metrics-api/server-enhanced.js ${VPS_USER}@${VPS_HOST}:/opt/services/metrics-api/

# Step 3: Update admin dashboard HTML
echo "📤 Updating admin dashboard..."
scp admin-dashboard-local/index.html ${VPS_USER}@${VPS_HOST}:/var/www/admin-dashboard/

# Step 4: Update metrics API on VPS
echo "🔄 Updating metrics API service..."
ssh ${VPS_USER}@${VPS_HOST} << 'EOF'
cd /opt/services/metrics-api

# Backup current server.js
cp server.js server-original.js

# Use enhanced version
cp server-enhanced.js server.js

# Restart metrics API container
docker restart metrics-api

# Copy files to admin dashboard container
docker cp /var/www/admin-dashboard/monitoring-enhanced.js admin-dashboard:/usr/share/nginx/html/
docker cp /var/www/admin-dashboard/index.html admin-dashboard:/usr/share/nginx/html/

# Restart admin dashboard to ensure clean state
docker restart admin-dashboard

echo "✅ Metrics API updated and restarted"
EOF

# Step 5: Verify deployment
echo ""
echo "🔍 Verifying deployment..."
sleep 5

# Check metrics API health
if curl -s https://admin.agistaffers.com:3009/api/health | grep -q "2.0.0"; then
    echo "✅ Enhanced Metrics API is running (v2.0.0)"
else
    echo "❌ Enhanced Metrics API check failed"
fi

# Check admin dashboard
if curl -s https://admin.agistaffers.com | grep -q "monitoring-enhanced.js"; then
    echo "✅ Enhanced monitoring module loaded"
else
    echo "❌ Enhanced monitoring module not found"
fi

echo ""
echo "🎉 Enhanced Monitoring Dashboard Deployed!"
echo "=========================================="
echo "📊 Dashboard: https://admin.agistaffers.com"
echo "🔗 New API endpoints available:"
echo "   - /api/metrics/analytics"
echo "   - /api/metrics/aggregate/:period"
echo "   - /api/metrics/export"
echo "   - /api/alerts/history"
echo ""
echo "📈 Features added:"
echo "   - Real-time predictions"
echo "   - Resource usage heatmap"
echo "   - Alert analytics"
echo "   - Container performance matrix"
echo "   - Data export functionality"