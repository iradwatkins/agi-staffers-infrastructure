# Mac Development Environment Setup Guide

## Essential Setup to Prevent Common Issues

### 1. Fix Line Ending Issues (CRLF vs LF)

**Problem**: Scripts fail with "bad interpreter: /bin/bash^M: no such file or directory"

**Permanent Fix**:
```bash
# Configure Git to handle line endings properly
git config --global core.autocrlf input

# Install dos2unix for quick fixes
brew install dos2unix

# Fix any script with line ending issues
dos2unix script.sh
# OR use perl (built-in on Mac)
perl -pi -e 's/\r\n/\n/g' script.sh
```

### 2. SSH Configuration for Easy Access

**Problem**: Typing full SSH commands repeatedly

**Fix - Create SSH config**:
```bash
# Edit SSH config
nano ~/.ssh/config

# Add this for each server:
Host agi-vps
    HostName 148.230.93.174
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# Now you can simply use:
ssh agi-vps
```

### 3. Terminal Aliases for Common Commands

**Add to `~/.zshrc`**:
```bash
# Navigation aliases
alias projects="cd ~/Documents/Cursor\ Setup"
alias vps="ssh agi-vps"

# Git aliases
alias gs="git status"
alias gp="git push"
alias gc="git commit -m"
alias ga="git add"

# Deployment aliases
alias deploy="./push-admin-dashboard.sh"
alias pull-admin="./pull-admin-dashboard.sh"

# Fix permissions quickly
alias fixperms="chmod +x *.sh"

# Quick server check
alias checkserver="curl -I https://admin.agistaffers.com"

# Apply changes
source ~/.zshrc
```

### 4. Git Configuration for Better Workflow

```bash
# Set up Git with your info
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Better Git log
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Auto-setup remote tracking
git config --global push.autoSetupRemote true

# Helpful aliases
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.amend "commit -a --amend"
```

### 5. VS Code Settings for Smooth Development

**Settings.json** (`Cmd+Shift+P` → "Preferences: Open Settings JSON"):
```json
{
    "files.eol": "\n",
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true,
    "editor.formatOnSave": true,
    "terminal.integrated.defaultProfile.osx": "zsh",
    "git.autofetch": true,
    "git.confirmSync": false,
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true
    }
}
```

### 6. Essential Mac Keyboard Shortcuts

```markdown
## Development Shortcuts
- `Cmd + Space` - Spotlight search
- `Cmd + Tab` - Switch applications
- `Cmd + ~` - Switch windows within app
- `Cmd + Shift + .` - Show hidden files in Finder
- `Option + Click` - Open file path in terminal

## Terminal Shortcuts
- `Ctrl + A` - Go to beginning of line
- `Ctrl + E` - Go to end of line
- `Ctrl + R` - Search command history
- `Cmd + K` - Clear terminal
- `Cmd + T` - New tab

## VS Code Shortcuts
- `Cmd + P` - Quick file open
- `Cmd + Shift + P` - Command palette
- `Cmd + B` - Toggle sidebar
- `Cmd + `` ` - Toggle terminal
- `Cmd + /` - Toggle comment
```

### 7. Script Template with Error Handling

**Use this template for all new scripts**:
```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined variables, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Main script logic
main() {
    log_info "Starting script..."
    
    # Your code here
    
    log_info "Script completed successfully!"
}

# Run main function
main "$@"
```

### 8. Quick Debugging Commands

```bash
# Debug bash scripts
bash -x script.sh  # Shows each command as it runs

# Check if command exists
command -v docker >/dev/null 2>&1 || { echo "Docker not installed"; exit 1; }

# Test network connectivity
nc -zv hostname 22  # Test SSH port
curl -I https://domain.com  # Test HTTPS

# Monitor file changes
fswatch -o . | xargs -n1 -I{} echo "File changed"

# Pretty print JSON
echo '{"test":"value"}' | python3 -m json.tool
```

### 9. Environment Setup Script

**Save as `setup-dev-env.sh`**:
```bash
#!/bin/bash

echo "🛠️  Setting up Mac development environment..."

# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install essential tools
brew install \
    git \
    wget \
    curl \
    jq \
    tree \
    htop \
    dos2unix \
    watch \
    gh

# Configure Git line endings
git config --global core.autocrlf input

# Create common directories
mkdir -p ~/Documents/Projects
mkdir -p ~/.ssh

# Set correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config 2>/dev/null || true

echo "✅ Development environment ready!"
```

### 10. Project-Specific Setup

**`.envrc` for project directory** (using direnv):
```bash
# Install direnv
brew install direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# Create .envrc in project
cat > .envrc << 'EOF'
# Auto-activate when entering project directory
export PROJECT_NAME="agi-staffers"
export VPS_HOST="148.230.93.174"
export VPS_USER="root"

# Aliases for this project
alias deploy="./push-admin-dashboard.sh"
alias logs="ssh agi-vps 'docker logs -f admin-dashboard'"
alias restart="ssh agi-vps 'docker restart admin-dashboard'"

echo "🚀 AGI Staffers environment loaded!"
EOF

# Allow direnv
direnv allow
```

### 11. Common Issue Prevention

**Permissions Script** (`fix-project-permissions.sh`):
```bash
#!/bin/bash
# Fix all permissions in project

# Make all .sh files executable
find . -name "*.sh" -type f -exec chmod +x {} \;

# Fix line endings on all scripts
find . -name "*.sh" -type f -exec perl -pi -e 's/\r\n/\n/g' {} \;

# Fix SSH key permissions if they exist
[ -f ~/.ssh/id_* ] && chmod 600 ~/.ssh/id_*
[ -f ~/.ssh/*.pub ] && chmod 644 ~/.ssh/*.pub

echo "✅ Permissions fixed!"
```

### 12. Time-Saving Git Hooks

**`.git/hooks/pre-push`** (prevent accidental pushes):
```bash
#!/bin/bash
# Prevent pushing to main without confirmation

protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]; then
    read -p "⚠️  You're about to push to main. Continue? (y/n) " -n 1 -r < /dev/tty
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Push cancelled."
        exit 1
    fi
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-push
```

### 13. Quick Health Check Script

**`health-check.sh`**:
```bash
#!/bin/bash

echo "🏥 System Health Check"
echo "====================="

# Check Git
echo -n "Git: "
git --version

# Check SSH to VPS
echo -n "VPS Connection: "
ssh -o ConnectTimeout=5 agi-vps "echo 'Connected'" 2>/dev/null && echo "✅" || echo "❌"

# Check website
echo -n "Website Status: "
curl -s -o /dev/null -w "%{http_code}" https://admin.agistaffers.com | grep -q "200" && echo "✅ Online" || echo "❌ Offline"

# Check Docker on VPS
echo -n "Docker Services: "
ssh agi-vps "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -c 'Up'" 2>/dev/null && echo "✅" || echo "❌"

# Check disk space
echo -n "Local Disk Space: "
df -h | grep -E '^/System/Volumes/Data' | awk '{print $5}'
```

### 14. Emergency Fixes

**When things go wrong**:
```bash
# Reset Git repository (keeps changes)
git reset --soft HEAD~1

# Fix "permission denied" on scripts
xattr -cr *.sh  # Remove quarantine attribute
chmod +x *.sh

# Clear DNS cache
sudo dscacheutil -flushcache

# Kill process on port
lsof -ti:3000 | xargs kill -9

# Reset Docker Desktop
osascript -e 'quit app "Docker"'
rm -rf ~/Library/Containers/com.docker.docker
open -a Docker
```

### 15. Productivity Enhancers

**Install these tools**:
```bash
# Better terminal experience
brew install --cask iterm2

# Quick Look plugins (preview files with spacebar)
brew install --cask \
    qlmarkdown \
    quicklook-json \
    qlstephen \
    quicklook-csv

# Dev tools
brew install --cask \
    visual-studio-code \
    docker \
    postman

# CLI improvements
brew install \
    bat \        # Better cat
    exa \        # Better ls
    ripgrep \    # Better grep
    fd \         # Better find
    httpie       # Better curl
```

### Summary Checklist

Before starting any project:
- [ ] Git configured with correct line endings
- [ ] SSH config set up for easy access
- [ ] Terminal aliases configured
- [ ] VS Code settings optimized
- [ ] Scripts have proper permissions
- [ ] Project-specific environment loaded

This setup will save hours of debugging and make development much smoother!