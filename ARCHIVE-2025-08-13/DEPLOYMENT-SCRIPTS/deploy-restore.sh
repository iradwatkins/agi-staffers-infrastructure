#!/bin/bash

echo "🚀 Restoring AGI Staffers to VPS..."

# Deploy admin dashboard files
echo "📦 Deploying admin dashboard files..."

# Upload main files
scp admin-dashboard-local/index.html root@72.60.28.175:/tmp/
scp admin-dashboard-local/sw.js root@72.60.28.175:/tmp/
scp admin-dashboard-local/push-notifications.js root@72.60.28.175:/tmp/

# Upload components
scp admin-dashboard-local/components/AlertsSystem.js root@72.60.28.175:/tmp/
scp admin-dashboard-local/components/HistoricalData.js root@72.60.28.175:/tmp/

# Upload push API files
scp -r admin-dashboard-local/push-api root@72.60.28.175:/root/

# Deploy to containers
ssh root@72.60.28.175 << 'DEPLOY'
# Copy files to admin dashboard
docker cp /tmp/index.html admin-dashboard:/usr/share/nginx/html/
docker cp /tmp/sw.js admin-dashboard:/usr/share/nginx/html/
docker cp /tmp/push-notifications.js admin-dashboard:/usr/share/nginx/html/

# Create components directory and copy files
docker exec admin-dashboard mkdir -p /usr/share/nginx/html/components
docker cp /tmp/AlertsSystem.js admin-dashboard:/usr/share/nginx/html/components/
docker cp /tmp/HistoricalData.js admin-dashboard:/usr/share/nginx/html/components/

# Clean up temp files
rm -f /tmp/*.html /tmp/*.js

# Set up Push API
cd /root/push-api
npm install

# Create simple Node.js runner for push API
cat > run-push-api.sh << 'SCRIPT'
#!/bin/bash
cd /root/push-api
PORT=3011 \
NODE_ENV=production \
VAPID_PUBLIC_KEY=BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8 \
VAPID_PRIVATE_KEY=Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E \
VAPID_SUBJECT=mailto:admin@agistaffers.com \
DATABASE_URL=postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@localhost:5432/stepperslife \
CORS_ORIGIN=https://agistaffers.com,https://admin.agistaffers.com \
node server.js
SCRIPT

chmod +x run-push-api.sh

# Run push API in background
nohup ./run-push-api.sh > push-api.log 2>&1 &

# Restart admin dashboard
docker restart admin-dashboard

echo "✅ Restoration complete!"
DEPLOY

echo "🎉 Restoration complete!"