const CACHE = "attie-math-v7";
const ESENCIALES = [
  "./",
  "./index.html",
  "./404.html",
  "./css/style.min.css",
  "./js/main.min.js",
  "./assets/favicon.svg",
  "./assets/icon-180.png",
  "./manifest.json",
  "./assets/fonts/grotesk-500.woff2",
  "./assets/fonts/grotesk-700.woff2",
  "./assets/fonts/plexmono-400.woff2",
  "./assets/fonts/plexmono-500.woff2",
  "./assets/fonts/plexmono-600.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ESENCIALES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copia));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match("./404.html"))
        )
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((hit) => {
      const red = fetch(request)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copia));
          return res;
        })
        .catch(() => hit);
      return hit || red;
    })
  );
});
