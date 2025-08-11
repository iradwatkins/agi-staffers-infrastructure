#!/bin/bash

# PostgreSQL Automated Backup Script for AGI Staffers
# Backs up all PostgreSQL databases with rotation and compression

# Configuration
BACKUP_DIR="/backup/postgresql"
BACKUP_RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/postgres-backup.log"

# PostgreSQL connection details
# Using the main stepperslife-db container
CONTAINER_NAME="stepperslife-db"
PGUSER="postgres"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Start backup process
log "=== Starting PostgreSQL backup ==="

# Get list of databases (excluding templates)
DATABASES=$(docker exec "$CONTAINER_NAME" psql -U "$PGUSER" -t -c "SELECT datname FROM pg_database WHERE datistemplate = false AND datname != 'postgres';")

# Backup each database
for DB in $DATABASES; do
    DB_NAME=$(echo $DB | tr -d ' ')
    if [ ! -z "$DB_NAME" ]; then
        BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
        
        log "Backing up database: $DB_NAME"
        
        # Perform backup with compression
        if docker exec "$CONTAINER_NAME" pg_dump -U "$PGUSER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
            # Get file size
            SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
            log "✓ Successfully backed up $DB_NAME (Size: $SIZE)"
            
            # Set permissions
            chmod 600 "$BACKUP_FILE"
        else
            log "✗ Failed to backup $DB_NAME"
        fi
    fi
done

# Backup global objects (roles, tablespaces, etc.)
GLOBALS_FILE="$BACKUP_DIR/globals_${TIMESTAMP}.sql.gz"
log "Backing up global objects"
if docker exec "$CONTAINER_NAME" pg_dumpall -U "$PGUSER" --globals-only | gzip > "$GLOBALS_FILE"; then
    log "✓ Successfully backed up global objects"
else
    log "✗ Failed to backup global objects"
fi

# Clean up old backups
log "Cleaning up backups older than $BACKUP_RETENTION_DAYS days"
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "*.sql.gz" -type f | wc -l)
log "Current backup count: $BACKUP_COUNT files"

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | awk '{print $1}')
log "Total backup size: $TOTAL_SIZE"

# Send notification if push API is available
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/health | grep -q "200"; then
    curl -s -X POST "http://localhost:3011/api/broadcast" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"✅ Database Backup Complete\",
            \"body\": \"PostgreSQL backup completed successfully. Size: $TOTAL_SIZE\",
            \"data\": {
                \"type\": \"backup-complete\",
                \"databases\": \"$DATABASES\",
                \"size\": \"$TOTAL_SIZE\"
            }
        }" > /dev/null
fi

log "=== PostgreSQL backup completed ==="