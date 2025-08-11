# PWA Customization Guide

This guide explains how to customize the PWA template for your specific needs.

## Basic Customization

### 1. App Identity

#### Update manifest.json
```json
{
  "name": "Your Company Dashboard",
  "short_name": "YourCo",
  "description": "Manage your business with our powerful dashboard",
  "categories": ["business", "productivity"],
  "lang": "en-US",
  "dir": "ltr"
}
```

#### Brand Colors
```json
{
  "background_color": "#ffffff",
  "theme_color": "#your-brand-color"
}
```

### 2. Icons and Branding

#### Generate New Icons
1. Create a 1024x1024px logo
2. Use the icon generator tool
3. Replace all icon files

#### Custom Splash Screen (iOS)
Add to your HTML:
```html
<link rel="apple-touch-startup-image" href="/splash-1242x2208.png">
```

### 3. Push Notification Customization

#### Custom Notification Icon
In `push-notifications.js`:
```javascript
const notification = {
    icon: '/your-custom-icon.png',
    badge: '/your-badge-icon.png'
};
```

#### Custom Vibration Pattern
```javascript
vibrate: [100, 50, 100, 50, 200] // Custom pattern
```

## Advanced Customization

### 1. Service Worker Modifications

#### Custom Cache Strategy
Edit `sw.js`:
```javascript
const CACHE_NAME = 'your-app-v1';
const urlsToCache = [
  '/index.html',
  '/styles.css',
  '/app.js',
  '/your-custom-files.js'
];
```

#### Advanced Caching Rules
```javascript
// Cache images for 7 days
if (request.url.match(/\.(jpg|jpeg|png|gif)$/)) {
  return caches.open('images-cache').then(cache => {
    return cache.match(request).then(response => {
      return response || fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
      });
    });
  });
}
```

### 2. Push Notification Features

#### Custom Notification Types
Add to `push-notifications.js`:
```javascript
async sendCustomNotification(type, data) {
    switch(type) {
        case 'order':
            return this.sendOrderNotification(data);
        case 'message':
            return this.sendMessageNotification(data);
        case 'reminder':
            return this.sendReminderNotification(data);
    }
}

async sendOrderNotification(order) {
    const options = {
        body: `New order #${order.id} - $${order.total}`,
        icon: '/order-icon.png',
        badge: '/badge.png',
        tag: `order-${order.id}`,
        data: {
            type: 'order',
            orderId: order.id,
            url: `/orders/${order.id}`
        },
        actions: [
            { action: 'view', title: 'View Order' },
            { action: 'process', title: 'Process Now' }
        ]
    };
    
    return this.showNotification('New Order!', options);
}
```

#### Notification Click Handling
In `sw.js`:
```javascript
self.addEventListener('notificationclick', function(event) {
    const notification = event.notification;
    const action = event.action;
    const data = notification.data;
    
    notification.close();
    
    if (action === 'process') {
        // Custom action handling
        clients.openWindow(`/process-order/${data.orderId}`);
    } else if (data.url) {
        clients.openWindow(data.url);
    }
});
```

### 3. App Installation Customization

#### Custom Install Prompt
Edit `app-installer.js`:
```javascript
showCustomPrompt() {
    const promptUI = document.createElement('div');
    promptUI.className = 'install-prompt';
    promptUI.innerHTML = `
        <div class="prompt-content">
            <img src="/icon-192x192.png" alt="App Icon">
            <h3>Install Our App</h3>
            <p>Get instant notifications and work offline!</p>
            <button id="install-yes">Install</button>
            <button id="install-later">Maybe Later</button>
        </div>
    `;
    document.body.appendChild(promptUI);
}
```

#### Platform-Specific Messages
```javascript
getPlatformMessage() {
    if (this.isIOS()) {
        return "Tap Share then 'Add to Home Screen'";
    } else if (this.isAndroid()) {
        return "Tap Install to add to your home screen";
    } else {
        return "Click Install in your browser";
    }
}
```

### 4. Fold Detection Enhancements

#### Custom Fold Layouts
Add to your CSS:
```css
/* Folded state (6.2" screen) */
.fold-folded .notification-card {
    padding: 10px;
    font-size: 14px;
}

/* Unfolded state (7.6" screen) */
.fold-unfolded .notification-card {
    padding: 20px;
    font-size: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* Transitioning state */
.fold-transitioning .notification-card {
    opacity: 0.7;
    transition: all 0.3s ease;
}
```

#### Fold-Aware Features
```javascript
foldDetector.onChange((state) => {
    if (state.state === 'unfolded') {
        // Show expanded view
        showExpandedDashboard();
    } else if (state.state === 'folded') {
        // Show compact view
        showCompactDashboard();
    }
});
```

### 5. Database Customization

#### Add Custom Tables
In `database.js`:
```javascript
// Add your custom tables
await pool.query(`
    CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        theme VARCHAR(50) DEFAULT 'light',
        language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
```

#### Custom Data Methods
```javascript
async saveUserSettings(userId, settings) {
    const result = await pool.query(`
        INSERT INTO user_settings (user_id, theme, language, timezone)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            theme = EXCLUDED.theme,
            language = EXCLUDED.language,
            timezone = EXCLUDED.timezone
        RETURNING *
    `, [userId, settings.theme, settings.language, settings.timezone]);
    
    return result.rows[0];
}
```

## UI/UX Customization

### 1. Notification UI Components

Create custom notification cards:
```html
<div class="notification-manager">
    <div class="notification-header">
        <h2>Notifications</h2>
        <button id="notification-settings">⚙️</button>
    </div>
    
    <div class="notification-status">
        <span class="status-indicator"></span>
        <span class="status-text">Notifications Enabled</span>
    </div>
    
    <div class="notification-actions">
        <button class="btn-primary" id="enable-notifications">
            Enable Notifications
        </button>
        <button class="btn-secondary" id="send-test">
            Send Test
        </button>
    </div>
    
    <div class="notification-preferences">
        <!-- Your custom preferences UI -->
    </div>
</div>
```

### 2. Custom Styles

Add your brand styles:
```css
:root {
    --brand-primary: #your-color;
    --brand-secondary: #your-color;
    --brand-accent: #your-color;
    --text-primary: #333;
    --text-secondary: #666;
    --bg-primary: #fff;
    --bg-secondary: #f5f5f5;
}

.notification-manager {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-primary {
    background: var(--brand-primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: darken(var(--brand-primary), 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Performance Optimization

### 1. Lazy Loading
```javascript
// Lazy load non-critical scripts
if ('IntersectionObserver' in window) {
    const lazyLoadScript = (src) => {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    };
    
    // Load when user scrolls
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoadScript('/heavy-feature.js');
                observer.unobserve(entry.target);
            }
        });
    });
}
```

### 2. Service Worker Optimization
```javascript
// Skip waiting and claim clients immediately
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});
```

## Security Enhancements

### 1. Content Security Policy
Add to your HTML:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://your-api.com">
```

### 2. API Security
Add to backend API:
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/api/subscribe', [
    body('userId').isAlphanumeric().isLength({ min: 3, max: 50 }),
    body('subscription.endpoint').isURL(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process subscription
});
```

## Testing Your Customizations

### 1. PWA Checklist
- [ ] Custom manifest.json loads
- [ ] Icons display correctly
- [ ] Theme color applied
- [ ] Service worker caches custom files
- [ ] Push notifications show custom content
- [ ] Install prompt appears correctly
- [ ] Offline mode works
- [ ] Fold detection functions

### 2. Cross-Browser Testing
- Chrome/Edge: Full PWA support
- Firefox: Test service workers
- Safari: Limited push support
- Samsung Internet: Fold support

### 3. Performance Testing
- Lighthouse PWA audit
- Network throttling tests
- Offline functionality
- Push notification delivery

## Common Customization Scenarios

### E-commerce PWA
- Order notifications
- Cart persistence
- Offline product browsing
- Payment integration

### Dashboard PWA
- Real-time data updates
- Chart caching
- Export functionality
- Multi-user support

### Communication PWA
- Message notifications
- Presence indicators
- File sharing
- Video call integration

## Support and Resources

- PWA Documentation: https://web.dev/progressive-web-apps/
- Service Worker Cookbook: https://serviceworke.rs/
- Web Push Protocol: https://developers.google.com/web/fundamentals/push-notifications/

Remember to test thoroughly after customization!