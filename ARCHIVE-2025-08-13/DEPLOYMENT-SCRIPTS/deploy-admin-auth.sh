#!/bin/bash

# Deploy Admin Authentication System
echo "🔐 Deploying Admin Authentication System..."

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
VPS_PASSWORD='Bobby321&Gloria321Watkins?'
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd "$PROJECT_DIR"

# Create tarball with new admin auth files
tar -czf admin-auth-deploy.tar.gz \
    app/admin/login \
    app/api/admin \
    lib/admin-auth.ts \
    middleware.ts

echo -e "${YELLOW}📤 Uploading to VPS...${NC}"
SSHPASS="$VPS_PASSWORD" sshpass -e scp admin-auth-deploy.tar.gz ${VPS_USER}@${VPS_IP}:/root/

echo -e "${YELLOW}🔧 Deploying on VPS...${NC}"
SSHPASS="$VPS_PASSWORD" sshpass -e ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /root/agistaffers

# Extract new files
tar -xzf /root/admin-auth-deploy.tar.gz

# Update environment variables
if ! grep -q "ADMIN_AUTH_SECRET" .env; then
    echo "" >> .env
    echo "# Admin Authentication" >> .env
    echo "ADMIN_AUTH_SECRET=$(openssl rand -base64 32)" >> .env
    echo "ADMIN_SESSION_NAME=admin_session" >> .env
fi

# Install bcryptjs if not installed
npm install bcryptjs jose

# Restart the application
pm2 restart agistaffers-main

echo "✅ Admin authentication deployed!"
echo "🔐 Admin login available at: https://admin.agistaffers.com"
echo "👥 Customer login remains at: https://agistaffers.com/login"

# Clean up
rm /root/admin-auth-deploy.tar.gz
EOF

# Clean up local file
rm admin-auth-deploy.tar.gz

echo -e "${GREEN}✅ Admin Authentication System deployed successfully!${NC}"
echo -e "${GREEN}🔐 Admin: https://admin.agistaffers.com${NC}"
echo -e "${GREEN}👥 Customer: https://agistaffers.com${NC}"