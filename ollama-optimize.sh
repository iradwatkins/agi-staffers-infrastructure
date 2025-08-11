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
