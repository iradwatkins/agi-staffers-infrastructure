#!/bin/bash

# Simple VAPID key generator using OpenSSL (no npm dependencies)
# This generates the same type of keys but using command line tools

echo "🔑 Generating VAPID Keys using OpenSSL..."

# Create directory for keys
mkdir -p vapid-keys

# Generate private key using P-256 curve (required for VAPID)
openssl ecparam -genkey -name prime256v1 -noout -out vapid-keys/private_key.pem

# Extract public key from private key
openssl ec -in vapid-keys/private_key.pem -pubout -out vapid-keys/public_key.pem

# Convert to URL-safe base64 (required format for VAPID)
# Private key
PRIVATE_KEY=$(openssl ec -in vapid-keys/private_key.pem -outform DER 2>/dev/null | tail -c +8 | head -c 32 | base64 | tr '+/' '-_' | tr -d '=')

# Public key (uncompressed point format)
PUBLIC_KEY=$(openssl ec -in vapid-keys/private_key.pem -pubout -outform DER 2>/dev/null | tail -c 65 | base64 | tr '+/' '-_' | tr -d '=')

# Create output files
cat > vapid-keys/.env.vapid << EOF
# Web Push VAPID Keys - Generated $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Keep these keys secure! The private key should never be exposed publicly.

VAPID_PUBLIC_KEY=$PUBLIC_KEY
VAPID_PRIVATE_KEY=$PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@agistaffers.com
EOF

cat > vapid-keys/vapid-public-key.js << EOF
// VAPID Public Key for Push Notifications
// Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
// This key is safe to use in client-side code

export const VAPID_PUBLIC_KEY = '$PUBLIC_KEY';
EOF

cat > vapid-keys/update-dashboard.sh << EOF
#!/bin/bash
# Script to update the push-notifications.js file with new VAPID key

echo "Updating push-notifications.js with new VAPID public key..."

# Update the VAPID key in push-notifications.js
sed -i.bak "s/this\.vapidPublicKey = '[^']*'/this.vapidPublicKey = '$PUBLIC_KEY'/" admin-dashboard-local/push-notifications.js

echo "✅ Updated push-notifications.js"
echo "Original file backed up as push-notifications.js.bak"
EOF

chmod +x vapid-keys/update-dashboard.sh

# Display results
echo "✅ VAPID Keys Generated Successfully!"
echo ""
echo "📋 Public Key (safe to share):"
echo "$PUBLIC_KEY"
echo ""
echo "🔒 Private Key (keep secret!):"
echo "$PRIVATE_KEY"
echo ""
echo "📁 Files created in ./vapid-keys/"
echo "- .env.vapid: Environment variables for server"
echo "- vapid-public-key.js: Client configuration"
echo "- private_key.pem: Private key in PEM format"
echo "- public_key.pem: Public key in PEM format"
echo "- update-dashboard.sh: Script to update dashboard"
echo ""
echo "🚀 Next Steps:"
echo "1. Run: ./vapid-keys/update-dashboard.sh"
echo "2. Copy .env.vapid to your server"
echo "3. Set up push notification API endpoint"