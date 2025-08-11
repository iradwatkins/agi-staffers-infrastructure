#!/bin/bash

# Backup Restoration Script for AGI Staffers Infrastructure
# Restores PostgreSQL databases and Docker volumes from backups

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_ROOT="/backup"
LOG_FILE="/var/log/restore-backup.log"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Display usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
    -t TYPE       Backup type to restore (postgres|docker|website|all)
    -d DATE       Backup date (YYYYMMDD format)
    -l            List available backups
    -f FILE       Specific backup file to restore
    -y            Skip confirmation prompts
    -h            Display this help message

Examples:
    $0 -l                    # List all available backups
    $0 -t postgres -d 20250808   # Restore PostgreSQL from specific date
    $0 -t all -y             # Restore everything (latest) without prompts
    $0 -f /backup/postgresql/stepperslife_20250808_120000.sql.gz

EOF
    exit 1
}

# List available backups
list_backups() {
    echo -e "${GREEN}=== Available Backups ===${NC}"
    
    echo -e "\n${YELLOW}PostgreSQL Backups:${NC}"
    if [ -d "$BACKUP_ROOT/postgresql" ]; then
        ls -lh "$BACKUP_ROOT/postgresql"/*.sql.gz 2>/dev/null | tail -10 || echo "No PostgreSQL backups found"
    fi
    
    echo -e "\n${YELLOW}Docker Volume Backups:${NC}"
    if [ -d "$BACKUP_ROOT/docker-volumes" ]; then
        ls -lh "$BACKUP_ROOT/docker-volumes"/*.tar.gz 2>/dev/null | tail -10 || echo "No Docker backups found"
    fi
    
    echo -e "\n${YELLOW}Website Backups:${NC}"
    if [ -d "$BACKUP_ROOT/websites" ]; then
        ls -lh "$BACKUP_ROOT/websites"/*.tar.gz 2>/dev/null | tail -10 || echo "No website backups found"
    fi
}

# Confirm action
confirm() {
    if [ "$SKIP_CONFIRM" != "true" ]; then
        echo -e "${YELLOW}$1${NC}"
        read -p "Are you sure? (yes/no): " -n 3 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
            echo "Restoration cancelled."
            exit 1
        fi
    fi
}

# Restore PostgreSQL database
restore_postgres() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Error: Backup file not found: $backup_file${NC}"
        return 1
    fi
    
    # Extract database name from filename
    local db_name=$(basename "$backup_file" | cut -d'_' -f1)
    
    log "Restoring PostgreSQL database: $db_name from $backup_file"
    
    # Drop existing database and recreate
    confirm "This will DROP and recreate database '$db_name'. All current data will be lost!"
    
    # Stop dependent services
    log "Stopping dependent services..."
    docker stop stepperslife stepperslife-api 2>/dev/null || true
    
    # Drop and recreate database
    docker exec stepperslife-db psql -U postgres -c "DROP DATABASE IF EXISTS $db_name;"
    docker exec stepperslife-db psql -U postgres -c "CREATE DATABASE $db_name;"
    
    # Restore from backup
    if gunzip -c "$backup_file" | docker exec -i stepperslife-db psql -U postgres -d "$db_name"; then
        log "✓ Successfully restored database: $db_name"
        
        # Restart services
        docker start stepperslife stepperslife-api 2>/dev/null || true
        return 0
    else
        log "✗ Failed to restore database: $db_name"
        return 1
    fi
}

# Restore Docker volume
restore_docker_volume() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Error: Backup file not found: $backup_file${NC}"
        return 1
    fi
    
    # Extract volume name from filename
    local volume_name=$(basename "$backup_file" | cut -d'_' -f1)
    
    log "Restoring Docker volume: $volume_name from $backup_file"
    
    confirm "This will replace the contents of volume '$volume_name'!"
    
    # Create volume if it doesn't exist
    docker volume create "$volume_name" 2>/dev/null || true
    
    # Stop containers using this volume
    log "Stopping containers using volume..."
    for container in $(docker ps -a --filter volume="$volume_name" -q); do
        docker stop "$container" 2>/dev/null || true
    done
    
    # Restore volume data
    docker run --rm \
        -v "$volume_name":/target \
        -v "$(dirname "$backup_file")":/backup:ro \
        alpine \
        sh -c "rm -rf /target/* && tar -xzf /backup/$(basename "$backup_file") -C /target"
    
    if [ $? -eq 0 ]; then
        log "✓ Successfully restored volume: $volume_name"
        
        # Restart containers
        for container in $(docker ps -a --filter volume="$volume_name" -q); do
            docker start "$container" 2>/dev/null || true
        done
        return 0
    else
        log "✗ Failed to restore volume: $volume_name"
        return 1
    fi
}

# Restore website files
restore_website() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Error: Backup file not found: $backup_file${NC}"
        return 1
    fi
    
    # Extract container name from filename
    local container_name=$(basename "$backup_file" | cut -d'_' -f1)
    
    log "Restoring website files for: $container_name"
    
    confirm "This will replace all files in container '$container_name'!"
    
    # Determine target directory based on container
    case "$container_name" in
        admin-dashboard)
            docker exec "$container_name" sh -c "rm -rf /usr/share/nginx/html/* && tar -xzf - -C /usr/share/nginx/html" < "$backup_file"
            ;;
        stepperslife)
            docker exec "$container_name" sh -c "rm -rf /app/* && tar -xzf - -C /app" < "$backup_file"
            ;;
        *)
            echo -e "${RED}Unknown container: $container_name${NC}"
            return 1
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        log "✓ Successfully restored website: $container_name"
        docker restart "$container_name"
        return 0
    else
        log "✗ Failed to restore website: $container_name"
        return 1
    fi
}

# Find latest backup of specific type
find_latest_backup() {
    local backup_type="$1"
    local backup_date="$2"
    
    case "$backup_type" in
        postgres)
            if [ -n "$backup_date" ]; then
                find "$BACKUP_ROOT/postgresql" -name "*_${backup_date}*.sql.gz" -type f | sort -r | head -1
            else
                find "$BACKUP_ROOT/postgresql" -name "*.sql.gz" -type f | sort -r | head -1
            fi
            ;;
        docker)
            if [ -n "$backup_date" ]; then
                find "$BACKUP_ROOT/docker-volumes" -name "*_${backup_date}*.tar.gz" -type f | sort -r | head -1
            else
                find "$BACKUP_ROOT/docker-volumes" -name "*.tar.gz" -type f | sort -r | head -1
            fi
            ;;
        website)
            if [ -n "$backup_date" ]; then
                find "$BACKUP_ROOT/websites" -name "*_${backup_date}*.tar.gz" -type f | sort -r | head -1
            else
                find "$BACKUP_ROOT/websites" -name "*.tar.gz" -type f | sort -r | head -1
            fi
            ;;
    esac
}

# Main script
BACKUP_TYPE=""
BACKUP_DATE=""
BACKUP_FILE=""
SKIP_CONFIRM="false"

# Parse command line options
while getopts "t:d:f:lyh" opt; do
    case $opt in
        t) BACKUP_TYPE="$OPTARG" ;;
        d) BACKUP_DATE="$OPTARG" ;;
        f) BACKUP_FILE="$OPTARG" ;;
        l) list_backups; exit 0 ;;
        y) SKIP_CONFIRM="true" ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Validate options
if [ -z "$BACKUP_TYPE" ] && [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Either -t (type) or -f (file) must be specified${NC}"
    usage
fi

log "=== Starting Backup Restoration ==="

# Restore specific file
if [ -n "$BACKUP_FILE" ]; then
    if [[ "$BACKUP_FILE" =~ \.sql\.gz$ ]]; then
        restore_postgres "$BACKUP_FILE"
    elif [[ "$BACKUP_FILE" =~ docker-volumes.*\.tar\.gz$ ]]; then
        restore_docker_volume "$BACKUP_FILE"
    elif [[ "$BACKUP_FILE" =~ websites.*\.tar\.gz$ ]]; then
        restore_website "$BACKUP_FILE"
    else
        echo -e "${RED}Error: Unknown backup file type${NC}"
        exit 1
    fi
else
    # Restore by type
    case "$BACKUP_TYPE" in
        postgres)
            backup=$(find_latest_backup "postgres" "$BACKUP_DATE")
            if [ -n "$backup" ]; then
                restore_postgres "$backup"
            else
                echo -e "${RED}No PostgreSQL backup found${NC}"
            fi
            ;;
        docker)
            backup=$(find_latest_backup "docker" "$BACKUP_DATE")
            if [ -n "$backup" ]; then
                restore_docker_volume "$backup"
            else
                echo -e "${RED}No Docker backup found${NC}"
            fi
            ;;
        website)
            backup=$(find_latest_backup "website" "$BACKUP_DATE")
            if [ -n "$backup" ]; then
                restore_website "$backup"
            else
                echo -e "${RED}No website backup found${NC}"
            fi
            ;;
        all)
            confirm "This will restore ALL backups (PostgreSQL, Docker volumes, and websites)!"
            
            # Restore in order: postgres -> docker -> websites
            for type in postgres docker website; do
                backup=$(find_latest_backup "$type" "$BACKUP_DATE")
                if [ -n "$backup" ]; then
                    case "$type" in
                        postgres) restore_postgres "$backup" ;;
                        docker) restore_docker_volume "$backup" ;;
                        website) restore_website "$backup" ;;
                    esac
                fi
            done
            ;;
        *)
            echo -e "${RED}Error: Invalid backup type: $BACKUP_TYPE${NC}"
            usage
            ;;
    esac
fi

log "=== Restoration Process Completed ==="