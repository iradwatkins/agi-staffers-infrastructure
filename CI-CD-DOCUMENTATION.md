
# GitHub Actions CI/CD Documentation

## 🚀 Overview

The AGI Staffers infrastructure now has a complete CI/CD pipeline using GitHub Actions. All deployments are automated and triggered by git pushes or manual workflow dispatches.

## 🔄 Automated Workflows

### 1. Main CI/CD Pipeline
**File**: `.github/workflows/main-cicd.yml`  
**Triggers**: Push to main, manual dispatch  
**Features**:
- Pre-deployment backup
- Code quality checks
- Security scanning
- Parallel deployments
- Automatic rollback on failure
- Post-deployment verification

### 2. Deploy Admin Dashboard
**File**: `.github/workflows/deploy-dashboard.yml`  
**Triggers**: Push to main (dashboard files), manual dispatch  
**Deploys**: Admin dashboard PWA to production

### 3. Deploy Push API
**File**: `.github/workflows/deploy-push-api.yml`  
**Triggers**: Push to main (push-api files)  
**Deploys**: Push notification API service

### 4. Deploy Docker Monitoring
**File**: `.github/workflows/deploy-monitoring.yml`  
**Triggers**: Push to main (monitoring files), manual dispatch  
**Deploys**: Docker monitoring with alerts

### 5. Deploy to VPS
**File**: `.github/workflows/deploy-vps.yml`  
**Triggers**: Push to main, manual dispatch  
**Deploys**: Full stack to AGI Staffers VPS

## 🔐 GitHub Secrets Configuration

Required secrets (already configured):

```
SERVER_HOST         - VPS IP address (148.230.93.174)
SERVER_USER         - SSH user (root)
SERVER_PASSWORD     - SSH password
SERVER_SSH_KEY      - SSH private key
VAPID_PUBLIC_KEY    - Push notification public key
VAPID_PRIVATE_KEY   - Push notification private key
```

## 📋 How to Use

### Automatic Deployment
Simply push to the main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Deployment
Trigger specific workflows:
```bash
# Deploy everything
gh workflow run "Main CI/CD Pipeline"

# Deploy only dashboard
gh workflow run "Deploy Admin Dashboard"

# Deploy only monitoring
gh workflow run "Deploy Docker Monitoring"
```

### Check Deployment Status
```bash
# List recent runs
gh run list

# Watch specific run
gh run watch <run-id>

# View run in browser
gh run view <run-id> --web
```

## 🎯 Deployment Flow

1. **Code Push** → GitHub Actions triggered
2. **Quality Checks** → Linting, security scan
3. **Backup** → Current state backed up
4. **Deploy** → Files copied, services restarted
5. **Verify** → Health checks run
6. **Rollback** → Automatic if verification fails

## ✅ Current Status

- **Repository**: https://github.com/iradwatkins/agi-staffers-infrastructure
- **CI/CD**: ✅ ACTIVE
- **Last Deployment**: Successfully deployed push notifications
- **Dashboard**: https://admin.agistaffers.com (CI/CD Active!)
- **Push API**: https://admin.agistaffers.com/push-api/health

## 🚨 Monitoring

### Deployment Notifications
- Success/failure notifications via GitHub
- Email alerts on deployment issues
- Slack integration available

### Health Checks
All deployments include automated health checks:
- Service availability
- API endpoints
- Database connections
- SSL certificates

## 🔧 Maintenance

### Update Secrets
```bash
gh secret set SECRET_NAME -b "value"
```

### View Logs
```bash
# View workflow logs
gh run view <run-id> --log

# SSH to server for live logs
ssh agi-vps 'docker logs -f <container>'
```

### Rollback
Automatic rollback on failure, or manual:
```bash
gh workflow run "Rollback Deployment"
```

## 📊 Benefits Achieved

1. **Zero-Downtime Deployments** - Services stay online
2. **Automatic Backups** - Every deployment backed up
3. **Quality Gates** - Code must pass checks
4. **Fast Deployments** - Under 2 minutes typically
5. **Easy Rollbacks** - One-click restoration
6. **Audit Trail** - Complete deployment history

## 🎉 Next Steps

1. **Add Staging Environment** - Test before production
2. **Implement Blue-Green Deployments** - Even safer updates
3. **Add Performance Tests** - Ensure no regressions
4. **Setup Deployment Approvals** - For critical changes
5. **Add Slack Notifications** - Real-time updates

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub CLI](https://cli.github.com/)

---

The CI/CD pipeline is now fully operational and ready for continuous deployments!