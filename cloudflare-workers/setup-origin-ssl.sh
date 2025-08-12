#!/bin/bash

echo "🔐 Setting up Cloudflare Origin SSL Certificate"
echo ""

# Step 1: Generate private key and CSR
echo "1️⃣ Generating private key and CSR..."
openssl genrsa -out origin-key.pem 2048
openssl req -new -key origin-key.pem -out origin.csr -subj "/C=US/ST=State/L=City/O=AGI Staffers/CN=origin.agistaffers.com"

# Read CSR
CSR=$(cat origin.csr | sed ':a;N;$!ba;s/\n/\\n/g')

# Step 2: Request certificate from Cloudflare
echo ""
echo "2️⃣ Requesting certificate from Cloudflare..."

CERT_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/certificates" \
  -H "Authorization: Bearer C20q4vI5LjOaFVaEp6qSA6o0TuH9KYbjJYjB0wvl" \
  -H "Content-Type: application/json" \
  --data "{
    \"hosts\": [
      \"*.agistaffers.com\",
      \"agistaffers.com\",
      \"origin.agistaffers.com\"
    ],
    \"requested_validity\": 5475,
    \"request_type\": \"origin-rsa\",
    \"csr\": \"$CSR\"
  }")

# Extract certificate
CERT=$(echo "$CERT_RESPONSE" | jq -r '.result.certificate')

if [ "$CERT" != "null" ] && [ -n "$CERT" ]; then
    echo "$CERT" > origin-cert.pem
    echo "✅ Certificate generated successfully!"
    echo ""
    echo "📁 Files created:"
    echo "  - origin-cert.pem (Certificate)"
    echo "  - origin-key.pem (Private Key)"
    echo ""
    
    # Step 3: Create installation script for VPS
    cat > install-on-vps.sh << 'EOF'
#!/bin/bash
# Run this on your VPS

echo "Installing Cloudflare Origin Certificate..."

# Create SSL directory
sudo mkdir -p /etc/ssl/cloudflare

# Copy certificates
sudo cp origin-cert.pem /etc/ssl/cloudflare/
sudo cp origin-key.pem /etc/ssl/cloudflare/

# Set permissions
sudo chmod 644 /etc/ssl/cloudflare/origin-cert.pem
sudo chmod 600 /etc/ssl/cloudflare/origin-key.pem
sudo chown caddy:caddy /etc/ssl/cloudflare/*

# Update Caddyfile
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup

# Add origin configuration
cat << 'CADDY' | sudo tee -a /etc/caddy/Caddyfile

# Origin endpoint for Cloudflare Workers
origin.agistaffers.com {
    tls /etc/ssl/cloudflare/origin-cert.pem /etc/ssl/cloudflare/origin-key.pem
    
    handle /api/metrics* {
        reverse_proxy localhost:3009
    }
    
    handle /api/push* {
        reverse_proxy localhost:3011
    }
    
    handle {
        reverse_proxy localhost:8080
    }
    
    header {
        X-Origin-Server "AGI-Staffers-Origin"
    }
}
CADDY

# Reload Caddy
sudo systemctl reload caddy

echo "✅ Origin certificate installed and Caddy configured!"
echo "Test with: curl -I https://origin.agistaffers.com/api/metrics"
EOF

    chmod +x install-on-vps.sh
    
    echo "3️⃣ Next steps:"
    echo "   1. Copy these files to your VPS:"
    echo "      scp origin-cert.pem origin-key.pem install-on-vps.sh root@72.60.28.175:/root/"
    echo ""
    echo "   2. SSH to your VPS and run:"
    echo "      ssh root@72.60.28.175"
    echo "      cd /root && ./install-on-vps.sh"
    echo ""
else
    echo "❌ Failed to generate certificate"
    echo "$CERT_RESPONSE" | jq .
fi

# Cleanup
rm -f origin.csr