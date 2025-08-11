#!/bin/bash

echo "🚀 Deploying Push Notification API to VPS..."

# Create directory on VPS
echo "📁 Creating directory structure on VPS..."
ssh agi-vps 'mkdir -p /root/push-notification-api'

# Copy files to VPS
echo "📤 Copying files to VPS..."
scp -r push-notification-api/* agi-vps:/root/push-notification-api/

# Copy VAPID keys
echo "🔑 Copying VAPID keys..."
scp vapid-keys/.env.vapid agi-vps:/root/push-notification-api/.env

# Deploy on VPS
echo "🐳 Deploying with Docker..."
ssh agi-vps << 'EOF'
cd /root/push-notification-api

# Build the Docker image
echo "Building Docker image..."
docker build -t agi-push-api:latest .

# Stop existing container if running
docker stop push-notification-api 2>/dev/null || true
docker rm push-notification-api 2>/dev/null || true

# Create network if it doesn't exist
docker network create agi-network 2>/dev/null || true

# Run the container
echo "Starting container..."
docker run -d \
  --name push-notification-api \
  --restart unless-stopped \
  --network agi-network \
  -p 3008:3008 \
  --env-file .env \
  agi-push-api:latest

# Check if container is running
sleep 3
if docker ps | grep push-notification-api > /dev/null; then
  echo "✅ Push Notification API is running!"
  echo ""
  echo "📡 API Endpoints:"
  echo "- Health: http://148.230.93.174:3008/health"
  echo "- Subscribe: POST http://148.230.93.174:3008/api/subscribe"
  echo "- Send: POST http://148.230.93.174:3008/api/send-notification"
  echo "- Broadcast: POST http://148.230.93.174:3008/api/broadcast"
  echo ""
  docker logs push-notification-api
else
  echo "❌ Container failed to start"
  docker logs push-notification-api
  exit 1
fi
EOF

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update admin dashboard to use the API endpoint"
echo "2. Configure Caddy for push.agistaffers.com subdomain"
echo "3. Test push notifications from the dashboard"