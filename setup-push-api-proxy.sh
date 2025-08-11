#!/bin/bash

echo "🔧 Setting up reverse proxy for Push API..."

# Create the Caddy configuration for the push API
ssh agi-vps << 'EOF'
# Add push API proxy to Caddy configuration
cat >> /etc/caddy/Caddyfile << 'CADDY_CONFIG'

# Push API endpoint on admin subdomain
admin.agistaffers.com {
    handle /push-api/* {
        reverse_proxy localhost:3011 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    handle {
        root * /usr/share/caddy/admin
        file_server
        try_files {path} /index.html
    }
}
CADDY_CONFIG

# Reload Caddy to apply changes
echo "Reloading Caddy..."
systemctl reload caddy

# Check if Caddy is running
if systemctl is-active --quiet caddy; then
    echo "✅ Caddy reloaded successfully"
else
    echo "❌ Caddy reload failed"
    systemctl status caddy
fi
EOF

echo ""
echo "✅ Push API proxy configured!"
echo ""
echo "📡 API Endpoints:"
echo "- Health: https://admin.agistaffers.com/push-api/health"
echo "- Subscribe: POST https://admin.agistaffers.com/push-api/api/subscribe"
echo "- Send: POST https://admin.agistaffers.com/push-api/api/send-notification"
echo "- Broadcast: POST https://admin.agistaffers.com/push-api/api/broadcast"