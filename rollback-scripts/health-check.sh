#!/bin/bash
# Automated health check with rollback triggers
# Part of AGI Staffers Emergency Rollback System

# Configuration
ERROR_THRESHOLD=3
RESPONSE_TIME_THRESHOLD=3000  # milliseconds
CHECK_INTERVAL=30  # seconds
LOG_FILE="/var/log/health-check.log"

# Health endpoints to monitor
declare -A ENDPOINTS=(
    ["admin"]="https://admin.agistaffers.com/health"
    ["metrics"]="https://admin.agistaffers.com/api/metrics"
    ["main"]="https://agistaffers.com/health"
    ["postgres"]="http://localhost:5432"
)

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S CST')] $1" | tee -a "$LOG_FILE"
}

# Function to check endpoint health
check_endpoint() {
    local name=$1
    local url=$2
    local start_time=$(date +%s%N)
    
    # Special handling for PostgreSQL
    if [[ "$name" == "postgres" ]]; then
        if docker exec postgres pg_isready -U postgres > /dev/null 2>&1; then
            echo "0"  # Success
            return
        else
            echo "1"  # Failure
            return
        fi
    fi
    
    # HTTP endpoint check
    local response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url")
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    
    if [[ "$response" == "200" ]] && [[ $response_time -lt $RESPONSE_TIME_THRESHOLD ]]; then
        echo "0"  # Success
    else
        echo "1"  # Failure
        log "⚠️ Endpoint $name failed: HTTP $response, ${response_time}ms"
    fi
}

# Main monitoring loop
log "🏥 Health monitoring started (Chicago time)"
ERROR_COUNT=0

while true; do
    CURRENT_ERRORS=0
    
    # Check all endpoints
    for endpoint in "${!ENDPOINTS[@]}"; do
        result=$(check_endpoint "$endpoint" "${ENDPOINTS[$endpoint]}")
        CURRENT_ERRORS=$((CURRENT_ERRORS + result))
    done
    
    # Update rolling error count
    if [[ $CURRENT_ERRORS -gt 0 ]]; then
        ERROR_COUNT=$((ERROR_COUNT + CURRENT_ERRORS))
        log "⚠️ Current error count: $ERROR_COUNT (threshold: $ERROR_THRESHOLD)"
    else
        # Reset error count if all healthy
        if [[ $ERROR_COUNT -gt 0 ]]; then
            log "✅ All endpoints healthy, resetting error count"
        fi
        ERROR_COUNT=0
    fi
    
    # Trigger rollback if threshold exceeded
    if [[ $ERROR_COUNT -ge $ERROR_THRESHOLD ]]; then
        log "🚨 ERROR THRESHOLD EXCEEDED - TRIGGERING EMERGENCY ROLLBACK"
        log "Failed endpoints: $ERROR_COUNT errors detected"
        
        # Create snapshot before rollback
        /root/rollback-system/scripts/create-snapshot.sh
        
        # Execute rollback
        /root/rollback-system/scripts/rollback-emergency.sh -f
        
        # Send notification (via push API if available)
        curl -X POST https://admin.agistaffers.com/api/push/send \
            -H "Content-Type: application/json" \
            -d '{
                "title": "Emergency Rollback Triggered",
                "body": "System health check failed. Automatic rollback executed.",
                "urgency": "high"
            }' 2>/dev/null || true
        
        # Reset error count after rollback
        ERROR_COUNT=0
        
        # Wait longer before next check after rollback
        sleep 300  # 5 minutes
    fi
    
    # Regular interval check
    sleep $CHECK_INTERVAL
done