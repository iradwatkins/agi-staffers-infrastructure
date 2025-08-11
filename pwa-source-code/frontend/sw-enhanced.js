// AGI Staffers Enhanced Service Worker - Full Offline Support
const CACHE_NAME = 'agi-staffers-v2';
const STATIC_CACHE = 'agi-static-v2';
const DYNAMIC_CACHE = 'agi-dynamic-v2';

// Files to cache for offline use
const staticAssets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/push-notifications.js',
    '/monitoring.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Cache size limits
const MAX_DYNAMIC_CACHE_ITEMS = 50;

// Install event - cache all static assets
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing enhanced service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[ServiceWorker] Caching static assets');
                // Cache one by one to handle failures gracefully
                return Promise.all(
                    staticAssets.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
                        });
                    })
                );
            })
    );
    
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating enhanced service worker...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    return self.clients.claim();
});

// Helper function to limit cache size
function trimCache(cacheName, maxItems) {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(() => {
                    trimCache(cacheName, maxItems);
                });
            }
        });
    });
}

// Fetch strategies
const fetchStrategies = {
    // Cache First - for static assets
    cacheFirst: async (request) => {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        try {
            const response = await fetch(request);
            if (response.status === 200) {
                const cache = await caches.open(STATIC_CACHE);
                cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            return offlineFallback(request);
        }
    },
    
    // Network First - for API calls and dynamic content
    networkFirst: async (request) => {
        try {
            const response = await fetch(request);
            if (response.status === 200) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, response.clone());
                trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_ITEMS);
            }
            return response;
        } catch (error) {
            const cached = await caches.match(request);
            return cached || offlineFallback(request);
        }
    },
    
    // Stale While Revalidate - for frequently updated content
    staleWhileRevalidate: async (request) => {
        const cached = await caches.match(request);
        
        const fetchPromise = fetch(request).then(response => {
            if (response.status === 200) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, response.clone()));
            }
            return response;
        }).catch(() => cached);
        
        return cached || fetchPromise;
    }
};

// Offline fallback responses
function offlineFallback(request) {
    if (request.destination === 'image') {
        return new Response(
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    if (request.headers.get('accept').includes('text/html')) {
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - AGI Staffers</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                    }
                    .offline-container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 { color: #667eea; }
                    p { color: #666; }
                    button {
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <h1>📡 You're Offline</h1>
                    <p>AGI Staffers Dashboard is currently offline.</p>
                    <p>Check your internet connection and try again.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    return new Response('Offline', { status: 503 });
}

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // API requests - Network First
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetchStrategies.networkFirst(request));
        return;
    }
    
    // Static assets - Cache First
    if (request.destination === 'script' || 
        request.destination === 'style' || 
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(fetchStrategies.cacheFirst(request));
        return;
    }
    
    // HTML pages - Stale While Revalidate
    if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
        event.respondWith(fetchStrategies.staleWhileRevalidate(request));
        return;
    }
    
    // Default - Network First
    event.respondWith(fetchStrategies.networkFirst(request));
});

// Push event - handle push notifications
self.addEventListener('push', event => {
    console.log('[ServiceWorker] Push received');
    
    let title = 'AGI Staffers Alert';
    let body = 'You have a new notification';
    let icon = '/icon-192x192.png';
    let badge = '/icon-192x192.png';
    
    if (event.data) {
        try {
            const data = event.data.json();
            title = data.title || title;
            body = data.body || body;
            icon = data.icon || icon;
            badge = data.badge || badge;
        } catch (e) {
            body = event.data.text();
        }
    }
    
    const options = {
        body: body,
        icon: icon,
        badge: badge,
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open Dashboard',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('[ServiceWorker] Notification click received');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Background sync event
self.addEventListener('sync', event => {
    console.log('[ServiceWorker] Sync event:', event.tag);
    
    if (event.tag === 'sync-dashboard') {
        event.waitUntil(syncDashboard());
    }
});

// Sync dashboard data when back online
async function syncDashboard() {
    console.log('[ServiceWorker] Syncing dashboard data...');
    
    try {
        // Get any queued actions from IndexedDB
        // This is where you'd sync any offline changes
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: Date.now()
            })
        });
        
        if (response.ok) {
            console.log('[ServiceWorker] Dashboard synced successfully');
        }
    } catch (error) {
        console.error('[ServiceWorker] Sync failed:', error);
        throw error; // Retry later
    }
}

// Message event - communicate with the app
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});