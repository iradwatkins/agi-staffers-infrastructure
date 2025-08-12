#!/bin/bash

# Generate Cloudflare Origin CA Certificate via API

echo "🔐 Generating Cloudflare Origin CA Certificate..."

# Create certificate request
CERT_RESPONSE=$(curl -X POST "https://api.cloudflare.com/client/v4/certificates" \
  -H "Authorization: Bearer C20q4vI5LjOaFVaEp6qSA6o0TuH9KYbjJYjB0wvl" \
  -H "Content-Type: application/json" \
  --data '{
    "hosts": [
      "*.agistaffers.com",
      "agistaffers.com",
      "origin.agistaffers.com"
    ],
    "requested_validity": 5475,
    "request_type": "origin-rsa",
    "csr": ""
  }')

# Extract certificate and key
CERT=$(echo "$CERT_RESPONSE" | jq -r '.result.certificate')
KEY=$(echo "$CERT_RESPONSE" | jq -r '.result.private_key')

if [ "$CERT" != "null" ] && [ "$KEY" != "null" ]; then
    echo "✅ Certificate generated successfully!"
    
    # Save to files
    echo "$CERT" > origin-cert.pem
    echo "$KEY" > origin-key.pem
    
    echo ""
    echo "📁 Files created:"
    echo "  - origin-cert.pem (Certificate)"
    echo "  - origin-key.pem (Private Key)"
    echo ""
    echo "🔒 Keep these files secure!"
    echo ""
    echo "Next step: Upload these to your VPS"
else
    echo "❌ Failed to generate certificate"
    echo "$CERT_RESPONSE" | jq .
fi