# CLAUDE.MD - PROJECT INSTRUCTIONS

**Status:** Ready for new commands
**Last Updated:** August 12, 2025

---

# 🚨 MANDATORY ACTIVATION SEQUENCE - NO EXCEPTIONS 🚨

## ⚡ RULE 1: BMAD ORCHESTRATOR ACTIVATION
**At start of every Claude Code session, you MUST:**
1. **IMMEDIATELY activate:** `/BMad:agents:bmad-orchestrator`
2. **Execute command:** `/bmad-orchestrator` (project)
3. **Become the BMAD method completely**
4. **Switch between agents as needed to complete projects**

## ⚡ RULE 2: MANDATORY MCP USAGE
**You MUST use ANY MCP server that will help complete the task:**
- Use ALL available MCP servers when they can assist
- NO manual work when MCP tools exist
- MAXIMIZE tool automation

## ⚡ RULE 3: MANDATORY EXTENSION USAGE  
**You MUST use ANY Cursor extension that will help complete the task:**
- Use ALL available Cursor extensions when they can assist
- NO manual work when extension tools exist
- MAXIMIZE extension automation

## ⚡ RULE 4: AGI STAFFERS LOCALHOST CONFIGURATION - NEVER CHANGE
**ABSOLUTE localhost rules for AGI Staffers:**
- **agistaffers.com (Consumer):** `http://localhost:3000` ✅
- **admin.agistaffers.com (Admin):** `http://localhost:3000/admin` ✅  
- **ONE SERVER ONLY - PORT 3000 - NO OTHER PORTS ALLOWED**

**PRODUCTION MAPPING - CRITICAL:**
- **agistaffers.com** is the production version of `http://localhost:3000`
- **ANY production updates should come from** `http://localhost:3000`
- **admin.agistaffers.com** is the production version of `http://localhost:3000/admin`  
- **ANY production updates should come from** `http://localhost:3000/admin`

**LOGIN ROUTES:**
- **Admin login:** `admin.agistaffers.com/login` (localhost: `http://localhost:3000/admin/login`)
- **Consumer login:** `agistaffers.com/login` (localhost: `http://localhost:3000/login`)

## ⚡ RULE 5: BMAD METHOD WORKFLOW & DOCUMENTATION
**MANDATORY workflow on activation:**
1. **ALWAYS follow the BMAD method completely**
2. **ALWAYS document work according to BMAD docs format**
3. **ON FIRST START:** Activate and become `/Users/irawatkins/Documents/Cursor Setup/.bmad/agents/bmad-orchestrator.md`
4. **CHECK status:** Review what was last completed, what's pending
5. **MATCH UP:** Compare status with current user request to continue properly

**BMAD Documentation Requirements:**
- Follow BMAD documentation standards exactly
- Update progress according to BMAD format
- Maintain continuity with previous work

## ⚡ RULE 6: MEMORY MANAGEMENT - CRITICAL
**Context Window:** 200,000 tokens (~150,000 words/300-400 pages)

**MANDATORY ACTION at 120,000 tokens:**
1. **COMPLETE** the current task OR current thought process (whatever I'm working on/thinking about)
2. **DOCUMENT** everything completely - all progress, decisions, next steps
3. **PROVIDE** detailed handoff prompt for new Claude Code session with exact continuation point

**Purpose:** Keep Claude smart and nimble, prevent memory overflow, ensure continuity

**Monitoring:** Always track token usage and proactively manage before hitting limits

## ⚡ RULE 7: BMAD DOCUMENTATION LOCATIONS
**All BMAD method documentation goes in structured directories:**

**Primary Documentation:**
- **`.bmad/docs/`** - Main project documentation, guides, architecture
- **`.bmad/stories/`** - Story-based work tracking with phases:
  - `.bmad/stories/1-active/` - Currently active stories
  - `.bmad/stories/1-todo/` - Pending stories  
  - `.bmad/stories/3-backlog/` - Backlog items
  - `.bmad/stories/3-review/` - Stories under review

**Agent & Process Documentation:**
- **`.bmad/agents/`** - Agent definitions and workflows
- **`.bmad/mcp-config/`** - MCP server configurations

**Documentation Standards:** 
- Follow BMAD format for all documentation updates
- **CRITICAL:** Make sure you're documenting or updating the CORRECT BMAD documentation folders
- **MANDATORY:** Include timestamp (time, date stamp) when saving documents in **Chicago time (CST/CDT)**
- **PURPOSE:** Easy tracking of where you left off and documentation history
- **TIMEZONE:** Always use Chicago, Illinois time for consistency in communication

## ⚡ RULE 8: NO SYSTEM REBUILDS - UPGRADES ONLY
**ABSOLUTE RULE - NO EXCEPTIONS:**
- **DO NOT rebuild our current system**
- **ONLY make upgrades to the existing codebase**
- **ENHANCE and IMPROVE what already exists**
- **FORBIDDEN:** Starting from scratch, complete rewrites, architectural rebuilds

**Allowed Actions:**
- ✅ Add new features to existing code
- ✅ Improve existing functionality  
- ✅ Fix bugs and issues
- ✅ Optimize performance
- ✅ Update dependencies
- ✅ Enhance UI/UX

**Forbidden Actions:**
- ❌ Rebuild entire system
- ❌ Replace existing architecture
- ❌ Start new projects from scratch
- ❌ Delete and recreate core systems

## ⚡ RULE 9: NO BACKUPS UNTIL INFRASTRUCTURE 100% COMPLETE
**RESOURCE MANAGEMENT PRIORITY:**
- **NO backup creation until system is fully operational**
- **Backups consume needed space** - defer until infrastructure is complete
- **Focus on getting core infrastructure to 100% first**
- **Backup implementation is END-PHASE work only**

**Current Priority Order:**
1. **FIRST:** Complete infrastructure to 100% operational
2. **SECOND:** Optimize and stabilize all systems  
3. **LAST:** Implement backup systems

**Reasoning:**
- Space conservation for active development
- Resource allocation to critical infrastructure
- Avoid premature optimization
- Complete core functionality before auxiliary systems

**When to implement backups:** Only after infrastructure reaches 100% operational status

## ⚡ RULE 10: SMART TOOL USAGE - MCP FIRST, DIRECT WHEN EFFICIENT
**TOOL USAGE PRIORITY:**
- **PRIMARY:** Use MCP tools and Cursor extensions as much as possible
- **SECONDARY:** Use direct access when it's easier/more efficient
- **PRINCIPLE:** Choose the most effective method for task completion

**MCP/Extension Priority Examples:**
- Use `git` MCP for version control operations
- Use `filesystem` MCP for complex file operations
- Use `playwright` MCP for testing
- Use `fetch` MCP for API testing

**Direct Access When More Efficient:**
- ✅ Direct GitHub commands if simpler than MCP equivalent
- ✅ Direct Docker commands if more straightforward
- ✅ Direct bash commands for simple operations
- ✅ Native tool access when MCP adds unnecessary complexity

**Decision Criteria:**
1. **Speed of execution** - Choose faster method
2. **Simplicity** - Avoid over-engineering simple tasks
3. **Reliability** - Use the most stable approach
4. **Task appropriateness** - Match tool to task complexity

## ⚡ RULE 11: VAULT PASSWORD MANAGEMENT & TERMINAL ACCESS
**SECURITY & ACCESS REQUIREMENTS:**
- **ALL passwords MUST go in VAULT** - That's why the system was created
- **I have terminal login information and password** - Use when needed
- **I MUST handle terminal commands** - User should NOT do manual terminal work
- **TRY 5 TIMES FIRST** - Only escalate to user after 5 failed attempts

**Password Management:**
- ✅ Store ALL credentials in Vault
- ✅ Retrieve passwords from Vault when needed
- ✅ NEVER hardcode passwords in files
- ✅ Use Vault for all sensitive information

**Terminal Access Protocol:**
1. **USE available terminal access with provided credentials**
2. **ATTEMPT terminal operations up to 5 times**
3. **TROUBLESHOOT and retry different approaches**
4. **ONLY escalate to user after 5 failed attempts**
5. **DOCUMENT what was tried for troubleshooting**

**User Expectation:** I handle all terminal operations unless 5 attempts fail

## ⚡ RULE 14: PROBLEM-SOLUTION DOCUMENTATION & TRACKING
**MANDATORY PROBLEM RESOLUTION PROCESS:**
- **EVERY problem that occurs MUST be recorded**
- **Solution MUST be documented in markdown format**
- **BEFORE solving new problems:** Check existing problem documentation first
- **PURPOSE:** Make fixing recurring problems quicker and more efficient

**Documentation Format:**
- **Problem Description:** What happened, when, where
- **Error Messages:** Exact error text/codes
- **Solution Steps:** Step-by-step resolution process
- **Prevention:** How to avoid the problem in future
- **Chicago Timestamp:** When problem occurred and was solved

**Storage Location:** `.bmad/docs/problem-solutions/`

**Workflow:**
1. **FIRST:** Search existing problem docs for similar issues
2. **IF FOUND:** Use documented solution
3. **IF NEW:** Document problem and solution after resolving
4. **ALWAYS:** Update docs if solution differs from previous

**Benefit:** Faster problem resolution through knowledge accumulation

## ⚡ RULE 15: AUTOMATED CONTINUOUS DEPLOYMENT WORKFLOW
**AUTOMATED PRODUCTION DEPLOYMENT:**
- **When we agree to push to production:** All deployment happens automatically
- **NO manual steps** required after agreement to deploy
- **Continuous workflow** from local → production
- **Single command execution** handles entire deployment process

**Automated Deployment Flow:**
1. **Agreement:** User confirms "push to production"
2. **Auto-execute:** Run appropriate deployment script automatically
3. **Auto-package:** Create deployment archive from localhost:3000
4. **Auto-transfer:** SCP to VPS (72.60.28.175) automatically  
5. **Auto-deploy:** Extract, install, restart services automatically
6. **Auto-verify:** Confirm deployment success automatically

**Target Scripts:** Use existing deployment scripts like `deploy-correct-local-version.sh`

**Deployment Destination:**
- **VPS:** 72.60.28.175
- **Live Sites:** agistaffers.com, admin.agistaffers.com

**User Experience:** Single agreement → Complete automated deployment

## ⚡ RULE 16: MANDATORY BLUE-GREEN DEPLOYMENT WORKFLOW
**ABSOLUTE DEPLOYMENT METHODOLOGY - NO EXCEPTIONS:**
- **ALL production deployments MUST use blue-green workflow**
- **NO direct deployments to live production allowed**
- **BMAD method REQUIRES this workflow for all deployments**
- **Zero-downtime deployments are MANDATORY**

**THE ASSEMBLY LINE WORKFLOW:**
```
LOCAL (Kitchen/Studio) → Continuously developing new code
           ↓
    Deploy to STANDBY (Blue or Green)
           ↓
    Test on STANDBY environment
           ↓
    Switch STANDBY → LIVE
           ↓
    Old LIVE becomes next STANDBY
```

**DEPLOYMENT CYCLE - MANDATORY PROCESS:**
1. **IDENTIFY current LIVE environment** (Blue or Green)
2. **DEPLOY new code to STANDBY environment**
3. **TEST thoroughly on STANDBY**
4. **SWITCH traffic from LIVE to STANDBY**
5. **VERIFY new LIVE is working correctly**
6. **Old LIVE becomes next deployment target**

**KEY PRINCIPLES:**
- **LOCAL:** Continuous development (never stops)
- **STANDBY:** Receives latest code from LOCAL
- **LIVE:** Currently serving production traffic
- **Old code is REPLACED, not preserved** - each deployment overwrites

**MANDATORY BEHAVIORS:**
- ✅ ALWAYS deploy to the STANDBY environment
- ✅ ALWAYS test before switching
- ✅ ALWAYS maintain two production environments
- ✅ ALWAYS use the alternating pattern (Blue→Green→Blue→Green)
- ❌ NEVER deploy directly to LIVE
- ❌ NEVER skip the testing phase
- ❌ NEVER break the blue-green cycle

**AUTOMATION REQUIREMENT:**
- Switching process MUST be automated via scripts
- Deployment to STANDBY MUST be automated
- Testing verification MUST be automated where possible
- Manual intervention only for go/no-go decision

**PURPOSE:**
- Zero-downtime deployments
- Instant rollback capability
- Safe production updates
- Continuous delivery pipeline

**This workflow is MANDATORY for all production deployments - NO EXCEPTIONS!**

**I understand and WILL perform these functions exactly as specified.**

---
