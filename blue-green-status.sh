#!/bin/bash

# Blue-Green Status Check Script
# Shows current deployment status

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔵🟢 Blue-Green Deployment Status${NC}"
echo "===================================="

# Check environments
ssh $VPS_USER@$VPS_IP "
    echo ''
    echo 'CURRENT DEPLOYMENT STATUS:'
    echo '--------------------------'
    
    # Current live environment
    if [ -f /var/www/current_env ]; then
        CURRENT=\$(cat /var/www/current_env)
        echo -e 'LIVE Environment: '\$CURRENT
    else
        echo 'LIVE Environment: Not configured'
    fi
    
    echo ''
    echo 'ENVIRONMENT HEALTH:'
    echo '-------------------'
    
    # Check Blue environment
    echo -n 'Blue (port 3000): '
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo '✅ Healthy'
    else
        echo '❌ Not responding'
    fi
    
    # Check Green environment
    echo -n 'Green (port 3001): '
    if curl -f http://localhost:3001 >/dev/null 2>&1; then
        echo '✅ Healthy'
    else
        echo '❌ Not responding'
    fi
    
    echo ''
    echo 'PM2 PROCESSES:'
    echo '--------------'
    pm2 list | grep agistaffers || echo 'No PM2 processes found'
    
    echo ''
    echo 'NGINX STATUS:'
    echo '-------------'
    if systemctl is-active nginx >/dev/null 2>&1; then
        echo 'NGINX: ✅ Running'
        grep 'server localhost' /etc/nginx/sites-available/agistaffers 2>/dev/null | head -1 || echo 'No upstream configured'
    else
        echo 'NGINX: ❌ Not running'
    fi
    
    echo ''
    echo 'DISK USAGE:'
    echo '-----------'
    df -h /var/www | tail -1
"

echo ""
echo -e "${GREEN}Status check complete!${NC}"