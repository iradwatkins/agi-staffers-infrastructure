# AGI Staffers VPS Migration - Complete Guide

## Quick Start Prompt for Claude
"I need to migrate the AGI Staffers infrastructure from old VPS (148.230.93.174) to new VPS (72.60.28.175). The migration backup file `agi-staffers-migration.tar.gz` should be uploaded to `/root/` on the new server. Please complete the entire migration process including Docker installation, service restoration, and verification. The server uses Ubuntu 22.04 and I can SSH as root with password: Bobby321&Gloria321Watkins?"

## Critical Information
- **New VPS IP**: 72.60.28.175
- **New Hostname**: vps.agistaffers.com
- **SSH User**: root
- **SSH Password**: Bobby321&Gloria321Watkins?
- **Backup Location**: /root/agi-staffers-migration.tar.gz (5.4GB)
- **OS**: Ubuntu 22.04 LTS (kernel 5.15.0-143-generic)
- **Old VPS IP**: 148.230.93.174 (for reference)

## Services to Restore (12 total)
1. **stepperslife.com** - Main website (Port 3000)
2. **admin.agistaffers.com** - PWA Dashboard (Port 3007)
3. **pgadmin.agistaffers.com** - Database Management (Port 5050)
4. **n8n.agistaffers.com** - Workflow Automation (Port 5678)
5. **chat.agistaffers.com** - AI Chat Interface (Port 3000)
6. **flowise.agistaffers.com** - AI Workflow Builder (Port 3001)
7. **portainer.agistaffers.com** - Container Management (Port 9000)
8. **searxng.agistaffers.com** - Search Engine (Port 8090)
9. **metrics-api** - Monitoring API (Port 3009)
10. **push-api** - Push Notifications (Port 3011)
11. **stepperslife-db** - PostgreSQL Database
12. **Other AI services** - Ollama, LocalAI, etc.

## Migration Steps

### Step 1: Connect to New VPS
```bash
SSHPASS='Bobby321&Gloria321Watkins?' sshpass -e ssh -o StrictHostKeyChecking=no root@72.60.28.175
```

### Step 2: Check Server State
```bash
# Check if backup file exists
ls -la /root/agi-staffers-migration.tar.gz

# Check disk space
df -h

# Check current services
docker ps 2>/dev/null || echo "Docker not installed"
```

### Step 3: Install Docker
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
apt install -y docker-compose
```

### Step 4: Install Caddy
```bash
# Install Caddy (native, not Docker)
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy
```

### Step 5: Extract Migration Backup
```bash
cd /root
tar -xzf agi-staffers-migration.tar.gz
# This creates /root/vps-migration/ directory
```

### Step 6: Load Docker Images
```bash
cd /root/vps-migration/docker-images
docker load -i essential-images.tar
```

### Step 7: Restore Docker Volumes
```bash
cd /root/vps-migration/docker-volumes
tar -xzf essential-volumes.tar.gz -C /var/lib/docker/volumes/
```

### Step 8: Configure Caddy
```bash
# Copy Caddy configuration
cp -r /root/vps-migration/configs/caddy/* /etc/caddy/

# Update IP in Caddyfile
sed -i 's/148.230.93.174/72.60.28.175/g' /etc/caddy/Caddyfile

# Restart Caddy
systemctl restart caddy
```

### Step 9: Create Docker Networks
```bash
docker network create stepperslife_default || true
docker network create caddy || true
docker network create localai_langfuse_langfuse || true
```

### Step 10: Start Database Container
```bash
docker run -d \
  --name stepperslife-db \
  --network stepperslife_default \
  -e POSTGRES_PASSWORD=hes5SldOvxvh2llrZlwcjQXgj \
  -e POSTGRES_DB=stepperslife \
  -v stepperslife_db_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:15

# Wait for database to start
sleep 10
```

### Step 11: Restore Database
```bash
cd /root/vps-migration/databases
docker exec -i stepperslife-db psql -U postgres stepperslife < stepperslife.sql
```

### Step 12: Start Essential Services
```bash
# Admin Dashboard
docker run -d \
  --name admin-dashboard \
  --network caddy \
  -p 3007:80 \
  --restart unless-stopped \
  admin-dashboard:latest

# Metrics API
docker run -d \
  --name metrics-api \
  --network stepperslife_default \
  -p 3009:3009 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --group-add 988 \
  --restart unless-stopped \
  metrics-api:latest

# Push Notifications API
docker run -d \
  --name push-api \
  --network stepperslife_default \
  -p 3011:3011 \
  -e NODE_ENV=production \
  -e PORT=3011 \
  -e VAPID_PUBLIC_KEY=BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8 \
  -e VAPID_PRIVATE_KEY=Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E \
  -e VAPID_SUBJECT=mailto:admin@agistaffers.com \
  -e DATABASE_URL=postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@stepperslife-db:5432/stepperslife \
  -e CORS_ORIGIN=https://agistaffers.com,https://admin.agistaffers.com \
  --restart unless-stopped \
  push-notification-api:latest

# SteppersLife Website
docker run -d \
  --name stepperslife-web \
  --network caddy \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@stepperslife-db:5432/stepperslife \
  --restart unless-stopped \
  stepperslife-com:latest
```

### Step 13: Start Remaining Services
Use the docker-compose files or container configs from:
```
/root/vps-migration/configs/
```

### Step 14: Setup Cron Jobs
```bash
# Install management scripts
cp /root/vps-migration/scripts/*.sh /usr/local/bin/
chmod +x /usr/local/bin/*.sh

# Setup cron jobs (without backup)
(crontab -l 2>/dev/null; echo "*/30 * * * * /usr/local/bin/ollama-optimize.sh >> /var/log/ollama-optimize.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "*/15 * * * * /usr/local/bin/dynamic-memory-manager.sh >> /var/log/memory-manager.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 */6 * * * docker system prune -f --volumes >> /var/log/docker-cleanup.log 2>&1") | crontab -
```

### Step 15: Verify Everything
```bash
# Check all containers
docker ps

# Test each service
curl http://localhost:3000  # SteppersLife
curl http://localhost:3007  # Admin Dashboard
curl http://localhost:3009/api/metrics  # Metrics API

# Check Caddy status
systemctl status caddy
caddy validate --config /etc/caddy/Caddyfile
```

## Important Environment Variables
```bash
# Database
POSTGRES_PASSWORD=hes5SldOvxvh2llrZlwcjQXgj
DATABASE_URL=postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@stepperslife-db:5432/stepperslife

# Push Notifications
VAPID_PUBLIC_KEY=BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8
VAPID_PRIVATE_KEY=Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E
VAPID_SUBJECT=mailto:admin@agistaffers.com
```

## GitHub Repository
- **Repo**: https://github.com/watkinslabs/agi-staffers (if needed for pulling latest code)

## DNS Configuration (User needs to update)
All domains should point to: 72.60.28.175
- agistaffers.com
- *.agistaffers.com (wildcard)
- stepperslife.com

## Troubleshooting

### If services won't start:
1. Check Docker logs: `docker logs container-name`
2. Verify networks exist: `docker network ls`
3. Check port conflicts: `netstat -tlnp`
4. Ensure volumes restored: `docker volume ls`

### If SSL issues:
1. Check Caddy logs: `journalctl -u caddy -f`
2. Verify DNS propagation: `dig admin.agistaffers.com`
3. Test Caddy config: `caddy validate --config /etc/caddy/Caddyfile`

### If database connection fails:
1. Check database is running: `docker ps | grep stepperslife-db`
2. Test connection: `docker exec -it stepperslife-db psql -U postgres`
3. Verify network: `docker network inspect stepperslife_default`

## Success Criteria
- [ ] All 12 services running in Docker
- [ ] All domains accessible via HTTPS
- [ ] Database restored with 64 records
- [ ] Admin dashboard shows real-time metrics
- [ ] Push notifications configured
- [ ] Cron jobs scheduled (except backup)

## Time Estimate: 2-3 hours total
1. Docker/Caddy installation: 30 mins
2. Backup extraction: 15 mins
3. Image/volume restoration: 45 mins
4. Service startup: 30 mins
5. Configuration/testing: 30 mins
6. Troubleshooting buffer: 30 mins

## Notes
- DO NOT enable backup cron job (it caused disk space issues)
- All services use Docker except Caddy (native install)
- The migration backup is 5.4GB compressed
- Ensure firewall allows ports 80, 443, and SSH