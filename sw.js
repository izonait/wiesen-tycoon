// Offline-Speicher für Wiesen-Tycoon (automatisch erzeugt von tool/make_pwa.sh).
// Beim Installieren werden die Kerndateien gespeichert, alles andere (Grafik-
// Engine, Töne, Schriften) beim ersten Laden. Danach startet das Spiel offline.
const CACHE = "wiesen-e26a5267e6ce";
const CORE = ["./", "index.html", "flutter_bootstrap.js", "flutter.js", "main.dart.js", "manifest.json", "icons/apple-touch-icon.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
// Erst aus dem Netz laden, damit Updates sofort ankommen; nur ohne
// Internet aus dem Speicher.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })),
  );
});
