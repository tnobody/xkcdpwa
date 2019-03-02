const CURRENT_CACHES = {
  static: "static-cache-v2",
  dynamic: "dynamic-cache-v2"
};

const NON_CACHE_METHODS = ["POST", "PUT", "DELETE"];

const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

const isImageURL = url => /https:\/\/imgs.xkcd.com\/comics/g.test(url);
const isDataURL = url => /^https:\/\/xkcd.now.sh\/$/g.test(url);
const proxyUrl = url => PROXY_URL + url;

self.oninstall = event => {
  console.log("[Service Worker] Installing service worker...", event);
  event.waitUntil(
    caches.open(CURRENT_CACHES.static).then(cache => {
      cache
        .addAll([
          "./",
          "./index.html",
          "./img/icons/app-icon-48x48.png",
          "./img/icons/app-icon-96x96.png",
          "./img/icons/app-icon-144x144.png",
          "./img/icons/app-icon-192x192.png",
          "./img/icons/app-icon-256x256.png",
          "./img/icons/app-icon-384x384.png",
          "./img/icons/app-icon-512x512.png",
          "./img/icons/apple-icon-76x76.png",
          "./img/icons/apple-icon-114x114.png",
          "./img/icons/apple-icon-144x144.png",
          "./img/icons/apple-icon-152x152.png",
          "./img/icons/apple-icon-60x60.png",
          "./img/icons/apple-icon-57x57.png",
          "./img/icons/apple-icon-72x72.png",
          "./img/icons/apple-icon-180x180.png",
          "./img/icons/apple-icon-120x120.png",
          "./img/logo.png"
        ])
        .catch(error => console.log("Failed to initialize HTML cache:", error));
    })
  );
};

self.onactivate = event => {
  console.log("[Service Worker] Activating service worker...", event);

  const active_caches = Object.keys(CURRENT_CACHES).map(
    key => CURRENT_CACHES[key]
  );

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (active_caches.indexOf(cacheName) < 0) {
            console.log("Purging outdated cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
};

self.onfetch = event => {
  console.log(event);
  event.respondWith(
    caches.match(event.request).then(cachedResonse => {
      if (cachedResonse) {
        return cachedResonse;
      } else {
        const target = isImageURL(event.request.url)
          ? proxyUrl(event.request.url)
          : event.request.url;
        const fetchedResponse = fetch(target);
        return fetchedResponse.then(resp => {
          console.log(resp);
          if (
            NON_CACHE_METHODS.indexOf(event.request.method) < 0 &&
            !isDataURL(event.request.url)
          ) {
            const clonedResponse = resp.clone();
            caches.open(CURRENT_CACHES.dynamic).then(cache => {
              cache.put(event.request, clonedResponse);
            });
          }
          return resp;
        });
      }
    })
  );
};
