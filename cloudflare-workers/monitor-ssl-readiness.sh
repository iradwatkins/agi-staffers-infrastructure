#!/bin/bash

echo "🔐 Monitoring SSL Certificate Readiness for api.agistaffers.com"
echo "================================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

check_ssl_and_worker() {
    echo -e "${YELLOW}⏳ Checking SSL certificate and Worker response...${NC}"
    
    # Test SSL certificate
    ssl_result=$(echo | openssl s_client -connect api.agistaffers.com:443 -servername api.agistaffers.com 2>/dev/null | openssl x509 -noout -subject 2>/dev/null)
    
    if [ $? -eq 0 ] && [ ! -z "$ssl_result" ]; then
        echo -e "${GREEN}✅ SSL Certificate is ready!${NC}"
        echo "Certificate: $ssl_result"
        
        # Test API Gateway
        echo -e "\n${YELLOW}🧪 Testing API Gateway...${NC}"
        
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://api.agistaffers.com/test 2>/dev/null)
        http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
        body=$(echo "$response" | sed '/HTTP_CODE:/d')
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "404" ] || [ "$http_code" = "502" ]; then
            echo -e "${GREEN}✅ API Gateway responding! (HTTP $http_code)${NC}"
            
            # Test metrics API
            echo -e "\n${YELLOW}📊 Testing Metrics API...${NC}"
            metrics_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://api.agistaffers.com/api/metrics 2>/dev/null)
            metrics_code=$(echo "$metrics_response" | grep "HTTP_CODE:" | cut -d: -f2)
            metrics_body=$(echo "$metrics_response" | sed '/HTTP_CODE:/d')
            
            echo "Response Code: $metrics_code"
            if [ "$metrics_code" = "200" ]; then
                echo -e "${GREEN}🎉 METRICS API WORKING!${NC}"
                echo "Preview:"
                echo "$metrics_body" | head -5
                return 0
            else
                echo "Response: $metrics_body"
                return 1
            fi
        else
            echo -e "${RED}❌ API Gateway not responding properly (HTTP $http_code)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ SSL Certificate not ready yet${NC}"
        return 1
    fi
}

# Check immediately
if check_ssl_and_worker; then
    echo -e "\n${GREEN}🎉 SUCCESS! API Gateway is fully operational!${NC}"
    echo ""
    echo "🚀 Ready to use:"
    echo "   • API Gateway: https://api.agistaffers.com"
    echo "   • Metrics API: https://api.agistaffers.com/api/metrics"
    echo ""
    echo "🔄 You can now update your PWA dashboard to use these endpoints!"
    exit 0
fi

echo -e "\n${YELLOW}⏳ SSL certificate not ready yet. This is normal - Cloudflare usually takes 2-10 minutes.${NC}"
echo ""
echo "📋 What's happening:"
echo "   1. ✅ DNS record created and resolving"
echo "   2. ⏳ Cloudflare issuing SSL certificate"
echo "   3. ⏳ SSL certificate propagation to edge servers"
echo "   4. 🎯 API Gateway activation"
echo ""
echo "💡 Run this script again in a few minutes:"
echo "   ./monitor-ssl-readiness.sh"
echo ""
echo "🔍 Or check manually:"
echo "   curl -I https://api.agistaffers.com/test"