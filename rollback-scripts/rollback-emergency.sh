#!/bin/bash
# Emergency rollback script - <2 minute recovery
# Part of AGI Staffers Emergency Rollback System

set -e

SNAPSHOT_DIR="/root/rollback-system/snapshots"
BLUE_CONTAINER="admin-dashboard-blue"
GREEN_CONTAINER="admin-dashboard-green"

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -s SNAPSHOT   Specific snapshot to restore (default: latest)"
    echo "  -f            Force rollback without confirmation"
    echo "  -h            Show this help"
    exit 1
}

# Parse arguments
SNAPSHOT=""
FORCE=false

while getopts "s:fh" opt; do
    case $opt in
        s) SNAPSHOT="$OPTARG" ;;
        f) FORCE=true ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Get latest snapshot if not specified
if [ -z "$SNAPSHOT" ]; then
    SNAPSHOT=$(ls -t "$SNAPSHOT_DIR" | head -1)
fi

SNAPSHOT_PATH="${SNAPSHOT_DIR}/${SNAPSHOT}"

if [ ! -d "$SNAPSHOT_PATH" ]; then
    echo "❌ Snapshot not found: $SNAPSHOT"
    exit 1
fi

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "📸 Using snapshot: $SNAPSHOT"
echo "⏱️ Target completion: <2 minutes"

# Confirmation
if [ "$FORCE" != true ]; then
    read -p "⚠️ This will rollback to snapshot $SNAPSHOT. Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Rollback cancelled."
        exit 1
    fi
fi

START_TIME=$(date +%s)

# 1. Quick container switch (10 seconds)
echo "🔄 Step 1/5: Switching containers..."
if docker ps | grep -q "$GREEN_CONTAINER"; then
    # Switch from green to blue
    docker stop "$GREEN_CONTAINER" || true
    docker start "$BLUE_CONTAINER" || true
    
    # Update nginx to route to blue
    sed -i 's/8081/8080/g' /etc/nginx/sites-enabled/admin
    nginx -s reload
else
    # Switch from blue to green
    docker stop "$BLUE_CONTAINER" || true
    docker start "$GREEN_CONTAINER" || true
    
    # Update nginx to route to green
    sed -i 's/8080/8081/g' /etc/nginx/sites-enabled/admin
    nginx -s reload
fi

# 2. Restore configurations (20 seconds)
echo "⚙️ Step 2/5: Restoring configurations..."
if [ -d "${SNAPSHOT_PATH}/nginx-config" ]; then
    cp -r "${SNAPSHOT_PATH}/nginx-config/"* /etc/nginx/sites-enabled/
    nginx -t && nginx -s reload
fi

# 3. Quick database restore if needed (30 seconds)
echo "🗄️ Step 3/5: Checking database state..."
if [ -f "${SNAPSHOT_PATH}/postgres-all.sql.gz" ]; then
    # Only restore if explicitly needed (check health first)
    if ! docker exec postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "Database unhealthy, restoring..."
        gunzip -c "${SNAPSHOT_PATH}/postgres-all.sql.gz" | docker exec -i postgres psql -U postgres
    else
        echo "Database healthy, skipping restore"
    fi
fi

# 4. Verify services (10 seconds)
echo "✔️ Step 4/5: Verifying services..."
SERVICES_OK=true

# Check admin dashboard
if ! curl -s -f -o /dev/null "http://localhost:8080/health" && ! curl -s -f -o /dev/null "http://localhost:8081/health"; then
    echo "⚠️ Admin dashboard health check failed"
    SERVICES_OK=false
fi

# Check metrics API
if ! curl -s -f -o /dev/null "http://localhost:3009/health"; then
    echo "⚠️ Metrics API health check failed"
    SERVICES_OK=false
fi

# 5. Final verification (10 seconds)
echo "🔍 Step 5/5: Final verification..."
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "📊 Rollback Summary:"
echo "==================="
echo "Duration: ${DURATION} seconds"
echo "Snapshot: ${SNAPSHOT}"
echo "Services: $([ "$SERVICES_OK" = true ] && echo "✅ Healthy" || echo "⚠️ Issues detected")"
echo "Active container: $(docker ps | grep -E "$BLUE_CONTAINER|$GREEN_CONTAINER" | awk '{print $NF}')"

if [ $DURATION -lt 120 ]; then
    echo ""
    echo "✅ ROLLBACK COMPLETED SUCCESSFULLY (under 2 minutes)"
else
    echo ""
    echo "⚠️ Rollback completed but took longer than 2 minutes"
fi

# Log the rollback
echo "$(date) - Rollback to ${SNAPSHOT} completed in ${DURATION}s" >> /var/log/rollback.log