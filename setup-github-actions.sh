#!/bin/bash

# GitHub Actions CI/CD Setup Script for AGI Staffers
# This script guides through setting up GitHub repository and CI/CD pipeline

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="148.230.93.174"
PROJECT_NAME="agi-staffers-infrastructure"
GITHUB_USER=""
GITHUB_REPO=""

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  AGI Staffers GitHub Actions Setup   ${NC}"
echo -e "${BLUE}======================================${NC}"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists git; then
    echo -e "${RED}✗ Git is not installed${NC}"
    echo "Please install git: brew install git"
    exit 1
fi

if ! command_exists gh; then
    echo -e "${RED}✗ GitHub CLI is not installed${NC}"
    echo "Please install GitHub CLI: brew install gh"
    exit 1
fi

if ! command_exists ssh-keygen; then
    echo -e "${RED}✗ ssh-keygen is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites installed${NC}"
echo

# Check git configuration
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    echo -e "${YELLOW}Git is not configured. Let's set it up:${NC}"
    read -p "Enter your name: " git_name
    read -p "Enter your email: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
fi

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
fi

# Check GitHub CLI authentication
echo -e "${YELLOW}Checking GitHub authentication...${NC}"
if ! gh auth status >/dev/null 2>&1; then
    echo -e "${YELLOW}Please authenticate with GitHub:${NC}"
    gh auth login
fi

# Get GitHub username
GITHUB_USER=$(gh api user -q .login)
echo -e "${GREEN}✓ Authenticated as: $GITHUB_USER${NC}"

# Create README if it doesn't exist
if [ ! -f README.md ]; then
    echo -e "${YELLOW}Creating README.md...${NC}"
    cat > README.md << 'EOF'
# AGI Staffers Infrastructure

Comprehensive VPS management system for AGI Staffers multi-tenant hosting platform.

## 🚀 Overview

This repository contains the complete infrastructure setup for AGI Staffers, including:
- Multi-tenant website hosting
- PWA admin dashboard
- Automated backup systems
- CI/CD pipelines
- Docker containerized services
- SSL/TLS secured endpoints

## 📦 Services

- **Main Website**: [stepperslife.com](https://stepperslife.com)
- **Admin Dashboard**: [admin.agistaffers.com](https://admin.agistaffers.com)
- **Database Management**: [pgadmin.agistaffers.com](https://pgadmin.agistaffers.com)
- **Workflow Automation**: [n8n.agistaffers.com](https://n8n.agistaffers.com)
- **AI Services**: Multiple AI-powered endpoints

## 🛠️ Technology Stack

- **Frontend**: Next.js PWA with Shadcn/ui
- **Backend**: Node.js microservices
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Reverse Proxy**: Caddy with automatic SSL
- **CI/CD**: GitHub Actions

## 📂 Project Structure

```
.
├── admin-dashboard-local/    # PWA admin dashboard
├── push-notification-api/    # Push notification service
├── backup-system/           # Automated backup scripts
├── .github/workflows/       # CI/CD pipelines
└── docker-compose.yml       # Service orchestration
```

## 🚀 Deployment

This project uses GitHub Actions for automated deployments. Push to `main` branch triggers automatic deployment to production.

## 🔒 Security

- All endpoints secured with SSL/TLS
- Automated security scanning in CI/CD
- Regular automated backups
- Container isolation for services

## 📝 License

© 2025 AGI Staffers. All rights reserved.
EOF
    echo -e "${GREEN}✓ README.md created${NC}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo -e "${YELLOW}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Environment files
.env
.env.local
.env.production

# Logs
*.log
logs/

# Backup files
*.backup
*.bak

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/

# Dependencies
node_modules/

# Build outputs
dist/
build/

# Docker
*.tar.gz

# Secrets
*.pem
*.key
*.crt
secrets/

# Temporary files
tmp/
temp/
EOF
    echo -e "${GREEN}✓ .gitignore created${NC}"
fi

# Stage and commit files
echo -e "${YELLOW}Preparing initial commit...${NC}"
git add .
git commit -m "Initial commit: AGI Staffers infrastructure

- Admin dashboard PWA
- Push notification API
- Automated backup system
- CI/CD workflows
- Docker containerized services" || true

# Create GitHub repository
echo -e "${YELLOW}Creating GitHub repository...${NC}"
read -p "Enter repository name (default: $PROJECT_NAME): " repo_name
GITHUB_REPO=${repo_name:-$PROJECT_NAME}

# Check if repo already exists
if gh repo view "$GITHUB_USER/$GITHUB_REPO" >/dev/null 2>&1; then
    echo -e "${YELLOW}Repository already exists. Using existing repository.${NC}"
else
    echo -e "${YELLOW}Creating new repository...${NC}"
    gh repo create "$GITHUB_REPO" --private --description "AGI Staffers Infrastructure - Multi-tenant hosting platform"
    echo -e "${GREEN}✓ Repository created: $GITHUB_USER/$GITHUB_REPO${NC}"
fi

# Set remote origin
git remote remove origin 2>/dev/null || true
git remote add origin "git@github.com:$GITHUB_USER/$GITHUB_REPO.git"
echo -e "${GREEN}✓ Remote origin set${NC}"

# Generate deployment SSH key
echo -e "${YELLOW}Generating deployment SSH key...${NC}"
SSH_KEY_PATH="$HOME/.ssh/agi-deploy-key"
if [ ! -f "$SSH_KEY_PATH" ]; then
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "github-actions@agistaffers.com"
    echo -e "${GREEN}✓ SSH key generated${NC}"
else
    echo -e "${GREEN}✓ SSH key already exists${NC}"
fi

# Display public key
echo
echo -e "${BLUE}=== DEPLOYMENT SSH PUBLIC KEY ===${NC}"
echo -e "${YELLOW}Add this key to your VPS authorized_keys:${NC}"
echo
cat "${SSH_KEY_PATH}.pub"
echo
echo -e "${YELLOW}To add to VPS, run:${NC}"
echo "echo '$(cat "${SSH_KEY_PATH}.pub")' | ssh root@$SERVER_IP 'cat >> ~/.ssh/authorized_keys'"
echo

# Wait for user to add key
read -p "Press Enter after adding the SSH key to your VPS..."

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ssh -o BatchMode=yes -o ConnectTimeout=5 -i "$SSH_KEY_PATH" root@$SERVER_IP exit 2>/dev/null; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ SSH connection failed. Please ensure the key is added correctly.${NC}"
    exit 1
fi

# Set GitHub secrets
echo
echo -e "${BLUE}=== SETTING GITHUB SECRETS ===${NC}"

# Set SSH key secret
echo -e "${YELLOW}Setting SERVER_SSH_KEY secret...${NC}"
gh secret set SERVER_SSH_KEY < "$SSH_KEY_PATH"
echo -e "${GREEN}✓ SERVER_SSH_KEY secret set${NC}"

# Set VAPID keys for push notifications
if [ -f push-notification-api/.env ]; then
    VAPID_PUBLIC=$(grep VAPID_PUBLIC_KEY push-notification-api/.env | cut -d'=' -f2)
    VAPID_PRIVATE=$(grep VAPID_PRIVATE_KEY push-notification-api/.env | cut -d'=' -f2)
    
    if [ -n "$VAPID_PUBLIC" ] && [ -n "$VAPID_PRIVATE" ]; then
        echo -e "${YELLOW}Setting VAPID key secrets...${NC}"
        echo "$VAPID_PUBLIC" | gh secret set VAPID_PUBLIC_KEY
        echo "$VAPID_PRIVATE" | gh secret set VAPID_PRIVATE_KEY
        echo -e "${GREEN}✓ VAPID keys set${NC}"
    fi
fi

# Push to GitHub
echo
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git branch -M main
git push -u origin main
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

# Enable GitHub Actions
echo -e "${YELLOW}Enabling GitHub Actions...${NC}"
gh workflow enable

# Display summary
echo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}    GitHub Actions Setup Complete!    ${NC}"
echo -e "${GREEN}======================================${NC}"
echo
echo -e "${BLUE}Repository:${NC} https://github.com/$GITHUB_USER/$GITHUB_REPO"
echo -e "${BLUE}Actions:${NC} https://github.com/$GITHUB_USER/$GITHUB_REPO/actions"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit the Actions tab to monitor deployments"
echo "2. Any push to 'main' branch will trigger deployment"
echo "3. Use workflow dispatch for manual deployments"
echo
echo -e "${GREEN}Your CI/CD pipeline is ready! 🚀${NC}"

# Create deployment instructions
cat > github-actions-setup-instructions.md << EOF
# GitHub Actions Setup Instructions

## Repository Information
- **Repository**: https://github.com/$GITHUB_USER/$GITHUB_REPO
- **Actions**: https://github.com/$GITHUB_USER/$GITHUB_REPO/actions

## Configured Secrets
- \`SERVER_SSH_KEY\`: SSH key for deployment
- \`VAPID_PUBLIC_KEY\`: Push notification public key
- \`VAPID_PRIVATE_KEY\`: Push notification private key

## Deployment Triggers
1. **Automatic**: Push to \`main\` branch
2. **Manual**: Use workflow dispatch in Actions tab

## Workflows
- **Main CI/CD Pipeline**: Orchestrates all deployments
- **Admin Dashboard**: Deploys PWA updates
- **Push API**: Deploys notification service
- **Monitoring**: Updates monitoring scripts

## Testing Deployment
1. Make a small change to any file
2. Commit and push to main:
   \`\`\`bash
   git add .
   git commit -m "Test deployment"
   git push
   \`\`\`
3. Check Actions tab for deployment status

## Rollback Procedure
1. Go to Actions tab
2. Run "Main CI/CD Pipeline" workflow
3. Check "Rollback Deployment" option

## SSH Access
Deployment key location: \`~/.ssh/agi-deploy-key\`

To SSH into server:
\`\`\`bash
ssh -i ~/.ssh/agi-deploy-key root@$SERVER_IP
\`\`\`
EOF

echo
echo -e "${GREEN}Setup instructions saved to: github-actions-setup-instructions.md${NC}"