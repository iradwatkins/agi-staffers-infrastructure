// AGI Staffers PWA Service Worker v2.4.0
const CACHE_NAME = 'agi-staffers-v2.4.0';
const DYNAMIC_CACHE_NAME = 'agi-dynamic-v2.4.0';

// Essential files to cache (only files we know exist)
const CORE_CACHE = [
  '/',
  '/admin',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_NAME.split('-v')[1]);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching core files');
        return cache.addAll(CORE_CACHE.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch(error => {
        console.warn('[ServiceWorker] Failed to cache some files:', error);
        // Don't fail the install if some files are missing
        return Promise.resolve();
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_NAME.split('-v')[1]);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request.clone())
          .then(response => {
            // Don't cache error responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache successful responses dynamically
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.warn('[ServiceWorker] Failed to cache:', event.request.url, error);
              });
            
            return response;
          })
          .catch(error => {
            console.warn('[ServiceWorker] Fetch failed:', event.request.url, error);
            
            // Fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/admin') || caches.match('/');
            }
            
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Service Worker registered successfully');