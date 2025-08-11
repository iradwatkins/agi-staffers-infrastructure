// AGI Staffers Service Worker - Enhanced with Smart Caching
// Version 2.0 - Forces cache refresh and implements better caching strategy

const CACHE_VERSION = '2.3.0'; // Increment this to force cache refresh
const CACHE_NAME = `agi-staffers-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `agi-dynamic-v${CACHE_VERSION}`;

// Static assets to cache (not HTML - we want fresh HTML always)
const urlsToCache = [
  '/manifest.json',
  '/push-notifications.js',
  '/app-installer.js',
  '/fold-detection.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-180x180.png'
];

// Install event - cache important files
self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        
        // Cache each file individually to handle failures gracefully
        const cachePromises = urlsToCache.map(async function(url) {
          try {
            await cache.add(url);
            console.log('[ServiceWorker] Cached:', url);
          } catch (error) {
            console.warn('[ServiceWorker] Failed to cache:', url, error.message);
            // Continue with other files even if one fails
          }
        });
        
        // Wait for all cache operations to complete
        await Promise.all(cachePromises);
        console.log('[ServiceWorker] App shell caching completed');
      })
      .catch(function(error) {
        console.error('[ServiceWorker] Cache setup failed:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - implement smart caching strategy
self.addEventListener('fetch', function(event) {
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Network-first strategy for HTML pages (always get fresh content)
  if (event.request.mode === 'navigate' || event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Don't cache error pages
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(function() {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Network-first for API calls - BYPASS ALL CACHE
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request, { 
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(function(response) {
          return response;
        })
        .catch(function() {
          // Return a timeout response for API failures
          return new Response(JSON.stringify({ error: 'Network timeout' }), {
            status: 408,
            statusText: 'Request timeout',
            headers: new Headers({ 'Content-Type': 'application/json' })
          });
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets (images, fonts, etc)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Don't cache non-GET requests
          if (event.request.method !== 'GET') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(function(error) {
        console.error('[ServiceWorker] Fetch failed:', error.message);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', function(event) {
  console.log('[ServiceWorker] Push received');
  
  let title = 'AGI Staffers Alert';
  let body = 'You have a new notification';
  let icon = '/icon-192x192.png';
  let badge = '/icon-192x192.png';
  
  // If push event has data, use it
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
self.addEventListener('notificationclick', function(event) {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('https://admin.agistaffers.com')
  );
});

// Background sync for offline functionality
self.addEventListener('sync', function(event) {
  console.log('[ServiceWorker] Sync event:', event.tag);
  if (event.tag === 'sync-dashboard') {
    event.waitUntil(syncDashboard());
  }
});

async function syncDashboard() {
  // Implement dashboard sync logic here
  console.log('[ServiceWorker] Syncing dashboard data...');
}

// Message event - listen for cache clear requests
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});