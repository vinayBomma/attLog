const cName = 'v3';

self.addEventListener('install', () => {
  console.log('service worker installed');
  self.skipWaiting()
});

// activate events
self.addEventListener('activate', e => {
  console.log('service worker activated');

  e.waitUntil(
    caches.keys().then(cNames => {
      return Promise.all(
        cNames.map(cache => {
          if (cache !== cName) {
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
      caches.open(cName)
        .then(cache => {
          if (e.request.method !== "POST") {
            cache.put(e.request, resClone)
          }
        }).catch((err) => {
          console.log(err)
        })
      // .then(() => self.skipWaiting()) 
      return res
    }).catch(() =>
      caches.match(e.request)
      .then(res => res)
    )
  )
})