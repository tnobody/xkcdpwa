const current_caches = {
    static: 'static-cache-v1',
    dynamic: 'dynamic-cache-v1'
};

self.oninstall = (event) => {
    console.log('[Service Worker] Installing service worker...', event);
    event.waitUntil(
        caches.open(current_caches.static)
            .then(cache => {
                    cache.addAll(
                        [
                            './',
                            './index.html',
                            './img/icons/app-icon-48x48.png',
                            './img/icons/app-icon-96x96.png',
                            './img/icons/app-icon-144x144.png',
                            './img/icons/app-icon-192x192.png',
                            './img/icons/app-icon-256x256.png',
                            './img/icons/app-icon-384x384.png',
                            './img/icons/app-icon-512x512.png',
                            './img/icons/apple-icon-76x76.png',
                            './img/icons/apple-icon-114x114.png',
                            './img/icons/apple-icon-144x144.png',
                            './img/icons/apple-icon-152x152.png',
                            './img/icons/apple-icon-60x60.png',
                            './img/icons/apple-icon-57x57.png',
                            './img/icons/apple-icon-72x72.png',
                            './img/icons/apple-icon-180x180.png',
                            './img/icons/apple-icon-120x120.png',
                        ]
                    )
                        .catch(error => console.log('Failed to initialize HTML cache:', error));
                }
            )
    );
};

self.onactivate = (event) => {
    console.log('[Service Worker] Activating service worker...', event);

    const active_caches = Object.keys(current_caches).map(key => (current_caches[key]));

    event.waitUntil(caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (active_caches.indexOf(cacheName) < 0) {
                        console.log("Purging outdated cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    );

    return self.clients.claim();
};

self.onfetch = (event) => {
    console.log(event);
    event.respondWith(
        fetch(event.request)
            .then(resp => {
                return resp
            })
    );
    // event.respondWith(
    //     caches.match(event.request)
    //         .then(cachedResponse => {
    //             if (cachedResponse) {
    //                 return cachedResponse;
    //             } else {
    //                 return fetch(event.request)
    //                     .then(fetchedResponse => {
    //                         const clonedResponse = fetchedResponse.clone();
    //                         if (fetchedResponse.ok) {
    //                             return fetchedResponse;
    //                         } else {
    //                             if (isContentUrl(fetchedResponse.url)) {
    //                                 clonedResponse.json().then(json => {
    //                                     contentCache.cache(event.request.url, json);
    //                                 });
    //                                 return fetchedResponse;
    //                             } else if (!isAuthUrl(fetchedResponse.url)) {
    //                                 return caches.open(currentConfig.caches.dynamic)
    //                                     .then(cache => {
    //                                         if (event.request.method !== 'PUT' && event.request.method !== 'POST' && event.request.method !== 'DELETE') {
    //                                             cache.put(event.request, clonedResponse);
    //                                         }
    //                                         return fetchedResponse;
    //                                     })
    //                                     .catch(reason => console.log("An error occured while caching data:", reason));
    //                             } else {
    //                                 return fetchedResponse;
    //                             }
    //                         }
    //                     })
    //                     .catch(reason => {
    //                         if (isContentUrl(event.request.url)) {
    //                             const cachedContent = contentCache.match(event.request.url);
    //                             if (cachedContent) {
    //                                 const init = {
    //                                     "status": 200,
    //                                     "statusText": "Cached response",
    //                                     "Content-Type": "application/json"
    //                                 };
    //                                 return cachedContent.then(json => {
    //                                     return new Response(JSON.stringify(json), init);
    //                                 });
    //                             }
    //                             console.log("No cached data found")
    //                         }
    //                         console.log("An error occured while fetching data:", reason)
    //                     });
    //             }
    //         }));
};
