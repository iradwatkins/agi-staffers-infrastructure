#!/bin/bash

# Docker Volumes Automated Backup Script for AGI Staffers
# Backs up all Docker volumes with compression and rotation

# Configuration
BACKUP_DIR="/backup/docker-volumes"
BACKUP_RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/docker-backup.log"
TEMP_DIR="/tmp/docker-backup-${TIMESTAMP}"

# Create directories
mkdir -p "$BACKUP_DIR" "$TEMP_DIR"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Start backup process
log "=== Starting Docker volumes backup ==="

# Get list of all volumes
VOLUMES=$(docker volume ls -q)
VOLUME_COUNT=$(echo "$VOLUMES" | wc -l)
log "Found $VOLUME_COUNT Docker volumes to backup"

# Backup each volume
for VOLUME in $VOLUMES; do
    if [ ! -z "$VOLUME" ]; then
        log "Backing up volume: $VOLUME"
        
        # Create backup filename
        BACKUP_FILE="$BACKUP_DIR/${VOLUME}_${TIMESTAMP}.tar.gz"
        
        # Run backup container to copy volume data
        docker run --rm \
            -v "$VOLUME":/source:ro \
            -v "$TEMP_DIR":/backup \
            alpine \
            tar -czf "/backup/${VOLUME}.tar.gz" -C /source .
        
        # Move to backup directory
        if [ -f "$TEMP_DIR/${VOLUME}.tar.gz" ]; then
            mv "$TEMP_DIR/${VOLUME}.tar.gz" "$BACKUP_FILE"
            
            # Get file size
            SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
            log "✓ Successfully backed up $VOLUME (Size: $SIZE)"
            
            # Set permissions
            chmod 600 "$BACKUP_FILE"
        else
            log "✗ Failed to backup $VOLUME"
        fi
    fi
done

# Backup container configurations
log "Backing up container configurations"
CONTAINERS_FILE="$BACKUP_DIR/containers_${TIMESTAMP}.json"
docker ps -a --format json > "$CONTAINERS_FILE"
gzip "$CONTAINERS_FILE"
log "✓ Container configurations saved"

# Backup docker-compose files
log "Backing up docker-compose files"
COMPOSE_BACKUP="$BACKUP_DIR/compose_files_${TIMESTAMP}.tar.gz"
find /root -name "docker-compose*.yml" -o -name "Dockerfile" | \
    tar -czf "$COMPOSE_BACKUP" -T -
log "✓ Docker compose files backed up"

# Clean up old backups
log "Cleaning up backups older than $BACKUP_RETENTION_DAYS days"
find "$BACKUP_DIR" -name "*.tar.gz" -o -name "*.json.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | awk '{print $1}')
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "*.gz" -type f | wc -l)
log "Backup complete: $BACKUP_COUNT files, Total size: $TOTAL_SIZE"

# Send notification
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/health | grep -q "200"; then
    curl -s -X POST "http://localhost:3011/api/broadcast" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"✅ Docker Backup Complete\",
            \"body\": \"Docker volumes backup completed. Size: $TOTAL_SIZE\",
            \"data\": {
                \"type\": \"backup-complete\",
                \"volumes\": $VOLUME_COUNT,
                \"size\": \"$TOTAL_SIZE\"
            }
        }" > /dev/null
fi

log "=== Docker volumes backup completed ==="