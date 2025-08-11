#!/bin/bash

# Script to update Caddyfile on VPS

cat > /tmp/admin-caddy-config.txt << 'EOF'

# Admin Dashboard with Push API support
admin.agistaffers.com {
    handle /push-api/* {
        uri strip_prefix /push-api
        reverse_proxy 127.0.0.1:3011
    }
    handle {
        reverse_proxy 127.0.0.1:3007
    }
    encode gzip
}
EOF

echo "Uploading Caddy config update..."
scp /tmp/admin-caddy-config.txt agi-vps:/tmp/

ssh agi-vps << 'REMOTE_SCRIPT'
cd /root/ai-infrastructure

# Backup current Caddyfile
cp Caddyfile Caddyfile.backup-$(date +%Y%m%d-%H%M%S)

# Check if admin.agistaffers.com already exists
if grep -q "admin.agistaffers.com" Caddyfile; then
    echo "Updating existing admin.agistaffers.com configuration..."
    # Remove existing admin config
    sed -i '/^admin\.agistaffers\.com {/,/^}/d' Caddyfile
fi

# Append new config
cat /tmp/admin-caddy-config.txt >> Caddyfile

echo "Restarting Caddy..."
docker-compose restart caddy

# Wait for Caddy to restart
sleep 5

# Test the endpoint
echo "Testing push API health endpoint..."
curl -s https://admin.agistaffers.com/push-api/health

echo ""
echo "Testing admin dashboard..."
curl -s -o /dev/null -w "%{http_code}" https://admin.agistaffers.com/
REMOTE_SCRIPT