#!/bin/bash

# AGI Staffers VPS Memory Health Monitor
# This script provides real-time memory health metrics and recommendations

echo "========================================="
echo "AGI STAFFERS MEMORY HEALTH CHECK"
echo "========================================="
echo "Date: $(date)"
echo ""

# 1. Real Memory Usage (excluding cache)
echo "1. ACTUAL MEMORY USAGE (What Really Matters)"
echo "--------------------------------------------"
REAL_MEM=$(free | grep Mem | awk '{print ($3-$6)/$2 * 100}')
TOTAL_MEM=$(free -h | grep Mem | awk '{print $2}')
USED_REAL=$(free -h | grep Mem | awk '{print $3}')
CACHE=$(free -h | grep Mem | awk '{print $6}')
AVAILABLE=$(free -h | grep Mem | awk '{print $7}')

echo "Total Memory: $TOTAL_MEM"
echo "Real Usage: $USED_REAL (${REAL_MEM%.*}%)"
echo "Cache/Buffer: $CACHE (this is GOOD - speeds up file access)"
echo "Available: $AVAILABLE"
echo ""

# Color-coded status
if (( $(echo "$REAL_MEM < 50" | bc -l) )); then
    echo "✅ STATUS: EXCELLENT - Plenty of memory available"
elif (( $(echo "$REAL_MEM < 70" | bc -l) )); then
    echo "🟢 STATUS: GOOD - Memory usage is healthy"
elif (( $(echo "$REAL_MEM < 85" | bc -l) )); then
    echo "🟡 STATUS: MODERATE - Consider optimization"
else
    echo "🔴 STATUS: HIGH - Memory optimization recommended"
fi
echo ""

# 2. Top Memory Consumers
echo "2. TOP 5 MEMORY CONSUMERS"
echo "-------------------------"
ps aux --sort=-%mem | head -6 | tail -5 | awk '{printf "%-20s %6s %s\n", substr($11,0,20), $4"%", $6/1024"MB"}'
echo ""

# 3. Docker Container Health
echo "3. DOCKER CONTAINER MEMORY STATUS"
echo "---------------------------------"
docker stats --no-stream --format "table {{.Container}}\t{{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -15
echo ""

# 4. Swap Usage
echo "4. SWAP MEMORY STATUS"
echo "--------------------"
SWAP_TOTAL=$(free -h | grep Swap | awk '{print $2}')
SWAP_USED=$(free -h | grep Swap | awk '{print $3}')
SWAP_FREE=$(free -h | grep Swap | awk '{print $4}')

if [ "$SWAP_TOTAL" = "0B" ]; then
    echo "⚠️  No swap configured (Consider adding 2-4GB swap as safety buffer)"
else
    echo "Total Swap: $SWAP_TOTAL"
    echo "Used: $SWAP_USED"
    echo "Free: $SWAP_FREE"
fi
echo ""

# 5. Memory Pressure Indicators
echo "5. MEMORY PRESSURE INDICATORS"
echo "-----------------------------"
# Check for OOM killer activity
OOM_COUNT=$(dmesg | grep -c "Out of memory" 2>/dev/null || echo "0")
echo "Out of Memory events: $OOM_COUNT"

# Check page faults
VMSTAT=$(vmstat 1 2 | tail -1)
PAGE_IN=$(echo $VMSTAT | awk '{print $7}')
PAGE_OUT=$(echo $VMSTAT | awk '{print $8}')
echo "Page In/Out activity: $PAGE_IN/$PAGE_OUT (lower is better)"

# Load average
LOAD=$(uptime | awk -F'load average:' '{print $2}')
echo "Load Average:$LOAD"
echo ""

# 6. Quick Optimization Commands
echo "6. OPTIMIZATION RECOMMENDATIONS"
echo "-------------------------------"

if (( $(echo "$REAL_MEM > 70" | bc -l) )); then
    echo "Since memory usage is moderate/high, consider:"
    echo ""
    echo "a) Set Docker memory limits:"
    echo "   docker update --memory='1g' flowise"
    echo "   docker update --memory='512m' n8n"
    echo ""
    echo "b) Clear Docker cache:"
    echo "   docker system prune -a --volumes"
    echo ""
    echo "c) Restart low-priority services:"
    echo "   docker restart pgadmin portainer"
else
    echo "✅ Memory usage is healthy! Current optimizations:"
    echo ""
    echo "a) Linux is using $(free -h | grep Mem | awk '{print $6}') for cache - GOOD!"
    echo "   This speeds up file access significantly"
    echo ""
    echo "b) No immediate action needed"
    echo "   Continue monitoring with: docker stats"
fi
echo ""

# 7. Historical Trend (if log exists)
echo "7. MEMORY USAGE TREND"
echo "--------------------"
LOG_FILE="/var/log/memory-usage.log"
if [ -f "$LOG_FILE" ]; then
    echo "Last 5 measurements:"
    tail -5 "$LOG_FILE"
else
    echo "No historical data yet. To start tracking:"
    echo "Add to crontab: */30 * * * * free -m | grep Mem >> /var/log/memory-usage.log"
fi
echo ""

# Log current usage
echo "$(date '+%Y-%m-%d %H:%M') Real: ${REAL_MEM%.*}% Cache: $CACHE Available: $AVAILABLE" >> /tmp/memory-health.log

echo "========================================="
echo "Memory health check complete!"
echo "Log saved to: /tmp/memory-health.log"
echo "========================================="