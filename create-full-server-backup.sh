#!/bin/bash

# AGI Staffers Full Server Backup Script
# Creates a complete backup of the entire server infrastructure
# This includes all containers, volumes, databases, and configurations

set -e  # Exit on error

echo "=============================================="
echo "🚀 AGI Staffers Full Server Backup"
echo "=============================================="
echo "This script creates a complete server backup"
echo "Estimated size: ~35-40GB compressed"
echo "=============================================="

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="agistaffers-full-backup-${BACKUP_DATE}"
TEMP_DIR="/tmp/${BACKUP_NAME}"
BACKUP_DIR="/backup/full-server"
FINAL_ARCHIVE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

# Create directories
echo "📁 Creating backup directories..."
mkdir -p "${TEMP_DIR}"
mkdir -p "${BACKUP_DIR}"

# Function to check disk space
check_disk_space() {
    AVAILABLE_SPACE=$(df -BG /tmp | awk 'NR==2 {print $4}' | sed 's/G//')
    echo "Available space in /tmp: ${AVAILABLE_SPACE}GB"
    if [ "$AVAILABLE_SPACE" -lt 50 ]; then
        echo "❌ ERROR: Not enough disk space. Need at least 50GB free in /tmp"
        exit 1
    fi
}

# Check disk space
check_disk_space

# 1. Export all Docker volumes
echo ""
echo "🐳 Backing up Docker volumes..."
mkdir -p "${TEMP_DIR}/docker-volumes"

# Get all volumes and back them up
docker volume ls -q | while read volume; do
    echo "  - Backing up volume: $volume"
    docker run --rm -v "${volume}:/source:ro" -v "${TEMP_DIR}/docker-volumes:/backup" \
        alpine tar czf "/backup/${volume}.tar.gz" -C /source .
done

# 2. Export all running containers (config + state)
echo ""
echo "📦 Exporting container configurations..."
mkdir -p "${TEMP_DIR}/containers"

docker ps -a --format "{{.Names}}" | while read container; do
    echo "  - Exporting container: $container"
    docker export "$container" | gzip > "${TEMP_DIR}/containers/${container}.tar.gz"
done

# 3. Backup PostgreSQL databases
echo ""
echo "🗄️ Backing up PostgreSQL databases..."
mkdir -p "${TEMP_DIR}/postgresql"

# Find all PostgreSQL containers and backup their databases
docker ps --format "{{.Names}}" | grep -E "(postgres|postgresql|db)" | while read db_container; do
    echo "  - Backing up database from: $db_container"
    
    # Try to dump the database
    docker exec "$db_container" pg_dumpall -U postgres 2>/dev/null | \
        gzip > "${TEMP_DIR}/postgresql/${db_container}-dump.sql.gz" || \
        echo "    ⚠️  Could not backup $db_container (might not be PostgreSQL)"
done

# 4. Backup all configuration files
echo ""
echo "⚙️ Backing up configuration files..."
mkdir -p "${TEMP_DIR}/configs"

# Docker Compose files
cp -r /root/docker-compose*.yml "${TEMP_DIR}/configs/" 2>/dev/null || true
cp -r /root/compose*.yml "${TEMP_DIR}/configs/" 2>/dev/null || true

# Caddy configuration
cp -r /etc/caddy/ "${TEMP_DIR}/configs/caddy/" 2>/dev/null || true

# System configurations
cp /etc/hosts "${TEMP_DIR}/configs/" 2>/dev/null || true
cp /etc/hostname "${TEMP_DIR}/configs/" 2>/dev/null || true
cp -r /root/.ssh/ "${TEMP_DIR}/configs/ssh/" 2>/dev/null || true

# Backup scripts
cp -r /root/*.sh "${TEMP_DIR}/configs/scripts/" 2>/dev/null || true
cp -r /backup/scripts/ "${TEMP_DIR}/configs/backup-scripts/" 2>/dev/null || true

# 5. Backup websites
echo ""
echo "🌐 Backing up websites..."
mkdir -p "${TEMP_DIR}/websites"

# Copy website files from their containers
docker cp stepperslife:/app "${TEMP_DIR}/websites/stepperslife" 2>/dev/null || true
docker cp admin-dashboard:/usr/share/nginx/html "${TEMP_DIR}/websites/admin-dashboard" 2>/dev/null || true

# 6. Create backup manifest
echo ""
echo "📝 Creating backup manifest..."
cat > "${TEMP_DIR}/backup-manifest.json" << EOF
{
    "backup_date": "${BACKUP_DATE}",
    "backup_name": "${BACKUP_NAME}",
    "server_info": {
        "hostname": "$(hostname)",
        "ip": "148.230.93.174",
        "os": "$(uname -a)",
        "docker_version": "$(docker --version)",
        "disk_usage": "$(df -h /)"
    },
    "containers": [
$(docker ps --format '        {"name": "{{.Names}}", "image": "{{.Image}}", "status": "{{.Status}}"}' | sed '$ ! s/$/,/')
    ],
    "volumes": [
$(docker volume ls --format '        "{{.Name}}"' | sed '$ ! s/$/,/')
    ],
    "backup_contents": {
        "docker_volumes": "All Docker volume data",
        "containers": "Container exports with full filesystem",
        "postgresql": "Database dumps from all PostgreSQL containers",
        "configs": "System and application configurations",
        "websites": "Website files and assets"
    }
}
EOF

# 7. Create the final compressed archive
echo ""
echo "📦 Creating final compressed archive..."
echo "This may take several minutes..."

cd /tmp
tar -czf "${FINAL_ARCHIVE}" "${BACKUP_NAME}/" \
    --checkpoint=1000 \
    --checkpoint-action=echo="  Progress: %u files processed"

# 8. Cleanup
echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf "${TEMP_DIR}"

# 9. Display results
echo ""
echo "=============================================="
echo "✅ Full server backup completed!"
echo "=============================================="
echo "Backup file: ${FINAL_ARCHIVE}"
echo "Size: $(du -h "${FINAL_ARCHIVE}" | cut -f1)"
echo ""
echo "This backup contains:"
echo "  - All Docker volumes (33GB+)"
echo "  - All container configurations"
echo "  - All PostgreSQL databases"
echo "  - All system configurations"
echo "  - All website files"
echo ""
echo "To restore this backup on a new server:"
echo "  1. Extract: tar -xzf ${BACKUP_NAME}.tar.gz"
echo "  2. Run the restore script (included in backup)"
echo "=============================================="

# Return the filename for the API
echo "${BACKUP_NAME}.tar.gz"