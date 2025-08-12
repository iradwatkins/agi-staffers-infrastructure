#!/bin/bash
# Blue-Green Deployment Switcher for AGI Staffers Admin Dashboard

echo "🔄 Blue-Green Deployment Switcher"
echo "================================="
echo ""

# Check current deployment
CURRENT_PORT=$(sshpass -p 'Bobby321&Gloria321Watkins?' ssh -o StrictHostKeyChecking=no root@72.60.28.175 'grep "reverse_proxy localhost" /etc/caddy/Caddyfile | grep -v "#" | grep -v "api" | head -1 | grep -oE "[0-9]+"')

if [ "$CURRENT_PORT" == "8080" ]; then
    echo "📘 Current: BLUE (Port 8080)"
    echo "🟢 Switching to: GREEN (Port 8082)"
    NEW_PORT=8082
    NEW_COLOR="GREEN"
else
    echo "🟢 Current: GREEN (Port 8082)"
    echo "📘 Switching to: BLUE (Port 8080)"
    NEW_PORT=8080
    NEW_COLOR="BLUE"
fi

echo ""
echo "Updating Caddy configuration..."

# Update Caddy config
sshpass -p 'Bobby321&Gloria321Watkins?' ssh -o StrictHostKeyChecking=no root@72.60.28.175 << EOF
# Backup current config
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup

# Update the port
sed -i "s/reverse_proxy localhost:$CURRENT_PORT/reverse_proxy localhost:$NEW_PORT/" /etc/caddy/Caddyfile

# Reload Caddy
systemctl reload caddy

echo "✅ Switched to $NEW_COLOR deployment (Port $NEW_PORT)"
echo ""
echo "Testing new configuration..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://admin.agistaffers.com
EOF

echo ""
echo "🎯 Deployment switched successfully!"
echo "   Admin dashboard now routing to: $NEW_COLOR (Port $NEW_PORT)"
echo ""
echo "To rollback, simply run this script again."