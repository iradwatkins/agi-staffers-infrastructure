# Phase 3 Deployment Checklist - AGI Staffers PWA Enhancement

## 📱 What's Being Deployed

### 1. Samsung Fold 6 Responsive Design ✅
- Edge-to-edge layout for folded mode (6.2")
- Optimized 2-column layout for unfolded mode (7.6")
- Mobile hamburger menu
- Responsive stat cards and website grids

### 2. Push Notifications ✅
- Service Worker push support
- Notification permission management
- Test notification system
- Alert types: Server down, deployments, high usage, container status

### 3. Real-time Monitoring Dashboard ✅
- Live CPU, Memory, Disk, Network charts
- Container status monitoring
- Chart.js visualizations
- Mock data for testing (ready for real data integration)

### 4. Website Resource Metrics ✅
- CPU, Memory, Disk usage per website
- Color-coded progress bars
- Only shown for deployed sites
- Updates every 5 seconds

### 5. Enhanced PWA Features ✅
- Advanced offline support with sw-enhanced.js
- Smart caching strategies
- App installation prompts
- iOS/Android specific install flows
- Background sync support

## 🚀 Deployment Steps

### Step 1: Deploy All Files

```bash
📟 Terminal: ./push-admin-dashboard.sh
```

This will upload:
- index.html (with all enhancements)
- push-notifications.js
- monitoring.js
- app-installer.js
- sw-enhanced.js
- server-monitor.sh
- All supporting files

### Step 2: Restart the Container

```bash
📟 Terminal: ssh agi-vps 'docker restart admin-dashboard'
```

### Step 3: Clear Browser Cache

**Important**: The service worker needs to update, so:
1. 🌐 **Browser**: Visit https://admin.agistaffers.com
2. Press `Cmd+Shift+R` for hard refresh
3. Or in Chrome DevTools > Application > Storage > Clear site data

### Step 4: Generate VAPID Keys (for Push Notifications)

1. 🌐 **Browser**: Open the key generator:
   ```bash
   📟 Terminal: open "/Users/irawatkins/Documents/Cursor Setup/admin-dashboard-local/generate-vapid-keys.html"
   ```

2. Generate keys and update push-notifications.js
3. Re-deploy with the updated public key

## ✅ Testing Checklist

### On Desktop:
- [ ] Dashboard loads correctly
- [ ] Real-time monitoring charts appear
- [ ] Website metrics show for deployed sites
- [ ] Push notification button works
- [ ] Service management grid displays

### On Samsung Fold 6 (Folded):
- [ ] Edge-to-edge layout (no side spacing)
- [ ] Single column layout
- [ ] Mobile menu works
- [ ] Cards are readable and tappable
- [ ] Charts display correctly

### On Samsung Fold 6 (Unfolded):
- [ ] 2-column stat layout
- [ ] Optimized for square display
- [ ] All features accessible
- [ ] Smooth transitions

### PWA Features:
- [ ] "Install App" prompt appears
- [ ] Push notifications can be enabled
- [ ] Test notification works
- [ ] Offline page shows when disconnected
- [ ] App can be installed to home screen

## 🔧 Troubleshooting

### Service Worker Not Updating:
1. In Chrome DevTools > Application > Service Workers
2. Check "Update on reload"
3. Click "skipWaiting" if available
4. Clear all site data and refresh

### Push Notifications Not Working:
1. Ensure HTTPS is working
2. Check notification permissions in browser
3. Verify VAPID keys are set correctly
4. Check console for errors

### Charts Not Showing:
1. Check if Chart.js loaded (console errors)
2. Verify canvas elements exist
3. Check if monitoring.js initialized

### Install Banner Not Appearing:
1. Must be served over HTTPS
2. Must have valid manifest.json
3. Must have service worker registered
4. Not already installed

## 📊 Production Monitoring Setup (Optional)

To connect real server metrics:

1. **Deploy monitoring script on server**:
   ```bash
   scp admin-dashboard-local/server-monitor.sh agi-vps:/root/
   ssh agi-vps 'chmod +x /root/server-monitor.sh'
   ```

2. **Create systemd service** (on server):
   ```bash
   ssh agi-vps
   ```
   
   Create `/etc/systemd/system/server-monitor.service`:
   ```ini
   [Unit]
   Description=AGI Staffers Server Monitor
   After=network.target
   
   [Service]
   Type=simple
   User=root
   ExecStart=/root/server-monitor.sh
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Enable and start:
   ```bash
   systemctl enable server-monitor
   systemctl start server-monitor
   ```

## 🎉 Success Indicators

You'll know deployment is successful when:
1. ✅ Fold status indicator shows on Samsung Fold 6
2. ✅ Push notification permission prompt appears
3. ✅ Real-time charts start animating
4. ✅ Website metrics display resource usage
5. ✅ Install app banner/button visible
6. ✅ Service worker shows as "activated" in DevTools

## 📱 Mobile Installation

After deployment, on your Samsung Fold 6:
1. Visit https://admin.agistaffers.com
2. You should see an "Install" button or banner
3. Tap to install the PWA
4. Enable notifications when prompted
5. App icon appears on home screen

## 🔄 Rollback Plan

If issues occur:
```bash
# Restore previous version
ssh agi-vps 'cd /var/www/admin && git checkout HEAD~1 .'
ssh agi-vps 'docker restart admin-dashboard'
```

---

**Ready to deploy?** Start with Step 1! 🚀