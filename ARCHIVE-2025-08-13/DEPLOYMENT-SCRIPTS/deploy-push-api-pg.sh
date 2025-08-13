#!/bin/bash

# Deploy Push Notification API with PostgreSQL to VPS
echo "🚀 Deploying Push Notification API with PostgreSQL..."
echo "=================================================="

# Configuration
VPS_HOST="agi-vps"
VPS_IP="148.230.93.174"
REMOTE_DIR="/root/push-notification-api"
CONTAINER_NAME="push-notification-api"
IMAGE_NAME="agi-push-api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we can connect to VPS
echo -e "${YELLOW}Checking VPS connection...${NC}"
ssh -o ConnectTimeout=5 $VPS_HOST "echo 'Connected'" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}Cannot connect to VPS. Please check your SSH configuration.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ VPS connection successful${NC}"

# Step 1: Prepare PostgreSQL version locally
echo -e "\n${YELLOW}Step 1: Preparing PostgreSQL version...${NC}"
cd push-notification-api
cp server-pg.js server.js
echo -e "${GREEN}✓ PostgreSQL server activated${NC}"

# Step 2: Update .env with database configuration
echo -e "\n${YELLOW}Step 2: Configuring database connection...${NC}"
cat > .env.production << EOF
NODE_ENV=production
PORT=3011
VAPID_PUBLIC_KEY=BCQLKtKr-hK9kVXSXoMX_8NPMZhTLfQzZGMFQdkC8sWJOVf-uu8sCwBIMz_Kwjow4HywIDjnAa5J4AwnJR7eli8
VAPID_PRIVATE_KEY=_qAK99oqPXnkPBzuwcPGXUrOA_ZPMbk7rf3Gp6ae6fo
VAPID_EMAIL=mailto:admin@agistaffers.com

# PostgreSQL Configuration
DB_HOST=postgresql
DB_PORT=5432
DB_NAME=stepperslife
DB_USER=postgres
DB_PASSWORD=postgres
EOF
echo -e "${GREEN}✓ Database configuration created${NC}"

# Step 3: Upload files to VPS
echo -e "\n${YELLOW}Step 3: Uploading files to VPS...${NC}"
scp server.js database.js package.json Dockerfile test-notification.js $VPS_HOST:$REMOTE_DIR/
scp .env.production $VPS_HOST:$REMOTE_DIR/.env
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Files uploaded successfully${NC}"
else
    echo -e "${RED}✗ File upload failed${NC}"
    exit 1
fi

# Step 4: Build and deploy on VPS
echo -e "\n${YELLOW}Step 4: Building and deploying on VPS...${NC}"
ssh $VPS_HOST << 'EOF'
set -e

cd /root/push-notification-api

# Install pg module in container build
echo "Updating package.json for PostgreSQL..."
npm install --save pg

# Build new image
echo "Building Docker image..."
docker build -t agi-push-api:pg .

# Test the new image
echo "Testing new image..."
docker run -d --name push-api-test \
  --network agi-network \
  -p 3099:3011 \
  --env-file .env \
  agi-push-api:pg

sleep 5

# Check if test container is healthy
if docker exec push-api-test curl -f http://localhost:3011/health | grep -q "AGI Push Notification API"; then
    echo "✓ New image tested successfully"
    
    # Check database connection
    if docker exec push-api-test curl -s http://localhost:3011/health | jq -r '.database.connected' | grep -q "true"; then
        echo "✓ Database connection verified"
    else
        echo "⚠️  Warning: Database connection not available, will use in-memory storage"
    fi
    
    # Stop and remove test container
    docker stop push-api-test && docker rm push-api-test
    
    # Deploy new version
    echo "Deploying new version..."
    docker stop push-notification-api || true
    docker rm push-notification-api || true
    
    # Tag and run production container
    docker tag agi-push-api:pg agi-push-api:latest
    docker run -d \
      --name push-notification-api \
      --restart unless-stopped \
      --network agi-network \
      -p 3011:3011 \
      --env-file .env \
      agi-push-api:latest
    
    # Initialize database tables
    echo "Initializing database tables..."
    sleep 3
    docker logs push-notification-api | tail -20
    
    echo "✓ Deployment successful"
else
    echo "✗ Health check failed"
    docker stop push-api-test && docker rm push-api-test
    docker rmi agi-push-api:pg
    exit 1
fi
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment completed successfully${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi

# Step 5: Verify deployment
echo -e "\n${YELLOW}Step 5: Verifying deployment...${NC}"
sleep 5

# Check container status
echo "Checking container status..."
ssh $VPS_HOST "docker ps | grep $CONTAINER_NAME" || {
    echo -e "${RED}✗ Container not running${NC}"
    exit 1
}

# Check API health
echo "Checking API health..."
HEALTH_RESPONSE=$(curl -s https://admin.agistaffers.com/push-api/health)
echo "$HEALTH_RESPONSE" | jq . || {
    echo -e "${RED}✗ API health check failed${NC}"
    exit 1
}

# Check database status
DB_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.database.connected')
if [ "$DB_STATUS" = "true" ]; then
    echo -e "${GREEN}✓ Database connected and tables initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Database not connected - using in-memory storage${NC}"
    echo "Database error: $(echo "$HEALTH_RESPONSE" | jq -r '.database.error')"
fi

# Final summary
echo -e "\n${GREEN}✅ Push Notification API deployed with PostgreSQL support!${NC}"
echo "=================================================="
echo -e "${YELLOW}API Endpoints:${NC}"
echo "  Health: https://admin.agistaffers.com/push-api/health"
echo "  Subscribe: POST https://admin.agistaffers.com/push-api/api/subscribe"
echo "  Preferences: POST https://admin.agistaffers.com/push-api/api/preferences"
echo "  History: GET https://admin.agistaffers.com/push-api/api/history/{userId}"
echo "  Broadcast: POST https://admin.agistaffers.com/push-api/api/broadcast"
echo -e "\n${YELLOW}Database Features:${NC}"
echo "  ✓ Persistent subscription storage"
echo "  ✓ User preference management"
echo "  ✓ Notification history tracking"
echo "  ✓ Automatic cleanup of expired subscriptions"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "  1. Test notifications in browser"
echo "  2. Monitor logs: ssh $VPS_HOST 'docker logs -f $CONTAINER_NAME'"
echo "  3. Check subscriptions: curl https://admin.agistaffers.com/push-api/api/subscriptions"
echo "  4. View database: pgAdmin at https://pgadmin.agistaffers.com"

# Return to parent directory
cd ..