#!/bin/bash

echo "🔔 Complete Push Notification System Test"
echo "========================================"

echo ""
echo "1. Testing VAPID Public Key Endpoint..."
echo "🔍 GET https://admin.agistaffers.com/api/push/vapid-public-key"
curl -s https://admin.agistaffers.com/api/push/vapid-public-key | jq .

echo ""
echo "2. Testing Push API Server Health..."
echo "🔍 GET http://148.230.93.174:3011/health"
curl -s http://148.230.93.174:3011/health | jq .

echo ""
echo "3. Testing Push API Subscription Count..."
echo "🔍 GET http://148.230.93.174:3011/api/subscriptions"
curl -s http://148.230.93.174:3011/api/subscriptions | jq .

echo ""
echo "4. Testing Manual Push Notification..."
echo "🔍 POST http://148.230.93.174:3011/api/broadcast"
curl -X POST http://148.230.93.174:3011/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎉 AGI Staffers Test",
    "body": "Push notification system is working correctly! Ready for multi-client deployment.",
    "icon": "/icons/icon-192x192.png"
  }' | jq .

echo ""
echo "5. Admin Dashboard URLs for Manual Testing:"
echo "📱 Dashboard: https://admin.agistaffers.com"
echo "🔔 Navigate to: Notifications tab → Enable Push Notifications"
echo "✅ Then run this script again to see if subscription count increases"

echo ""
echo "🎯 Next Steps:"
echo "   1. Go to https://admin.agistaffers.com"
echo "   2. Click on 'Notifications' tab (5th tab)"
echo "   3. Click 'Enable Push Notifications' and allow browser permission"
echo "   4. Run this script again to test delivery"

echo ""
echo "✅ Test completed!"