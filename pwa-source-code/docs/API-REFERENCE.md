# Push Notification API Reference

Complete API documentation for the PWA push notification service.

## Base URL

```
https://yourdomain.com/push-api
```

## Authentication

The API uses VAPID (Voluntary Application Server Identification) for push notification authentication. No additional authentication is required for API endpoints.

## Endpoints

### Health Check

Check if the API is running and database status.

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "Push Notification API",
  "timestamp": "2025-08-08T12:00:00.000Z",
  "database": {
    "connected": true,
    "error": null
  },
  "storage": "PostgreSQL",
  "subscriptions": 5
}
```

### Subscribe to Push Notifications

Register a user's push subscription.

```http
POST /api/subscribe
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "expirationTime": null,
    "keys": {
      "p256dh": "base64string",
      "auth": "base64string"
    }
  },
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription successful"
}
```

### Unsubscribe from Push Notifications

Remove a user's push subscription.

```http
POST /api/unsubscribe
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unsubscribed successfully"
}
```

### Update Notification Preferences

Set user preferences for notification types.

```http
POST /api/preferences
Content-Type: application/json

{
  "userId": "user-123",
  "preferences": {
    "notify_container_down": true,
    "notify_high_cpu": true,
    "notify_low_memory": true,
    "notify_low_disk": true,
    "notify_deployments": true,
    "notify_security": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "notify_container_down": true,
    "notify_high_cpu": true,
    "notify_low_memory": true,
    "notify_low_disk": true,
    "notify_deployments": true,
    "notify_security": true
  }
}
```

### Get Notification Preferences

Retrieve user's notification preferences.

```http
GET /api/preferences/{userId}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "notify_container_down": true,
    "notify_high_cpu": true,
    "notify_low_memory": true,
    "notify_low_disk": true,
    "notify_deployments": true,
    "notify_security": true
  }
}
```

### Send Notification to User

Send a push notification to a specific user.

```http
POST /api/send-notification
Content-Type: application/json

{
  "userId": "user-123",
  "title": "Test Notification",
  "body": "This is a test message",
  "icon": "/icon-192x192.png",
  "badge": "/icon-192x192.png",
  "data": {
    "url": "https://yourdomain.com/dashboard",
    "type": "alert"
  },
  "actions": [
    {
      "action": "view",
      "title": "View Details"
    },
    {
      "action": "dismiss",
      "title": "Dismiss"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent"
}
```

### Broadcast to All Users

Send a notification to all subscribed users.

```http
POST /api/broadcast
Content-Type: application/json

{
  "title": "System Update",
  "body": "Maintenance scheduled for tonight",
  "icon": "/icon-192x192.png",
  "badge": "/icon-192x192.png",
  "data": {
    "type": "announcement"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    { "userId": "user-123", "status": "sent" },
    { "userId": "user-456", "status": "sent" }
  ],
  "summary": {
    "total": 2,
    "sent": 2,
    "failed": 0
  }
}
```

### Get Notification History

Retrieve notification history for a user.

```http
GET /api/history/{userId}?limit=50
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "userId": "user-123",
      "title": "Test Notification",
      "body": "This is a test",
      "type": "alert",
      "status": "sent",
      "sent_at": "2025-08-08T12:00:00.000Z"
    }
  ]
}
```

### List All Subscriptions (Debug)

Get all active subscriptions (for debugging).

```http
GET /api/subscriptions
```

**Response:**
```json
{
  "count": 2,
  "subscriptions": [
    {
      "userId": "user-123",
      "endpoint": "https://fcm.googleapis.com/...",
      "expirationTime": null
    }
  ],
  "storage": "PostgreSQL"
}
```

## Monitoring Alert Endpoints

Special endpoints for system monitoring integration.

### Container Down Alert

```http
POST /api/notify/container-down
Content-Type: application/json

{
  "containerName": "nginx",
  "containerId": "abc123def"
}
```

### High CPU Alert

```http
POST /api/notify/high-cpu
Content-Type: application/json

{
  "usage": 95,
  "threshold": 80
}
```

### Low Disk Space Alert

```http
POST /api/notify/low-disk
Content-Type: application/json

{
  "available": 5,
  "threshold": 10
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid subscription"
}
```

### 404 Not Found
```json
{
  "error": "Subscription not found"
}
```

### 410 Gone
```json
{
  "error": "Subscription expired"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to send notification"
}
```

## Notification Payload Format

Notifications sent to the service worker have this format:

```javascript
{
  "title": "Notification Title",
  "body": "Notification message",
  "icon": "/icon-192x192.png",
  "badge": "/icon-192x192.png",
  "vibrate": [200, 100, 200],
  "tag": "unique-tag",
  "requireInteraction": false,
  "data": {
    "url": "https://yourdomain.com",
    "type": "alert",
    "timestamp": "2025-08-08T12:00:00.000Z"
  },
  "actions": [
    {
      "action": "view",
      "title": "View",
      "icon": "/icon-192x192.png"
    }
  ]
}
```

## Storage Modes

The API supports two storage modes:

### PostgreSQL (Recommended)
- Persistent storage
- User preferences
- Notification history
- Multi-device support

### In-Memory (Fallback)
- No persistence
- Lost on restart
- Limited to 1000 history entries
- Single device per user

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding:
- Rate limiting per user
- Broadcast frequency limits
- Subscription limits per IP

## WebSocket Support

The API can be extended to support WebSocket connections for real-time updates. The infrastructure is ready but not currently implemented.

## Testing

### Test Subscription
```bash
curl -X POST https://yourdomain.com/push-api/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {
      "endpoint": "test",
      "keys": { "p256dh": "test", "auth": "test" }
    },
    "userId": "test-user"
  }'
```

### Test Broadcast
```bash
curl -X POST https://yourdomain.com/push-api/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Broadcast",
    "body": "This is a test"
  }'
```