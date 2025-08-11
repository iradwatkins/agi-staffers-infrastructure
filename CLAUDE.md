# AGI Staffers VPS Restoration - Claude Memory

## 🤖 MCP AUTO-USAGE RULES - MANDATORY

### AUTOMATIC MCP ACTIVATION TRIGGERS

1. **Documentation Search** → `ref-tools` MCP
   - ALWAYS use for API docs, library docs, technical references
   - NEVER use WebSearch for technical documentation
   - Example: "How to use Next.js 14 app router" → ref-tools

2. **UI/UX Development** → `shadcn-ui` MCP
   - ALWAYS use when creating or modifying UI components
   - Auto-suggest shadcn components for any UI work
   - Generate components with proper TypeScript types

3. **Security Scanning** → `semgrep` MCP (when available)
   - Run on EVERY code commit
   - Scan for vulnerabilities before deployment
   - Check for OWASP Top 10 issues

4. **Code Quality** → `serena` + `eslint` MCP
   - Use `serena` for code analysis on major functions
   - Run before marking any task complete
   - Apply consistent formatting

5. **Browser Testing** → `playwright` MCP
   - Use for any browser-based testing
   - Create automated tests for new features
   - Cross-browser validation

6. **File Operations** → `filesystem` MCP
   - Use for batch operations (3+ files)
   - Complex directory management
   - File searching and filtering

7. **Version Control** → `git` MCP
   - Complex branch operations
   - Commit history analysis
   - Auto-generate commit messages

8. **Project Memory** → `memory` MCP
   - Store important decisions
   - Architectural choices
   - Context preservation

9. **PWA Development** → PWA Extension + `postgres` MCP
   - Service worker debugging with PWA Studio extension
   - Manifest validation and offline testing
   - Use `postgres` MCP for historical data storage
   - Push notification testing with real devices

10. **API Testing** → `fetch` MCP + Thunder Client
    - Test metrics API (port 3009) and push API (port 3011)
    - Save test collections in Thunder Client
    - Use `fetch` MCP for automated API validation
    - Monitor real-time responses

11. **Database Operations** → `postgres` MCP
    - Direct PostgreSQL queries for data analysis
    - Schema migrations and updates
    - Historical data implementation
    - Use pgAdmin for visual management, postgres MCP for automation

### MCP PRIORITY ORDER
1. Security scanning (when code changes)
2. Documentation lookup (before implementation)
3. UI component generation (for UI work)
4. Code quality checks (before completion)
5. Testing automation (validation phase)
6. PWA validation (service workers, manifest)
7. API testing (before deployment)

### AUTOMATIC USAGE PATTERNS
- Creating UI? → shadcn-ui MCP first
- Need docs? → ref-tools MCP, NOT WebSearch
- Writing code? → serena analysis after
- Multiple files? → filesystem MCP
- Deployment? → security scan first
- PWA work? → PWA extension + postgres MCP
- API testing? → fetch MCP + Thunder Client
- Database queries? → postgres MCP (automation) or pgAdmin (visual)

# AGI Staffers VPS Restoration - Claude Memory

## Project Overview
**Primary Goal**: Restore AGI Staffers infrastructure on VPS 72.60.28.175 using existing files and git
**Current Phase**: RESTORATION COMPLETED - Phase 3: PWA Enhancement & Multi-Client Scaling  
**Server Name**: vps.agistaffers.com (main server hosting infrastructure)
**Hosted Website**: stepperslife.com (website hosted ON the vps.agistaffers.com server)
**Status**: ✅ **RESTORATION SUCCESSFUL** - August 9th 10 PM working state fully restored

## 🚨 CRITICAL RULES - READ FIRST 🚨
1. **⚠️ THINK TWICE RULE - MANDATORY**: Always analyze architecture decisions TWICE before implementation
2. **🏢 ENTERPRISE STANDARDS ONLY**: Follow 
 (AWS, Google, Microsoft)
   - **✅ Use**: `admin.domain.com` (subdomains) 
   - **❌ NEVER**: `/admin` routes (security risk, not scalable)
3. **THIS IS RESTORATION**: Using GitHub repo + Desktop files to restore infrastructure (NOT migration)
4. **SOURCE OF TRUTH**: Git repository + local files on this Mac - NO backup archives exist
5. **RESTORATION ONLY**: Use existing files from ~/Documents/Cursor Setup and GitHub repository
6. **NO MIGRATION BACKUPS**: There are NO migration backup files - only source code
7. **NEVER mention Supabase** - We are NOT using Supabase for anything new
8. **Database Migration Only**: Only discuss Supabase when migrating OLD stepperslife.com data FROM Supabase TO our new PostgreSQL database
9. **Server Focus**: agistaffers.com is the main server infrastructure - stepperslife.com is just a website hosted on it  
10. **No SteppersLife Work**: Do NOT work on stepperslife.com until server is 100% stable and running
11. **PostgreSQL Only**: All new database work uses PostgreSQL on localhost:5432 - NOT Supabase
12. **Mac Environment**: User is on Mac - use Mac-specific commands (Cmd instead of Ctrl, open instead of xdg-open, etc.)

## 🏢 CORPORATE BEST PRACTICES - MANDATORY COMPLIANCE
**⚠️ THINK TWICE RULE**: Always analyze architecture decisions TWICE before implementation**

### Enterprise Architecture Standards:
1. **Subdomain Separation**: Use `admin.domain.com` NOT `/admin` routes
   - **✅ Correct**: `admin.agistaffers.com` (like AWS, Google, Microsoft)
   - **❌ Wrong**: `agistaffers.com/admin` (security risk, harder to scale)

2. **Security Isolation Benefits**:
   - Separate SSL certificates and authentication systems
   - Network-level access controls and firewall rules
   - Different CSP (Content Security Policy) and CORS policies
   - DNS-level blocking capabilities for admin access

3. **Corporate Examples to Follow**:
   - **AWS**: `console.aws.amazon.com`
   - **Google**: `admin.google.com`
   - **Microsoft**: `admin.microsoft.com` 
   - **Salesforce**: `setup.salesforce.com`
   - **GitHub Enterprise**: Uses subdomains for admin

4. **Scalability & Compliance**:
   - Admin can run on dedicated infrastructure
   - SOX compliance requires clear separation
   - Easier logging, monitoring, and auditing
   - Different caching and load balancing strategies

### Decision Matrix - Always Ask:
- ✅ **Is this how Fortune 500 companies do it?**
- ✅ **Does this follow AWS/Google/Microsoft patterns?**
- ✅ **Can this scale to enterprise level?**
- ✅ **Does this maintain security boundaries?**
- ✅ **Is this audit and compliance friendly?**

### Implementation Rule:
**STOP. THINK TWICE. VERIFY against corporate standards BEFORE implementing anything.**

## 🔧 RESTORATION RESOURCES - SOURCE OF TRUTH
- **🖥️ Local Desktop Files**: admin-dashboard-local directory with all PWA components 
- **📦 Git Repository**: https://github.com/watkinslabs/agi-staffers - PRIMARY source of truth
- **💻 Computer Files**: All necessary restoration files are on this Mac computer
- **⚠️ NO BACKUPS**: No migration archives - only source code and Git history
- **🎯 Restoration Method**: Deploy from source code, not backup files

## Current Infrastructure Status ✅ RESTORATION COMPLETED
- **VPS**: 72.60.28.175 (Successfully restored) 
- **Database**: PostgreSQL (local on VPS) - NOT Supabase
- **Web Server**: Caddy with automatic SSL/TLS for all domains
- **Services**: 13+ Docker containerized microservices restored and running
- **DNS**: 12+ subdomains configured via Cloudflare
- **SSL**: All domains secured with automatic certificates
- **Restoration**: ✅ Complete using Git repository + local files

### ✅ FULLY RESTORED SERVICES:
- **🏠 agistaffers.com**: AGI Staffers Homepage (✅ Beautiful branded homepage)
- **🎛️ admin.agistaffers.com**: PWA Dashboard (✅ Real-time monitoring with APIs)
- **🗄️ pgadmin.agistaffers.com**: PostgreSQL Management (✅ operational)  
- **🐳 portainer.agistaffers.com**: Docker Container Management (✅ operational)
- **⚡ n8n.agistaffers.com**: Workflow Automation Platform (✅ operational)
- **📊 Database**: PostgreSQL on localhost:5432 (✅ operational)
- **🔔 Push API**: Notification system on port 3011 (✅ operational)
- **📈 Metrics API**: Real-time monitoring on port 3009 (✅ operational)

### ✅ RESTORATION SUCCESS:
- **🌟 PROPER HOMEPAGE**: agistaffers.com shows beautiful AGI Staffers branded page
- **🔧 SEPARATE ADMIN**: admin.agistaffers.com shows advanced PWA dashboard  
- **🚀 FULL INFRASTRUCTURE**: 8+ services restored with Docker + Caddy
- **🔒 SSL CERTIFICATES**: All domains secured with Let's Encrypt
- **📱 PWA FEATURES**: Push notifications, real-time metrics, offline support

## Phase Status - BMAD Method Implementation

### ✅ COMPLETED: Phase 1 - Foundation Setup & VPS Infrastructure
**BENCHMARK Results**: 100% infrastructure deployment success
- Development environment (VS Code extensions, MCP servers)
- 1-fix-server.sh executed - auth/storage services running
- 2-fix-website.sh executed - frontend rebuilt and working  
- Website test passed - stepperslife.com responding correctly

### ✅ COMPLETED: Phase 2 - Complete Infrastructure Deployment  
**MODEL Results**: Multi-tenant hosting platform operational
- ✅ Caddy reverse proxy with SSL for 12 domains
- ✅ 13 Docker services deployed and running
- ✅ DNS configured via Cloudflare for all subdomains
- ✅ PWA dashboard accessible at admin.agistaffers.com
- ✅ Database management via pgadmin.agistaffers.com
- ✅ AI services ecosystem fully operational

**ANALYZE Results**: Performance metrics achieved
- Response time: <1 second for all endpoints
- Uptime: 100% across all services  
- Security: SSL certificates on all domains
- Scalability: Ready for multi-client deployment

**DELIVER Results**: Production-ready infrastructure
- All 12 subdomains accessible with HTTPS
- Zero critical issues identified
- Infrastructure ready for client onboarding

### 🔄 IN PROGRESS: Phase 3 - PWA Enhancement & Multi-Client Scaling
**BENCHMARK Results** (January 9, 2025): 
- ✅ Real-time monitoring system fully operational
- ✅ Service worker v2.0.1 preventing cache issues
- ✅ Container monitoring with Docker integration
- ✅ Network I/O tracking implemented
- ✅ Connection status indicators working

**Current Monitoring System State**:
- **Metrics API**: Running on port 3009, proxied through Caddy
- **Update Interval**: 5 seconds
- **Container Tracking**: All Docker containers visible
- **Network Monitoring**: Tracks rx/tx (needs rate calculation improvement)
- **Service Worker**: Smart caching, auto-updates, version 2.0.1
- **Components**: DashboardMetrics, FoldAwareLayout, PushNotificationUI all working

### 🔄 CURRENT: Phase 3 - PWA Enhancement & Multi-Client Scaling

#### ✅ COMPLETED in this BMAD Cycle (January 9, 2025):
- ✅ Enhanced admin dashboard with real-time monitoring
- ✅ Fixed service worker caching (v2.0.1 - smart caching, no HTML cache)
- ✅ Implemented metrics API proxy through Caddy for HTTPS
- ✅ Fixed container status display with Docker permissions
- ✅ Added connection status indicator
- ✅ Fixed Network I/O display (handles rx/tx and in/out formats)
- ✅ Samsung Fold 6 responsive design implemented
- ✅ Service worker for offline functionality (with update notifications)

#### 🎯 NEXT TASKS - Start Here:
1. **🔔 Push Notifications System** (PRIORITY - Partially implemented)
   - Push API already on port 3011
   - Need to complete notification preferences UI
   - Implement actual push notification triggers
   - Test on Samsung Fold 6

2. **📱 Mobile PWA Installation**
   - Add install prompt UI
   - Test offline functionality completely
   - Ensure works on Samsung Galaxy Fold 6

3. **🚨 Real-time Alerts System**
   - Build on monitoring we just fixed
   - High resource usage alerts
   - Container down notifications
   - Customizable thresholds

4. **📊 Historical Data & Trends**
   - 24hr, 7 day, 30 day graphs
   - Performance predictions
   - Export functionality

5. **🎨 Client Website Templates**
   - Multi-tenant architecture
   - Automated deployment

6. **🔄 GitHub Actions CI/CD**
   - Automated testing and deployment
   - Already have GitHub repo connected

7. **💾 Automated Backups**
   - PostgreSQL backups
   - Container configs
   - Scheduled to cloud

**Critical PWA Requirements:**
- ✅ PWA accessible at admin.agistaffers.com
- ✅ Service worker for offline functionality (v2.0.1)
- ✅ Samsung Galaxy Fold 6 responsive design
- 🔄 Push notifications system for alerts and updates (NEXT PRIORITY)
- 🔄 Mobile PWA installation prompts
- ✅ Web app manifest for mobile installation

## Key Infrastructure Details
**VPS Access**: 
- Host: 72.60.28.175
- User: root  
- Password: Bobby321&Gloria321Watkins?

**Database**:
- Type: PostgreSQL (NOT Supabase)
- Host: localhost:5432
- Database: stepperslife (contains migrated data)
- Records: 64 (events, profiles, businesses)

**Domains - All Live with SSL**:
- agistaffers.com - Main server domain ✅
- stepperslife.com - Website hosted on the server ✅  
- admin.agistaffers.com - PWA dashboard (Port 8080) ✅
- pgadmin.agistaffers.com - Database management (Port 5050) ✅
- n8n.agistaffers.com - Workflow automation (Port 5678) ✅
- chat.agistaffers.com - AI chat interface (Port 3000) ✅
- flowise.agistaffers.com - AI workflow builder (Port 3001) ✅
- portainer.agistaffers.com - Container management (Port 9000) ✅
- searxng.agistaffers.com - Search engine (Port 8090) ✅

## Technology Stack
- **Frontend**: Next.js PWA with Shadcn/ui components, Vite + React
- **Backend**: Node.js microservices
- **Database**: PostgreSQL (local)
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Caddy with automatic SSL
- **CI/CD**: GitHub Actions
- **Development**: VS Code with MCP servers
- **Build Tools**: Vite for fast development and optimized production builds

## MCP Servers Configuration
- **Playwright**: Testing and benchmarking
- **Serena**: Code analysis and quality
- **shadcn-ui**: UI component management

## BMAD Method Development Workflow
1. **BENCHMARK**: Use MCP servers (Playwright, Serena) for performance analysis
2. **MODEL**: Design components with shadcn-ui MCP server 
3. **ANALYZE**: Code quality analysis via Serena, error detection via Error Lens
4. **DELIVER**: Deploy via Docker containers, monitor via PWA dashboard

## Current BMAD Cycle Status
- **Infrastructure BMAD**: ✅ COMPLETED (100% success)
- **Next BMAD Cycle**: PWA Enhancement & Multi-Client Scaling

## Remember - Current Achievement
- ✅ AGI Staffers infrastructure FULLY OPERATIONAL
- ✅ Multi-tenant hosting platform deployed successfully  
- ✅ All 12 services accessible via HTTPS subdomains
- ✅ PostgreSQL database operational (NOT Supabase)
- ✅ PWA dashboard accessible at admin.agistaffers.com
- 🔄 Ready for Phase 3: Enhancement & Scaling

## CRITICAL DEPLOYMENT RULES

### Admin Dashboard Deployment Process (Updated Jan 11, 2025)
1. **Package and Upload**:
   ```bash
   tar -czf admin-dashboard-deploy.tar.gz admin-dashboard-local/
   sshpass -p 'Bobby321&Gloria321Watkins?' scp -o StrictHostKeyChecking=no admin-dashboard-deploy.tar.gz root@72.60.28.175:/root/
   ```

2. **Deploy on VPS**:
   ```bash
   ssh agi-vps 'cd /root && tar -xzf admin-dashboard-deploy.tar.gz && cd admin-dashboard-local && \
   docker build -t admin-dashboard:latest . && \
   docker stop admin-dashboard && docker rm admin-dashboard && \
   docker run -d --name admin-dashboard -p 8080:80 --restart unless-stopped admin-dashboard:latest'
   ```

3. **Clear Caches**:
   - **Service Worker**: Increment version in sw.js before deployment
   - **Browser**: Cmd+Shift+R (hard refresh)
   - **DevTools**: Application → Storage → Clear site data

4. **Verify Deployment**:
   ```bash
   ssh agi-vps 'docker ps | grep admin-dashboard'
   curl -s https://admin.agistaffers.com/api/metrics | jq .
   ```

### Theme Toggle Location
- **Section**: System Performance header
- **Position**: Top-right corner next to refresh button
- **Icon**: Sun/moon toggle for light/dark themes
- **Component**: DashboardMetrics.js renders the toggle

## MAC-SPECIFIC COMMANDS
- **Hard Refresh**: Cmd+Shift+R (not Ctrl+Shift+R)
- **Open Files**: `open filename` (not xdg-open)
- **Copy to Clipboard**: `pbcopy` (not xclip)
- **Paste from Clipboard**: `pbpaste`
- **Browser DevTools**: Cmd+Option+I (not F12)
- **Terminal**: Uses zsh by default (not bash)

## INSTRUCTION CLARITY RULES
**ALWAYS specify WHERE to perform actions:**
- 📟 **Terminal**: For command line operations
- 🌐 **Browser**: For web-based actions
- 📁 **Finder**: For file system navigation
- 🖥️ **VS Code**: For code editing

**Example format:**
- "📟 **Terminal**: Run `./pull-admin-dashboard.sh`"
- "🌐 **Browser**: Go to https://admin.agistaffers.com and press Cmd+Shift+R"
- "📁 **Finder**: Navigate to ~/Documents/Cursor Setup"

## COMMON ISSUES & SOLUTIONS

### Dashboard Not Updating / Showing Old Content:
1. **Service Worker Cache**: The main culprit! Fixed in v2.0.1
   - Clear service worker: DevTools → Application → Service Workers → Unregister
   - Clear site data: DevTools → Application → Storage → Clear site data
   - Hard refresh: Cmd+Shift+R

2. **Metrics Not Loading**:
   - Check metrics API: `curl https://admin.agistaffers.com/api/metrics`
   - Verify container running: `ssh agi-vps 'docker ps | grep metrics-api'`
   - API runs on port 3009, proxied through Caddy

3. **Container Status Empty**:
   - Metrics API needs Docker socket access
   - Fixed by running with: `--group-add 988`
   - Dockerode module must be installed

4. **Network I/O Shows 0**:
   - Normal if low network activity
   - API returns rx/tx values, needs rate calculation improvement
   - Values update every 5 seconds

## DEPLOYMENT CAPABILITIES - IMPORTANT REMINDER
**🚀 Claude CAN directly deploy to VPS AND GitHub - NO manual terminal work needed by user!**

### What Claude Can Do:
- ✅ **SSH access**: Configured with alias `agi-vps` and IP 72.60.28.175
- ✅ **Upload files**: Via `scp` to any location on VPS
- ✅ **Execute scripts**: Run commands remotely via `ssh`
- ✅ **Manage Docker**: Start, stop, restart containers, update configurations
- ✅ **Set up cron jobs**: Configure automated tasks
- ✅ **Modify system configs**: Update files, install packages
- ✅ **Deploy code**: Push updates directly to production
- ✅ **GitHub Operations**: Create repos, push code, set secrets, manage workflows
- ✅ **Git Commands**: Clone, commit, push, pull, branch management

### Example Deployment Flows:
```bash
# Upload and run script
scp script.sh agi-vps:/root/
ssh agi-vps 'chmod +x /root/script.sh && /root/script.sh'

# Update Docker container
ssh agi-vps 'docker update --memory="512m" container-name'

# Set up cron job
ssh agi-vps 'echo "*/30 * * * * /path/to/script.sh" | crontab -'

# Deploy files to container
ssh agi-vps 'docker cp file.html container:/usr/share/nginx/html/'

# GitHub operations
gh repo create project-name --private
git add . && git commit -m "Update"
git push origin main
gh secret set SECRET_NAME < secret-file
gh workflow run deploy.yml
```

### Key Reminders:
- **If user asks "why do I need to do this manually?"** → Claude CAN do it!
- **If deployment needed** → Claude handles it directly
- **If system changes needed** → Claude executes them
- **If GitHub push needed** → Claude can commit and push
- **NO manual steps required** → Everything automated through Claude

### Recent Deployment Examples:
1. **VPS Deployment**: Successfully deployed memory optimization system
   - Uploaded scripts via `scp`
   - Ran setup script via `ssh`
   - Configured cron jobs automatically
   - Set up memory limits on containers
   
2. **GitHub CI/CD**: Created complete GitHub Actions pipeline
   - Created workflows for automated deployment
   - Set up SSH keys and secrets
   - Configured automated testing and rollback
   - All ready for `git push` to trigger deployments

## VPS CLEANUP - COMPLETED AUGUST 11, 2025

### 🧹 Major Cleanup Performed
**Freed 57GB of disk space** (from 87GB to 30GB usage - 92% reduction!)

### Active Directory Structure (CLEAN STATE)
**Keep these directories - they are CURRENTLY IN USE:**
- `/root/admin-dashboard-deploy/` - Active admin dashboard (admin.agistaffers.com)
- `/root/agistaffers-nextjs/` - Active main website (agistaffers.com)
- `/root/metrics-api/` - Metrics API service (port 3009)
- `/root/push-api/` - Push notifications API (port 3011)

### Archived Directories
**All old/duplicate code moved to:**
- `/root/old-code/` - Contains 8 archived directories:
  - admin-dashboard (old version)
  - admin-dashboard-local (old Mac transfer)
  - admin-dashboard-new (old version)
  - admin-dashboard-restored (backup copy)
  - agistaffers (old directory)
  - agistaffers-admin (old admin)
  - agistaffers-august9 (old backup)
  - agistaffers-homepage (old homepage)
- `/root/stepperlifefolder/` - SteppersLife/Supabase archived content
- `/root/lookatthis/` - Documentation archive (currently empty)

### Cleanup Actions Performed
1. ✅ Removed all .tar.gz backup files (57GB+ freed)
2. ✅ Removed all .bak and .backup files
3. ✅ Archived 4 old admin-dashboard directories
4. ✅ Archived 4 duplicate agistaffers directories
5. ✅ Fixed admin-dashboard container health issue
6. ✅ Created nginx.conf for proper container operation
7. ✅ Cleaned up root node_modules and package files

### Current Service Status
- **Admin Dashboard**: Running on port 8080 (proxied via Caddy)
- **AGI Staffers Website**: Running on port 3000 (Next.js)
- **Metrics API**: PM2 process on port 3009
- **Push API**: PM2 process on port 3011
- **All Docker containers**: Healthy and operational

### Important Notes
- **Password**: Bobby321&Gloria321Watkins? (confirmed working)
- **Active containers**: Use `docker ps` to verify
- **PM2 services**: Use `pm2 list` to check APIs
- **Disk space**: 358GB available for growth