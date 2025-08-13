#!/bin/bash
# Deploy Emergency Rollback System to AGI Staffers VPS
# This script sets up the complete rollback infrastructure

echo "🚀 AGI Staffers Emergency Rollback System Deployment"
echo "==================================================="
echo "Target: 72.60.28.175 (agi-vps)"
echo "Features: <2min rollback, Chicago timezone, blue-green deployment"
echo ""

# Step 1: Create rollback directory structure on VPS
echo "Step 1: Creating rollback infrastructure..."
ssh agi-vps 'mkdir -p /root/rollback-system/{snapshots,configs,scripts,monitoring}'

# Step 2: Upload rollback scripts
echo "Step 2: Uploading rollback scripts..."
scp rollback-scripts/*.sh agi-vps:/root/rollback-system/scripts/
ssh agi-vps 'chmod +x /root/rollback-system/scripts/*.sh'

# Step 3: Upload blue-green configuration
echo "Step 3: Uploading blue-green deployment configs..."
scp rollback-scripts/docker-compose.blue-green.yml agi-vps:/root/rollback-system/configs/
scp rollback-scripts/nginx-blue-green.conf agi-vps:/root/rollback-system/configs/

# Step 4: Set up automated snapshots
echo "Step 4: Configuring automated snapshots..."
ssh agi-vps << 'EOF'
# Add snapshot cron job (every 4 hours)
(crontab -l 2>/dev/null | grep -v "create-snapshot.sh"; echo "0 */4 * * * /root/rollback-system/scripts/create-snapshot.sh") | crontab -

# Create initial snapshot
/root/rollback-system/scripts/create-snapshot.sh
EOF

# Step 5: Execute Chicago timezone setup
echo "Step 5: Converting to Chicago timezone..."
ssh agi-vps '/root/rollback-system/scripts/chicago-timezone-setup.sh'

# Step 6: Set up health monitoring service
echo "Step 6: Creating health monitoring service..."
ssh agi-vps << 'EOF'
# Create systemd service for health monitoring
cat > /etc/systemd/system/health-monitor.service << 'SERVICE'
[Unit]
Description=AGI Staffers Health Monitor with Rollback
After=network.target docker.service

[Service]
Type=simple
ExecStart=/root/rollback-system/scripts/health-check.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

# Enable and start the service
systemctl daemon-reload
systemctl enable health-monitor.service
systemctl start health-monitor.service
EOF

# Step 7: Prepare blue-green deployment
echo "Step 7: Preparing blue-green deployment..."
ssh agi-vps << 'EOF'
# Ensure current admin dashboard is tagged as blue
docker tag admin-dashboard:latest admin-dashboard:js-stable || true

# Build React dashboard if needed
if [ -d /root/agistaffers ]; then
    cd /root/agistaffers
    docker build -t admin-dashboard:react-latest . || echo "React build will be done during deployment"
fi

# Deploy blue-green containers
cd /root/rollback-system/configs
docker-compose -f docker-compose.blue-green.yml up -d admin-dashboard-blue
EOF

# Step 8: Verification
echo ""
echo "Step 8: Verifying deployment..."
echo "======================================"

# Check timezone
echo "Timezone verification:"
ssh agi-vps 'timedatectl | grep "Time zone"'

# Check snapshots
echo ""
echo "Snapshot system:"
ssh agi-vps 'ls -la /root/rollback-system/snapshots/'

# Check health monitor
echo ""
echo "Health monitor status:"
ssh agi-vps 'systemctl status health-monitor.service --no-pager | head -5'

# Check containers
echo ""
echo "Container status:"
ssh agi-vps 'docker ps | grep -E "admin-dashboard|metrics-api|push-api" || echo "Containers will be started during deployment"'

echo ""
echo "======================================"
echo "✅ Rollback system deployment complete!"
echo ""
echo "Next steps:"
echo "1. Test rollback: ssh agi-vps '/root/rollback-system/scripts/rollback-emergency.sh'"
echo "2. Deploy React dashboard: ssh agi-vps 'docker-compose -f /root/rollback-system/configs/docker-compose.blue-green.yml up -d'"
echo "3. Switch traffic: Update Caddy configuration to route to port 8081 for React"
echo "4. Monitor health: ssh agi-vps 'journalctl -u health-monitor -f'"
echo ""
echo "Rollback capabilities:"
echo "- Automatic snapshots every 4 hours"
echo "- Health monitoring with auto-rollback"
echo "- <2 minute recovery time"
echo "- Blue-green instant switching"