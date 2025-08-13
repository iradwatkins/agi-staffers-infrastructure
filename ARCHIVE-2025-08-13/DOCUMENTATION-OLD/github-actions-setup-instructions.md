# GitHub Actions Setup Instructions

## Repository Information
- **Repository**: https://github.com/iradwatkins/agi-staffers-infrastructure
- **Actions**: https://github.com/iradwatkins/agi-staffers-infrastructure/actions

## Configured Secrets
- `SERVER_SSH_KEY`: SSH key for deployment
- `VAPID_PUBLIC_KEY`: Push notification public key
- `VAPID_PRIVATE_KEY`: Push notification private key

## Deployment Triggers
1. **Automatic**: Push to `main` branch
2. **Manual**: Use workflow dispatch in Actions tab

## Workflows
- **Main CI/CD Pipeline**: Orchestrates all deployments
- **Admin Dashboard**: Deploys PWA updates
- **Push API**: Deploys notification service
- **Monitoring**: Updates monitoring scripts

## Testing Deployment
1. Make a small change to any file
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Check Actions tab for deployment status

## Rollback Procedure
1. Go to Actions tab
2. Run "Main CI/CD Pipeline" workflow
3. Check "Rollback Deployment" option

## SSH Access
Deployment key location: `~/.ssh/agi-deploy-key`

To SSH into server:
```bash
ssh -i ~/.ssh/agi-deploy-key root@148.230.93.174
```
