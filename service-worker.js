const CACHE_NAME = 'ramazan-app-cache-v1';
const STATIC_CACHE_NAME = 'ramazan-static-v1';
const DATA_CACHE_NAME = 'ramazan-data-v1';

const STATIC_ASSETS = [
  '/',
  '/src/styles/global.css',
  '/src/utils/dateTime.js',
  '/src/utils/themeManager.js',
  '/src/utils/prayerTimesManager.js',
  '/src/utils/shareManager.js',
  '/src/utils/verseManager.js',
  '/src/utils/cacheManager.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DATA_CACHE_NAME)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('ramazan-') && 
                   cacheName !== STATIC_CACHE_NAME && 
                   cacheName !== DATA_CACHE_NAME;
          })
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests (prayer times and verses)
  if (url.pathname.includes('/cities/') || url.pathname.includes('/ayet/')) {
    event.respondWith(handleDataRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

async function handleDataRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    const cache = await caches.open(DATA_CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function handleStaticRequest(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    // You might want to return a custom offline page here
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Handle periodic sync for background updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-prayer-times') {
    event.waitUntil(updatePrayerTimes());
  }
});

async function updatePrayerTimes() {
  const cache = await caches.open(DATA_CACHE_NAME);
  const cachedRequests = await cache.keys();
  
  return Promise.all(
    cachedRequests
      .filter(request => request.url.includes('/cities/'))
      .map(async request => {
        try {
          const response = await fetch(request);
          return cache.put(request, response);
        } catch (error) {
          console.error('Background update failed:', error);
        }
      })
  );
}
