// AGI Staffers Service Worker - Enhanced for Push Notifications
const CACHE_NAME = 'agi-staffers-v1';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/monitoring.js',
  '/push-notifications.js',
  '/app-installer.js'
];

// Install event - cache important files
self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('[ServiceWorker] Cache failed:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
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

// Fetch event - serve from cache when possible
self.addEventListener('fetch', function(event) {
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
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
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            })
            .catch(function(error) {
              console.error('[ServiceWorker] Cache put failed:', error);
            });
          
          return response;
        });
      })
      .catch(function(error) {
        console.error('[ServiceWorker] Fetch failed:', error);
        // Return offline page if available
        return caches.match('/index.html');
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