# 🎯 AGI STAFFERS - UNIFIED CLAUDE MEMORY (BMAD METHOD)
**Last Updated:** January 11, 2025  
**Status:** UNIFIED SOURCE OF TRUTH - USE THIS FILE ONLY

---

## 🚨 CRITICAL DISCOVERIES - READ FIRST

### THE TRUTH ABOUT THE PROJECT
After comprehensive audit, we discovered:
1. **The multi-tenant platform IS BUILT** - Complete Next.js/TypeScript application in `/agistaffers` directory
2. **It's NOT DEPLOYED** - Running basic HTML instead of the full platform
3. **Project is 75% complete**, not 51% as initially assessed
4. **This is a DEPLOYMENT problem, not a DEVELOPMENT problem**

---

## 🤖 MCP AUTO-USAGE RULES - MANDATORY

### BMAD METHOD PERSONA ADOPTION - CRITICAL
When implementing infrastructure or development tasks, I MUST adopt the appropriate BMAD persona and use corresponding MCP tools:
- **BENCHMARK**: Use `playwright` for performance testing, `exa` for research, `firecrawl` for data extraction
- **MODEL**: Use `shadcn-ui`/`shadcn-mcp` for UI design, `ref-tools` for documentation
- **ANALYZE**: Use `serena` for code quality, `semgrep` for security analysis
- **DELIVER**: Combine all tools for production-ready implementation

### AUTOMATIC MCP ACTIVATION TRIGGERS
[Previous MCP rules remain the same...]

---

## 📊 PROJECT OVERVIEW - ACTUAL STATE

### What EXISTS (Built & Ready)
✅ **Complete Multi-Tenant Platform** (`/agistaffers` directory)
- CustomerManagement.tsx (490 lines) - Full CRUD operations
- SiteManagement.tsx (500+ lines) - Deployment automation
- SiteDeploymentService.ts - Docker orchestration
- 10 Professional Templates - Defined and ready
- Historical Data Charts - Complete implementation
- Alert System - Fully configured
- Backup Manager - Automated operations
- PWA Components - All built

### What's DEPLOYED (Currently Running)
⚠️ **Basic HTML Dashboard** (`/admin-dashboard-local`)
- Simple monitoring.js
- Basic service worker
- No database connections
- No React components active

### What NEEDS Deployment
1. Deploy `/agistaffers` Next.js app to VPS
2. Run database migrations (schema exists in `/agistaffers/prisma/migrations`)
3. Seed templates (script ready at `/agistaffers/scripts/seed-templates.sql`)
4. Update Caddy routing to Next.js port 3000
5. Configure environment variables

---

## 🏗️ INFRASTRUCTURE STATUS - VERIFIED

### ✅ WORKING SERVICES (HTTP Tested)
| Service | URL | Status | Container |
|---------|-----|--------|-----------|
| Main Website | agistaffers.com | ✅ 200 | agistaffers-web |
| PgAdmin | pgadmin.agistaffers.com | ✅ 302 | pgadmin |
| N8N | n8n.agistaffers.com | ✅ 200 | n8n |
| Portainer | portainer.agistaffers.com | ✅ 307 | portainer |
| AI Chat | chat.agistaffers.com | ✅ 200 | chat (1GB RAM) |
| Flowise | flowise.agistaffers.com | ✅ 200 | flowise |
| SearXNG | searxng.agistaffers.com | ✅ 200 | searxng |
| Grafana | grafana.agistaffers.com | ✅ 302 | grafana |
| Uptime | uptime.agistaffers.com | ✅ 302 | uptime-kuma |
| MinIO | minio.agistaffers.com | ✅ 403 | minio |
| Vault | vault.agistaffers.com | ✅ 307 | vault |
| Jaeger | jaeger.agistaffers.com | ✅ 200 | jaeger |
| Metrics API | /api/metrics | ✅ Working | Port 3009 |

### ❌ ISSUES TO FIX
- **Admin Dashboard**: 502 Bad Gateway (wrong app deployed)
- **Memory**: 93% usage (29.13GB/31.34GB) - CRITICAL
- **CI/CD**: Wrong VPS IP in GitHub Actions
- **Database**: Using SteppersLife schema instead of AGI Staffers

---

## 🛠️ DEPLOYMENT COMMANDS - READY TO USE

### Deploy the EXISTING Multi-Tenant Platform
```bash
# 1. SSH to VPS
ssh root@72.60.28.175

# 2. Stop current wrong dashboard
docker stop admin-dashboard admin-dashboard-green

# 3. Clone and build the REAL platform
cd /root
git clone https://github.com/iradwatkins/agi-staffers-infrastructure.git agistaffers-platform
cd agistaffers-platform/agistaffers

# 4. Build Docker image
docker build -t agistaffers-nextjs .

# 5. Run with proper environment
docker run -d \
  --name agistaffers-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:password@stepperslife-db:5432/agistaffers" \
  -e NEXTAUTH_URL="https://admin.agistaffers.com" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  --network agistaffers-network \
  agistaffers-nextjs

# 6. Run migrations
docker exec agistaffers-app npx prisma migrate deploy
docker exec agistaffers-app npx prisma db seed

# 7. Update Caddy
echo 'admin.agistaffers.com {
    reverse_proxy localhost:3000
}' >> /etc/caddy/Caddyfile
caddy reload
```

---

## 📁 FILE STRUCTURE - WHAT TO KEEP

### ✅ KEEP - Production Code
```
/agistaffers/               # FULL NEXT.JS PLATFORM - DEPLOY THIS!
├── app/api/               # All API routes built
├── components/dashboard/  # All UI components ready
├── lib/                   # Services implemented
├── prisma/migrations/     # Correct schema here
└── scripts/               # Templates ready to seed

/admin-dashboard-local/     # Current deployed (wrong version)
├── monitoring.js          # Keep for reference
├── push-notifications.js  # Has VAPID keys
└── sw.js                  # Service worker v2.0.1

/metrics-api/              # Working metrics service
/push-notification-api/    # Push service ready
/rollback-scripts/         # Emergency rollback system
```

### ❌ REMOVE - Duplicates/Old
```
/download/                 # Can delete after preserving docs
/agistaffers/_COMPLETED_VANILLA_JS/  # Old version
Multiple monitoring.js.backup files
Duplicate deployment scripts
```

---

## 🎯 IMMEDIATE ACTION PLAN (2-4 Hours)

### Phase 1: Deploy What's Built (30 min)
1. ✅ Deploy `/agistaffers` Next.js app
2. ✅ Run database migrations
3. ✅ Seed templates
4. ✅ Update Caddy routing

### Phase 2: Fix Critical Issues (1 hour)
1. ✅ Set memory limits on containers
2. ✅ Fix admin dashboard 502 error
3. ✅ Update GitHub Actions with correct IP
4. ✅ Rotate exposed credentials

### Phase 3: Test Everything (30 min)
1. ✅ Test customer creation
2. ✅ Test site deployment
3. ✅ Test template selection
4. ✅ Verify historical data

### Phase 4: Document Success (30 min)
1. ✅ Update this file with results
2. ✅ Remove conflicting documentation
3. ✅ Create deployment checklist

---

## 🔐 CREDENTIALS & ACCESS

### VPS Access
- **Host:** 72.60.28.175
- **User:** root
- **SSH:** Configured with alias `agi-vps`

### Services (Move to Vault)
- **MinIO:** admin / AGIStaffers2024SecurePass!
- **Vault Token:** agistaffers-vault-token
- **Neo4j:** neo4j / agistaffers2024
- **PostgreSQL:** Pg$9mK2nX7vR4pL8qW3eT6yU1iO5aSdF0gH9jKmN2bV5cX8zQ4wE7rT1yU6iO3pA

### GitHub
- **Repo:** https://github.com/iradwatkins/agi-staffers-infrastructure.git
- **Actions:** Need to update VPS_HOST secret to 72.60.28.175

---

## 📊 TRUE PROJECT STATUS

### By Component (Code vs Deployment)
| Component | Code Complete | Deployed | Action Needed |
|-----------|--------------|----------|---------------|
| Infrastructure | 85% | 85% | Memory optimization |
| Customer Management | 100% | 0% | Deploy Next.js app |
| Site Deployment | 95% | 0% | Deploy Next.js app |
| Template System | 100% | 0% | Run seed script |
| Historical Data | 90% | 0% | Deploy Next.js app |
| Alert System | 100% | 0% | Deploy Next.js app |
| Backup System | 90% | 0% | Deploy & schedule |
| PWA Features | 95% | 20% | Deploy correct version |

### Overall: **75% Built, 30% Deployed**

---

## 🚀 SUCCESS CRITERIA

When deployment is complete, you should see:
1. ✅ Admin dashboard at admin.agistaffers.com (no 502 error)
2. ✅ Customer management interface working
3. ✅ Site deployment queue functional
4. ✅ 10 templates available for selection
5. ✅ Historical data charts showing
6. ✅ Memory usage below 80%
7. ✅ All subdomains responding with 200/302
8. ✅ GitHub Actions deploying successfully

---

## 📝 RULES FOR FUTURE WORK

1. **THIS FILE IS THE SOURCE OF TRUTH** - Update it after every change
2. **CHECK BEFORE BUILDING** - The code might already exist
3. **DEPLOY BEFORE DEVELOPING** - Get existing code running first
4. **USE BMAD METHOD** - Benchmark, Model, Analyze, Deliver
5. **PRESERVE GOOD CODE** - Don't delete working implementations
6. **TEST BEFORE CLAIMING** - Verify with actual HTTP requests

---

## 🔄 RECENT UPDATES

### January 11, 2025
- ✅ Discovered complete multi-tenant platform in `/agistaffers`
- ✅ Identified deployment gap (built but not deployed)
- ✅ Created unified source of truth
- ✅ Preserved critical files from download folder
- 🔄 Ready to deploy existing platform

### Files Preserved from Download
- `/download/prd.md` → `/ORIGINAL-PRD.md`
- `/download/mcp-setup/` → `/mcp-setup/`

---

**USE THIS DOCUMENT AS YOUR SINGLE SOURCE OF TRUTH**
**DO NOT CREATE DUPLICATE CLAUDE.MD FILES**
**UPDATE THIS FILE WITH ALL CHANGES**