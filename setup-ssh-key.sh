#!/bin/bash

# Setup SSH Key for AGI Staffers VPS Access

echo "🔐 Setting up SSH key for AGI Staffers VPS..."
echo "================================================"

# Check if key already exists
if [ -f ~/.ssh/agi-vps ]; then
    echo "⚠️  SSH key already exists at ~/.ssh/agi-vps"
    read -p "Do you want to regenerate it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing key..."
    else
        echo "Backing up existing key..."
        mv ~/.ssh/agi-vps ~/.ssh/agi-vps.backup-$(date +%Y%m%d-%H%M%S)
        mv ~/.ssh/agi-vps.pub ~/.ssh/agi-vps.pub.backup-$(date +%Y%m%d-%H%M%S)
    fi
fi

# Generate new key if it doesn't exist
if [ ! -f ~/.ssh/agi-vps ]; then
    echo "📝 Generating new SSH key..."
    ssh-keygen -t ed25519 -f ~/.ssh/agi-vps -C "agi-vps-access" -N ""
    echo "✅ SSH key generated successfully!"
fi

# Display the public key
echo ""
echo "📋 Your public key:"
echo "==================="
cat ~/.ssh/agi-vps.pub
echo ""

# Copy key to server
echo "🔑 Adding key to VPS..."
echo "You'll need to enter the root password once:"
echo "(Password: Bobby321&Gloria321Watkins?)"
echo ""

# Use ssh-copy-id to add the key
ssh-copy-id -i ~/.ssh/agi-vps.pub root@72.60.28.175

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSH key successfully added to VPS!"
    echo ""
    
    # Test the connection
    echo "🧪 Testing SSH connection..."
    ssh -o BatchMode=yes agi-vps 'echo "✅ SSH connection successful! You can now use the pull/push scripts."'
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Setup complete! You're ready to use:"
        echo "   ./pull-admin-dashboard.sh - Download code from VPS"
        echo "   ./push-admin-dashboard.sh - Upload code to VPS"
    else
        echo ""
        echo "⚠️  Connection test failed. Please check:"
        echo "   - SSH config at ~/.ssh/config"
        echo "   - Key permissions: chmod 600 ~/.ssh/agi-vps"
    fi
else
    echo ""
    echo "❌ Failed to add SSH key to server"
    echo "Please try manually:"
    echo "   ssh-copy-id -i ~/.ssh/agi-vps.pub root@72.60.28.175"
fi