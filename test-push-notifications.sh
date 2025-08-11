#!/bin/bash

# Test Push Notification System
echo "🔔 Testing Push Notification System..."
echo "====================================="

# Test API Health
echo -e "\n1. Testing API Health:"
curl -s https://admin.agistaffers.com/push-api/health | jq .

# Check subscriptions
echo -e "\n2. Current Subscriptions:"
curl -s https://admin.agistaffers.com/push-api/api/subscriptions | jq .

# Test monitoring alerts
echo -e "\n3. Testing Monitoring Alerts:"

# Container down alert
echo -e "\n   - Container Down Alert:"
curl -s -X POST https://admin.agistaffers.com/push-api/api/notify/container-down \
  -H "Content-Type: application/json" \
  -d '{"containerName": "test-container", "containerId": "abc123"}' | jq .

# High CPU alert
echo -e "\n   - High CPU Alert:"
curl -s -X POST https://admin.agistaffers.com/push-api/api/notify/high-cpu \
  -H "Content-Type: application/json" \
  -d '{"usage": 95, "threshold": 80}' | jq .

# Low disk alert
echo -e "\n   - Low Disk Alert:"
curl -s -X POST https://admin.agistaffers.com/push-api/api/notify/low-disk \
  -H "Content-Type: application/json" \
  -d '{"available": 5, "threshold": 10}' | jq .

echo -e "\n✅ Push notification system test complete!"
echo "====================================="
echo -e "\nTo test browser notifications:"
echo "1. 🌐 Go to https://admin.agistaffers.com"
echo "2. 🔔 Click 'Enable' button in Push Notifications section"
echo "3. ✅ Accept the browser permission prompt"
echo "4. 📱 You should see a test notification!"