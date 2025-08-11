#!/bin/bash
# Complete fix script for stepperslife.com issues

echo "🔧 Fixing Stepperslife Production Issues..."

# 1. Fix JSX file extensions and build
echo "📁 Renaming JSX files to proper extensions..."
cd /root/stepperslife

# Find and rename JSX files
find src -name "*.js" -exec grep -l "<" {} \; | while read file; do
    mv "$file" "${file%.js}.jsx"
    echo "Renamed: $file -> ${file%.js}.jsx"
done

# 2. Fix main.js imports
echo "🔄 Updating imports in main.js..."
sed -i 's/App\.js/App.jsx/g' src/main.js
sed -i 's/from "\.\/App"/from "\.\/App.jsx"/g' src/main.js

# 3. Fix all JSX imports
echo "🔗 Updating all JSX imports..."
find src -name "*.jsx" -exec sed -i 's/from "\.\/\([^"]*\)\.js"/from ".\/\1.jsx"/g' {} \;
find src -name "*.jsx" -exec sed -i "s/from '\.\/\([^']*\)\.js'/from '.\/\1.jsx'/g" {} \;

# 4. Fix database URLs - replace localhost with production domain
echo "🌐 Fixing API URLs..."
sed -i 's/localhost:3010/stepperslife.com\/api/g' src/lib/database.js
sed -i 's/http:\/\/stepperslife.com\/api/https:\/\/stepperslife.com\/api/g' src/lib/database.js

# 5. Update environment config
echo "⚙️ Updating environment configuration..."
cat > .env.production << 'EOF'
VITE_API_URL=https://stepperslife.com/api
VITE_STORAGE_URL=https://stepperslife.com/storage
NODE_ENV=production
EOF

# 6. Clean and rebuild
echo "🏗️ Building production app..."
rm -rf dist/
npm run build

# 7. Fix any remaining .tsx references in built files
echo "🔍 Fixing built file extensions..."
find dist -name "*.html" -exec sed -i 's/\.tsx/\.js/g' {} \;

# 8. Set correct MIME types
echo "📋 Creating .htaccess for proper MIME types..."
cat > dist/.htaccess << 'EOF'
AddType application/javascript .js
AddType text/css .css
AddType image/svg+xml .svg
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/gif .gif
AddType image/webp .webp
EOF

# 9. Test build
echo "✅ Testing build output..."
ls -la dist/
echo "Build complete!"
echo ""
echo "Next steps:"
echo "1. Upload dist/ contents to your web server"
echo "2. Configure nginx to proxy /api to port 3010"
echo "3. Test https://stepperslife.com"