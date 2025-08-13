# 🔵🟢 Blue-Green Deployment Guide - AGI Staffers

**Created:** August 13, 2025  
**System:** AGI Staffers Platform  
**Rule:** Following CLAUDE.md Rule 16 - Mandatory Blue-Green Deployment

---

## 📋 Overview

This guide implements the **mandatory blue-green deployment workflow** as specified in Rule 16. All production deployments MUST use this system.

## 🎯 Key Features

- **Zero-downtime deployments**
- **<2 minute rollback capability** (BMAD-001 requirement)
- **Automatic health checks**
- **Traffic switching via NGINX**
- **PM2 process management**

---

## 🔄 The Assembly Line Workflow

```
LOCAL (Your Computer)     →    STANDBY (Blue or Green)    →    LIVE (Production)
    localhost:3000                  VPS Port 3000/3001           agistaffers.com
```

---

## 🚀 Deployment Commands

### 1. **Deploy New Version**
```bash
./blue-green-deploy.sh
```
This script:
- Identifies current LIVE environment
- Deploys to STANDBY environment
- Tests STANDBY health
- Prompts to switch traffic
- Updates NGINX configuration

### 2. **Check Status**
```bash
./blue-green-status.sh
```
Shows:
- Current LIVE environment
- Health of both Blue and Green
- PM2 process status
- NGINX configuration

### 3. **Emergency Rollback**
```bash
./blue-green-rollback.sh
```
Features:
- Instant traffic switch (<2 minutes)
- No code deployment needed
- Uses existing STANDBY environment
- Automatic health verification

---

## 📊 Environment Configuration

### **Blue Environment**
- **Port:** 3000
- **Directory:** `/var/www/agistaffers-blue`
- **PM2 Name:** `agistaffers-blue`
- **Status:** PRIMARY (default)

### **Green Environment**
- **Port:** 3001
- **Directory:** `/var/www/agistaffers-green`
- **PM2 Name:** `agistaffers-green`
- **Status:** SECONDARY

---

## 🔧 Technical Details

### **NGINX Configuration**
```nginx
upstream agistaffers_app {
    server localhost:3000;  # Or 3001 for green
}

server {
    server_name agistaffers.com;
    location / {
        proxy_pass http://agistaffers_app;
    }
}

server {
    server_name admin.agistaffers.com;
    location / {
        proxy_pass http://agistaffers_app/admin;
    }
}
```

### **Environment Tracking**
- **File:** `/var/www/current_env`
- **Values:** `blue` or `green`
- **Purpose:** Tracks which environment is currently LIVE

---

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] Test changes locally on `localhost:3000`
- [ ] Commit changes to Git
- [ ] Run `blue-green-status.sh` to check current state

### **Deployment**
- [ ] Run `blue-green-deploy.sh`
- [ ] Wait for deployment to STANDBY
- [ ] Verify health check passes
- [ ] Confirm traffic switch when prompted

### **Post-Deployment**
- [ ] Verify site works on production
- [ ] Check admin.agistaffers.com functionality
- [ ] Monitor for 5 minutes
- [ ] Keep old environment as instant rollback

---

## 🚨 Rollback Procedure

If issues occur after deployment:

1. **Run rollback immediately:**
   ```bash
   ./blue-green-rollback.sh
   ```

2. **Rollback happens in <2 minutes:**
   - Traffic switches to previous version
   - No deployment needed
   - Users experience minimal disruption

3. **Investigate issues:**
   - Check logs: `pm2 logs agistaffers-[blue/green]`
   - Fix issues in local development
   - Redeploy when ready

---

## 🎯 Benefits

1. **Zero Downtime**
   - Users never see deployment process
   - Instant traffic switching

2. **Safe Deployments**
   - Test in production environment before switching
   - Keep previous version ready

3. **Fast Rollback**
   - <2 minute recovery (BMAD-001 requirement met)
   - No redeployment needed

4. **Continuous Delivery**
   - Deploy anytime without fear
   - Automated health checks

---

## 📊 Success Metrics

- **Deployment Time:** ~5-10 minutes
- **Rollback Time:** <2 minutes ✅
- **Downtime:** 0 seconds ✅
- **Data Loss Risk:** None ✅

---

## 🔐 Security Notes

- SSH keys required for VPS access
- NGINX reload requires root access
- PM2 managed by root user
- Database shared between environments

---

## 📝 Troubleshooting

### **Deployment Fails**
- Check npm build errors
- Verify disk space: `df -h`
- Check PM2 logs: `pm2 logs`

### **Health Check Fails**
- Verify port not in use: `lsof -i :3000`
- Check Next.js build: `npm run build`
- Review .env.local settings

### **NGINX Won't Switch**
- Test config: `nginx -t`
- Check syntax in sites-available
- Restart NGINX: `systemctl restart nginx`

---

## ✅ Rule 16 Compliance

This implementation fully satisfies **CLAUDE.md Rule 16**:
- ✅ Mandatory blue-green workflow
- ✅ No direct production deployments
- ✅ Assembly line pattern (LOCAL → STANDBY → LIVE)
- ✅ Zero-downtime deployments
- ✅ Automated process

**The blue-green deployment system is now MANDATORY for all production updates!**