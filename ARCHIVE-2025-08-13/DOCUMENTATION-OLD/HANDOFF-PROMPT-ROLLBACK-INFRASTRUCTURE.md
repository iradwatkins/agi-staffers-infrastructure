# 🚀 AI Agent Handoff: Emergency Rollback Infrastructure Implementation

## Context & Current Status

You are taking over the implementation of an emergency rollback system for AGI Staffers infrastructure. The BMAD method documentation, MCP configurations, and all preparatory work have been completed. Your task is to deploy the rollback infrastructure to the VPS.

## Critical Pre-Implementation Checklist

### 1. Verify MCP Servers are Active
Before starting, verify all MCP servers are working:
```bash
# Test in Claude chat (Cmd+K):
- "Use ref-tools to search for blue-green deployment"
- "Use exa to search for rollback best practices"
- "Use firecrawl to check https://admin.agistaffers.com"
- "Use shadcn-mcp to show button component demo"
```

### 2. Confirm API Keys are Configured
Check `~/.cursor/mcp.json` has these API keys:
- GitHub Token: `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`
- Exa API Key: `b85913a0-1aeb-4dcd-b21a-a83b9ec61ffd`
- Firecrawl API Key: `fc-b8dceff8862b4da482614bcf0ff001d6`

### 3. Review BMAD Documentation
- Main story: `.bmad/stories/2-in-progress/BMAD-001-rollback-timezone-implementation.md`
- MCP usage rules: `CLAUDE.md` (updated with mandatory MCP usage)
- Timezone guide: `.bmad/docs/timezone-configuration-guide.md`

## Implementation Plan

### Phase 1: Deploy Rollback Infrastructure (CURRENT TASK)

1. **Execute Deployment Script**
   ```bash
   cd /Users/irawatkins/Documents/Cursor Setup
   ./deploy-rollback-system.sh
   ```

2. **What This Script Does:**
   - Creates `/root/rollback-system/` directory structure on VPS
   - Uploads rollback scripts (snapshot, emergency rollback, health monitoring)
   - Configures Chicago timezone system-wide
   - Sets up automated snapshots (every 4 hours)
   - Creates systemd service for health monitoring
   - Prepares blue-green deployment containers

3. **Scripts Being Deployed:**
   - `rollback-scripts/create-snapshot.sh` - System state snapshots
   - `rollback-scripts/rollback-emergency.sh` - <2 minute rollback
   - `rollback-scripts/health-check.sh` - Auto-rollback triggers
   - `rollback-scripts/chicago-timezone-setup.sh` - Timezone conversion
   - `rollback-scripts/docker-compose.blue-green.yml` - Blue-green setup
   - `rollback-scripts/nginx-blue-green.conf` - Load balancer config

### Phase 2: Test Rollback System

1. **Create Initial Snapshot**
   ```bash
   ssh agi-vps '/root/rollback-system/scripts/create-snapshot.sh'
   ```

2. **Test Emergency Rollback**
   ```bash
   ssh agi-vps '/root/rollback-system/scripts/rollback-emergency.sh -s snapshot_[timestamp]'
   ```

3. **Verify Health Monitoring**
   ```bash
   ssh agi-vps 'systemctl status health-monitor'
   ssh agi-vps 'journalctl -u health-monitor -f'
   ```

### Phase 3: Deploy React Dashboard with Rollback

1. **Build React Dashboard**
   ```bash
   ssh agi-vps 'cd /root/agistaffers && docker build -t admin-dashboard:react-latest .'
   ```

2. **Deploy Blue-Green Containers**
   ```bash
   ssh agi-vps 'cd /root/rollback-system/configs && docker-compose -f docker-compose.blue-green.yml up -d'
   ```

3. **Test Blue-Green Switching**
   - Current (Blue): JavaScript dashboard on port 8080
   - New (Green): React dashboard on port 8081
   - Switch traffic by updating Caddy configuration

## Key Information

### VPS Access
- Host: 72.60.28.175
- Alias: `agi-vps`
- User: root

### Current Todo Status
- [x] Copy BMAD agent files and preserve download folder
- [x] Verify BMAD method with MCPs and extensions
- [x] Create BMAD documentation
- [x] Add ShadCN, Firecrawl, Figma MCP configurations
- [ ] **Implement emergency rollback infrastructure** ← YOU ARE HERE
- [ ] Convert system to Chicago timezone
- [ ] Set up blue-green deployment
- [ ] Deploy React dashboard with rollback
- [ ] Create health monitoring system
- [ ] Build update management page
- [ ] Test complete system

### BMAD Method Requirements
When implementing, adopt the appropriate persona:
- **BENCHMARK**: Use playwright for testing, exa for research
- **MODEL**: Use shadcn-mcp for any UI components needed
- **ANALYZE**: Use serena for code quality checks
- **DELIVER**: Combine all tools for production deployment

### Success Criteria
- Rollback capability in <2 minutes
- Zero data loss during rollback
- Chicago timezone across all systems
- Blue-green deployment working
- Health monitoring active

## Important Notes

1. **The download folder has been cleaned** - All necessary files are in `.bmad/`
2. **React dashboard already exists** in `/agistaffers/` - Don't recreate it
3. **Backup system exists** - Enhance it, don't duplicate
4. **Use MCP tools actively** - This is mandatory per CLAUDE.md

## First Actions

1. Verify all MCPs are working (test each one)
2. Review the deployment script at `deploy-rollback-system.sh`
3. Execute the deployment
4. Monitor the deployment progress
5. Test each component as it's deployed

Good luck! The system is fully prepared for you to execute the implementation.