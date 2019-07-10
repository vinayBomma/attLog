const cacheName = 'v3';

self.addEventListener('install', e => {
  console.log('service worker installed');
  self.skipWaiting()
});

// activate event
self.addEventListener('activate', e => {
  console.log('service worker activated');

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('service worker fetched')

  e.respondWith(
    fetch(e.request)
    .then(res => {
      const resClone = res.clone()
      caches.open(cacheName)
        .then(cache => {
          cache.put(e.request, resClone)
        })
      // .then(() => self.skipWaiting()) 
      return res
    }).catch(err =>
      caches.match(e.request)
      .then(res => res)
    )
  )
})