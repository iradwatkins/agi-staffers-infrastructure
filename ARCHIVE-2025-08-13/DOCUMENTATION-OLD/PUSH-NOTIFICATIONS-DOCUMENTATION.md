# Push Notification System Documentation
**Last Updated**: August 8, 2025
**System**: AGI Staffers Admin Dashboard

## Overview
The push notification system enables real-time alerts for the AGI Staffers admin dashboard, supporting browser-based push notifications for system monitoring, alerts, and user engagement.

## Architecture

### Components
1. **Push API Service** (Node.js/Express)
   - Port: 3011
   - URL: https://admin.agistaffers.com/push-api/*
   - Container: push-notification-api

2. **Frontend Integration** (JavaScript)
   - File: push-notifications.js
   - Service Worker: sw.js
   - PWA Manifest: manifest.json

3. **Monitoring Integration**
   - Docker monitor alerts script
   - Automated system alerts

## Recent Changes (August 8, 2025)

### 1. VAPID Key Configuration
**Problem**: Mismatch between frontend and backend VAPID keys prevented subscriptions
**Solution**: Generated new matching VAPID key pair

```
Public Key: BCQLKtKr-hK9kVXSXoMX_8NPMZhTLfQzZGMFQdkC8sWJOVf-uu8sCwBIMz_Kwjow4HywIDjnAa5J4AwnJR7eli8
Private Key: _qAK99oqPXnkPBzuwcPGXUrOA_ZPMbk7rf3Gp6ae6fo
```

### 2. Frontend Updates (push-notifications.js)
**Changes Made**:
- Added proper VAPID public key
- Implemented actual API subscription flow
- Added user ID generation and persistence
- Fixed subscribe/unsubscribe methods to communicate with backend
- Added subscription state checking on initialization

**Key Methods Updated**:
- `constructor()`: Added apiUrl and userId properties
- `subscribe()`: Now creates push subscription and sends to server
- `unsubscribe()`: Properly removes subscription from server
- `init()`: Checks for existing subscription on load
- `generateUserId()`: Creates persistent user identifier

### 3. Backend Fixes (server.js)
**Stack Overflow Bug Fixed**:
- Removed recursive `app.handle()` calls in monitoring endpoints
- Implemented proper notification broadcasting for alerts

**Monitoring Endpoints Fixed**:
- `/api/notify/container-down`
- `/api/notify/high-cpu`
- `/api/notify/low-disk`

Each endpoint now properly broadcasts to all subscribers without recursion.

### 4. Service Worker Configuration (sw.js)
**Features**:
- Push event handler for receiving notifications
- Notification click handler to open dashboard
- Offline caching support
- Background sync capability

## API Endpoints

### Health Check
```
GET /push-api/health
Response: {
  "status": "ok",
  "service": "AGI Push Notification API",
  "timestamp": "2025-08-08T16:34:41.276Z"
}
```

### Subscribe
```
POST /push-api/api/subscribe
Body: {
  "subscription": { /* Push subscription object */ },
  "userId": "user-123"
}
Response: {
  "success": true,
  "message": "Subscription successful"
}
```

### Unsubscribe
```
POST /push-api/api/unsubscribe
Body: {
  "userId": "user-123"
}
Response: {
  "success": true,
  "message": "Unsubscribed successfully"
}
```

### Send Notification
```
POST /push-api/api/send-notification
Body: {
  "userId": "user-123",
  "title": "Alert Title",
  "body": "Notification message",
  "icon": "/icon-192x192.png",
  "badge": "/icon-192x192.png",
  "data": {},
  "actions": []
}
```

### Broadcast
```
POST /push-api/api/broadcast
Body: {
  "title": "Broadcast Title",
  "body": "Message to all users",
  "icon": "/icon-192x192.png",
  "badge": "/icon-192x192.png",
  "data": {}
}
```

### Monitoring Alerts
```
POST /push-api/api/notify/container-down
Body: {
  "containerName": "nginx",
  "containerId": "abc123"
}

POST /push-api/api/notify/high-cpu
Body: {
  "usage": 95,
  "threshold": 80
}

POST /push-api/api/notify/low-disk
Body: {
  "available": 5,
  "threshold": 10
}
```

### Debug Endpoint
```
GET /push-api/api/subscriptions
Response: {
  "count": 2,
  "subscriptions": [
    {
      "userId": "user-123",
      "endpoint": "https://fcm.googleapis.com/...",
      "expirationTime": null
    }
  ]
}
```

## Deployment Configuration

### Docker Setup
```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3011
CMD ["node", "server.js"]
```

### Environment Variables (.env)
```
NODE_ENV=production
PORT=3011
VAPID_PUBLIC_KEY=BCQLKtKr-hK9kVXSXoMX_8NPMZhTLfQzZGMFQdkC8sWJOVf-uu8sCwBIMz_Kwjow4HywIDjnAa5J4AwnJR7eli8
VAPID_PRIVATE_KEY=_qAK99oqPXnkPBzuwcPGXUrOA_ZPMbk7rf3Gp6ae6fo
VAPID_EMAIL=mailto:admin@agistaffers.com
```

### Caddy Reverse Proxy
```
admin.agistaffers.com {
    handle /push-api/* {
        uri strip_prefix /push-api
        reverse_proxy 127.0.0.1:3011
    }
    # ... other handlers
}
```

## Testing Push Notifications

### Browser Testing
1. Navigate to https://admin.agistaffers.com
2. Click "Enable" in Push Notifications section
3. Accept browser permission prompt
4. Test notification will appear

### API Testing
```bash
# Test health
curl https://admin.agistaffers.com/push-api/health

# Check subscriptions
curl https://admin.agistaffers.com/push-api/api/subscriptions

# Test container down alert
curl -X POST https://admin.agistaffers.com/push-api/api/notify/container-down \
  -H "Content-Type: application/json" \
  -d '{"containerName": "test", "containerId": "123"}'
```

## Storage Implementation

### Hybrid Storage Mode (Current)
The push notification API now supports **hybrid storage mode**, automatically detecting database availability:

- **With PostgreSQL**: Full persistence, preferences, history tracking
- **Without PostgreSQL**: In-memory storage with graceful fallback
- **Auto-detection**: Checks database on startup and adapts accordingly

### Current Status
- **Storage Mode**: In-Memory (PostgreSQL not accessible from container network)
- **Subscription Persistence**: Lost on container restart
- **Preference Storage**: In-memory during session
- **History Tracking**: Last 1000 notifications in memory

### PostgreSQL Features (When Available)
1. **Persistent Storage**
   - push_subscriptions table
   - push_preferences table
   - notification_history table
   
2. **Advanced Features**
   - User preference management
   - Notification history tracking
   - Multi-device support
   - Analytics and reporting

### Enabling PostgreSQL
To enable PostgreSQL persistence:
1. Ensure PostgreSQL container is on same Docker network
2. Update DB_HOST in .env to container name
3. Restart push-notification-api container
4. Check /health endpoint for database status

## Samsung Fold 6 Optimization
The system includes fold detection (fold-detection.js) for responsive notification display:
- Detects folded (6.2") vs unfolded (7.6") states
- Adjusts notification layout based on screen size
- Supports both portrait and landscape orientations

## Monitoring Integration
The docker-monitor-alerts.sh script automatically sends push notifications for:
- Container down events
- High CPU usage (>80%)
- Low disk space (<10GB)
- Critical service failures

## Security Considerations
- VAPID keys ensure only authorized servers can send notifications
- HTTPS required for all API endpoints
- Subscription endpoints should be protected (pending implementation)
- Rate limiting recommended for production

## Troubleshooting

### No Notifications Received
1. Check browser notification permissions
2. Verify service worker is registered
3. Check subscription exists via /api/subscriptions
4. Review browser console for errors

### Container Restart Issues
- Currently subscriptions are lost on restart
- PostgreSQL integration will resolve this

### VAPID Key Errors
- Ensure public key matches in frontend and backend
- Private key must be valid base64 string
- Keys must be generated as a pair

## File Locations
- **Frontend**: `/admin-dashboard-local/push-notifications.js`
- **Service Worker**: `/admin-dashboard-local/sw.js`
- **Backend**: `/push-notification-api/server.js`
- **Database Module**: `/push-notification-api/database.js`
- **Docker Config**: `/push-notification-api/Dockerfile`
- **Environment**: `/push-notification-api/.env`

## Implementation Summary

### What Was Done
1. **Fixed VAPID Keys** - Generated new matching keys for frontend/backend
2. **Implemented Subscription Flow** - Frontend now properly calls API endpoints
3. **Fixed Stack Overflow** - Removed recursive app.handle() calls
4. **Added Hybrid Storage** - Graceful fallback between PostgreSQL and in-memory
5. **Enhanced Error Handling** - Proper handling of expired subscriptions
6. **Added Preference System** - User notification preferences (in-memory/database)
7. **Implemented History Tracking** - Track sent/failed notifications

### Current Capabilities
- ✅ Browser push notifications working
- ✅ Service worker with offline support
- ✅ Monitoring system integration
- ✅ User preferences for notification types
- ✅ Notification history tracking
- ✅ Samsung Fold 6 detection
- ✅ Automatic HTTPS via Caddy
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD

### Next Steps for Full PostgreSQL Integration
1. Add PostgreSQL container to agi-network
2. Update DB_HOST to use container name
3. Test database connectivity
4. Migrate in-memory data to database
5. Enable multi-device support
6. Implement analytics dashboard