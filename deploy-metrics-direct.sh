#!/bin/bash

echo "🚀 Deploying Metrics API to AGI Staffers VPS (Direct Docker)"
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
tar -czf metrics-api.tar.gz metrics-api/

echo "📤 Uploading to VPS..."
scp metrics-api.tar.gz agi-vps:/tmp/

echo "🔧 Deploying on VPS..."
ssh agi-vps << 'ENDSSH'
    cd /tmp
    tar -xzf metrics-api.tar.gz
    
    # Stop and remove existing container if it exists
    docker stop metrics-api 2>/dev/null || true
    docker rm metrics-api 2>/dev/null || true
    
    # Build the image
    cd metrics-api
    docker build -t agi-metrics-api .
    
    # Run the container
    docker run -d \
        --name metrics-api \
        --restart unless-stopped \
        -p 3009:3009 \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        -e NODE_ENV=production \
        -e PORT=3009 \
        --network agi-network \
        agi-metrics-api
    
    # Wait for container to start
    sleep 5
    
    # Check if container is running
    if docker ps | grep -q metrics-api; then
        echo "✅ Metrics API container started successfully"
        docker logs metrics-api --tail 10
    else
        echo "❌ Failed to start Metrics API container"
        docker logs metrics-api
        exit 1
    fi
    
    # Cleanup
    rm -rf /tmp/metrics-api*
ENDSSH

echo "🔍 Verifying deployment..."
sleep 3

# Test the API endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" http://148.230.93.174:3009/api/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Metrics API is running and accessible${NC}"
    echo "📊 API endpoint: http://148.230.93.174:3009"
    echo "🔌 WebSocket endpoint: ws://148.230.93.174:3009"
    
    # Test metrics endpoint
    echo ""
    echo "📈 Testing metrics endpoint..."
    curl -s http://148.230.93.174:3009/api/metrics | jq '.system' 2>/dev/null || echo "Metrics endpoint working!"
else
    echo -e "${RED}❌ Metrics API returned HTTP $response${NC}"
    exit 1
fi

# Cleanup local file
rm -f metrics-api.tar.gz

echo -e "${GREEN}✅ Deployment complete!${NC}"