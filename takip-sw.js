/* MAQUAS Takip — cevrimdisi calisma
   Uygulama dosyalarini onbellege alir, internet yokken de acilir.
   Surum numarasini degistirirsen tarayici yeni dosyalari ceker. */

var SURUM = "maquas-takip-v7";
var KUTUPHANE = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.115.0/dist/umd/supabase.js";
var DOSYALAR = [
  "/takip.html",
  "/takip.webmanifest",
  "/simge-180.png",
  "/simge-192.png",
  "/simge-512.png",
  "/simge-maskable.png",
  KUTUPHANE
];

self.addEventListener("install", function (olay) {
  olay.waitUntil(
    caches.open(SURUM).then(function (onbellek) {
      return onbellek.addAll(DOSYALAR);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (olay) {
  olay.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.map(function (ad) {
        if (ad !== SURUM) return caches.delete(ad);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (olay) {
  var istek = olay.request;
  if (istek.method !== "GET") return;
  /* veritabanı isteklerine karışma; yalnız uygulama dosyaları ve kütüphane önbelleğe alınır */
  var adres = new URL(istek.url);
  var cdn = adres.hostname === "cdn.jsdelivr.net";
  if (adres.origin !== self.location.origin && !cdn) return;

  /* once agdan dene, basarisizsa onbellekten ver */
  olay.respondWith(
    fetch(istek).then(function (yanit) {
      if (yanit && yanit.status === 200 && (yanit.type === "basic" || cdn)) {
        var kopya = yanit.clone();
        caches.open(SURUM).then(function (o) { o.put(istek, kopya); });
      }
      return yanit;
    }).catch(function () {
      return caches.match(istek).then(function (bulunan) {
        return bulunan || caches.match("/takip.html");
      });
    })
  );
});
