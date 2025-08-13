#\!/bin/bash
set -e
echo "🔔 Deploying Push Notification API to VPS..."

# Update Dockerfile to use correct port
cd /Users/irawatkins/Documents/Cursor\ Setup/push-notification-api
sed -i '' 's/EXPOSE 3008/EXPOSE 3011/g' Dockerfile

# Create deployment directory on VPS
ssh agi-vps 'mkdir -p /root/push-notification-api'

# Copy files to VPS
echo "📦 Copying files to VPS..."
scp -r server.js package.json package-lock.json Dockerfile agi-vps:/root/push-notification-api/

# Create environment file on VPS with VAPID keys
echo "🔐 Setting up environment variables..."
ssh agi-vps 'cat > /root/push-notification-api/.env << EOF
PORT=3011
VAPID_PUBLIC_KEY=BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8
VAPID_PRIVATE_KEY=Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E
VAPID_SUBJECT=mailto:admin@agistaffers.com
DATABASE_TYPE=memory
CORS_ORIGIN=https://agistaffers.com,https://admin.agistaffers.com
EOF'

# Build and run the Docker container
echo "🐳 Building Docker image..."
ssh agi-vps 'cd /root/push-notification-api && docker build -t push-notification-api .'

# Stop existing container if running
ssh agi-vps 'docker stop push-api 2>/dev/null || true'
ssh agi-vps 'docker rm push-api 2>/dev/null || true'

# Run the new container
echo "🚀 Starting push notification API..."
ssh agi-vps 'docker run -d --name push-api --restart unless-stopped -p 3011:3011 --env-file /root/push-notification-api/.env push-notification-api'

# Update Caddy configuration for push.agistaffers.com
echo "🌐 Configuring Caddy for push.agistaffers.com..."
ssh agi-vps 'grep -q "push.agistaffers.com" /etc/caddy/Caddyfile || cat >> /etc/caddy/Caddyfile << EOF

push.agistaffers.com {
    reverse_proxy localhost:3011
}
EOF'

# Reload Caddy
ssh agi-vps 'systemctl reload caddy'

# Test the API
echo "✅ Testing push API..."
sleep 3
curl -s https://push.agistaffers.com/api/health || echo "⚠️  API not responding yet, may need DNS propagation"

echo "🎉 Push Notification API deployed\!"
EOF < /dev/null