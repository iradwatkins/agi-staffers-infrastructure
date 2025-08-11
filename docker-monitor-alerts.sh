#!/bin/bash

# Docker Monitor with Push Notification Alerts
# This script monitors Docker containers and sends push notifications for critical events

PUSH_API_URL="http://localhost:3011"
CHECK_INTERVAL=30  # Check every 30 seconds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90

# Track container states
declare -A CONTAINER_STATES

# Function to send notification
send_notification() {
    local title="$1"
    local body="$2"
    local type="${3:-alert}"
    
    curl -s -X POST "$PUSH_API_URL/api/broadcast" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"$title\",
            \"body\": \"$body\",
            \"data\": {
                \"type\": \"$type\",
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
            }
        }" > /dev/null
}

# Function to check container status
check_containers() {
    local current_containers=$(docker ps --format "{{.Names}}:{{.Status}}" 2>/dev/null)
    
    # Check each container
    while IFS=: read -r name status; do
        # Check if container was previously down
        if [[ "${CONTAINER_STATES[$name]}" == "down" ]] && [[ "$status" =~ "Up" ]]; then
            send_notification "✅ Container Recovered" "$name is back online" "recovery"
        fi
        CONTAINER_STATES[$name]="up"
    done <<< "$current_containers"
    
    # Check for down containers
    local all_containers=$(docker ps -a --format "{{.Names}}:{{.Status}}" 2>/dev/null)
    while IFS=: read -r name status; do
        if [[ ! "$status" =~ "Up" ]] && [[ "${CONTAINER_STATES[$name]}" != "down" ]]; then
            # Container is down and wasn't previously marked as down
            CONTAINER_STATES[$name]="down"
            send_notification "🚨 Container Down" "$name has stopped unexpectedly" "container-down"
            
            # Send to specific endpoint
            curl -s -X POST "$PUSH_API_URL/api/notify/container-down" \
                -H "Content-Type: application/json" \
                -d "{
                    \"containerName\": \"$name\",
                    \"containerId\": \"$(docker ps -aq -f name=$name)\"
                }" > /dev/null
        fi
    done <<< "$all_containers"
}

# Function to check system resources
check_system_resources() {
    # Check CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}' | cut -d. -f1)
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        curl -s -X POST "$PUSH_API_URL/api/notify/high-cpu" \
            -H "Content-Type: application/json" \
            -d "{
                \"usage\": $cpu_usage,
                \"threshold\": $CPU_THRESHOLD
            }" > /dev/null
    fi
    
    # Check memory usage
    local memory_info=$(free | grep Mem)
    local total_mem=$(echo $memory_info | awk '{print $2}')
    local used_mem=$(echo $memory_info | awk '{print $3}')
    local mem_percent=$((used_mem * 100 / total_mem))
    
    if [ "$mem_percent" -gt "$MEMORY_THRESHOLD" ]; then
        send_notification "⚠️ High Memory Usage" "Memory usage at ${mem_percent}% (threshold: ${MEMORY_THRESHOLD}%)" "memory-alert"
    fi
    
    # Check disk usage
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    local disk_available=$(df -h / | awk 'NR==2 {print $4}')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        curl -s -X POST "$PUSH_API_URL/api/notify/low-disk" \
            -H "Content-Type: application/json" \
            -d "{
                \"available\": \"$disk_available\",
                \"threshold\": 10
            }" > /dev/null
    fi
}

# Function to check for critical services
check_critical_services() {
    local critical_services=("admin-dashboard" "push-notification-api" "postgresql" "caddy")
    
    for service in "${critical_services[@]}"; do
        if ! docker ps | grep -q "$service"; then
            send_notification "🚨 Critical Service Down" "$service is not running!" "critical-alert"
        fi
    done
}

# Main monitoring loop
echo "🔍 Docker Monitor with Push Notifications Started"
echo "Monitoring interval: ${CHECK_INTERVAL}s"
echo "Push API: $PUSH_API_URL"
echo ""

# Send startup notification
send_notification "🚀 Monitor Started" "Docker monitoring with push notifications is active" "info"

while true; do
    echo "[$(date)] Checking containers and resources..."
    
    check_containers
    check_system_resources
    check_critical_services
    
    sleep $CHECK_INTERVAL
done