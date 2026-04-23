const CACHE_NAME = 'qulanshop-v1';
const assets = [
  'index.html',
  'profile.html',
  'admin.html',
  'manifest.json'
];

// Орнату және файлдарды сақтау
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// Интернетсіз жұмыс істеу режимі
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});