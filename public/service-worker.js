const CACHE_NAME = 'ramazan-app-cache-v1';

const urlsToCache = [
  '/',
  '/dist/index.html',
  '/dist/_astro/hoisted.1XEFCPvF.js',
  '/dist/_astro/hoisted.1XEFCPvF.js',
  '/dist/index.HpaBiqn-.css',
  '/dist/favicons/favicon-16x16.png',
  '/dist/manifest_y3MdlcSw.mjs',
  '/dist/sitemap-0.xml',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});
