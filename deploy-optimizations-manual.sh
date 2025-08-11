#!/bin/bash

# Manual deployment script for memory optimizations on VPS
# Run this after GitHub Actions completes

echo "🚀 Deploying Memory Optimizations to AGI Staffers VPS"
echo "===================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# VPS connection
VPS_HOST="148.230.93.174"
VPS_USER="root"

echo "📋 Step 1: Checking GitHub deployment status..."
cd /Users/irawatkins/Documents/Cursor\ Setup
gh run list --limit 1 --workflow=deploy.yml

echo ""
echo "⏳ Waiting for GitHub Actions to complete..."
echo "   (Press Ctrl+C if already complete)"
sleep 10

echo ""
echo "📋 Step 2: Connecting to VPS and running optimization setup..."
echo ""

# Create deployment script
cat << 'DEPLOY_SCRIPT' > /tmp/deploy-optimizations.sh
#!/bin/bash

echo "Starting optimization deployment on VPS..."

# 1. Check if files were deployed
if [ -f "/root/agi-staffers-platform/advanced-memory-optimizations.sh" ]; then
    echo "✅ Optimization scripts found in deployment"
    
    # Copy to working directory
    cp /root/agi-staffers-platform/advanced-memory-optimizations.sh /root/
    cp /root/agi-staffers-platform/ollama-optimize.sh /root/
    cp /root/agi-staffers-platform/dynamic-memory-manager.sh /root/
    cp /root/agi-staffers-platform/neo4j-memory.conf /root/
    
    # Make executable
    chmod +x /root/advanced-memory-optimizations.sh
    chmod +x /root/ollama-optimize.sh
    chmod +x /root/dynamic-memory-manager.sh
    
    echo "✅ Scripts copied and made executable"
    
    # Run the optimization setup
    echo ""
    echo "🚀 Running optimization setup..."
    cd /root
    ./advanced-memory-optimizations.sh
    
else
    echo "❌ Optimization scripts not found in deployment"
    echo "   You may need to copy them manually"
fi

echo ""
echo "📋 Verification steps:"
echo "1. Check cron jobs:"
crontab -l | grep -E "ollama|memory|docker"

echo ""
echo "2. Test dynamic memory manager:"
if [ -f "/usr/local/bin/dynamic-memory-manager.sh" ]; then
    /usr/local/bin/dynamic-memory-manager.sh
else
    echo "Memory manager not installed yet"
fi

echo ""
echo "3. Current memory status:"
free -h

echo ""
echo "✅ Deployment verification complete!"
DEPLOY_SCRIPT

# Copy and run deployment script
echo -e "${YELLOW}Please enter VPS password when prompted:${NC}"
scp /tmp/deploy-optimizations.sh $VPS_USER@$VPS_HOST:/tmp/
ssh $VPS_USER@$VPS_HOST 'chmod +x /tmp/deploy-optimizations.sh && /tmp/deploy-optimizations.sh'

echo ""
echo -e "${GREEN}✅ Manual deployment process complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Monitor optimization logs over next 24 hours:"
echo "   ssh $VPS_USER@$VPS_HOST 'tail -f /var/log/memory-manager.log'"
echo ""
echo "2. Check Ollama model unloading after 30 minutes:"
echo "   ssh $VPS_USER@$VPS_HOST 'tail -f /var/log/ollama-optimize.log'"
echo ""
echo "3. View memory trends in admin dashboard:"
echo "   https://admin.agistaffers.com"