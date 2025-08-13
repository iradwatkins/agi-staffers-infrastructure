#!/bin/bash

# Deploy Phase 3 PWA Enhancements to AGI Staffers VPS
# This script uploads all the new components and updated files

echo "🚀 Deploying Phase 3 PWA Enhancements to VPS..."

# VPS Details
VPS_IP="72.60.28.175"
VPS_USER="root"
VPS_PASS="Gv4!pQ2xR8wz"

# Files to upload
declare -a FILES=(
    "admin-dashboard-local/index.html"
    "admin-dashboard-local/sw.js"
    "admin-dashboard-local/push-notifications.js"
    "admin-dashboard-local/components/AlertsSystem.js"
    "admin-dashboard-local/components/HistoricalData.js"
    "admin-dashboard-local/push-api/server.js"
    "admin-dashboard-local/push-api/package.json"
)

echo "📦 Uploading dashboard files..."

# Upload each file
for FILE in "${FILES[@]}"; do
    if [ -f "$FILE" ]; then
        echo "Uploading $FILE..."
        # Copy to admin dashboard container
        if [[ $FILE == *"push-api"* ]]; then
            # Push API files go to a different location
            DEST_DIR="/root/push-api/"
            SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "mkdir -p $DEST_DIR"
            SSHPASS="$VPS_PASS" sshpass -e scp -o StrictHostKeyChecking=no "$FILE" $VPS_USER@$VPS_IP:$DEST_DIR
        else
            # Extract just the filename for components
            if [[ $FILE == *"components/"* ]]; then
                FILENAME=$(basename "$FILE")
                SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP \
                    "docker exec admin-dashboard mkdir -p /usr/share/nginx/html/components"
                SSHPASS="$VPS_PASS" sshpass -e scp -o StrictHostKeyChecking=no "$FILE" $VPS_USER@$VPS_IP:/tmp/$FILENAME
                SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP \
                    "docker cp /tmp/$FILENAME admin-dashboard:/usr/share/nginx/html/components/ && rm /tmp/$FILENAME"
            else
                # Regular files
                FILENAME=$(basename "$FILE")
                SSHPASS="$VPS_PASS" sshpass -e scp -o StrictHostKeyChecking=no "$FILE" $VPS_USER@$VPS_IP:/tmp/$FILENAME
                SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP \
                    "docker cp /tmp/$FILENAME admin-dashboard:/usr/share/nginx/html/ && rm /tmp/$FILENAME"
            fi
        fi
    else
        echo "Warning: $FILE not found"
    fi
done

echo "🐳 Setting up Push API server..."

# Create Push API Docker container
SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'EOF'
cd /root/push-api

# Create Dockerfile if it doesn't exist
cat > Dockerfile << 'DOCKERFILE'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3011
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3011/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"
CMD ["node", "server.js"]
DOCKERFILE

# Build and run the Push API container
docker build -t push-notification-api .
docker stop push-api 2>/dev/null || true
docker rm push-api 2>/dev/null || true

docker run -d \
  --name push-api \
  --network stepperslife_default \
  -p 3011:3011 \
  -e NODE_ENV=production \
  -e PORT=3011 \
  -e VAPID_PUBLIC_KEY=BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8 \
  -e VAPID_PRIVATE_KEY=Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E \
  -e VAPID_SUBJECT=mailto:admin@agistaffers.com \
  -e DATABASE_URL=postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@stepperslife-db:5432/stepperslife \
  -e CORS_ORIGIN=https://agistaffers.com,https://admin.agistaffers.com \
  --restart unless-stopped \
  push-notification-api:latest

# Update Caddy configuration to proxy push API
cat >> /etc/caddy/Caddyfile << 'CADDY'

# Push API proxy (if not already configured)
admin.agistaffers.com {
    handle /push-api/* {
        reverse_proxy localhost:3011
    }
}
CADDY

# Reload Caddy
systemctl reload caddy

# Restart admin dashboard to ensure all updates are loaded
docker restart admin-dashboard

echo "✅ Push API server deployed and running"
echo "✅ Admin dashboard restarted with new components"
EOF

echo "🎉 Phase 3 deployment complete!"
echo ""
echo "Next steps:"
echo "1. Visit https://admin.agistaffers.com"
echo "2. Clear browser cache (Cmd+Shift+R)"
echo "3. Test push notifications"
echo "4. Configure alert thresholds"
echo "5. View historical data visualization"
echo ""
echo "📱 For Samsung Fold 6 testing:"
echo "- Open in Samsung Internet browser"
echo "- Test fold/unfold states"
echo "- Check PWA installation prompt"
echo "- Verify responsive layouts"