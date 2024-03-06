const CACHE_NAME = 'ramazan-app-cache-v2';
const urlsToCache = [
  '/',
  '/src/pages/index.astro',
  '/src/styles/global.css',
];

self.addEventListener('install', async (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('Opened cache');
      await cache.addAll(urlsToCache);
    })()
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const response = await caches.match(event.request);
      if (response) {
        return response;
      }

      const fetchResponse = await fetch(event.request);
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }

      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
    })()
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
});
