#!/bin/bash

echo "🚀 Quick Memory Optimization for AGI Staffers"
echo "==========================================="

# 1. Set immediate memory limits on high-usage containers
echo "Setting memory limits..."
ssh agi-vps << 'EOF'
# Limit AI services
docker update --memory="512m" --memory-swap="512m" ollama 2>/dev/null || echo "Ollama not found"
docker update --memory="768m" --memory-swap="768m" open-webui 2>/dev/null || echo "Open-WebUI not found"
docker update --memory="512m" --memory-swap="512m" flowise 2>/dev/null || echo "Flowise not found"

# Limit databases
docker update --memory="512m" --memory-swap="512m" neo4j 2>/dev/null || echo "Neo4j not found"

# Limit rarely used services
docker update --memory="256m" --memory-swap="256m" pgadmin 2>/dev/null || echo "PgAdmin not found"
docker update --memory="256m" --memory-swap="256m" portainer 2>/dev/null || echo "Portainer not found"

echo "✅ Memory limits applied"
EOF

# 2. Clean Docker system
echo ""
echo "Cleaning Docker resources..."
ssh agi-vps 'docker system prune -f --volumes'

# 3. Show new memory status
echo ""
echo "New Memory Status:"
ssh agi-vps 'free -h'
echo ""
ssh agi-vps 'docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}" | head -15'