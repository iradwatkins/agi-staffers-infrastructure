Put the contact in the menu as a submenu under the "About us" page.Just put SEO in the menu, no content and SEO.#!/bin/bash

# Blue-Green Deployment Script for AGI Staffers
# Following Rule 16: Mandatory Blue-Green Deployment Workflow

set -e


# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
PROJECT_DIR="/Users/irawatkins/Documents/Cursor Setup/agistaffers"
REMOTE_DIR="/var/www"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔵🟢 AGI Staffers Blue-Green Deployment System${NC}"
echo "============================================="

# Function to check current live environment
check_current_live() {
    echo -e "${YELLOW}Checking current LIVE environment...${NC}"
    ssh $VPS_USER@$VPS_IP "
        if [ -f /var/www/current_env ]; then
            cat /var/www/current_env
        else
            echo 'blue'
        fi
    "
}

# Function to determine standby environment
get_standby_env() {
    local current=$1
    if [ "$current" = "blue" ]; then
        echo "green"
    else
        echo "blue"
    fi
}

# Function to deploy to standby
deploy_to_standby() {
    local standby=$1
    local port=$2

    echo -e "${YELLOW}📦 Deploying to $standby environment (port $port)...${NC}"

    # Create deployment package
    echo "Creating deployment archive..."
    cd "$PROJECT_DIR"
    tar -czf agistaffers-deploy.tar.gz \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.git' \
        --exclude='*.log' \
        .

    # Transfer to VPS
    echo "Transferring to VPS..."
    scp agistaffers-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/

    # Deploy on VPS
    echo "Deploying on VPS to $standby environment..."
    ssh $VPS_USER@$VPS_IP "
        # Create standby directory
        mkdir -p $REMOTE_DIR/agistaffers-$standby

        # Extract files
        cd $REMOTE_DIR/agistaffers-$standby
        tar -xzf /tmp/agistaffers-deploy.tar.gz

        # Install dependencies
        npm install --production

        # Build Next.js
        npm run build

        # Set environment port
        echo 'PORT=$port' > .env.local

        # Start in PM2
        pm2 delete agistaffers-$standby 2>/dev/null || true
        pm2 start npm --name agistaffers-$standby -- start

        # Health check
        sleep 10
        curl -f http://localhost:$port || exit 1

        echo 'Deployment to $standby successful!'
    "

    # Clean up
    rm agistaffers-deploy.tar.gz

    echo -e "${GREEN}✅ Deployed to $standby environment${NC}"
}

# Function to switch traffic
switch_traffic() {
    local new_live=$1
    local new_port=$2

    echo -e "${YELLOW}🔄 Switching traffic to $new_live...${NC}"

    ssh $VPS_USER@$VPS_IP "
        # Update NGINX configuration
        cat > /etc/nginx/sites-available/agistaffers <<EOF
upstream agistaffers_app {
    server localhost:$new_port;
}

server {
    listen 80;
    server_name agistaffers.com www.agistaffers.com;

    location / {
        proxy_pass http://agistaffers_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}

server {
    listen 80;
    server_name admin.agistaffers.com;

    location / {
        proxy_pass http://agistaffers_app/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF

        # Reload NGINX
        nginx -t && nginx -s reload

        # Update current environment marker
        echo '$new_live' > /var/www/current_env

        echo 'Traffic switched to $new_live!'
    "

    echo -e "${GREEN}✅ Traffic now serving from $new_live environment${NC}"
}

# Main deployment flow
main() {
    echo -e "${BLUE}Starting Blue-Green Deployment...${NC}"

    # Step 1: Identify current LIVE environment
    CURRENT_LIVE=$(check_current_live)
    echo -e "Current LIVE: ${BLUE}$CURRENT_LIVE${NC}"

    # Step 2: Determine STANDBY environment
    STANDBY=$(get_standby_env $CURRENT_LIVE)
    echo -e "Will deploy to: ${GREEN}$STANDBY${NC}"

    # Step 3: Set ports
    if [ "$STANDBY" = "blue" ]; then
        STANDBY_PORT=3000
    else
        STANDBY_PORT=3001
    fi

    # Step 4: Deploy to STANDBY
    deploy_to_standby $STANDBY $STANDBY_PORT

    # Step 5: Test STANDBY
    echo -e "${YELLOW}Testing $STANDBY environment...${NC}"
    ssh $VPS_USER@$VPS_IP "curl -f http://localhost:$STANDBY_PORT" || {
        echo -e "${RED}❌ Health check failed! Aborting switch.${NC}"
        exit 1
    }

    # Step 6: Confirm switch
    echo -e "${YELLOW}Ready to switch traffic to $STANDBY.${NC}"
    read -p "Switch traffic now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        switch_traffic $STANDBY $STANDBY_PORT
        echo -e "${GREEN}🎉 Blue-Green Deployment Complete!${NC}"
        echo -e "Old LIVE ($CURRENT_LIVE) is now STANDBY"
        echo -e "New LIVE is $STANDBY"
    else
        echo -e "${YELLOW}Switch cancelled. $STANDBY is ready but not live.${NC}"
    fi
}

# Run main function
main
