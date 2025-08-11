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
