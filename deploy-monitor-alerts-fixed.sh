#!/bin/bash

echo "🚀 Deploying Docker Monitor with Push Alerts..."

# Upload the monitoring script
scp docker-monitor-alerts.sh agi-vps:/root/

# Set up the monitoring service on VPS
ssh agi-vps << 'EOF'
# Make script executable
chmod +x /root/docker-monitor-alerts.sh

# Create systemd service
cat > /etc/systemd/system/docker-monitor-alerts.service << 'SERVICE'
[Unit]
Description=Docker Monitor with Push Notification Alerts
After=docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=/root/docker-monitor-alerts.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=docker-monitor

[Install]
WantedBy=multi-user.target
SERVICE

# Reload systemd and start the service
systemctl daemon-reload
systemctl stop docker-monitor-alerts 2>/dev/null || true
systemctl start docker-monitor-alerts
systemctl enable docker-monitor-alerts

# Check status
if systemctl is-active --quiet docker-monitor-alerts; then
    echo "✅ Docker Monitor service is running"
    echo ""
    echo "View logs with: journalctl -u docker-monitor-alerts -f"
else
    echo "❌ Docker Monitor service failed to start"
    systemctl status docker-monitor-alerts
fi
EOF

echo ""
echo "🎉 Docker Monitor with Push Alerts deployed!"
echo ""
echo "The monitor will:"
echo "- Check container status every 30 seconds"
echo "- Send alerts when containers go down"
echo "- Monitor CPU, memory, and disk usage"
echo "- Alert on critical service failures"