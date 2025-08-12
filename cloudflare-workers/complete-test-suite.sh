#!/bin/bash

echo "🧪 AGI Staffers API Gateway - Complete Test Suite"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_dns_resolution() {
    echo -e "\n${BLUE}📡 Testing DNS Resolution${NC}"
    echo "----------------------------------------"
    
    result=$(dig +short api.agistaffers.com @1.1.1.1)
    if [ ! -z "$result" ]; then
        echo -e "${GREEN}✅ DNS resolved: $result${NC}"
        return 0
    else
        echo -e "${RED}❌ DNS not resolved${NC}"
        echo -e "${YELLOW}⚠️  Please create DNS record:${NC}"
        echo "   Go to: https://dash.cloudflare.com"
        echo "   Zone: agistaffers.com"
        echo "   Add CNAME: api -> agistaffers.com (Proxied)"
        return 1
    fi
}

test_worker_endpoint() {
    echo -e "\n${BLUE}🔧 Testing Worker Endpoint${NC}"
    echo "----------------------------------------"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://api.agistaffers.com/test 2>/dev/null)
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Worker responding (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 0
    else
        echo -e "${RED}❌ Worker not responding (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

test_metrics_api() {
    echo -e "\n${BLUE}📊 Testing Metrics API Proxy${NC}"
    echo "----------------------------------------"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://api.agistaffers.com/api/metrics 2>/dev/null)
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Metrics API responding (HTTP $http_code)${NC}"
        echo "Metrics preview:"
        echo "$body" | python3 -m json.tool | head -10
        return 0
    else
        echo -e "${RED}❌ Metrics API not responding (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

test_cors_headers() {
    echo -e "\n${BLUE}🌍 Testing CORS Headers${NC}"
    echo "----------------------------------------"
    
    headers=$(curl -s -I https://api.agistaffers.com/api/metrics 2>/dev/null)
    
    if echo "$headers" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✅ CORS headers present${NC}"
        echo "$headers" | grep -i "access-control"
        return 0
    else
        echo -e "${RED}❌ CORS headers missing${NC}"
        return 1
    fi
}

test_origin_server() {
    echo -e "\n${BLUE}🎯 Testing Origin Server Directly${NC}"
    echo "----------------------------------------"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://origin.agistaffers.com/api/metrics 2>/dev/null)
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Origin server responding (HTTP $http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ Origin server not responding (HTTP $http_code)${NC}"
        return 1
    fi
}

run_performance_test() {
    echo -e "\n${BLUE}⚡ Performance Test${NC}"
    echo "----------------------------------------"
    
    echo "Testing API gateway performance..."
    curl -s -w "Time: %{time_total}s | Size: %{size_download} bytes | Speed: %{speed_download} bytes/s\n" \
         -o /dev/null https://api.agistaffers.com/api/metrics
}

# Main test execution
main() {
    echo "Starting comprehensive test suite..."
    
    # Test counters
    total_tests=0
    passed_tests=0
    
    # Run DNS test
    total_tests=$((total_tests + 1))
    if test_dns_resolution; then
        passed_tests=$((passed_tests + 1))
        DNS_OK=true
    else
        DNS_OK=false
    fi
    
    # Only run other tests if DNS is working
    if [ "$DNS_OK" = true ]; then
        # Test Worker
        total_tests=$((total_tests + 1))
        if test_worker_endpoint; then
            passed_tests=$((passed_tests + 1))
        fi
        
        # Test Origin Server
        total_tests=$((total_tests + 1))
        if test_origin_server; then
            passed_tests=$((passed_tests + 1))
        fi
        
        # Test Metrics API
        total_tests=$((total_tests + 1))
        if test_metrics_api; then
            passed_tests=$((passed_tests + 1))
        fi
        
        # Test CORS
        total_tests=$((total_tests + 1))
        if test_cors_headers; then
            passed_tests=$((passed_tests + 1))
        fi
        
        # Performance test (informational only)
        run_performance_test
    fi
    
    # Summary
    echo -e "\n${BLUE}📋 Test Summary${NC}"
    echo "======================================="
    echo -e "Tests passed: ${GREEN}$passed_tests${NC}/$total_tests"
    
    if [ "$passed_tests" = "$total_tests" ]; then
        echo -e "${GREEN}🎉 All tests passed! API Gateway is fully operational.${NC}"
        
        echo -e "\n${BLUE}🚀 Ready to use:${NC}"
        echo "  • API Gateway: https://api.agistaffers.com"
        echo "  • Metrics API: https://api.agistaffers.com/api/metrics"
        echo "  • Admin Dashboard: https://admin.agistaffers.com"
        
        return 0
    else
        echo -e "${RED}⚠️  Some tests failed. Check the output above.${NC}"
        return 1
    fi
}

# Run main function
main "$@"