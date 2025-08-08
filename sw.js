const CACHE_NAME = 'jadwal-v2';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'sw.js',
  'just-saying-593.mp3',
  'Logo.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap',
  'https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrFJA.ttf' 
];

// Install: simpan semua file di cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama jika versi berubah
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: ambil dari cache dulu, kalau tidak ada baru ambil online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
