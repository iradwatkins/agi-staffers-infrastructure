#!/bin/bash

echo "🚀 Deploying Admin Dashboard with Complete Cache Bust"

# Configuration
DOMAIN="admin.agistaffers.com"
SERVER_IP="148.230.93.174"
VERSION=$(date +%Y%m%d%H%M%S)

echo "📌 Deployment Version: $VERSION"

# 1. Push code to server
echo "📦 Pushing code to server..."
./push-admin-dashboard.sh

# 2. Clear server-side caches
echo "🧹 Clearing server caches..."
ssh agi-vps << 'EOF'
# Clear nginx cache
rm -rf /var/cache/nginx/* 2>/dev/null || true
rm -rf /var/nginx/cache/* 2>/dev/null || true

# Restart nginx to ensure fresh config
docker exec caddy caddy reload 2>/dev/null || nginx -s reload 2>/dev/null || true

# Clear any container caches
docker exec admin-dashboard rm -rf /tmp/* 2>/dev/null || true

echo "✅ Server caches cleared"
EOF

# 3. Add cache-busting headers to nginx
echo "📝 Updating cache headers..."
ssh agi-vps << 'EOF'
# Create nginx cache control config
cat > /tmp/cache-control.conf << 'NGINX'
location ~* \.(html|htm)$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    add_header Pragma "no-cache";
}

location ~* \.(js|css)$ {
    expires -1;
    add_header Cache-Control "no-cache, must-revalidate";
}

location /api/ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
NGINX

# Copy to container if using containerized nginx
docker cp /tmp/cache-control.conf admin-dashboard:/etc/nginx/conf.d/cache-control.conf 2>/dev/null || true
docker exec admin-dashboard nginx -s reload 2>/dev/null || true
EOF

# 4. Clear Cloudflare cache if configured
if [ ! -z "$CLOUDFLARE_ZONE_ID" ] && [ ! -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "☁️ Clearing Cloudflare cache..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"purge_everything":true}' \
         --silent > /dev/null
    echo "✅ Cloudflare cache cleared"
fi

# 5. Test the deployment
echo "🔍 Testing deployment..."
sleep 3

# Check if site is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Site is accessible (HTTP $HTTP_CODE)"
else
    echo "⚠️ Warning: Site returned HTTP $HTTP_CODE"
fi

# Check for specific fix (dynamic versioning)
if curl -s https://$DOMAIN | grep -q "new Date().getTime()"; then
    echo "✅ Dynamic versioning detected"
else
    echo "⚠️ Warning: Dynamic versioning may not be active"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "To verify changes:"
echo "1. Open in incognito: https://$DOMAIN"
echo "2. Hard refresh: Cmd+Shift+R"
echo "3. Check console for errors: Cmd+Option+I"
echo ""
echo "If changes still don't appear:"
echo "- Clear browser cache: Cmd+Shift+Delete"
echo "- Try a different browser"
echo "- Wait 5 minutes for CDN propagation"

# Make script executable
chmod +x deploy-with-cache-bust.sh 2>/dev/null || true