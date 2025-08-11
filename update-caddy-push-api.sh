#!/bin/bash

echo "🔧 Updating Caddy configuration for Push API..."

# Update Caddy configuration on VPS
ssh agi-vps << 'EOF'
# Backup current Caddyfile
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup

# Update the admin.agistaffers.com configuration
sed -i '/admin\.agistaffers\.com {/,/}/c\
  admin.agistaffers.com {\
      handle /push-api/* {\
          uri strip_prefix /push-api\
          reverse_proxy localhost:3011\
      }\
      handle {\
          reverse_proxy localhost:3007\
      }\
  }' /etc/caddy/Caddyfile

# Validate the configuration
echo "Validating Caddy configuration..."
caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy
echo "Reloading Caddy..."
systemctl reload caddy

# Check status
if systemctl is-active --quiet caddy; then
    echo "✅ Caddy reloaded successfully"
    echo ""
    echo "Testing endpoints..."
    # Test health endpoint
    if curl -s https://admin.agistaffers.com/push-api/health | grep -q "AGI Push Notification API"; then
        echo "✅ Push API health endpoint is accessible"
    else
        echo "❌ Push API health endpoint is not accessible"
    fi
else
    echo "❌ Caddy reload failed"
    systemctl status caddy
fi
EOF

echo ""
echo "📡 Push API Endpoints:"
echo "- Health: https://admin.agistaffers.com/push-api/health"
echo "- Subscribe: POST https://admin.agistaffers.com/push-api/api/subscribe"
echo "- Send: POST https://admin.agistaffers.com/push-api/api/send-notification"
echo "- Broadcast: POST https://admin.agistaffers.com/push-api/api/broadcast"