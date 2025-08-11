#!/bin/bash

# Memory Optimization Recommendations Script
# Focuses on specific optimization opportunities

echo "========================================="
echo "MEMORY OPTIMIZATION ANALYSIS"
echo "========================================="
echo ""

# 1. Find containers without memory limits
echo "1. CONTAINERS WITHOUT MEMORY LIMITS (High Priority)"
echo "---------------------------------------------------"
for container in $(docker ps --format "{{.Names}}"); do
    mem_limit=$(docker inspect $container | grep '"Memory":' | grep -v '"Memory": 0,' | wc -l)
    if [ "$mem_limit" -eq 0 ]; then
        echo "⚠️  $container - NO MEMORY LIMIT SET"
        current_usage=$(docker stats --no-stream --format "{{.MemUsage}}" $container)
        echo "   Current usage: $current_usage"
        echo "   Suggested limit based on current usage + 50% buffer"
    fi
done
echo ""

# 2. Identify duplicate services
echo "2. POTENTIAL DUPLICATE SERVICES"
echo "-------------------------------"
echo "Checking for multiple instances of same service type..."
docker ps --format "{{.Names}}\t{{.Image}}" | sort -k2 | awk '{print $2}' | uniq -d
echo ""

# 3. AI/ML Services Memory Analysis
echo "3. AI/ML SERVICES MEMORY USAGE"
echo "------------------------------"
echo "These services typically use the most memory:"
for service in flowise n8n chat searxng; do
    container=$(docker ps --format "{{.Names}}" | grep -i $service | head -1)
    if [ ! -z "$container" ]; then
        stats=$(docker stats --no-stream --format "{{.Name}}: {{.MemUsage}} ({{.MemPerc}})" $container)
        echo "$stats"
        
        # Check if service has loaded models
        echo "  Checking for loaded models/large data..."
        docker exec $container sh -c 'du -sh /app 2>/dev/null || du -sh /usr/src/app 2>/dev/null || echo "Could not access app directory"' 2>/dev/null
    fi
done
echo ""

# 4. Database Memory Usage
echo "4. DATABASE MEMORY OPTIMIZATION"
echo "-------------------------------"
echo "PostgreSQL memory configuration:"
docker exec $(docker ps --format "{{.Names}}" | grep -i postgres | head -1) sh -c 'psql -U postgres -c "SHOW shared_buffers; SHOW effective_cache_size; SHOW work_mem;"' 2>/dev/null || echo "Could not connect to PostgreSQL"
echo ""

# 5. Unused Docker Resources
echo "5. UNUSED DOCKER RESOURCES"
echo "--------------------------"
echo "Space that can be reclaimed:"
docker system df
echo ""
echo "Unused images:"
docker images | grep -E "weeks ago|months ago" | wc -l
echo ""
echo "Dangling volumes:"
docker volume ls -f dangling=true | wc -l
echo ""

# 6. Service-Specific Recommendations
echo "6. SERVICE-SPECIFIC RECOMMENDATIONS"
echo "-----------------------------------"
cat << 'EOF'
Based on AGI Staffers service stack:

🔴 HIGH PRIORITY OPTIMIZATIONS:
1. Flowise AI - Typically uses 500MB-2GB
   - Add memory limit: 1GB
   - Clear model cache if not actively used
   
2. N8N Workflow - Can grow with workflows
   - Add memory limit: 512MB
   - Archive old workflow executions
   
3. PostgreSQL - Often over-provisioned
   - Tune shared_buffers to 25% of available RAM
   - Set effective_cache_size to 50% of RAM

🟡 MEDIUM PRIORITY:
4. Portainer - Minimal usage needed
   - Limit to 256MB
   
5. SearXNG - Search engine
   - Limit to 512MB
   - Disable unnecessary search engines

6. PgAdmin - Only used occasionally
   - Limit to 256MB
   - Consider stopping when not in use

🟢 LOW PRIORITY:
7. Admin Dashboard - Next.js app
   - Should use <200MB
   - Already optimized

8. SteppersLife Website
   - Static content, minimal memory
   - Already optimized

QUICK WIN COMMANDS:
# Set memory limits for top consumers
docker update --memory="1g" --memory-swap="1g" flowise
docker update --memory="512m" --memory-swap="512m" n8n
docker update --memory="256m" --memory-swap="256m" portainer
docker update --memory="256m" --memory-swap="256m" pgadmin

# Clean up Docker resources
docker system prune -a --volumes -f
docker image prune -a -f

# Restart services with new limits
docker-compose down && docker-compose up -d
EOF
echo ""

# 7. Monitoring Setup
echo "7. ONGOING MONITORING SETUP"
echo "---------------------------"
cat << 'EOF'
To prevent future memory issues:

1. Add to docker-compose.yml for each service:
   deploy:
     resources:
       limits:
         memory: 512M
       reservations:
         memory: 256M

2. Set up automated cleanup cron job:
   0 2 * * * docker system prune -f
   0 3 * * 0 docker image prune -a -f

3. Monitor with your PWA dashboard at:
   https://admin.agistaffers.com
EOF

echo ""
echo "========================================="
echo "Run 'docker stats' to see real-time usage"
echo "========================================="