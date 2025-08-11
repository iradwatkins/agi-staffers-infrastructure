# AGI Staffers VPS Management System - Updated Product Requirements Document

## Executive Summary

**Product Vision**: Transform the existing AGI Staffers infrastructure (148.230.93.174) into a comprehensive web development and hosting platform, leveraging already-deployed AI services and adding a unified PWA management dashboard.

**Current State**: Server already running with multiple AI services (Open WebUI, N8N, Supabase, Flowise, etc.) and one live website (SteppersLife.com with 64 records).

**Target State**: Streamlined multi-website hosting with mobile PWA management, automated deployments, and integrated AI capabilities.

## Current Infrastructure Assets

### Existing Services Running
- **Open WebUI** (chat.agistaffers.com) - Port 3000
- **N8N Automation** (n8n.agistaffers.com) - Port 5678
- **Supabase Database** (db.agistaffers.com) - Port 5432
- **Flowise AI Builder** (flowise.agistaffers.com) - Port 3001
- **Ollama AI Models** (llama3.2, qwen2.5, codellama) - Port 11434
- **SteppersLife.com** - Live website with database (64 records)
- **Caddy** - SSL/TLS management already configured

### Server Access
- **IP**: 148.230.93.174
- **Admin**: iradwatkins@gmail.com
- **SSH Password**: Bobby321&Gloria321Watkins?
- **Plan**: Hostinger KVM4 ($10/month)

## Functional Requirements

### FR-001: Leverage Existing Infrastructure
**Description**: Build upon current Docker setup and running services
**Acceptance Criteria**:
- Use existing Supabase for centralized database needs
- Integrate N8N for automation workflows
- Utilize Ollama for AI-powered features
- Maintain all current services while adding new capabilities
**Priority**: Critical

### FR-002: PWA Management Dashboard
**Description**: Create admin dashboard at admin.agistaffers.com
**Acceptance Criteria**:
- Mobile-installable PWA using Next.js 14+
- Authentication using existing credentials (iradwatkins@gmail.com / Iw2006js!)
- Real-time monitoring of all containers
- Control panel for website management
- Integration with existing services (N8N, Supabase, etc.)
**Priority**: Critical

### FR-003: Website Isolation System
**Description**: Implement isolated containers for each client website
**Current Implementation**:
- SteppersLife already running (Port 3002, DB Port 5432)
- Reserved ports for future sites:
  - gangrunprinting.com (Port 3003)
  - uvcoatedclubflyers.com (Port 3004)
  - vaina.com.do (Port 3005)
  - elarmario.com.do (Port 3006)
**Acceptance Criteria**:
- Each site in separate Docker container
- Individual PostgreSQL databases
- Shared password: Pg$9mK2nX7vR4pL8qW3eT6yU1iO5aSdF0gH9jKmN2bV5cX8zQ4wE7rT1yU6iO3pA
**Priority**: Critical

### FR-004: Template System with Shadcn/ui
**Description**: Create reusable website templates
**Tech Stack**:
- Frontend: Next.js 14+ with React
- UI Components: Shadcn/ui
- Styling: Tailwind CSS
- Database: PostgreSQL (using existing setup)
**Templates Required**:
- Business website template
- Portfolio template
- E-commerce template (future)
**Priority**: High

### FR-005: GitHub Actions Deployment
**Description**: Automated deployment pipeline
**Repository**: [GitHub]/agistaffers-infrastructure
**Acceptance Criteria**:
- Push to main branch triggers deployment
- Zero-downtime updates using Docker
- Integration with existing Caddy for SSL
- Deployment notifications via N8N
**Priority**: High

### FR-006: Backup System Integration
**Description**: Automated backups using existing infrastructure
**Implementation**:
- Use N8N for scheduling
- Store backups in designated volumes
- Database dumps via pg_dump
- File backups via tar
**Priority**: Critical

### FR-007: AI Service Integration
**Description**: Leverage existing AI services for enhanced features
**Available Services**:
- Ollama for code generation assistance
- Flowise for AI workflows
- Open WebUI for chat interfaces
- SearXNG for private search
**Use Cases**:
- AI-powered content generation
- Code suggestions and debugging
- Automated customer support
**Priority**: Medium

## Non-Functional Requirements

### NFR-001: Performance
- Website load time: <3 seconds (like SteppersLife)
- PWA response: <1 second
- Container startup: <30 seconds
- Support 50+ websites on current VPS

### NFR-002: Security
- Use existing secure passwords from vault
- Maintain Caddy SSL/TLS management
- Container isolation via Docker networks
- SSH key authentication for deployment

### NFR-003: Reliability
- 99.9% uptime target
- Automatic container restart on failure
- Health checks via existing monitoring
- Disaster recovery <2 hours

## Technical Stack (Leveraging Existing)

| Component | Current | Addition Needed |
|-----------|---------|-----------------|
| **OS** | Ubuntu (Hostinger VPS) | ✓ Already configured |
| **SSL** | Caddy + Let's Encrypt | ✓ Working |
| **Database** | PostgreSQL (Supabase) | ✓ Running |
| **Containers** | Docker + Docker Compose | ✓ Installed |
| **Automation** | N8N | ✓ Configure workflows |
| **AI Models** | Ollama | ✓ Ready to use |
| **Frontend** | - | Next.js 14+ with Shadcn/ui |
| **Monitoring** | Portainer | ✓ Add PWA interface |
| **Backup** | - | Shell scripts + N8N |

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] VPS access configured
- [x] Docker environment ready
- [x] SSL/TLS via Caddy working
- [ ] Create PWA project structure
- [ ] Set up development environment with Cursor

### Phase 2: PWA Dashboard (Week 2-3)
- [ ] Create Next.js PWA at /root/admin-dashboard
- [ ] Implement authentication (iradwatkins@gmail.com)
- [ ] Connect to Docker API for container management
- [ ] Create website management interface
- [ ] Deploy to admin.agistaffers.com

### Phase 3: Template System (Week 4)
- [ ] Create base Next.js + Shadcn/ui template
- [ ] Implement customization system
- [ ] Test with first client website
- [ ] Document template usage

### Phase 4: Automation (Week 5)
- [ ] Configure GitHub Actions deployment
- [ ] Set up N8N automation workflows
- [ ] Implement backup scripts
- [ ] Test full deployment pipeline

### Phase 5: Production (Week 6)
- [ ] Deploy remaining client websites
- [ ] Performance optimization
- [ ] Documentation completion
- [ ] System validation

## Success Criteria

### Technical Validation
- [x] Multiple AI services running concurrently
- [x] SteppersLife.com operational with database
- [ ] PWA dashboard controlling all services
- [ ] Automated deployments via GitHub
- [ ] Backup/restore procedures tested

### Business Validation
- [ ] 5+ client websites hosted
- [ ] <30 minute deployment time
- [ ] Mobile management functional
- [ ] All services monitored via PWA
- [ ] Documentation complete

## Risk Mitigation

### Identified Risks
1. **Resource Constraints**: KVM4 plan may limit concurrent websites
   - Mitigation: Monitor usage, optimize containers, upgrade if needed

2. **Password Security**: Multiple complex passwords to manage
   - Mitigation: Use password vault, implement SSO where possible

3. **Service Conflicts**: Multiple services on various ports
   - Mitigation: Document port usage, use Docker networks for isolation

## Development Workflow

### Quick Start (Already Partially Complete)
```bash
# SSH into server (password: Bobby321&Gloria321Watkins?)
ssh root@148.230.93.174

# Navigate to project directories
cd /root/admin-dashboard  # For PWA
cd /root/websites         # For client sites

# Check running services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Connect with Cursor IDE
# Use Remote-SSH extension with root@148.230.93.174
```

### Repository Structure
```
/root/
├── local-ai-packaged/     # AI services (existing)
├── stepperslife/          # Live website (existing)
├── admin-dashboard/       # PWA management (new)
├── websites/              # Client websites (new)
│   ├── templates/         # Reusable templates
│   ├── gangrunprinting/   # Client site
│   └── vaina/            # Client site
└── backups/              # Automated backups
```

## Next Steps

1. **Immediate Actions**:
   - Create admin-dashboard directory structure
   - Initialize Next.js PWA project
   - Connect to existing Docker socket
   - Test container management APIs

2. **This Week**:
   - Complete PWA authentication
   - Create dashboard UI with Shadcn/ui
   - Implement container controls
   - Test on mobile devices

3. **Next Week**:
   - Create first website template
   - Set up GitHub Actions
   - Configure N8N automations
   - Deploy second client website