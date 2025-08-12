#!/bin/bash

echo "Testing Cloudflare Workers API..."
echo ""

# Test metrics endpoint
echo "1. Testing Metrics API:"
curl -s -I https://api.agistaffers.com/api/metrics | head -5
echo ""

# Test with full response
echo "2. Getting metrics data:"
curl -s https://api.agistaffers.com/api/metrics | jq '.' 2>/dev/null || echo "Response received (not JSON formatted)"
echo ""

# Test cache
echo "3. Testing cache (second request should be faster):"
time curl -s https://api.agistaffers.com/api/metrics > /dev/null
echo ""

# Test CORS
echo "4. Testing CORS headers:"
curl -s -I -X OPTIONS https://api.agistaffers.com/api/metrics | grep -i "access-control"
echo ""

echo "If you see 525 errors, check DNS records in Cloudflare!"