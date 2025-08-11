#!/bin/bash

# VPS Memory Analysis Script
# This script performs comprehensive memory analysis on the AGI Staffers VPS

echo "========================================="
echo "AGI STAFFERS VPS MEMORY ANALYSIS"
echo "========================================="
echo "Date: $(date)"
echo ""

# 1. Overall System Memory
echo "1. SYSTEM MEMORY OVERVIEW"
echo "-------------------------"
free -h
echo ""
echo "Memory usage percentage:"
free | grep Mem | awk '{print "Used: " $3/$2 * 100.0 "%"}'
echo ""

# 2. Docker Container Memory Stats
echo "2. DOCKER CONTAINER MEMORY USAGE"
echo "---------------------------------"
echo "Real-time container stats (sorted by memory):"
docker stats --no-stream --format "table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -20
echo ""

# 3. Detailed Container Memory Limits
echo "3. CONTAINER MEMORY LIMITS & ACTUAL USAGE"
echo "-----------------------------------------"
for container in $(docker ps --format "{{.Names}}"); do
    echo "Container: $container"
    docker inspect $container | grep -E '"Memory":|"MemorySwap":|"MemoryReservation":' | sed 's/,$//'
    echo "Current usage:"
    docker stats --no-stream --format "Memory: {{.MemUsage}} ({{.MemPerc}})" $container
    echo "---"
done
echo ""

# 4. Top Memory Consuming Processes
echo "4. TOP MEMORY CONSUMING PROCESSES"
echo "---------------------------------"
ps aux --sort=-%mem | head -15
echo ""

# 5. Memory Maps for Large Processes
echo "5. MEMORY USAGE BY SERVICE TYPE"
echo "--------------------------------"
echo "PostgreSQL processes:"
ps aux | grep postgres | grep -v grep | awk '{sum+=$6} END {print "Total PostgreSQL memory: " sum/1024 " MB"}'
echo ""
echo "Node.js processes:"
ps aux | grep node | grep -v grep | awk '{sum+=$6} END {print "Total Node.js memory: " sum/1024 " MB"}'
echo ""
echo "Python processes:"
ps aux | grep python | grep -v grep | awk '{sum+=$6} END {print "Total Python memory: " sum/1024 " MB"}'
echo ""

# 6. Check for Large Log Files
echo "6. LARGE LOG FILES (>100MB)"
echo "---------------------------"
find /var/log -type f -size +100M -exec ls -lh {} \; 2>/dev/null
echo ""
echo "Docker container logs size:"
for container in $(docker ps --format "{{.Names}}"); do
    log_size=$(docker inspect $container | grep -A1 LogPath | grep LogPath | cut -d'"' -f4 | xargs ls -lh 2>/dev/null | awk '{print $5}')
    if [ ! -z "$log_size" ]; then
        echo "$container: $log_size"
    fi
done
echo ""

# 7. Shared Memory Usage
echo "7. SHARED MEMORY USAGE"
echo "----------------------"
df -h /dev/shm
ipcs -m | head -10
echo ""

# 8. Container Volume Sizes
echo "8. DOCKER VOLUMES SIZE"
echo "----------------------"
docker system df
echo ""
echo "Detailed volume usage:"
for volume in $(docker volume ls -q); do
    size=$(docker run --rm -v $volume:/data alpine du -sh /data 2>/dev/null | cut -f1)
    echo "$volume: $size"
done
echo ""

# 9. Check for Memory Leaks (containers running for long time)
echo "9. LONG-RUNNING CONTAINERS (potential memory leaks)"
echo "--------------------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.RunningFor}}" | grep -E "days|weeks|months"
echo ""

# 10. AI/ML Model Memory Usage
echo "10. AI/ML SERVICE MEMORY ANALYSIS"
echo "---------------------------------"
echo "Flowise AI memory:"
docker stats --no-stream --format "{{.Name}}: {{.MemUsage}} ({{.MemPerc}})" | grep -i flowise || echo "Flowise not found"
echo ""
echo "N8N workflow memory:"
docker stats --no-stream --format "{{.Name}}: {{.MemUsage}} ({{.MemPerc}})" | grep -i n8n || echo "N8N not found"
echo ""
echo "Chat service memory:"
docker stats --no-stream --format "{{.Name}}: {{.MemUsage}} ({{.MemPerc}})" | grep -i chat || echo "Chat service not found"
echo ""

# 11. Temporary Files
echo "11. TEMPORARY FILES CHECK"
echo "-------------------------"
echo "Size of /tmp:"
du -sh /tmp 2>/dev/null
echo "Size of /var/tmp:"
du -sh /var/tmp 2>/dev/null
echo ""

# 12. Memory Recommendations
echo "12. OPTIMIZATION RECOMMENDATIONS"
echo "--------------------------------"
echo "Based on the analysis above, consider:"
echo "1. Set memory limits for containers without limits"
echo "2. Clean up large log files regularly"
echo "3. Review long-running containers for memory leaks"
echo "4. Optimize AI/ML services if using excessive memory"
echo "5. Clear unnecessary docker volumes and images"
echo ""

# 13. Quick cleanup commands (not executed, just displayed)
echo "13. SUGGESTED CLEANUP COMMANDS"
echo "------------------------------"
echo "# Clean docker system (remove unused data):"
echo "docker system prune -a --volumes"
echo ""
echo "# Clear specific container logs:"
echo "truncate -s 0 /var/lib/docker/containers/*/*-json.log"
echo ""
echo "# Remove old log files:"
echo "find /var/log -name '*.log' -mtime +30 -delete"
echo ""

echo "========================================="
echo "ANALYSIS COMPLETE"
echo "========================================="