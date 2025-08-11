#!/bin/bash

# Deploy Admin Dashboard to VPS
echo "🚀 Deploying Admin Dashboard..."

# Create archive without backups
cd ~/Documents/Cursor\ Setup
tar -czf admin-deploy.tar.gz \
  --exclude='*.tar.gz' \
  --exclude='node_modules' \
  --exclude='.next' \
  agistaffers/

# Upload to VPS
echo "📤 Uploading to VPS..."
SSHPASS='Bobby321&Gloria321Watkins?' sshpass -e scp admin-deploy.tar.gz root@72.60.28.175:/root/

# Deploy on VPS
echo "🔧 Deploying on VPS..."
SSHPASS='Bobby321&Gloria321Watkins?' sshpass -e ssh root@72.60.28.175 << 'EOF'
cd /root
rm -rf agistaffers-admin
mkdir -p agistaffers-admin
cd agistaffers-admin
tar -xzf /root/admin-deploy.tar.gz
cd agistaffers

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Create admin-specific docker image
cat > Dockerfile.admin << 'DOCKEREOF'
FROM node:20-alpine
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
EXPOSE 3007
ENV PORT 3007
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
DOCKEREOF

# Build and run container
docker stop agistaffers-admin 2>/dev/null || true
docker rm agistaffers-admin 2>/dev/null || true
docker build -f Dockerfile.admin -t agistaffers-admin:latest .
docker run -d --name agistaffers-admin -p 3007:3007 --restart unless-stopped agistaffers-admin:latest

echo "✅ Admin dashboard deployed!"
EOF

# Cleanup
rm admin-deploy.tar.gz

echo "🎉 Deployment complete!"
echo "Admin dashboard will be available at https://admin.agistaffers.com/admin"