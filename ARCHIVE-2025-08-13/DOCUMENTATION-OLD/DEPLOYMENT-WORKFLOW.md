# AGI Staffers Admin Dashboard - Deployment Workflow

## Overview
This workflow enables you to pull code from the VPS, edit it locally, and push changes back to the live server.

## Initial Setup

### 1. Set up SSH Key Authentication
```bash
# Run the setup script
./setup-ssh-key.sh

# Follow the instructions to add your public key to the VPS
ssh-copy-id -i ~/.ssh/agi-vps.pub root@148.230.93.174

# Test the connection
ssh agi-vps 'echo "Connection successful!"'
```

### 2. Pull Current Code
```bash
# Download the current admin dashboard code
./pull-admin-dashboard.sh
```

This creates a `./admin-dashboard-local/` directory with all the files from the container.

## Development Workflow

### 1. Pull Latest Code
Always start by pulling the latest code from the server:
```bash
./pull-admin-dashboard.sh
```

### 2. Edit Files Locally
- Open files in `./admin-dashboard-local/` with your preferred editor
- Make and test your changes
- The main file is `index.html`

### 3. Push Changes to Server
```bash
./push-admin-dashboard.sh
```

This will:
- Create a backup on the server
- Upload your changes
- Make them immediately live at https://admin.agistaffers.com

## File Structure
```
admin-dashboard-local/
├── index.html          # Main dashboard HTML
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
└── favicon.ico        # Site icon
```

## Version Control (Optional)

### Initialize Git Repository
```bash
cd admin-dashboard-local
git init
git add .
git commit -m "Initial dashboard code"
```

### Track Changes
```bash
git add .
git commit -m "Fixed notification button"
git log --oneline
```

## Troubleshooting

### SSH Connection Issues
- Ensure your SSH key is added: `ssh-add ~/.ssh/agi-vps`
- Check SSH config: `cat ~/.ssh/config`
- Verify server IP: 148.230.93.174

### Container Issues
- Check if container is running: `ssh agi-vps 'docker ps | grep admin-dashboard'`
- View logs: `ssh agi-vps 'docker logs admin-dashboard'`
- Restart container: `ssh agi-vps 'docker restart admin-dashboard'`

### JavaScript Errors
- Always check browser console after pushing
- Test locally first if possible
- Keep backups of working versions

## Important Notes
- Changes go live immediately after pushing
- Always test on https://admin.agistaffers.com after pushing
- The server creates automatic backups before each push
- Container uses BusyBox utilities (limited tools available)

## Current Issues to Fix
1. JavaScript syntax error at line 463 in index.html
2. testPushNotification function not working due to syntax error
3. Test Notifications button needs proper functionality

## Next Steps
1. Pull the current code
2. Fix the JavaScript syntax error
3. Test the notification functionality
4. Push the fixed version