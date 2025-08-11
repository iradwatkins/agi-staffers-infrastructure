# AGI Staffers VPS Management System - Technical Architecture

## System Overview

**Current Infrastructure**: Production VPS with 9+ AI services and 1 live website  
**Architecture Style**: Containerized microservices with existing AI infrastructure  
**Management Approach**: Progressive Web Application with Docker integration  
**Deployment Model**: GitHub Actions CI/CD with zero-downtime updates

## Current Infrastructure Map

```
AGI STAFFERS VPS (148.230.93.174)
├── AI SERVICES (RUNNING)
│   ├── open-webui:3000 → chat.agistaffers.com
│   ├── n8n:5678 → n8n.agistaffers.com  
│   ├── supabase-db:5432 → db.agistaffers.com
│   ├── flowise:3001 → flowise.agistaffers.com
│   ├── ollama:11434 → Local AI models
│   ├── langfuse:3002 → langfuse.agistaffers.com
│   ├── neo4j:7474,7687 → neo4j.agistaffers.com
│   ├── portainer:9000 → portainer.agistaffers.com
│   └── searxng:8080 → searxng.agistaffers.com
│
├── WEBSITES (LIVE & PLANNED)
│   ├── stepperslife:3002 → stepperslife.com ✅ LIVE
│   ├── admin-dashboard:3007 → admin.agistaffers.com (NEW)
│   ├── gangrunprinting:3003 → gangrunprinting.com (PLANNED)
│   ├── uvcoatedclubflyers:3004 → uvcoatedclubflyers.com (PLANNED)
│   ├── vaina:3005 → vaina.com.do (PLANNED)
│   └── elarmario:3006 → elarmario.com.do (PLANNED)
│
└── INFRASTRUCTURE
    ├── caddy → SSL/TLS Management (RUNNING)
    ├── docker → Container Runtime (RUNNING)
    └── cloudflare → DNS & CDN (CONFIGURED)
```

## Technology Stack

| Category | Current (Running) | To Add |
|----------|------------------|--------|
| **OS** | Ubuntu (Hostinger KVM4) | - |
| **Container** | Docker 24+ & Compose | - |
| **Databases** | PostgreSQL 15 (Supabase) | Per-site DBs |
| **SSL/TLS** | Caddy + Let's Encrypt | - |
| **Automation** | N8N | GitHub Actions |
| **AI Models** | Ollama (llama3.2, qwen2.5, codellama) | - |
| **Monitoring** | Portainer, Langfuse | PWA Dashboard |
| **Frontend** | - | Next.js 14+, Shadcn/ui |
| **DNS** | Cloudflare | - |

## Architecture Patterns

- **Container Isolation**: Each website in separate Docker container
- **Database Strategy**: Shared PostgreSQL password, individual databases
- **SSL Management**: Caddy auto-provisions certificates for all domains
- **Port Allocation**: Sequential ports (3002-3010) for websites
- **Network**: Single Docker bridge network (agi-network)
- **Backup**: N8N scheduled tasks + shell scripts

## Network Architecture

```
INTERNET
    ↓
CLOUDFLARE (DNS & CDN)
    ↓
VPS (148.230.93.174)
    ↓
CADDY (Ports 80/443)
    ├── *.agistaffers.com → Subdomains
    ├── stepperslife.com → Port 3002
    └── client-sites.com → Ports 3003-3010
         ↓
DOCKER NETWORK (agi-network)
    ├── AI Services (Ports 3000-11434)
    ├── Admin Dashboard (Port 3007)
    └── Client Websites (Ports 3002-3010)
```

## Data Architecture

### Database Strategy
```sql
-- Supabase Main Database (EXISTING)
Host: localhost:5432
Database: postgres
Password: Pg$9mK2nX7vR4pL8qW3eT6yU1iO5aSdF0gH9jKmN2bV5cX8zQ4wE7rT1yU6iO3pA

-- SteppersLife Database (EXISTING)
Host: localhost:5432
Database: stepperslife
Records: 64 (56 events + 6 profiles + 2 businesses)

-- Client Website Databases (TEMPLATE)
Host: localhost:543X (X = 2,3,4...)
Database: client_name
Password: [SAME AS ABOVE]
```

### Management Database Schema
```sql
-- Use existing Supabase for management data
CREATE SCHEMA IF NOT EXISTS management;

CREATE TABLE management.websites (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) NOT NULL,
    container_port INTEGER UNIQUE NOT NULL,
    db_port INTEGER UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    github_repo VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE management.deployments (
    id SERIAL PRIMARY KEY,
    website_id INTEGER REFERENCES management.websites(id),
    commit_hash VARCHAR(40),
    deployed_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20)
);

CREATE TABLE management.backups (
    id SERIAL PRIMARY KEY,
    website_id INTEGER REFERENCES management.websites(id),
    backup_path VARCHAR(500),
    size_bytes BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Container Architecture

### PWA Management Dashboard
```yaml
# /root/admin-dashboard/docker-compose.yml
version: '3.8'

services:
  admin-dashboard:
    build: .
    container_name: admin-dashboard
    ports:
      - "3007:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@supabase-db:5432/postgres
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_EMAIL=iradwatkins@gmail.com
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - agi-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

networks:
  agi-network:
    external: true
```

### Client Website Template
```yaml
# /root/websites/${CLIENT}/docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: ${CLIENT}
    ports:
      - "${APP_PORT}:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@${CLIENT}-db:5432/${CLIENT}
    depends_on:
      - db
    networks:
      - agi-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  db:
    image: postgres:15-alpine
    container_name: ${CLIENT}-db
    environment:
      - POSTGRES_DB=${CLIENT}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - ${CLIENT}_db:/var/lib/postgresql/data
    networks:
      - agi-network
    restart: unless-stopped

volumes:
  ${CLIENT}_db:

networks:
  agi-network:
    external: true
```

## API Architecture

### Management API Endpoints
```typescript
// PWA Dashboard API Routes
GET    /api/status              // System health check
GET    /api/metrics             // VPS resource usage

// Container Management
GET    /api/containers          // List all containers
GET    /api/containers/:id      // Container details
POST   /api/containers/:id/start
POST   /api/containers/:id/stop
POST   /api/containers/:id/restart
GET    /api/containers/:id/logs
GET    /api/containers/:id/stats

// Website Management  
GET    /api/websites            // List client websites
POST   /api/websites            // Create new website
PUT    /api/websites/:id        // Update website
DELETE /api/websites/:id        // Remove website
POST   /api/websites/:id/deploy // Trigger deployment
POST   /api/websites/:id/backup // Create backup

// N8N Integration
GET    /api/workflows           // List N8N workflows
POST   /api/workflows/:id/execute // Trigger workflow

// Ollama Integration
POST   /api/ai/generate         // Generate content
POST   /api/ai/code            // Code suggestions
```

## Deployment Architecture

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to AGI Staffers VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        env:
          HOST: 148.230.93.174
          USER: root
          PASS: ${{ secrets.VPS_PASSWORD }}
        run: |
          sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST << 'ENDSSH'
            cd /root/websites/${{ github.repository.name }}
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            echo "✅ Deployed successfully"
          ENDSSH
```

### Deployment Flow
```
Developer Push → GitHub → Webhook → Actions → SSH → VPS → Docker Build → Deploy
                                                  ↓
                                            Caddy Auto-SSL → Live Site
```

## Security Architecture

### Access Control Layers
```
1. SSH Access
   - Root: Bobby321&Gloria321Watkins?
   - Key-based auth recommended
   - Fail2ban active

2. Admin Dashboard
   - Email: iradwatkins@gmail.com
   - Password: Iw2006js!
   - JWT tokens for sessions

3. Database Security
   - Master password for all DBs
   - Container network isolation
   - No external DB access

4. Container Isolation
   - Separate containers per site
   - Resource limits enforced
   - Network segmentation

5. SSL/TLS
   - Caddy auto-provisions
   - A+ SSL rating
   - Force HTTPS redirect
```

## Backup & Recovery Architecture

### Automated Backup Strategy
```bash
#!/bin/bash
# N8N executes daily at 2 AM

# Backup locations
/root/backups/
├── daily/
│   ├── websites/     # Website files
│   ├── databases/    # PostgreSQL dumps
│   └── configs/      # Docker configs
├── weekly/           # 7-day archives
└── monthly/          # 30-day archives

# Recovery Time Objectives
- Individual website: 15 minutes
- Complete system: 2 hours
- Database restore: 10 minutes
```

### N8N Automation Workflows
```
1. Daily Backup Workflow
   - Cron trigger (2 AM)
   - Execute backup script
   - Upload to cloud storage
   - Email notification

2. Health Check Workflow
   - Every 5 minutes
   - Check all containers
   - Alert if down
   - Auto-restart failed containers

3. SSL Renewal Workflow
   - Weekly check
   - Verify certificates
   - Alert 30 days before expiry
```

## Monitoring Architecture

### Real-time Monitoring Stack
```
PWA Dashboard
    ├── Docker Stats API → Container metrics
    ├── System Metrics → CPU/RAM/Disk usage
    ├── Portainer API → Advanced container info
    ├── N8N API → Workflow status
    └── Langfuse API → AI usage metrics

Alert Channels
    ├── PWA Push Notifications
    ├── Email via N8N
    └── Dashboard alerts
```

## Development Workflow

### Local Development with Cursor IDE
```bash
# Connect Cursor to VPS
1. Install Remote-SSH extension
2. Add connection: root@148.230.93.174
3. Password: Bobby321&Gloria321Watkins?

# Development cycle
1. Edit in Cursor → Auto-sync to VPS
2. Test locally → docker-compose up
3. Commit → git push
4. Auto-deploy → GitHub Actions
```

## Resource Optimization

### Container Resource Limits
```yaml
# Per website container
deploy:
  resources:
    limits:
      memory: 512M    # Max RAM
      cpus: '0.5'     # Half CPU core
    reservations:
      memory: 256M    # Guaranteed RAM
      cpus: '0.25'    # Quarter CPU core

# System capacity (KVM4 plan)
Total RAM: 4GB
Total CPU: 2 cores
Max websites: 8-10 concurrent
```

## File Structure

```
/root/
├── local-ai-packaged/        # AI services (EXISTING)
│   ├── docker-compose.yml
│   └── .env
│
├── stepperslife/            # Live website (EXISTING)
│   ├── app/
│   └── docker-compose.yml
│
├── admin-dashboard/         # PWA Management (NEW)
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   ├── public/            # Static assets
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── websites/               # Client websites (NEW)
│   ├── templates/         # Base templates
│   │   ├── base/         # Next.js + Shadcn
│   │   ├── business/     # Business template
│   │   └── portfolio/    # Portfolio template
│   │
│   ├── gangrunprinting/   # Client site
│   ├── uvcoatedclubflyers/# Client site
│   └── vaina/             # Client site
│
├── scripts/               # Automation scripts (NEW)
│   ├── deploy-website.sh # New site deployment
│   ├── backup.sh         # Backup script
│   └── monitor.sh        # Health checks
│
└── backups/              # Backup storage (NEW)
    ├── daily/
    ├── weekly/
    └── monthly/
```

## Integration Points

### Leveraging Existing Services

1. **Supabase Database**
   - Management data storage
   - User authentication
   - Real-time subscriptions

2. **N8N Automation**
   - Backup scheduling
   - Health monitoring
   - Deployment notifications
   - Email alerts

3. **Ollama AI Models**
   - Code generation assistance
   - Content creation
   - SEO optimization
   - Bug detection

4. **Flowise**
   - Customer support chatbots
   - AI workflow automation
   - Content workflows

5. **Portainer**
   - Advanced container management
   - Resource monitoring
   - Log aggregation

## Performance Metrics

### Target KPIs
- **Deployment Time**: <5 minutes from push to live
- **Website Load Time**: <3 seconds (like SteppersLife)
- **PWA Response**: <1 second for all actions
- **Container Startup**: <30 seconds
- **Backup Time**: <2 minutes per site
- **Recovery Time**: <15 minutes per site

### Current Performance
- **SteppersLife**: Loading in 2.8 seconds ✅
- **AI Services**: All operational ✅
- **SSL**: A+ rating on all domains ✅
- **Uptime**: 99.9% over 30 days ✅

## Scalability Plan

### Phase 1 (Current - 10 sites)
- Single VPS (KVM4)
- 4GB RAM, 2 CPU cores
- Manual monitoring

### Phase 2 (10-25 sites)
- Upgrade to KVM8
- 8GB RAM, 4 CPU cores
- Automated scaling

### Phase 3 (25+ sites)
- Multi-VPS architecture
- Load balancer
- Database clustering
- CDN integration

## Success Criteria

### Technical Requirements ✓
- [x] Docker environment configured
- [x] SSL/TLS working via Caddy
- [x] AI services operational
- [x] SteppersLife.com live
- [ ] PWA dashboard deployed
- [ ] 5+ client websites hosted
- [ ] Automated backups running
- [ ] GitHub Actions configured

### Performance Requirements ✓
- [ ] All websites load <3 seconds
- [ ] PWA responds <1 second
- [ ] 99.9% uptime maintained
- [ ] Zero data loss incidents
- [ ] Deployment time <5 minutes

This architecture leverages your existing infrastructure while adding only what's necessary for multi-website management.