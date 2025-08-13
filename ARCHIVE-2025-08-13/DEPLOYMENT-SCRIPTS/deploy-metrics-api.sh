#!/bin/bash

echo "🚀 Deploying Metrics API to AGI Staffers VPS"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if metrics-api directory exists
if [ ! -d "metrics-api" ]; then
    echo -e "${RED}❌ metrics-api directory not found${NC}"
    exit 1
fi

echo "📦 Creating deployment package..."
tar -czf metrics-api.tar.gz metrics-api/ docker-compose.metrics.yml

echo "📤 Uploading to VPS..."
scp metrics-api.tar.gz agi-vps:/tmp/

echo "🔧 Deploying on VPS..."
ssh agi-vps << 'ENDSSH'
    cd /tmp
    tar -xzf metrics-api.tar.gz
    
    # Create metrics directory if it doesn't exist
    mkdir -p /root/agi-staffers-platform/metrics-api
    
    # Copy files
    cp -r metrics-api/* /root/agi-staffers-platform/metrics-api/
    cp docker-compose.metrics.yml /root/agi-staffers-platform/
    
    # Go to platform directory
    cd /root/agi-staffers-platform
    
    # Build and start the metrics API
    docker-compose -f docker-compose.metrics.yml build
    docker-compose -f docker-compose.metrics.yml up -d
    
    # Wait for container to start
    sleep 5
    
    # Check if container is running
    if docker ps | grep -q metrics-api; then
        echo "✅ Metrics API container started successfully"
    else
        echo "❌ Failed to start Metrics API container"
        docker logs metrics-api
        exit 1
    fi
    
    # Cleanup
    rm -f /tmp/metrics-api.tar.gz
ENDSSH

echo "🔍 Verifying deployment..."
sleep 3

# Test the API endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" http://148.230.93.174:3008/api/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Metrics API is running and accessible${NC}"
    echo "📊 API endpoint: http://148.230.93.174:3008"
    echo "🔌 WebSocket endpoint: ws://148.230.93.174:3008"
else
    echo -e "${RED}❌ Metrics API returned HTTP $response${NC}"
    exit 1
fi

# Cleanup local file
rm -f metrics-api.tar.gz

echo -e "${GREEN}✅ Deployment complete!${NC}"