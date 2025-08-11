#!/bin/bash

echo "🚀 Pushing Admin Dashboard Updates to Production..."

# Configuration
VPS_HOST="72.60.28.175"
VPS_USER="root"

# Create deployment package with updated files
DEPLOY_PACKAGE="/tmp/admin-updates-$(date +%Y%m%d-%H%M%S).tar.gz"
cd agistaffers

echo "📦 Creating deployment package..."
tar -czf "$DEPLOY_PACKAGE" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    app/admin/page.tsx \
    app/api/customers/ \
    app/api/sites/ \
    app/api/templates/ \
    components/dashboard/CustomerManagement.tsx \
    components/dashboard/SiteManagement.tsx \
    lib/site-deployment-service.ts \
    scripts/seed-templates.sql \
    || echo "⚠️ Some files may not exist yet"

echo "📤 Uploading to VPS..."
expect -c "
spawn scp $DEPLOY_PACKAGE ${VPS_USER}@${VPS_HOST}:/tmp/
expect \"password:\"
send \"Gv4!pQ2xR8wz\\r\"
expect eof
" || echo "⚠️ Upload failed - manual deployment needed"

echo "🔄 Deploying updates on VPS..."
expect -c "
spawn ssh ${VPS_USER}@${VPS_HOST}
expect \"password:\"
send \"Gv4!pQ2xR8wz\\r\"
expect \"#\"
send \"cd /root/agi-staffers/agistaffers\\r\"
expect \"#\"
send \"tar -xzf /tmp/$(basename $DEPLOY_PACKAGE)\\r\"
expect \"#\"
send \"docker restart admin-dashboard 2>/dev/null || echo 'Container restart needed'\\r\"
expect \"#\"
send \"echo 'Updates deployed - please clear browser cache'\\r\"
expect \"#\"
send \"exit\\r\"
expect eof
" || echo "⚠️ Remote deployment failed"

echo "✅ Admin dashboard updates pushed!"
echo ""
echo "🌐 **Next Steps:**"
echo "   1. Visit: https://admin.agistaffers.com"  
echo "   2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (PC)"
echo "   3. Clear browser cache if needed"
echo "   4. Look for 'Customers' and 'Sites' tabs"
echo ""
echo "📋 **New Features Available:**"
echo "   • Customers tab: Create and manage clients"
echo "   • Sites tab: Deploy websites with templates"  
echo "   • 10+ professional templates ready"
echo "   • Automated Docker deployment"
echo ""

# Cleanup
rm -f "$DEPLOY_PACKAGE"