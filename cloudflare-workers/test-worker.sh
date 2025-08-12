#!/bin/bash

echo "Testing Cloudflare Worker API..."
echo ""

# Test 1: Check Worker response
echo "1. Testing API endpoint:"
response=$(curl -s -w "\n[HTTP_CODE]:%{http_code}" https://api.agistaffers.com/api/metrics)
body=$(echo "$response" | sed -n '1,/\[HTTP_CODE\]/p' | sed '$d')
code=$(echo "$response" | grep -o '\[HTTP_CODE\]:[0-9]*' | cut -d':' -f2)

echo "HTTP Status: $code"
echo "Response: $body" | head -50
echo ""

# Test 2: Check headers
echo "2. Response headers:"
curl -s -I https://api.agistaffers.com/api/metrics 2>&1 | head -20 || echo "Headers request failed"
echo ""

# Test 3: Direct origin test
echo "3. Testing origin directly:"
curl -s -I https://origin.agistaffers.com/api/metrics | grep -E "(HTTP|x-origin-server)" || echo "Origin test failed"
echo ""

# Test 4: Check DNS
echo "4. DNS Resolution:"
echo "api.agistaffers.com: $(dig +short api.agistaffers.com | head -1 || echo 'No A record')"
echo "origin.agistaffers.com: $(dig +short origin.agistaffers.com)"