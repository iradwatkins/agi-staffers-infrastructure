#!/bin/bash
# BMAD Method - Infrastructure 100% Completion Script
# Phase 1: Quick Infrastructure Fixes
# Generated: August 12, 2025

echo "========================================="
echo "   AGI STAFFERS - 100% INFRASTRUCTURE    "
echo "   Current: 92% → Target: 100%          "
echo "========================================="

# Configuration
VPS_IP="72.60.28.175"
VPS_USER="root"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create local commands directory
mkdir -p infrastructure-commands

# 1. BACKUP AUTOMATION SETUP
echo "Creating backup automation script..."
cat > infrastructure-commands/setup-backups.sh << 'BACKUP_SCRIPT'
#!/bin/bash
# Automated Backup Configuration

BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Create backup script
cat > /root/automated-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$DATE"

mkdir -p $BACKUP_PATH

echo "[$(date)] Starting backup..."

# PostgreSQL backup
docker exec stepperslife-db pg_dumpall -U postgres > $BACKUP_PATH/postgres.sql 2>/dev/null || echo "DB backup failed"

# Redis backup
docker exec redis redis-cli BGSAVE 2>/dev/null || echo "Redis backup failed"
sleep 5
docker cp redis:/data/dump.rdb $BACKUP_PATH/redis.rdb 2>/dev/null || true

# Configuration backup
cp /root/Caddyfile $BACKUP_PATH/ 2>/dev/null || true
cp -r /root/agi-staffers-infrastructure $BACKUP_PATH/ 2>/dev/null || true

# Compress
cd $BACKUP_DIR
tar czf backup_$DATE.tar.gz backup_$DATE/
rm -rf backup_$DATE/

# Cleanup old backups (7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "[$(date)] Backup completed: backup_$DATE.tar.gz"
EOF

chmod +x /root/automated-backup.sh

# Setup cron (3 AM Chicago = 9 AM UTC)
(crontab -l 2>/dev/null || true; echo "0 9 * * * /root/automated-backup.sh >> /var/log/backup.log 2>&1") | crontab -

# Create log file
touch /var/log/backup.log

# Test backup
echo "Testing backup script..."
/root/automated-backup.sh

echo "✅ Backup automation configured"
BACKUP_SCRIPT

# 2. MEMORY OPTIMIZATION
echo "Creating memory optimization script..."
cat > infrastructure-commands/optimize-memory.sh << 'MEMORY_SCRIPT'
#!/bin/bash
# Container Memory Optimization

echo "Applying memory limits to containers..."

# Apply limits to heavy containers
docker update --memory="512m" --memory-swap="512m" chat 2>/dev/null || echo "chat: limit failed"
docker update --memory="512m" --memory-swap="512m" neo4j 2>/dev/null || echo "neo4j: limit failed"
docker update --memory="512m" --memory-swap="512m" flowise 2>/dev/null || echo "flowise: limit failed"
docker update --memory="256m" --memory-swap="256m" n8n 2>/dev/null || echo "n8n: limit failed"
docker update --memory="256m" --memory-swap="256m" grafana 2>/dev/null || echo "grafana: limit failed"
docker update --memory="256m" --memory-swap="256m" prometheus 2>/dev/null || echo "prometheus: limit failed"

# Check memory usage
echo ""
echo "Current memory usage:"
free -h | grep Mem

echo ""
echo "Container memory status:"
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | head -15

echo "✅ Memory optimization applied"
MEMORY_SCRIPT

# 3. SERVICE FIXES
echo "Creating service fix commands..."
cat > infrastructure-commands/fix-services.sh << 'SERVICE_SCRIPT'
#!/bin/bash
# Fix Service Issues

echo "Fixing service issues..."

# Restart Portainer (timeout issue)
echo "Restarting Portainer..."
docker restart portainer 2>/dev/null || echo "Portainer restart failed"

# Check Prometheus in Caddyfile
if ! grep -q "prometheus.agistaffers.com" /root/Caddyfile; then
    echo "Adding Prometheus to Caddyfile..."
    cat >> /root/Caddyfile << 'CADDY'

# Prometheus Metrics
prometheus.agistaffers.com {
    reverse_proxy localhost:9090
}
CADDY
    # Reload Caddy
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile
fi

# Fix Neo4j SSL (if needed)
echo "Checking Neo4j configuration..."
docker logs neo4j --tail 20 2>/dev/null | grep -i error || echo "Neo4j appears healthy"

echo "✅ Service fixes applied"
SERVICE_SCRIPT

# 4. DEPLOYMENT SUMMARY
echo "Creating deployment summary..."
cat > infrastructure-commands/deploy-all.sh << 'DEPLOY_ALL'
#!/bin/bash
# Master deployment script

echo "======================================"
echo "  DEPLOYING ALL INFRASTRUCTURE FIXES "
echo "======================================"

# Run all scripts
bash setup-backups.sh
echo ""
bash optimize-memory.sh
echo ""
bash fix-services.sh

echo ""
echo "======================================"
echo "        DEPLOYMENT COMPLETE           "
echo "======================================"
echo ""
echo "Verification commands:"
echo "1. Check backups: ls -la /root/backups/"
echo "2. Check cron: crontab -l | grep backup"
echo "3. Check memory: free -h"
echo "4. Check services: docker ps --format 'table {{.Names}}\t{{.Status}}'"
DEPLOY_ALL

chmod +x infrastructure-commands/*.sh

echo ""
echo "========================================="
echo "     INFRASTRUCTURE SCRIPTS READY        "
echo "========================================="
echo ""
echo "📁 Scripts created in: infrastructure-commands/"
echo ""
echo "📋 MANUAL STEPS REQUIRED:"
echo ""
echo "1. DNS CONFIGURATION (5 minutes):"
echo "   Add A record: prometheus.agistaffers.com → 72.60.28.175"
echo "   Provider: Your DNS provider (Cloudflare/Namecheap/etc)"
echo ""
echo "2. SSH DEPLOYMENT (30 minutes):"
echo "   scp -r infrastructure-commands/ root@72.60.28.175:/root/"
echo "   ssh root@72.60.28.175 'cd /root/infrastructure-commands && bash deploy-all.sh'"
echo ""
echo "3. FLOWISE SETUP (5 minutes):"
echo "   Visit: https://flowise.agistaffers.com"
echo "   Create admin account with secure password"
echo ""
echo "4. VERIFICATION (10 minutes):"
echo "   Test: curl -I https://prometheus.agistaffers.com"
echo "   Test: curl https://admin.agistaffers.com/api/metrics | jq '.memory.percentage'"
echo "   Test: ssh root@72.60.28.175 'ls -la /root/backups/'"
echo ""
echo "Total time to 100%: ~50 minutes"