#!/bin/bash

# Master Backup Script for AGI Staffers Infrastructure
# Orchestrates all backup operations and remote storage

# Configuration
BACKUP_ROOT="/backup"
REMOTE_BACKUP_ENABLED=${REMOTE_BACKUP_ENABLED:-false}
REMOTE_BACKUP_DESTINATION=${REMOTE_BACKUP_DESTINATION:-""}
LOG_FILE="/var/log/master-backup.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    log "ERROR: Backup failed at line $1"
    
    # Send alert notification
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/health | grep -q "200"; then
        curl -s -X POST "http://localhost:3011/api/broadcast" \
            -H "Content-Type: application/json" \
            -d "{
                \"title\": \"🚨 Backup Failed\",
                \"body\": \"Master backup script encountered an error\",
                \"data\": {
                    \"type\": \"backup-error\",
                    \"timestamp\": \"$TIMESTAMP\"
                }
            }" > /dev/null
    fi
    
    exit 1
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Start master backup
log "=== Starting Master Backup Process ==="
START_TIME=$(date +%s)

# Create backup root directory
mkdir -p "$BACKUP_ROOT"

# 1. PostgreSQL Backup
log "Starting PostgreSQL backup..."
if [ -f "$SCRIPT_DIR/postgres-backup.sh" ]; then
    bash "$SCRIPT_DIR/postgres-backup.sh"
else
    log "WARNING: PostgreSQL backup script not found"
fi

# 2. Docker Volumes Backup
log "Starting Docker volumes backup..."
if [ -f "$SCRIPT_DIR/docker-backup.sh" ]; then
    bash "$SCRIPT_DIR/docker-backup.sh"
else
    log "WARNING: Docker backup script not found"
fi

# 3. Website Files Backup
log "Starting website files backup..."
WEBSITES_BACKUP_DIR="$BACKUP_ROOT/websites"
mkdir -p "$WEBSITES_BACKUP_DIR"

# Backup admin dashboard
if docker exec admin-dashboard test -d /usr/share/nginx/html; then
    ADMIN_BACKUP="$WEBSITES_BACKUP_DIR/admin-dashboard_${TIMESTAMP}.tar.gz"
    docker exec admin-dashboard tar -czf - -C /usr/share/nginx/html . > "$ADMIN_BACKUP"
    log "✓ Admin dashboard backed up"
fi

# Backup stepperslife
if docker exec stepperslife test -d /app; then
    STEPPERS_BACKUP="$WEBSITES_BACKUP_DIR/stepperslife_${TIMESTAMP}.tar.gz"
    docker exec stepperslife tar -czf - -C /app . > "$STEPPERS_BACKUP"
    log "✓ SteppersLife backed up"
fi

# 4. Configuration Files Backup
log "Backing up configuration files..."
CONFIG_BACKUP="$BACKUP_ROOT/configs_${TIMESTAMP}.tar.gz"
tar -czf "$CONFIG_BACKUP" \
    /etc/caddy/Caddyfile \
    /etc/systemd/system/docker-monitor-alerts.service \
    /root/.env* \
    /root/*.sh \
    2>/dev/null || true
log "✓ Configuration files backed up"

# 5. Create backup manifest
MANIFEST_FILE="$BACKUP_ROOT/backup-manifest_${TIMESTAMP}.json"
cat > "$MANIFEST_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "hostname": "$(hostname)",
  "backup_components": {
    "postgresql": true,
    "docker_volumes": true,
    "websites": true,
    "configurations": true
  },
  "backup_locations": {
    "postgresql": "$BACKUP_ROOT/postgresql",
    "docker_volumes": "$BACKUP_ROOT/docker-volumes",
    "websites": "$WEBSITES_BACKUP_DIR",
    "configs": "$CONFIG_BACKUP"
  }
}
EOF
log "✓ Backup manifest created"

# Calculate total backup size and time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
TOTAL_SIZE=$(du -sh "$BACKUP_ROOT" | awk '{print $1}')
TOTAL_FILES=$(find "$BACKUP_ROOT" -type f | wc -l)

log "Local backup completed in ${DURATION}s"
log "Total backup size: $TOTAL_SIZE"
log "Total files: $TOTAL_FILES"

# 6. Remote backup (if enabled)
if [ "$REMOTE_BACKUP_ENABLED" = "true" ] && [ ! -z "$REMOTE_BACKUP_DESTINATION" ]; then
    log "Starting remote backup sync..."
    
    # Create daily archive
    DAILY_ARCHIVE="$BACKUP_ROOT/daily-backup_${TIMESTAMP}.tar.gz"
    tar -czf "$DAILY_ARCHIVE" -C "$BACKUP_ROOT" \
        --exclude="daily-backup_*.tar.gz" \
        --exclude="remote-sync.lock" \
        .
    
    # Sync to remote (supports rsync, S3, etc.)
    case "$REMOTE_BACKUP_DESTINATION" in
        s3://*)
            # AWS S3 sync
            aws s3 cp "$DAILY_ARCHIVE" "$REMOTE_BACKUP_DESTINATION/" --storage-class GLACIER
            log "✓ Uploaded to S3"
            ;;
        rsync://*)
            # Rsync to remote server
            rsync -avz "$DAILY_ARCHIVE" "$REMOTE_BACKUP_DESTINATION/"
            log "✓ Synced via rsync"
            ;;
        *)
            # Generic rsync
            rsync -avz "$DAILY_ARCHIVE" "$REMOTE_BACKUP_DESTINATION/"
            log "✓ Synced to remote destination"
            ;;
    esac
    
    # Clean up daily archive
    rm -f "$DAILY_ARCHIVE"
fi

# 7. Backup verification
log "Verifying backup integrity..."
VERIFICATION_ERRORS=0

# Check PostgreSQL backups
if [ -d "$BACKUP_ROOT/postgresql" ]; then
    for backup in "$BACKUP_ROOT/postgresql"/*_${TIMESTAMP}.sql.gz; do
        if [ -f "$backup" ]; then
            if ! gzip -t "$backup" 2>/dev/null; then
                log "✗ Corrupt backup detected: $backup"
                ((VERIFICATION_ERRORS++))
            fi
        fi
    done
fi

if [ $VERIFICATION_ERRORS -eq 0 ]; then
    log "✓ All backups verified successfully"
else
    log "✗ Found $VERIFICATION_ERRORS verification errors"
fi

# 8. Send success notification
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/health | grep -q "200"; then
    curl -s -X POST "http://localhost:3011/api/broadcast" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"✅ Master Backup Complete\",
            \"body\": \"All backups completed successfully. Size: $TOTAL_SIZE, Duration: ${DURATION}s\",
            \"data\": {
                \"type\": \"backup-complete\",
                \"size\": \"$TOTAL_SIZE\",
                \"files\": $TOTAL_FILES,
                \"duration\": $DURATION,
                \"errors\": $VERIFICATION_ERRORS
            }
        }" > /dev/null
fi

log "=== Master Backup Process Completed ==="

# Exit with appropriate code
if [ $VERIFICATION_ERRORS -eq 0 ]; then
    exit 0
else
    exit 1
fi