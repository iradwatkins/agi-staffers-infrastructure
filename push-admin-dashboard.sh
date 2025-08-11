#!/bin/bash

# Push Admin Dashboard Code to AGI Staffers VPS
# This script uploads local changes to the agistaffers-web container

CONTAINER_NAME="agistaffers-web"
LOCAL_DIR="./agistaffers"

echo "🚀 Pushing code to $CONTAINER_NAME container..."

# Check if local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    echo "❌ Error: $LOCAL_DIR directory not found"
    exit 1
fi

# Build the project first
echo "🔨 Building the project..."
cd "$LOCAL_DIR"
pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
cd ..

# Create backup on server before pushing
echo "📦 Creating backup on server..."
ssh agi-vps "docker exec $CONTAINER_NAME mkdir -p /app/backups && docker exec $CONTAINER_NAME cp -r /app /app/backups/backup-$(date +%Y%m%d-%H%M%S)"

# Push built files to container
echo "📤 Uploading built files..."
# Push the entire built app
tar -czf - -C "$LOCAL_DIR" . | ssh agi-vps "docker exec -i $CONTAINER_NAME tar -xzf - -C /app"

if [ $? -eq 0 ]; then
    echo "✅ Code successfully pushed to $CONTAINER_NAME container"
    
    # Restart container to ensure changes are loaded
    echo "🔄 Restarting container to apply changes..."
    ssh agi-vps "docker restart $CONTAINER_NAME"
    
    echo "🌐 Changes are live at: https://admin.agistaffers.com"
    echo "💡 Tips:"
    echo "   - Use Cmd+Shift+R (hard refresh) to clear browser cache"
    echo "   - Check browser console (Cmd+Option+I) for any JavaScript errors"
    echo "   - Open in incognito window (Cmd+Shift+N) if changes don't appear"
else
    echo "❌ Failed to push code to server"
    exit 1
fi