#!/bin/bash

# PWA Deployment Script
# This script deploys your PWA to a production server

# Configuration
DOMAIN="yourdomain.com"
SERVER_USER="root"
SERVER_HOST="your-server-ip"
REMOTE_PATH="/var/www/pwa"
API_PATH="/opt/pwa-push-api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 PWA Deployment Script"
echo "======================="

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Build frontend
echo -e "\n${YELLOW}Step 1: Preparing frontend files${NC}"
cd ../../frontend
tar -czf pwa-frontend.tar.gz *.js manifest.json
cd ../icons
tar -czf pwa-icons.tar.gz *.png *.ico
cd ../backend/deployment
check_status "Frontend files prepared"

# Step 2: Upload files
echo -e "\n${YELLOW}Step 2: Uploading files to server${NC}"
scp ../../frontend/pwa-frontend.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/
scp ../../icons/pwa-icons.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/
scp -r ../push-api ${SERVER_USER}@${SERVER_HOST}:/tmp/
check_status "Files uploaded"

# Step 3: Deploy on server
echo -e "\n${YELLOW}Step 3: Deploying on server${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
# Create directories
mkdir -p /var/www/pwa
mkdir -p /opt/pwa-push-api

# Extract frontend files
cd /var/www/pwa
tar -xzf /tmp/pwa-frontend.tar.gz
tar -xzf /tmp/pwa-icons.tar.gz

# Set permissions
chown -R www-data:www-data /var/www/pwa
chmod -R 755 /var/www/pwa

# Deploy API
rm -rf /opt/pwa-push-api/*
mv /tmp/push-api/* /opt/pwa-push-api/
cd /opt/pwa-push-api

# Install dependencies and build
npm install --production
docker build -t pwa-push-api .

# Stop existing container
docker stop pwa-push-api 2>/dev/null || true
docker rm pwa-push-api 2>/dev/null || true

# Start new container
docker run -d \
  --name pwa-push-api \
  --restart unless-stopped \
  -p 3011:3011 \
  --env-file .env \
  pwa-push-api

# Clean up
rm -f /tmp/pwa-*.tar.gz
rm -rf /tmp/push-api

echo "Deployment completed on server"
ENDSSH

check_status "Server deployment"

# Step 4: Configure web server
echo -e "\n${YELLOW}Step 4: Configuring web server${NC}"
scp caddy-config.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/pwa-caddy.conf
ssh ${SERVER_USER}@${SERVER_HOST} << ENDSSH
# Backup existing config
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup

# Update Caddy config
sed -i "s/yourdomain.com/${DOMAIN}/g" /tmp/pwa-caddy.conf
cp /tmp/pwa-caddy.conf /etc/caddy/sites-enabled/${DOMAIN}.conf

# Reload Caddy
systemctl reload caddy
ENDSSH

check_status "Web server configuration"

# Step 5: Verify deployment
echo -e "\n${YELLOW}Step 5: Verifying deployment${NC}"

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} | grep -q "200"; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}✗ Frontend check failed${NC}"
fi

# Check API
if curl -s https://${DOMAIN}/push-api/health | grep -q "ok"; then
    echo -e "${GREEN}✓ Push API is running${NC}"
else
    echo -e "${RED}✗ Push API check failed${NC}"
fi

# Check PWA requirements
if curl -s https://${DOMAIN}/manifest.json | grep -q "name"; then
    echo -e "${GREEN}✓ Manifest is accessible${NC}"
else
    echo -e "${RED}✗ Manifest check failed${NC}"
fi

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo "======================="
echo "Frontend: https://${DOMAIN}"
echo "Push API: https://${DOMAIN}/push-api/health"
echo ""
echo "Next steps:"
echo "1. Test the PWA installation"
echo "2. Enable push notifications"
echo "3. Monitor logs: ssh ${SERVER_USER}@${SERVER_HOST} 'docker logs -f pwa-push-api'"