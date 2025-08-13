#!/bin/bash

# Blue-Green Instant Rollback Script
# Achieves <2 minute rollback as per BMAD-001 requirements

set -e

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}🔄 EMERGENCY ROLLBACK SYSTEM${NC}"
echo "================================"

# Function to get current environment
get_current_env() {
    ssh $VPS_USER@$VPS_IP "cat /var/www/current_env 2>/dev/null || echo 'blue'"
}

# Function to perform instant rollback
instant_rollback() {
    local current=$1
    local rollback_to=""
    local rollback_port=""
    
    # Determine rollback target
    if [ "$current" = "blue" ]; then
        rollback_to="green"
        rollback_port="3001"
    else
        rollback_to="blue"
        rollback_port="3000"
    fi
    
    echo -e "${YELLOW}Rolling back from $current to $rollback_to...${NC}"
    
    # Start timer
    SECONDS=0
    
    # Quick health check of rollback target
    echo "Checking $rollback_to environment health..."
    ssh $VPS_USER@$VPS_IP "curl -f http://localhost:$rollback_port" || {
        echo -e "${RED}❌ Rollback target not healthy!${NC}"
        exit 1
    }
    
    # Switch traffic immediately
    echo "Switching traffic..."
    ssh $VPS_USER@$VPS_IP "
        # Update NGINX upstream
        sed -i 's/server localhost:[0-9]*/server localhost:$rollback_port/' /etc/nginx/sites-available/agistaffers
        
        # Reload NGINX
        nginx -s reload
        
        # Update environment marker
        echo '$rollback_to' > /var/www/current_env
    "
    
    # Calculate time taken
    duration=$SECONDS
    
    echo -e "${GREEN}✅ ROLLBACK COMPLETE in $duration seconds!${NC}"
    echo -e "Traffic restored to $rollback_to environment"
    
    # Verify rollback
    echo "Verifying rollback..."
    ssh $VPS_USER@$VPS_IP "curl -I http://localhost:$rollback_port"
    
    if [ $duration -lt 120 ]; then
        echo -e "${GREEN}🎯 BMAD-001 Goal Achieved: Rollback in <2 minutes!${NC}"
    fi
}

# Main execution
main() {
    echo -e "${RED}⚠️  EMERGENCY ROLLBACK INITIATED${NC}"
    
    # Get current environment
    CURRENT=$(get_current_env)
    echo -e "Current environment: ${BLUE}$CURRENT${NC}"
    
    # Confirm rollback
    echo -e "${YELLOW}This will immediately switch traffic to the standby environment.${NC}"
    read -p "Proceed with rollback? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        instant_rollback $CURRENT
    else
        echo -e "${YELLOW}Rollback cancelled.${NC}"
        exit 0
    fi
}

# Run main
main