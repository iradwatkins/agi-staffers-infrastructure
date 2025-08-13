# 🧹 CLEANUP PLAN - AGI Staffers

## ✅ PHASE 1: Archive Old Documentation
Move these to ARCHIVE-2025-08-13/DOCUMENTATION-OLD/:
- BMAD-100-PERCENT-COMPLETE.md
- SUCCESS-REPORT.md
- PROJECT-COMPLETION-SUMMARY.md
- BMAD-AUTH-COMPLETE.md
- BMAD-MULTITENANT-FINAL.md
- PRODUCTION-DEPLOYMENT-GUIDE.md
- VPS_MIGRATION_COMPLETE_GUIDE.md
- ENHANCED-MONITORING-DOCUMENTATION.md
- FOLD6-TESTING-GUIDE.md

## ✅ PHASE 2: Consolidate Deployment Scripts
Keep:
- deploy-correct-local-version.sh (most recent, comprehensive)

Archive all others (34 scripts!) to DEPLOYMENT-SCRIPTS/

## ✅ PHASE 3: Fix Auth Structure
Correct Structure:
- agistaffers.com/login → Customer login ✅
- admin.agistaffers.com/login → Admin login ✅

Remove/Archive:
- /admin/login folder (confusing duplicate)

## ✅ PHASE 4: Enable Middleware
- Rename middleware.ts.disabled → middleware.ts
- This handles subdomain routing for admin

## ✅ PHASE 5: Clean Build Files
Safe to delete (can regenerate):
- .next/ folder
- Old workbox files

## ✅ PHASE 6: Choose Active Files
globals.css - Keep active one, archive .disabled
middleware.ts - Enable (rename from .disabled)

## 📋 EXECUTION ORDER:
1. Create backups first
2. Move documentation to archive
3. Move old deployment scripts
4. Fix middleware and CSS files
5. Clean cache folders
6. Update git with clean structure