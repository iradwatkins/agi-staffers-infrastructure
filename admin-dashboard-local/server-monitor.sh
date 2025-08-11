#!/bin/bash

# AGI Staffers Server Monitoring Script
# This script collects system metrics and sends them to the dashboard

# Function to get CPU usage
get_cpu_usage() {
    # Get CPU usage percentage
    top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'
}

# Function to get memory usage
get_memory_usage() {
    # Get memory usage percentage
    free | grep Mem | awk '{print ($2-$7)/$2 * 100.0}'
}

# Function to get disk usage
get_disk_usage() {
    # Get disk usage percentage for root partition
    df -h / | awk 'NR==2 {print $5}' | sed 's/%//'
}

# Function to get network traffic (requires vnstat)
get_network_traffic() {
    # Get network interface (assuming eth0 or ens3)
    INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
    
    # Get current network speed (rough estimate)
    RX1=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
    TX1=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)
    sleep 1
    RX2=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
    TX2=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)
    
    # Calculate speed in MB/s
    RX_SPEED=$(echo "scale=2; ($RX2 - $RX1) / 1048576" | bc)
    TX_SPEED=$(echo "scale=2; ($TX2 - $TX1) / 1048576" | bc)
    
    echo "$RX_SPEED,$TX_SPEED"
}

# Function to get container status
get_container_status() {
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.ID}}" | tail -n +2 | while read name status id; do
        # Get container stats
        stats=$(docker stats --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}" $id)
        cpu=$(echo $stats | awk '{print $1}' | sed 's/%//')
        mem=$(echo $stats | awk '{print $2}' | awk -F'/' '{print $1}' | sed 's/MiB//' | sed 's/GiB/*1024/' | bc)
        
        echo "{\"name\":\"$name\",\"status\":\"running\",\"cpu\":$cpu,\"memory\":$mem}"
    done | paste -sd "," -
}

# Main monitoring loop
while true; do
    # Collect metrics
    CPU=$(get_cpu_usage)
    MEMORY=$(get_memory_usage)
    DISK=$(get_disk_usage)
    NETWORK=$(get_network_traffic)
    CONTAINERS=$(get_container_status)
    
    # Parse network data
    RX_SPEED=$(echo $NETWORK | cut -d',' -f1)
    TX_SPEED=$(echo $NETWORK | cut -d',' -f2)
    
    # Create JSON payload
    JSON="{
        \"cpu\": $CPU,
        \"memory\": $MEMORY,
        \"disk\": $DISK,
        \"network\": {
            \"in\": $RX_SPEED,
            \"out\": $TX_SPEED
        },
        \"containers\": [$CONTAINERS],
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
    }"
    
    # Send to monitoring endpoint (if available)
    # curl -X POST -H "Content-Type: application/json" -d "$JSON" http://localhost:3007/api/metrics
    
    # For now, just output to console
    echo "$JSON"
    
    # Wait 5 seconds before next update
    sleep 5
done