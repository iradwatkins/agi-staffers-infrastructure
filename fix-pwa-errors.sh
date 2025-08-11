#!/bin/bash

echo "🔧 Fixing PWA Errors on AGI Staffers Admin Dashboard"
echo "=================================================="

# SSH into VPS and fix the issues
ssh root@148.230.93.174 << 'ENDSSH'

# Fix manifest.json syntax error
echo "📝 Fixing manifest.json..."
docker exec -it admin-dashboard sh -c 'cat > /usr/share/nginx/html/manifest.json << EOF
{
  "name": "AGI Staffers Admin Dashboard",
  "short_name": "AGI Staffers",
  "description": "Multi-website hosting platform management dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ]
}
EOF'

# Create a simple service worker
echo "⚙️ Creating service worker..."
docker exec -it admin-dashboard sh -c 'cat > /usr/share/nginx/html/sw.js << EOF
self.addEventListener("install", function(event) {
  console.log("Service Worker installed");
});

self.addEventListener("activate", function(event) {
  console.log("Service Worker activated");
});

self.addEventListener("fetch", function(event) {
  event.respondWith(fetch(event.request));
});
EOF'

# Add missing JavaScript functions to the existing HTML
echo "🔨 Adding missing JavaScript functions..."
docker exec -it admin-dashboard sh -c '
# First check if functions already exist
if ! grep -q "testPushNotification" /usr/share/nginx/html/index.html; then
  # Add the functions before the closing script tag
  sed -i "/<\/script>/i\
\        // PWA Functions\
\        function testPushNotification() {\
\            if (\"Notification\" in window) {\
\                if (Notification.permission === \"granted\") {\
\                    new Notification(\"AGI Staffers\", {\
\                        body: \"Test notification working!\",\
\                        icon: \"/favicon.ico\"\
\                    });\
\                } else if (Notification.permission !== \"denied\") {\
\                    Notification.requestPermission().then(permission => {\
\                        if (permission === \"granted\") {\
\                            new Notification(\"AGI Staffers\", {\
\                                body: \"Notifications enabled!\",\
\                                icon: \"/favicon.ico\"\
\                            });\
\                        }\
\                    });\
\                } else {\
\                    alert(\"Notifications are blocked. Enable them in browser settings.\");\
\                }\
\            } else {\
\                alert(\"This browser does not support notifications.\");\
\            }\
\        }\
\        \
\        // Service Worker Registration\
\        if (\"serviceWorker\" in navigator) {\
\            navigator.serviceWorker.register(\"/sw.js\").then(function(registration) {\
\                console.log(\"ServiceWorker registered successfully\");\
\            }).catch(function(err) {\
\                console.log(\"ServiceWorker registration failed: \", err);\
\            });\
\        }" /usr/share/nginx/html/index.html
fi
'

# Verify the fixes
echo "✅ Verifying fixes..."
docker exec -it admin-dashboard ls -la /usr/share/nginx/html/manifest.json
docker exec -it admin-dashboard ls -la /usr/share/nginx/html/sw.js
docker exec -it admin-dashboard grep -c "testPushNotification" /usr/share/nginx/html/index.html || echo "0"

echo "🎉 PWA fixes applied! Test at https://admin.agistaffers.com"

ENDSSH