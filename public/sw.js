self.addEventListener('install', (event) => {
    console.log('service worker installing service worker...', event);
});

self.addEventListener('activate', (event) => {
    console.log('[service worker] activate service worker....', event);
});

self.addEventListener('fetch', (event) => {
    console.log('[ service worker] fetching somehting ...', event);
    event.respondWith(fetch(event.request));
});