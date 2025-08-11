#!/bin/bash

# Pull Admin Dashboard Code from AGI Staffers VPS
# This script downloads the current code from the admin-dashboard container

echo "🔄 Pulling code from admin-dashboard container..."

# Create local directory if it doesn't exist
mkdir -p ./admin-dashboard-local

# Pull files from container
# Using docker exec with tar to preserve permissions
ssh agi-vps 'docker exec admin-dashboard tar -czf - -C /usr/share/nginx/html .' | tar -xzf - -C ./admin-dashboard-local/

if [ $? -eq 0 ]; then
    echo "✅ Code successfully pulled to ./admin-dashboard-local/"
    echo "📁 Files downloaded:"
    ls -la ./admin-dashboard-local/
else
    echo "❌ Failed to pull code from server"
    exit 1
fi