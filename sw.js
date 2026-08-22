/* Attie SW — offline primero, siempre fresco */
const CACHE = "attie-v32";
const ESENCIALES = [
  "./",
  "./index.html",
  "./blog/index.html",
  "./blog/bienvenida.html",
  "./blog/canciones-que-recuerdan.html",
  "./blog/mi-lado-gamer.html",
  "./secreto.html",
  "./lost.html",
  "./404.html",
  "./css/style.css",
  "./js/main.js",
  "./assets/avatar.png",
  "./assets/favicon.svg",
  "./manifest.json"
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
