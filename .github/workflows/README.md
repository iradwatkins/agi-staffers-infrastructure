# GitHub Actions CI/CD Setup Guide

## 🚀 Quick Setup

### 1. Generate SSH Key for GitHub Actions
Run this on your local machine:
```bash
ssh-keygen -t ed25519 -C "github-actions@agi-staffers" -f ~/.ssh/github-actions-key
```

### 2. Add Public Key to VPS
```bash
cat ~/.ssh/github-actions-key.pub | ssh root@148.230.93.174 "cat >> ~/.ssh/authorized_keys"
```

### 3. Add Secret to GitHub Repository
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `VPS_SSH_KEY`
5. Value: Copy the contents of `~/.ssh/github-actions-key` (private key)

```bash
# Copy private key to clipboard (Mac)
cat ~/.ssh/github-actions-key | pbcopy
```

## 📋 Workflow Features

### Automatic Deployment
- Triggers on push to `main` branch
- Runs tests before deployment
- Zero-downtime deployment with rollback capability
- Health checks after deployment

### Manual Deployment
- Go to Actions tab in GitHub
- Select "Deploy to AGI Staffers VPS"
- Click "Run workflow"

### Deployment Process
1. **Test Phase**: Runs tests and builds application
2. **Deploy Phase**: 
   - Backs up current version
   - Deploys new code
   - Restarts Docker container
   - Verifies deployment
   - Rolls back if health check fails
3. **Notification Phase**: Reports deployment status

## 🔒 Security Notes

- SSH key is stored securely in GitHub Secrets
- Key is removed after each deployment
- Only deploys from main branch
- Health checks prevent broken deployments

## 🛠️ Customization

### Add More Services
Edit `deploy-other-services` job to deploy additional services

### Change Deployment Branch
Edit `if: github.ref == 'refs/heads/main'` to deploy from different branch

### Add Slack/Discord Notifications
Add webhook URL as secret and update `notify` job

## 🧪 Testing Locally

Test the deployment script locally:
```bash
# Simulate the deployment
./push-admin-dashboard.sh
```

## 📊 Monitoring Deployments

View deployment history:
1. Go to Actions tab in GitHub
2. Filter by workflow: "Deploy to AGI Staffers VPS"
3. Click on any run to see detailed logs