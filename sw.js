// Offline-Speicher für Wiesen-Tycoon (automatisch erzeugt von tool/make_pwa.sh).
// Beim Installieren werden die Kerndateien gespeichert, alles andere (Grafik-
// Engine, Töne, Schriften) beim ersten Laden. Danach startet das Spiel offline.
const CACHE = "wiesen-559feadf12a7";
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
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }),
  );
});
