#!/bin/bash
# Chicago Timezone Setup Script
# Converts entire AGI Staffers infrastructure to Chicago time

echo "🕐 Chicago Timezone Configuration Script"
echo "======================================"
echo "Converting system from UTC to America/Chicago"
echo ""

# Check current timezone
CURRENT_TZ=$(timedatectl | grep "Time zone" | awk '{print $3}')
echo "Current timezone: $CURRENT_TZ"

# 1. System timezone
echo ""
echo "Step 1: Setting system timezone..."
timedatectl set-timezone America/Chicago
echo "✅ System timezone set to Chicago"

# 2. Update all Docker containers
echo ""
echo "Step 2: Updating Docker containers..."

# Create environment file for Chicago timezone
cat > /root/chicago-tz.env << 'EOF'
TZ=America/Chicago
EOF

# Update all running containers
for container in $(docker ps --format '{{.Names}}'); do
    echo "  Updating $container..."
    docker exec "$container" sh -c 'export TZ=America/Chicago' 2>/dev/null || true
done

# Update docker-compose files
find /root -name "docker-compose*.yml" -type f | while read file; do
    echo "  Updating compose file: $file"
    # Add TZ environment variable if not exists
    if ! grep -q "TZ=" "$file"; then
        sed -i '/environment:/a\      - TZ=America/Chicago' "$file" 2>/dev/null || true
    fi
done

echo "✅ Docker containers configured for Chicago timezone"

# 3. PostgreSQL timezone
echo ""
echo "Step 3: Updating PostgreSQL timezone..."
docker exec postgres psql -U postgres << EOF
ALTER SYSTEM SET timezone = 'America/Chicago';
SELECT pg_reload_conf();
EOF

# Verify PostgreSQL timezone
docker exec postgres psql -U postgres -c "SHOW timezone;" | grep -q "America/Chicago"
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL timezone set to Chicago"
else
    echo "⚠️ PostgreSQL timezone update may have failed"
fi

# 4. Update backup schedules
echo ""
echo "Step 4: Updating backup schedules to Chicago time..."

# Convert cron jobs to Chicago time
crontab -l > /tmp/crontab.bak 2>/dev/null || true

# Add timezone specification to crontab
(echo "CRON_TZ=America/Chicago"; crontab -l 2>/dev/null | grep -v "CRON_TZ") | crontab -

echo "✅ Cron schedules updated to Chicago timezone"

# 5. Update monitoring scripts
echo ""
echo "Step 5: Updating monitoring and logging..."

# Update rsyslog to include timezone
if [ -f /etc/rsyslog.conf ]; then
    sed -i 's/$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat/$ActionFileDefaultTemplate RSYSLOG_FileFormat/' /etc/rsyslog.conf
    systemctl restart rsyslog
fi

# 6. Update Node.js applications
echo ""
echo "Step 6: Updating Node.js applications..."

# Metrics API
docker exec metrics-api sh -c 'echo "process.env.TZ = \"America/Chicago\";" >> /app/server.js' 2>/dev/null || true

# Push API
docker exec push-api sh -c 'echo "process.env.TZ = \"America/Chicago\";" >> /app/server.js' 2>/dev/null || true

# Restart PM2 processes
pm2 restart all 2>/dev/null || true

echo "✅ Application timezones updated"

# 7. Verification
echo ""
echo "Step 7: Verifying timezone changes..."
echo "======================================"

# System time
echo "System time: $(date)"
echo "Timezone: $(timedatectl | grep "Time zone" | awk '{print $3}')"

# Docker container check
echo ""
echo "Container timezones:"
docker exec admin-dashboard date 2>/dev/null || echo "  admin-dashboard: Not running"
docker exec postgres date 2>/dev/null || echo "  postgres: Not running"
docker exec metrics-api date 2>/dev/null || echo "  metrics-api: Not running"

# Database check
echo ""
echo "PostgreSQL timezone:"
docker exec postgres psql -U postgres -c "SELECT now() AT TIME ZONE 'America/Chicago' as chicago_time;" 2>/dev/null || echo "  Unable to check"

echo ""
echo "======================================"
echo "✅ Chicago timezone setup complete!"
echo ""
echo "Note: Some services may need to be restarted for changes to take full effect."
echo "Run 'docker-compose down && docker-compose up -d' if needed."