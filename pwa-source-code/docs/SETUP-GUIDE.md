# PWA Complete Setup Guide

This guide will walk you through setting up a fully functional Progressive Web App with push notifications.

## Prerequisites

- Web server with HTTPS (required for service workers)
- Node.js 18+ (for backend API)
- Domain name with SSL certificate
- Modern web browser for testing

## Step 1: Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for push notifications.

```bash
cd tools
node generate-vapid-keys.js
```

Save the output - you'll need both public and private keys.

## Step 2: Configure the Frontend

### 2.1 Update manifest.json

Edit `frontend/manifest.json`:

```json
{
  "name": "Your Full App Name",
  "short_name": "YourApp",
  "description": "Your app description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#your-brand-color",
  "orientation": "any",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2.2 Update push-notifications.js

Replace the VAPID public key on line 5:

```javascript
this.vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
```

### 2.3 Update API URL (if needed)

If your push API is not at `/push-api`, update line 8:

```javascript
this.apiUrl = '/your-api-path';
```

## Step 3: Create Your Icons

### Option A: Use provided generator
1. Open `icons/generate-icons.html` in a browser
2. Upload your logo
3. Download generated icons

### Option B: Create manually
- 192x192px PNG for app launcher
- 512x512px PNG for splash screen
- favicon.ico for browser tab

## Step 4: Set Up Your HTML

Add to your HTML `<head>`:

```html
<!-- PWA Meta Tags -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#your-color">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- iOS Support -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icon-192x192.png">
```

Before closing `</body>`:

```html
<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
</script>

<!-- PWA Scripts -->
<script src="/app-installer.js"></script>
<script src="/push-notifications.js"></script>
<script src="/fold-detection.js"></script>

<!-- Initialize PWA Features -->
<script>
// Initialize push notifications
pushManager.init();

// Initialize app installer
const installer = new AppInstaller();
installer.init();

// Initialize fold detection
// (automatically initialized)
</script>
```

## Step 5: Deploy Frontend Files

Upload these files to your web root:
- All files from `frontend/`
- All files from `icons/`
- Your HTML files

Directory structure on server:
```
/var/www/yoursite/
├── index.html
├── manifest.json
├── sw.js
├── push-notifications.js
├── app-installer.js
├── fold-detection.js
├── alerts-config.js
├── favicon.ico
├── icon-192x192.png
└── icon-512x512.png
```

## Step 6: Set Up Backend API

### 6.1 Configure Environment

Copy and edit `.env.example`:

```bash
cd backend/push-api
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=3011
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=mailto:admin@yourdomain.com

# Optional PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 6.2 Deploy with Docker

```bash
docker build -t push-api .
docker run -d \
  --name push-api \
  -p 3011:3011 \
  --env-file .env \
  --restart unless-stopped \
  push-api
```

### 6.3 Configure Reverse Proxy

For Nginx:
```nginx
location /push-api/ {
    proxy_pass http://localhost:3011/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

For Caddy:
```caddy
yourdomain.com {
    handle /push-api/* {
        uri strip_prefix /push-api
        reverse_proxy localhost:3011
    }
    handle {
        root * /var/www/yoursite
        file_server
    }
}
```

## Step 7: Test Your PWA

### 7.1 Basic PWA Test
1. Open Chrome DevTools
2. Go to Application tab
3. Check:
   - ✓ Manifest detected
   - ✓ Service Worker registered
   - ✓ HTTPS connection

### 7.2 Installation Test
1. Open site in Chrome/Edge
2. Look for install prompt in address bar
3. Click install and verify app appears

### 7.3 Push Notification Test
1. Click "Enable" in push notifications UI
2. Accept permission prompt
3. Check browser console for subscription
4. Test with: `curl https://yourdomain.com/push-api/health`

### 7.4 Offline Test
1. Enable offline mode in DevTools
2. Reload page - should still work
3. Check cached resources in Application tab

## Step 8: Production Checklist

- [ ] HTTPS enabled on domain
- [ ] Valid SSL certificate
- [ ] manifest.json accessible
- [ ] Service worker registered
- [ ] Icons loading correctly
- [ ] Push API responding
- [ ] VAPID keys configured
- [ ] Environment variables set
- [ ] Docker container running
- [ ] Reverse proxy configured

## Troubleshooting

### Service Worker Not Registering
- Check HTTPS is enabled
- Verify sw.js is in root directory
- Check console for errors

### Push Notifications Not Working
- Verify VAPID keys match frontend/backend
- Check API health endpoint
- Ensure notifications permitted in browser

### Icons Not Showing
- Check icon paths in manifest.json
- Verify icons are in correct sizes
- Clear browser cache

### App Not Installing
- Must be served over HTTPS
- Check manifest.json validity
- Ensure start_url is correct

## Next Steps

1. Customize the UI in `alerts-config.js`
2. Add your branding to all files
3. Implement custom notification types
4. Set up monitoring for the API
5. Configure database for persistence

For more customization options, see [CUSTOMIZATION.md](CUSTOMIZATION.md).