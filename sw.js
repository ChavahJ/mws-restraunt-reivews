// Taken from https://developers.google.com/web/fundamentals/primers/service-workers/

var CACHE_NAME = 'mwsrr-cache-v1';
var urlsToCache = [
    '/',
    'index.html',
    'restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/1.jpg',
    '/img/1_small.jpg',
    '/img/2.jgp',
    '/img/2_small.jpg',
    '/img/3.jgp',
    '/img/3_small.jpg',
    '/img/4.jgp',
    '/img/4_small.jpg',
    '/img/5.jgp',
    '/img/5_small.jpg',
    '/img/6.jgp',
    '/img/6_small.jpg',
    '/img/7.jgp',
    '/img/7_small.jpg',
    '/img/8.jgp',
    '/img/8_small.jpg',
    '/img/9.jgp',
    '/img/9_small.jpg',
    '/img/10.jgp',
    '/img/10_small.jpg',

];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['mwsrr-cache-v1',];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});
