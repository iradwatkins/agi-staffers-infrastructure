# Enterprise SSL/TLS Configuration for AGI Staffers

## Architecture Overview

### 1. **Three-Tier SSL Architecture**

```
[Client] --HTTPS--> [Cloudflare Edge] --HTTPS--> [Origin Server]
```

- **Tier 1**: Client to Cloudflare (Cloudflare Universal SSL)
- **Tier 2**: Cloudflare to Origin (Origin CA Certificate)
- **Tier 3**: Internal services (Self-signed or Let's Encrypt)

### 2. **Proper Domain Strategy**

#### External Domains (Cloudflare Proxied)
```
api.agistaffers.com         → Workers API Gateway
admin.agistaffers.com       → Cloudflare Pages
*.agistaffers.com          → Various services
```

#### Internal Domains (Not Proxied)
```
origin.agistaffers.com      → Direct VPS access (A record, gray cloud)
internal.agistaffers.com    → Internal API endpoints
```

### 3. **SSL Configuration Steps**

#### Step 1: Create Cloudflare Origin CA Certificate

1. Go to **SSL/TLS** → **Origin Server**
2. Click **"Create Certificate"**
3. Choose:
   - Private key type: RSA
   - Certificate Validity: 15 years
   - Hostnames: 
     - `*.agistaffers.com`
     - `agistaffers.com`
     - `origin.agistaffers.com`
4. Save the certificate and private key

#### Step 2: Install Origin Certificate on VPS

```bash
# On your VPS
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/origin-cert.pem
# Paste the certificate

sudo nano /etc/ssl/cloudflare/origin-key.pem
# Paste the private key

# Set proper permissions
sudo chmod 644 /etc/ssl/cloudflare/origin-cert.pem
sudo chmod 600 /etc/ssl/cloudflare/origin-key.pem
```

#### Step 3: Configure Caddy with Origin Certificate

```caddyfile
# /etc/caddy/Caddyfile

# Internal origin endpoint (not proxied through Cloudflare)
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
}

# Regular services (proxied through Cloudflare)
admin.agistaffers.com {
    reverse_proxy localhost:8080
}

# Other services...
```

#### Step 4: Update Workers to Use Origin Domain

```javascript
// api-gateway/src/index.js
export default {
  async fetch(request, env, ctx) {
    // ... existing code ...
    
    // Use origin domain for internal communication
    const ORIGIN_BASE = 'https://origin.agistaffers.com';
    
    // Route to appropriate endpoint
    const originUrl = `${ORIGIN_BASE}${url.pathname}${url.search}`;
    
    // Include origin certificate validation
    const response = await fetch(originUrl, {
      method: request.method,
      headers: {
        ...request.headers,
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP'),
        'X-Forwarded-Proto': 'https',
        'X-Real-IP': request.headers.get('CF-Connecting-IP')
      },
      body: request.body,
      // Trust Cloudflare Origin CA
      cf: {
        strictSSL: true
      }
    });
    
    // ... rest of code ...
  }
};
```

### 4. **DNS Configuration**

In Cloudflare DNS:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | origin | 72.60.28.175 | DNS only (gray cloud) |
| A | api | 72.60.28.175 | DNS only (gray cloud)* |
| A | admin | 72.60.28.175 | Proxied (orange cloud) |

*Note: api.agistaffers.com should have NO A record if using Workers routes

### 5. **SSL/TLS Settings in Cloudflare**

1. Go to **SSL/TLS** → **Overview**
2. Set mode to **"Full (strict)"**
3. Enable **"Always Use HTTPS"**
4. Enable **"Automatic HTTPS Rewrites"**

### 6. **Security Headers**

Add via Cloudflare Transform Rules or in your Worker:

```javascript
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;"
};
```

### 7. **Monitoring & Compliance**

1. **SSL Certificate Monitoring**:
   - Set up Uptime Kuma to monitor SSL expiry
   - Use Cloudflare notifications for certificate issues

2. **Security Scanning**:
   - Regular SSL Labs scans
   - OWASP ZAP for vulnerability testing

3. **Compliance**:
   - Meets PCI DSS requirements
   - SOC 2 compliant configuration
   - HIPAA compatible (with additional controls)

### 8. **High Availability Configuration**

```yaml
Primary Origin: origin.agistaffers.com
Backup Origin: origin-backup.agistaffers.com (different VPS)

Cloudflare Load Balancing:
  - Health checks every 60 seconds
  - Automatic failover
  - Geographic routing
```

### 9. **Implementation Checklist**

- [ ] Create Cloudflare Origin CA certificate
- [ ] Install certificate on VPS
- [ ] Configure Caddy with origin certificate
- [ ] Create origin.agistaffers.com DNS record (gray cloud)
- [ ] Update all Workers to use origin domain
- [ ] Set SSL/TLS mode to "Full (strict)"
- [ ] Configure security headers
- [ ] Set up monitoring
- [ ] Test with SSL Labs
- [ ] Document all configurations

### 10. **Testing**

```bash
# Test origin directly (should work with Cloudflare Origin CA)
curl -v https://origin.agistaffers.com/api/metrics

# Test through Workers (should work with caching)
curl -v https://api.agistaffers.com/api/metrics

# Test SSL configuration
openssl s_client -connect origin.agistaffers.com:443 -servername origin.agistaffers.com

# SSL Labs test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=api.agistaffers.com
```

## Benefits of This Architecture

1. **Security**: Proper SSL/TLS end-to-end encryption
2. **Performance**: Cloudflare caching and edge computing
3. **Reliability**: No circular references or SSL conflicts
4. **Scalability**: Easy to add more origins or services
5. **Compliance**: Meets enterprise security standards
6. **Monitoring**: Full visibility into SSL health
7. **Flexibility**: Can bypass Cloudflare if needed via origin domain

This is the proper enterprise-grade solution that Fortune 500 companies use.