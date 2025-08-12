#!/bin/bash
# BMAD Final 15% Infrastructure Deployment
# Clean, executable script for VPS deployment

echo "Starting BMAD Infrastructure Completion..."

# Create backup automation script
cat > /tmp/backup-automation.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$DATE"

mkdir -p $BACKUP_PATH

echo "Starting backup at $(date)"

# Database Backup
docker exec stepperslife-db pg_dumpall -U postgres > $BACKUP_PATH/postgres_full.sql

# Redis Backup
docker exec redis redis-cli BGSAVE
sleep 5
docker cp redis:/data/dump.rdb $BACKUP_PATH/redis_dump.rdb

# Configuration Files
cp /root/Caddyfile $BACKUP_PATH/
cp -r /root/agi-staffers-infrastructure $BACKUP_PATH/
cp /root/docker-compose*.yml $BACKUP_PATH/ 2>/dev/null || true

# Compress
cd $BACKUP_DIR
tar czf backup_$DATE.tar.gz backup_$DATE/
rm -rf backup_$DATE/

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
echo "$(date): Backup completed" >> /var/log/backup.log
EOF

# Deploy to VPS
echo "Deploying to VPS..."
scp /tmp/backup-automation.sh root@72.60.28.175:/root/

ssh root@72.60.28.175 << 'REMOTE_COMMANDS'
    # Make backup script executable
    chmod +x /root/backup-automation.sh
    
    # Setup cron job (3 AM Chicago = 9 AM UTC)
    (crontab -l 2>/dev/null || true; echo "0 9 * * * /root/backup-automation.sh >> /var/log/backup.log 2>&1") | crontab -
    
    # Create log file
    touch /var/log/backup.log
    
    # Test backup
    echo "Testing backup script..."
    /root/backup-automation.sh
    
    # Check Prometheus configuration
    if ! grep -q "prometheus.agistaffers.com" /root/Caddyfile; then
        echo "Adding Prometheus to Caddyfile..."
        cat >> /root/Caddyfile << 'CADDY'

# Prometheus Metrics (BMAD Added)
prometheus.agistaffers.com {
    reverse_proxy localhost:9090
}
CADDY
        # Reload Caddy
        docker exec caddy caddy reload --config /etc/caddy/Caddyfile
    fi
    
    # Apply basic memory limits
    echo "Applying memory limits to heavy containers..."
    
    # Limit chat container
    docker update --memory="512m" --memory-swap="512m" chat 2>/dev/null || true
    
    # Limit neo4j container  
    docker update --memory="512m" --memory-swap="512m" neo4j 2>/dev/null || true
    
    # Limit flowise container
    docker update --memory="512m" --memory-swap="512m" flowise 2>/dev/null || true
    
    # Check results
    echo "Current memory usage:"
    free -h | grep Mem
    
    echo "Container memory limits:"
    docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemLimit}}" | head -10
    
    echo "Backup cron jobs:"
    crontab -l | grep backup
    
    echo "BMAD Deployment Complete!"
REMOTE_COMMANDS

echo "Infrastructure updates deployed successfully!"