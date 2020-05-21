var CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
    '/',
    '/fallback.json',
    '/js/main.js',
    '/css/style.css',
    '/img/mai-san.jpg'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {

    let request = event.request
    let url = new URL(request.url)

    // pisahkan request API dan internal
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then(function(response) {
                console.log('origin')
                return response || fetch(request)
            })
        )
    } else {
        event.respondWith(
            caches.open('products-cache').then(function(cache) {
                console.log("product-cache ok")
                return fetch(request).then(function(liveResponse) {
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function(error) {
                    return caches.match(request).then(function(response) {
                        if (response) return response
                        return caches.match('/fallback.json')
                    })
                })
            })
        )
    }
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName != CACHE_NAME
                }).map(function(cacheName) {
                    return caches.delete(cacheName)
                })
            );
        })
    );
});