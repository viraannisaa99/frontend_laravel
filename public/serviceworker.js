var staticCacheName = "pwa-v" + new Date().getTime();// Ubah versi cache ketika ada perubahan
var filesToCache = [
    '.',
    // '/posts',
    '/offline',
    '/css/sb-admin-2.min.css',
    '/js/sb-admin-2.min.js',
    '/css/app.css',
    '/js/app.js',
    '/serviceworker.js',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',
];

// Cache on install
self.addEventListener("install", event => {
  this.skipWaiting();
  event.waitUntil(
      caches.open(staticCacheName)
          .then(cache => {
              return cache.addAll(filesToCache);
          })
  )
});

self.addEventListener('activate', event => {
event.waitUntil(
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== staticCacheName) {
          return caches.delete(cacheName);
        }
      })
    )
  })
)
})

// Serve from Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(staticCacheName).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          // Clone the network response to cache it
          const responseClone = networkResponse.clone();

          cache.put(event.request, responseClone);

          return networkResponse;
        }).catch(error => {
          console.error('Service Worker fetch failed:', error);
          return caches.match('offline'); // Jika gagal, tampilkan halaman offline
        });
      });
    })
  );
});