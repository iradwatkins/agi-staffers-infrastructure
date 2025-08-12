#!/bin/bash
# Create snapshot of current system state
# Part of AGI Staffers Emergency Rollback System

SNAPSHOT_DIR="/root/rollback-system/snapshots"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT_NAME="snapshot_${TIMESTAMP}"

echo "🔄 Creating system snapshot: ${SNAPSHOT_NAME}"

# Create snapshot directory
mkdir -p "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}"

# 1. Save Docker container states
echo "📦 Saving Docker container states..."
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" > "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/docker-containers.txt"
docker inspect $(docker ps -q) > "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/docker-inspect.json"

# 2. Save configuration files
echo "⚙️ Backing up configurations..."
cp -r /etc/nginx/sites-enabled "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/nginx-config"
cp /etc/systemd/system/*.service "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/" 2>/dev/null || true

# 3. Create database snapshot
echo "🗄️ Creating database snapshot..."
docker exec postgres pg_dumpall -U postgres | gzip > "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/postgres-all.sql.gz"

# 4. Save environment variables
echo "🔐 Saving environment configurations..."
docker inspect $(docker ps -q) | jq '.[].Config.Env' > "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/docker-envs.json"

# 5. Create metadata file
cat > "${SNAPSHOT_DIR}/${SNAPSHOT_NAME}/metadata.json" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "date": "$(date)",
  "timezone": "$(timedatectl | grep "Time zone" | awk '{print $3}')",
  "containers": $(docker ps -q | wc -l),
  "disk_usage": "$(df -h / | tail -1 | awk '{print $5}')",
  "memory_usage": "$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
}
EOF

# 6. Clean old snapshots (keep last 10)
cd "${SNAPSHOT_DIR}"
ls -t | tail -n +11 | xargs -r rm -rf

echo "✅ Snapshot created: ${SNAPSHOT_NAME}"
echo "📍 Location: ${SNAPSHOT_DIR}/${SNAPSHOT_NAME}"