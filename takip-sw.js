/* MAQUAS Takip — cevrimdisi calisma
   Uygulama dosyalarini onbellege alir, internet yokken de acilir.
   Surum numarasini degistirirsen tarayici yeni dosyalari ceker. */

var SURUM = "maquas-takip-v9";
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

/* telefona gelen bildirim (uygulama kapalıyken de) */
self.addEventListener("push", function (olay) {
  var y = {};
  try { y = olay.data ? olay.data.json() : {}; } catch (e) { y = { metin: olay.data ? olay.data.text() : "" }; }
  olay.waitUntil(self.registration.showNotification(y.baslik || "Maquas İş Takip Sistemi", {
    body: y.metin || "",
    icon: "/simge-192.png",
    badge: "/simge-192.png",
    tag: y.tag || undefined,
    data: { url: y.url || "/takip.html" }
  }));
});

/* bildirime dokununca uygulamayı aç (açıksa öne getir ve ilgili işi göster) */
self.addEventListener("notificationclick", function (olay) {
  olay.notification.close();
  var url = (olay.notification.data && olay.notification.data.url) || "/takip.html";
  olay.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (pencereler) {
      for (var i = 0; i < pencereler.length; i++) {
        var p = pencereler[i];
        if (p.url.indexOf("/takip.html") >= 0 && "focus" in p) {
          p.postMessage({ tip: "bildirim", url: url });
          return p.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
