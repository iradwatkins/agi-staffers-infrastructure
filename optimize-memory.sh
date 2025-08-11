#!/bin/bash

# Memory Optimization Script for AGI Staffers VPS
# This script helps optimize memory usage on the server

echo "🧠 AGI Staffers Memory Optimization Tool"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to show memory status
show_memory_status() {
    echo "📊 Current Memory Status:"
    ssh agi-vps 'free -h'
    echo ""
}

# Function to clear page cache
clear_cache() {
    echo "🧹 Clearing page cache..."
    ssh agi-vps 'sync && echo 3 > /proc/sys/vm/drop_caches'
    echo -e "${GREEN}✅ Page cache cleared${NC}"
    echo ""
}

# Function to restart high-memory containers
restart_containers() {
    echo "🔄 Restarting high-memory containers..."
    
    containers=("open-webui" "neo4j" "ollama" "flowise")
    
    for container in "${containers[@]}"; do
        echo -n "Restarting $container... "
        ssh agi-vps "docker restart $container" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    done
    echo ""
}

# Function to check container memory usage
check_containers() {
    echo "📦 Container Memory Usage:"
    ssh agi-vps 'docker stats --no-stream --format "table {{.Container}}\t{{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -20'
    echo ""
}

# Function to add swap if needed
add_swap() {
    echo "💾 Checking swap status..."
    swap_status=$(ssh agi-vps 'swapon -s | wc -l')
    
    if [ "$swap_status" -eq 1 ]; then
        echo -e "${YELLOW}No swap configured. Would you like to add 4GB swap? (y/n)${NC}"
        read -r response
        
        if [ "$response" = "y" ]; then
            echo "Creating 4GB swap file..."
            ssh agi-vps << 'ENDSSH'
                fallocate -l 4G /swapfile
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                echo '/swapfile none swap sw 0 0' >> /etc/fstab
ENDSSH
            echo -e "${GREEN}✅ Swap added successfully${NC}"
        fi
    else
        echo -e "${GREEN}✅ Swap already configured${NC}"
    fi
    echo ""
}

# Main menu
while true; do
    echo "🔧 Memory Optimization Options:"
    echo "1) Show current memory status"
    echo "2) Clear page cache (safe, temporary)"
    echo "3) Restart high-memory containers"
    echo "4) Check container memory usage"
    echo "5) Add swap space (if needed)"
    echo "6) Apply all optimizations"
    echo "0) Exit"
    echo ""
    echo -n "Select option: "
    read -r option
    echo ""
    
    case $option in
        1)
            show_memory_status
            ;;
        2)
            clear_cache
            show_memory_status
            ;;
        3)
            restart_containers
            ;;
        4)
            check_containers
            ;;
        5)
            add_swap
            ;;
        6)
            echo "🚀 Applying all optimizations..."
            echo ""
            show_memory_status
            clear_cache
            restart_containers
            check_containers
            show_memory_status
            echo -e "${GREEN}✅ All optimizations complete!${NC}"
            ;;
        0)
            echo "👋 Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
    clear
done