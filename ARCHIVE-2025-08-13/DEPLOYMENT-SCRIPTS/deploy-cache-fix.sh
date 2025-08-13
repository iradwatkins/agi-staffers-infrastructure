#!/bin/bash

echo "🚀 Deploying Cache Fix v2.2.0 - Complete Cache Bypass"
echo "========================================"

# Package the updated files
echo "📦 Packaging updated files..."
cd /Users/irawatkins/Documents/Cursor\ Setup/admin-dashboard-local
tar -czf /tmp/cache-fix-v2.2.0.tar.gz \
    sw.js \
    components/BackupManager.js \
    manifest.json \
    index.html

echo "📤 Uploading to VPS..."
scp /tmp/cache-fix-v2.2.0.tar.gz agi-vps:/tmp/

echo "🔧 Deploying on VPS..."
ssh agi-vps << 'EOF'
    cd /root/admin-dashboard
    
    echo "🗂️  Extracting files..."
    tar -xzf /tmp/cache-fix-v2.2.0.tar.gz --overwrite
    
    echo "🔄 Restarting Caddy to reload configuration..."
    docker restart caddy
    sleep 3
    
    echo "🔄 Restarting admin-dashboard container..."
    docker restart admin-dashboard
    sleep 5
    
    echo "🧹 Clearing nginx cache inside container..."
    docker exec admin-dashboard find /var/cache/nginx -type f -delete 2>/dev/null || true
    docker exec admin-dashboard nginx -s reload 2>/dev/null || true
    
    echo "✅ Deployment complete!"
    
    echo "🧪 Testing API endpoints..."
    echo "Testing direct metrics API (port 3009):"
    curl -s http://localhost:3009/api/backups | head -10
    
    echo -e "\nTesting through Caddy proxy:"
    curl -s -H "Cache-Control: no-cache" https://admin.agistaffers.com/api/proxy/backups | head -10
    
EOF

echo "🎯 Local deployment complete!"
echo "🌐 Please test at: https://admin.agistaffers.com"
echo "💡 Use Cmd+Shift+R to force refresh in browser"
echo "🔧 Clear site data in DevTools → Application → Storage → Clear site data"

rm /tmp/cache-fix-v2.2.0.tar.gz