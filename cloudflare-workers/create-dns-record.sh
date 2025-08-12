#!/bin/bash

# AGI Staffers API Gateway DNS Setup
echo "Creating DNS record for api.agistaffers.com..."

# Zone ID for agistaffers.com
ZONE_ID="f6411878e9495ca7d33bfcc5914f079b"

# Create CNAME record pointing to the domain itself (will be proxied through Cloudflare)
# This creates a "placeholder" record that Cloudflare can proxy through Workers
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CNAME",
    "name": "api",
    "content": "agistaffers.com",
    "proxied": true,
    "ttl": 1
  }' | jq .

echo ""
echo "DNS record created. Waiting for propagation..."
echo "Testing DNS resolution..."

for i in {1..30}; do
  echo "Attempt $i/30..."
  result=$(dig +short api.agistaffers.com @1.1.1.1)
  if [ ! -z "$result" ]; then
    echo "DNS resolved: $result"
    break
  fi
  sleep 2
done

echo "Testing API gateway..."
sleep 5
curl -s -w "\nHTTP Status: %{http_code}\n" https://api.agistaffers.com/test