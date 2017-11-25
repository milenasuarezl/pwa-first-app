var CACHE_STATIC_NAME = 'static-v13';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', (event) => {
    console.log('service worker installing service worker...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then((cache) => {
            console.log('[Service workers] Precaching App shell ');
            cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                '/src/js/promise.js',
                '/src/js/fetch.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[service worker] activate service worker....', event);
    event.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('[Service Worker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

//Cache then Network & Dynamic Caching
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then((cache) => {
          return fetch(event.request)
            .then((res) => {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
});

/* self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
            .then((res) => {
                return caches.open(CACHE_DYNAMIC_NAME)
                .then((cache) => {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            })
            .catch((err) => {
                return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/offline.html');
                }); 
            })
          }
        })
    );
  }); 

//Network with cache cache fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
    fetch(event.request)
        .then((res) => {
            return caches.open(CACHE_DYNAMIC_NAME)
            .then((cache) => {
                cache.put(event.request.url, res.clone());
                return res;
            })
        })
        .catch((err) => {
            caches.match(event.request)
        })
    );
});

//cache only
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
    );
}); 

//Network only
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
    );
}); */