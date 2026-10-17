// Create a cache when the service worker is installed.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("count-your-work-v2").then((cache) => {
            return cache.addAll([
                "./",
                "./index.html",
                "./style.css",
                "./script.js",
                "./logo1.png",
                "./manifest.json",
                "./icons/icon-192.png",
                "./icons/icon-512.png"
            ]);
        })
    );
});

// Serve cached files when the browser requests them.
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// Remove outdated caches when the new service worker activates.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) =>
                        cacheName.startsWith("count-your-work-") &&
                        cacheName !== "count-your-work-v2"
                    )
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

