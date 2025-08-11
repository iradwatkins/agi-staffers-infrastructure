#!/bin/bash
echo "Testing SSH connection to AGI Staffers VPS..."
ssh -o BatchMode=yes -o ConnectTimeout=5 root@148.230.93.174 'echo "✅ SSH connection successful!"' 2>&1 || {
    echo "❌ SSH connection failed"
    echo ""
    echo "Please run: ./setup-ssh-key.sh"
    echo "And follow the instructions to set up SSH access"
    exit 1
}