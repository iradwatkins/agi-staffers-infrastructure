#\!/bin/bash

# Get Cloudflare credentials from user
echo "🔐 Cloudflare API Setup for DNS Record Creation"
echo ""
echo "We need your Cloudflare Global API Key to create the DNS record."
echo "You can find it at: https://dash.cloudflare.com/profile/api-tokens"
echo ""

read -p "Enter your Cloudflare email: " CF_EMAIL
echo ""
read -s -p "Enter your Cloudflare Global API Key: " CF_API_KEY
echo ""

# Validate credentials by testing API
echo "🧪 Testing API credentials..."
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ API credentials valid\!"
else
    echo "❌ Invalid API credentials. Please check and try again."
    exit 1
fi

# Create DNS record
echo ""
echo "🌐 Creating CNAME record for api.agistaffers.com..."

ZONE_ID="f6411878e9495ca7d33bfcc5914f079b"

DNS_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "api",
    "content": "agistaffers.com",
    "proxied": true,
    "ttl": 1
  }')

if echo "$DNS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ DNS record created successfully\!"
    echo ""
    echo "📋 Record Details:"
    echo "$DNS_RESPONSE" | python3 -m json.tool | grep -A 10 -B 10 '"result":'
else
    echo "⚠️ Response from Cloudflare:"
    echo "$DNS_RESPONSE" | python3 -m json.tool
fi

echo ""
echo "⏳ DNS propagation may take a few minutes..."
echo "🧪 Test with: curl -s https://api.agistaffers.com/api/metrics"
