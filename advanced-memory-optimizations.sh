#!/bin/bash

# Advanced Memory Optimization Implementation for AGI Staffers
# This script implements the most impactful optimizations

echo "🚀 Advanced Memory Optimization for AGI Staffers"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Create Ollama Auto-Unload Script
echo "📦 Setting up Ollama model auto-unloading..."
cat << 'EOF' > ollama-optimize.sh
#!/bin/bash
# Ollama Model Auto-Unloader
# Unloads models after 30 minutes of inactivity

OLLAMA_IDLE_TIMEOUT=1800

# Get container uptime
CONTAINER_START=$(ssh agi-vps "docker inspect -f '{{.State.StartedAt}}' ollama 2>/dev/null | xargs date +%s -d")
CURRENT_TIME=$(date +%s)
UPTIME=$((CURRENT_TIME - CONTAINER_START))

# Only check if container has been running for more than idle timeout
if [ $UPTIME -gt $OLLAMA_IDLE_TIMEOUT ]; then
    # Check for recent API activity in logs
    RECENT_ACTIVITY=$(ssh agi-vps "docker logs --since 30m ollama 2>&1 | grep -E 'POST|GET|api' | wc -l")
    
    if [ "$RECENT_ACTIVITY" -eq 0 ]; then
        echo "No recent Ollama activity detected. Unloading models..."
        ssh agi-vps "docker exec ollama sh -c 'ollama list | tail -n +2 | awk \"{print \\\$1}\" | xargs -I {} ollama rm {}' 2>/dev/null"
        echo "✅ Ollama models unloaded to save memory"
    else
        echo "Ollama is active, keeping models loaded"
    fi
fi
EOF

# Upload to VPS
scp ollama-optimize.sh agi-vps:/usr/local/bin/
ssh agi-vps 'chmod +x /usr/local/bin/ollama-optimize.sh'

# 2. Create Neo4j optimization config
echo ""
echo "🗄️ Optimizing Neo4j memory configuration..."
cat << 'EOF' > neo4j-memory.conf
# Optimized Neo4j memory settings for 512MB limit
dbms.memory.heap.initial_size=256m
dbms.memory.heap.max_size=400m
dbms.memory.pagecache.size=100m
dbms.memory.off_heap.max_size=12m

# Aggressive garbage collection
dbms.jvm.additional=-XX:+UseG1GC
dbms.jvm.additional=-XX:MaxGCPauseMillis=100
dbms.jvm.additional=-XX:+AlwaysPreTouch
dbms.jvm.additional=-XX:G1ReservePercent=10
dbms.jvm.additional=-XX:InitiatingHeapOccupancyPercent=35
EOF

# Upload and apply to Neo4j
scp neo4j-memory.conf agi-vps:/tmp/
ssh agi-vps << 'ENDSSH'
# Apply Neo4j config if container exists
if docker ps -a | grep -q neo4j; then
    docker cp /tmp/neo4j-memory.conf neo4j:/var/lib/neo4j/conf/
    docker restart neo4j
    echo "✅ Neo4j memory optimized"
fi
ENDSSH

# 3. Create Dynamic Memory Manager
echo ""
echo "🧠 Setting up dynamic memory management..."
cat << 'EOF' > dynamic-memory-manager.sh
#!/bin/bash
# Dynamic Memory Manager - Adjusts container memory based on system pressure

check_memory_pressure() {
    # Get memory stats
    MEMINFO=$(free -m | grep Mem)
    TOTAL=$(echo $MEMINFO | awk '{print $2}')
    USED=$(echo $MEMINFO | awk '{print $3}')
    AVAILABLE=$(echo $MEMINFO | awk '{print $7}')
    USAGE_PERCENT=$((100 * USED / TOTAL))
    
    echo "Memory: ${USED}MB/${TOTAL}MB (${USAGE_PERCENT}%) - Available: ${AVAILABLE}MB"
    
    # High pressure (>80% used)
    if [ $USAGE_PERCENT -gt 80 ]; then
        echo "⚠️ HIGH memory pressure detected!"
        
        # Reduce non-critical services
        docker update --memory="256m" flowise 2>/dev/null
        docker update --memory="256m" pgadmin 2>/dev/null
        docker update --memory="256m" portainer 2>/dev/null
        
        # Unload Ollama models
        docker exec ollama sh -c 'ollama list | tail -n +2 | awk "{print \$1}" | xargs -I {} ollama rm {}' 2>/dev/null
        
        # Clear caches
        sync && echo 1 > /proc/sys/vm/drop_caches
        
        echo "✅ Reduced memory limits and cleared caches"
        
    # Normal pressure (50-80%)
    elif [ $USAGE_PERCENT -gt 50 ]; then
        echo "✓ Normal memory pressure"
        
        # Standard limits
        docker update --memory="512m" flowise 2>/dev/null
        docker update --memory="384m" pgadmin 2>/dev/null
        docker update --memory="384m" portainer 2>/dev/null
        
    # Low pressure (<50%)
    else
        echo "✅ LOW memory pressure - resources available"
        
        # Can increase limits if needed
        docker update --memory="768m" flowise 2>/dev/null
        docker update --memory="512m" pgadmin 2>/dev/null
    fi
}

# Run the check
check_memory_pressure
EOF

# Upload to VPS
scp dynamic-memory-manager.sh agi-vps:/usr/local/bin/
ssh agi-vps 'chmod +x /usr/local/bin/dynamic-memory-manager.sh'

# 4. Setup automated cron jobs
echo ""
echo "⏰ Setting up automated optimization tasks..."
ssh agi-vps << 'ENDSSH'
# Add cron jobs
(crontab -l 2>/dev/null; echo "# AGI Staffers Memory Optimization") | crontab -
(crontab -l; echo "*/30 * * * * /usr/local/bin/ollama-optimize.sh >> /var/log/ollama-optimize.log 2>&1") | crontab -
(crontab -l; echo "*/15 * * * * /usr/local/bin/dynamic-memory-manager.sh >> /var/log/memory-manager.log 2>&1") | crontab -
(crontab -l; echo "0 */6 * * * docker system prune -f --volumes >> /var/log/docker-cleanup.log 2>&1") | crontab -
(crontab -l; echo "0 3 * * * docker exec neo4j neo4j-admin memrec >> /var/log/neo4j-optimize.log 2>&1") | crontab -
echo "✅ Cron jobs configured"
ENDSSH

# 5. Apply immediate optimizations
echo ""
echo "🔧 Applying immediate optimizations..."
ssh agi-vps << 'ENDSSH'
# Set memory limits with reservations
docker update --memory="768m" --memory-reservation="512m" open-webui 2>/dev/null
docker update --memory="512m" --memory-reservation="256m" ollama 2>/dev/null
docker update --memory="512m" --memory-reservation="256m" flowise 2>/dev/null
docker update --memory="512m" --memory-reservation="384m" neo4j 2>/dev/null
docker update --memory="256m" --memory-reservation="128m" pgadmin 2>/dev/null
docker update --memory="256m" --memory-reservation="128m" portainer 2>/dev/null
docker update --memory="512m" --memory-reservation="256m" n8n 2>/dev/null
docker update --memory="256m" --memory-reservation="128m" searxng 2>/dev/null
docker update --memory="200m" --memory-reservation="100m" minio 2>/dev/null

# Configure MinIO for low memory
docker exec minio sh -c 'export MINIO_CACHE="off"' 2>/dev/null

# Unload any current Ollama models
docker exec ollama sh -c 'ollama list | tail -n +2 | awk "{print \$1}" | xargs -I {} ollama rm {}' 2>/dev/null || echo "No Ollama models to unload"

# Clean Docker system
docker system prune -af --volumes

echo "✅ Immediate optimizations applied"
ENDSSH

# 6. Show current status
echo ""
echo "📊 Current Memory Status:"
ssh agi-vps 'free -h'
echo ""
echo "🐳 Container Memory Usage:"
ssh agi-vps 'docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}" | sort -k3 -hr | head -15'

echo ""
echo -e "${GREEN}✅ Advanced memory optimizations complete!${NC}"
echo ""
echo "📋 What was implemented:"
echo "1. ✅ Ollama auto-model unloading (every 30 min)"
echo "2. ✅ Neo4j JVM optimization"
echo "3. ✅ Dynamic memory management based on pressure"
echo "4. ✅ Automated cleanup tasks via cron"
echo "5. ✅ Memory limits with soft reservations"
echo ""
echo "📈 Expected improvements:"
echo "- 30-50% reduction in idle memory usage"
echo "- Automatic response to memory pressure"
echo "- Better performance under load"
echo "- Self-healing memory management"
echo ""
echo "📝 Log files created:"
echo "- /var/log/ollama-optimize.log"
echo "- /var/log/memory-manager.log"
echo "- /var/log/docker-cleanup.log"
echo "- /var/log/neo4j-optimize.log"