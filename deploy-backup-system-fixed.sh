#!/bin/bash

echo "🚀 Deploying Automated Backup System..."

# Create backup directory structure on VPS
ssh agi-vps 'mkdir -p /backup/{postgresql,docker-volumes,websites,scripts}'

# Upload backup scripts
echo "📤 Uploading backup scripts..."
scp -r backup-system/*.sh agi-vps:/backup/scripts/

# Set up the backup system on VPS
ssh agi-vps << 'EOF'
# Make scripts executable
chmod +x /backup/scripts/*.sh

# Create backup user for PostgreSQL (if needed)
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null || true

# Create .pgpass file for passwordless backups
cat > /root/.pgpass << 'PGPASS'
localhost:5432:*:postgres:postgres
PGPASS
chmod 600 /root/.pgpass

# Create systemd service for automated backups
cat > /etc/systemd/system/agi-backup.service << 'SERVICE'
[Unit]
Description=AGI Staffers Automated Backup
After=docker.service postgresql.service

[Service]
Type=oneshot
ExecStart=/backup/scripts/master-backup.sh
StandardOutput=journal
StandardError=journal
SyslogIdentifier=agi-backup

[Install]
WantedBy=multi-user.target
SERVICE

# Create systemd timer for daily backups at 3 AM
cat > /etc/systemd/system/agi-backup.timer << 'TIMER'
[Unit]
Description=Run AGI Backup daily at 3 AM
Requires=agi-backup.service

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
TIMER

# Create cron job as backup (in case systemd timer fails)
(crontab -l 2>/dev/null; echo "0 3 * * * /backup/scripts/master-backup.sh >> /var/log/backup-cron.log 2>&1") | crontab -

# Enable and start the backup timer
systemctl daemon-reload
systemctl enable agi-backup.timer
systemctl start agi-backup.timer

# Run initial backup
echo "Running initial backup test..."
/backup/scripts/master-backup.sh

# Check timer status
echo ""
echo "Backup timer status:"
systemctl status agi-backup.timer --no-pager

# Show next scheduled run
echo ""
echo "Next scheduled backup:"
systemctl list-timers agi-backup.timer --no-pager
EOF

echo ""
echo "✅ Backup system deployed successfully!"
echo ""
echo "📋 Backup Schedule:"
echo "- Daily backups at 3:00 AM server time"
echo "- 7-day retention policy"
echo "- Backup location: /backup/"
echo ""
echo "🔧 Useful Commands:"
echo "- Manual backup: ssh agi-vps '/backup/scripts/master-backup.sh'"
echo "- List backups: ssh agi-vps '/backup/scripts/restore-backup.sh -l'"
echo "- View logs: ssh agi-vps 'journalctl -u agi-backup -f'"
echo "- Restore: ssh agi-vps '/backup/scripts/restore-backup.sh -h'"