const staticCacheName = 'static-v4';
const dynamicCacheName = 'dynamic-v4';

const assets = [
  '/favicon.ico',
  '/android-chrome-192x192',
  '/webmanifest.json',
]

self.addEventListener('install', evt => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets)
    })
  )
});


// activate events
self.addEventListener('activate', evt => {
  console.log('service worker activated');

  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', evt => {

  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          })
        })
      }).catch(() => {
        console.log('err')
      })
    )
  }
})