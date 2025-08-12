#!/bin/bash

echo "🔐 Setting up Cloudflare Origin SSL Certificate"
echo ""

# Since API requires specific format, let's use the manual approach
echo "For enterprise-grade SSL, you need to create the Origin Certificate manually."
echo ""
echo "📋 Steps to create Origin Certificate in Cloudflare Dashboard:"
echo ""
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Select your domain (agistaffers.com)"
echo "3. Navigate to SSL/TLS → Origin Server"
echo "4. Click 'Create Certificate'"
echo "5. Choose:"
echo "   - Private key type: RSA (2048)"
echo "   - Certificate Validity: 15 years"
echo "   - Hostnames:"
echo "     • *.agistaffers.com"
echo "     • agistaffers.com"
echo "     • origin.agistaffers.com"
echo "6. Click 'Create'"
echo "7. Save both the Origin Certificate and Private Key"
echo ""
echo "Once you have the certificate and key, I'll help you install them."
echo ""
echo "Press Enter when you have the certificate and key ready..."
read

# Create directory for certificates
mkdir -p origin-ssl

echo ""
echo "📝 Please paste the Origin Certificate (paste, then press Ctrl+D):"
cat > origin-ssl/origin-cert.pem

echo ""
echo "📝 Please paste the Private Key (paste, then press Ctrl+D):"
cat > origin-ssl/origin-key.pem

# Create installation script
cat > origin-ssl/install-origin-ssl.sh << 'SCRIPT'
#!/bin/bash

echo "🔧 Installing Cloudflare Origin SSL on VPS..."

# Backup current Caddyfile
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup-$(date +%Y%m%d-%H%M%S)

# Create SSL directory
sudo mkdir -p /etc/ssl/cloudflare

# Install certificates
sudo cp origin-cert.pem /etc/ssl/cloudflare/
sudo cp origin-key.pem /etc/ssl/cloudflare/

# Set proper permissions
sudo chmod 644 /etc/ssl/cloudflare/origin-cert.pem
sudo chmod 600 /etc/ssl/cloudflare/origin-key.pem
sudo chown caddy:caddy /etc/ssl/cloudflare/*

# Create new Caddyfile with origin configuration
cat > /tmp/Caddyfile << 'EOF'
# Origin endpoint for Cloudflare Workers (not proxied)
origin.agistaffers.com {
    tls /etc/ssl/cloudflare/origin-cert.pem /etc/ssl/cloudflare/origin-key.pem
    
    # Metrics API
    handle /api/metrics* {
        reverse_proxy localhost:3009 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Push API
    handle /api/push* {
        reverse_proxy localhost:3011 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Admin Dashboard
    handle {
        reverse_proxy localhost:8080 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Security headers
    header {
        X-Origin-Server "AGI-Staffers-Origin"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
    }
}

# Existing configurations (keep all current services)
agistaffers.com {
    root * /var/www/agistaffers
    file_server
}

admin.agistaffers.com {
    reverse_proxy localhost:8080
}

pgadmin.agistaffers.com {
    reverse_proxy localhost:5050
}

n8n.agistaffers.com {
    reverse_proxy localhost:5678
}

portainer.agistaffers.com {
    reverse_proxy localhost:9000
}

chat.agistaffers.com {
    reverse_proxy localhost:3002
}

flowise.agistaffers.com {
    reverse_proxy localhost:3001
}

searxng.agistaffers.com {
    reverse_proxy localhost:8090
}

# New infrastructure services
grafana.agistaffers.com {
    reverse_proxy localhost:3003
}

prometheus.agistaffers.com {
    reverse_proxy localhost:9090
}

uptime.agistaffers.com {
    reverse_proxy localhost:3004
}

minio.agistaffers.com {
    reverse_proxy localhost:9001
}

vault.agistaffers.com {
    reverse_proxy localhost:8200
}

jaeger.agistaffers.com {
    reverse_proxy localhost:16686
}
EOF

# Validate the new configuration
if sudo caddy validate --config /tmp/Caddyfile; then
    echo "✅ Configuration valid, applying..."
    sudo cp /tmp/Caddyfile /etc/caddy/Caddyfile
    sudo systemctl reload caddy
    echo "✅ Caddy reloaded with origin configuration!"
else
    echo "❌ Configuration validation failed!"
    exit 1
fi

# Test the origin endpoint
echo ""
echo "🧪 Testing origin endpoint..."
sleep 2
curl -I https://origin.agistaffers.com/api/metrics || echo "Note: It may take a moment for DNS to propagate"

echo ""
echo "✅ Origin SSL setup complete!"
echo ""
echo "Next step: Update your Cloudflare Workers to use https://origin.agistaffers.com"
SCRIPT

chmod +x origin-ssl/install-origin-ssl.sh

echo ""
echo "✅ Files prepared!"
echo ""
echo "📤 Now copy everything to your VPS:"
echo "   scp -r origin-ssl root@72.60.28.175:/root/"
echo ""
echo "📟 Then install on VPS:"
echo "   ssh root@72.60.28.175"
echo "   cd /root/origin-ssl && ./install-origin-ssl.sh"
echo ""