#!/bin/bash

# Test push notification script
echo "🔔 Testing push notification system..."

# Test VAPID public key endpoint
echo "Testing VAPID public key endpoint..."
curl -s https://admin.agistaffers.com/api/push/vapid-public-key | jq .

echo ""
echo "Testing push API health..."
curl -s http://148.230.93.174:3011/health | jq .

echo ""
echo "Testing direct push API notification (requires subscription)..."
# Send test notification via push API
curl -X POST http://148.230.93.174:3011/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "default",
    "title": "Test Notification",
    "body": "Push notifications are working! 🎉",
    "icon": "/icons/icon-192x192.png",
    "badge": "/icons/icon-192x192.png"
  }'

echo ""
echo "✅ Push notification tests completed!"