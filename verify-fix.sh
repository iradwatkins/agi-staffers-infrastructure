#!/bin/bash

echo "🔍 SteppersLife Production Verification Script"
echo "============================================="

SERVER_IP="148.230.93.174"

echo "Checking production server status..."

ssh root@${SERVER_IP} << 'EOF'
cd /root/stepperslife

echo "📊 Build Output Analysis:"
echo "========================="

echo "1. Checking for .tsx files in dist (should be none):"
find dist -name "*.tsx" -type f | wc -l

echo "2. Checking for .js files in dist (should be several):"
find dist -name "*.js" -type f | wc -l

echo "3. Sample of built files:"
ls -la dist/assets/ | head -5

echo "4. Checking HTML file references:"
if grep -q "\.tsx" dist/index.html; then
    echo "❌ HTML still contains .tsx references"
    grep "\.tsx" dist/index.html
else
    echo "✅ No .tsx references in HTML"
fi

echo "5. Checking if server is responding:"
curl -I http://localhost:5173 2>/dev/null || echo "Server might be down or on different port"

echo "6. Docker container status:"
docker ps | grep stepperslife || echo "No stepperslife container found"

echo "==========================="
echo "Verification complete!"
EOF