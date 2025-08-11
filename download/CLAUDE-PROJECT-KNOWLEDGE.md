# Claude Project Knowledge - VPS & CI/CD Expert Setup

## Project Context
This knowledge base enables Claude to assist with complete VPS setup, from initial server configuration to automated CI/CD deployments. It includes Mac-specific commands, security best practices, and troubleshooting guides.

## Key Documents to Include

### 1. GITHUB-CICD-SETUP-GUIDE.md
Complete guide for setting up GitHub Actions automated deployments to VPS, including:
- SSH key generation and management
- GitHub Actions workflow configuration
- Deployment scripts and rollback strategies
- Security best practices

### 2. VPS-SETUP-ASSISTANT-INSTRUCTIONS.md
Comprehensive AI assistant instructions for:
- Initial VPS provisioning and security hardening
- Docker and Docker Compose setup
- Nginx configuration with SSL certificates
- Domain configuration and DNS setup
- Monitoring and backup automation

### 3. Quick Reference Card
```markdown
## Essential Commands & Information

### SSH Setup (Mac)
- Generate key: `ssh-keygen -t ed25519 -C "email@example.com"`
- Copy to clipboard: `cat ~/.ssh/id_ed25519.pub | pbcopy`
- Test connection: `ssh root@VPS_IP`

### Common VPS Paths
- Web apps: `/var/www/apps/`
- Nginx sites: `/etc/nginx/sites-available/`
- Docker compose: `/var/www/apps/your-app/docker-compose.yml`
- SSL certs: `/etc/letsencrypt/live/your-domain/`

### Quick Fixes
- Port in use: `lsof -i :PORT` then `kill -9 PID`
- Docker permission: `sudo usermod -aG docker $USER`
- Nginx test: `nginx -t`
- SSL renew: `certbot renew --dry-run`

### GitHub Actions Secrets
- VPS_SSH_KEY: Private SSH key for deployment
- VPS_HOST: Your VPS IP address
- VPS_USER: SSH username (usually root)
```

## Custom Instructions for Claude

When helping with VPS setup, I should:

1. **Always gather context first**:
   - What VPS provider?
   - What's already set up?
   - What type of application?
   - Mac or other OS?

2. **Explain before executing**:
   - What each command does
   - Why it's necessary
   - What could go wrong

3. **Provide verification steps**:
   - How to check if it worked
   - What success looks like
   - Common error messages

4. **Use Mac-specific commands**:
   - `pbcopy` instead of `xclip`
   - `open` instead of `xdg-open`
   - Cmd+Key instead of Ctrl+Key

5. **Security first approach**:
   - Never show passwords in examples
   - Always use SSH keys over passwords
   - Implement firewall rules early
   - Set up fail2ban

6. **Anticipate common issues**:
   - Line ending problems (CRLF vs LF)
   - Permission denied errors
   - Port conflicts
   - DNS propagation delays

## Project-Specific Context

For AGI Staffers platform:
- Main domain: agistaffers.com (server infrastructure)
- Website: stepperslife.com (hosted on the server)
- 13 Docker services with subdomains
- PostgreSQL database (not Supabase)
- Admin PWA at admin.agistaffers.com
- Caddy reverse proxy with automatic SSL

## Workflow Templates

### New VPS Setup Flow
1. Provision VPS and get root access
2. Run initial security setup script
3. Configure domain DNS
4. Install Docker and Docker Compose
5. Set up Nginx/Caddy with SSL
6. Deploy application
7. Configure GitHub Actions CI/CD
8. Set up monitoring and backups

### Adding New Service Flow
1. Create subdomain DNS record
2. Add service to docker-compose.yml
3. Configure reverse proxy
4. Test locally first
5. Deploy via GitHub Actions
6. Verify SSL certificate
7. Add monitoring

## Common Patterns

### Docker Compose Service Template
```yaml
service-name:
  image: image-name:tag
  container_name: unique-name
  restart: unless-stopped
  environment:
    - ENV_VAR=value
  ports:
    - "internal:external"
  volumes:
    - ./data:/app/data
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:port/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

### Nginx Reverse Proxy Template
```nginx
server {
    listen 80;
    server_name subdomain.domain.com;
    
    location / {
        proxy_pass http://localhost:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### GitHub Actions Deployment Template
```yaml
- name: Deploy to VPS
  run: |
    ssh ${{ env.VPS_USER }}@${{ env.VPS_HOST }} << 'EOF'
      cd /var/www/apps/your-app
      git pull origin main
      docker-compose up -d --build
      docker ps
    EOF
```

## Important Reminders

1. **Always backup before major changes**
2. **Test in staging/local first when possible**
3. **Document custom configurations**
4. **Use version control for everything**
5. **Monitor logs after deployments**
6. **Keep credentials in secure storage only**

## Success Metrics

A properly set up VPS should have:
- ✅ Automated deployments on git push
- ✅ SSL certificates auto-renewing
- ✅ Docker containers auto-restarting
- ✅ Firewall configured and active
- ✅ Fail2ban preventing brute force
- ✅ Regular automated backups
- ✅ Monitoring and alerts configured
- ✅ Zero-downtime deployments