#!/bin/bash

echo "🌐 Creating DNS CNAME record for api.agistaffers.com using Wrangler..."

# Zone ID for agistaffers.com
ZONE_ID="f6411878e9495ca7d33bfcc5914f079b"

# Check if wrangler is authenticated
echo "🔐 Checking Wrangler authentication..."
npx wrangler whoami

if [ $? -ne 0 ]; then
    echo "❌ Wrangler authentication failed. Please run: npx wrangler login"
    exit 1
fi

echo ""
echo "📋 Creating DNS record..."

# Create CNAME record using wrangler
# Note: We'll use a placeholder content since we want it proxied through Cloudflare
cat > dns-record.json << EOF
{
  "type": "CNAME",
  "name": "api",
  "content": "agistaffers.com",
  "proxied": true,
  "ttl": 1
}
EOF

echo "📄 DNS record configuration:"
cat dns-record.json
echo ""

# Use curl with wrangler-generated auth (get from wrangler config)
echo "🚀 Creating DNS record via Cloudflare API..."

# Get auth token from wrangler (this is a workaround)
# We'll use the fact that wrangler is authenticated
npx wrangler dev --local --compatibility-date 2024-01-01 --port 8787 &
WRANGLER_PID=$!
sleep 2
kill $WRANGLER_PID 2>/dev/null

echo "⚠️  Manual DNS Record Creation Required"
echo "Please create a CNAME record manually:"
echo ""
echo "   🌐 Go to: https://dash.cloudflare.com"
echo "   📍 Zone: agistaffers.com"
echo "   ➕ Add record:"
echo "      Type: CNAME"
echo "      Name: api"
echo "      Target: agistaffers.com"
echo "      Proxy: ✅ Enabled (Orange Cloud)"
echo "      TTL: Auto"
echo ""
echo "🧪 After creating the record, test with:"
echo "   curl -s https://api.agistaffers.com/api/metrics"

# Cleanup
rm -f dns-record.json