/* Service worker Al-Qur'an Digital
   Strategi baru:
   - index.html, doa.json & navigasi  -> JARINGAN DULU (selalu ambil versi terbaru), cache hanya cadangan saat offline.
   - font & gambar                    -> cache dulu, diperbarui di latar belakang.
   Naikkan VERSI setiap ada perubahan agar cache lama dibuang dan pengguna langsung mendapat versi baru. */
var VERSI = 'qk-v58';
var INTI = ['./', 'index.html', 'doa.json', 'font/LPMQ-Isep-Misbah.ttf',
            'logo/foto-keluarga-kecil.jpg', 'logo/logo-nu.jpg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) {
    /* no-cache: lewati cache HTTP browser supaya yang tersimpan benar-benar versi terbaru */
    return Promise.all(INTI.map(function (u) {
      return fetch(new Request(u, { cache: 'no-cache' })).then(function (res) {
        if (res && res.ok) return c.put(u, res);
      }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

function jaringanDulu(r, c) {
  return fetch(r, { cache: 'no-cache' }).then(function (res) {
    if (res && res.ok) c.put(r, res.clone());
    return res;
  }).catch(function () {
    return c.match(r, { ignoreSearch: true }).then(function (hit) {
      return hit || c.match('index.html');
    });
  });
}

function cacheDulu(r, c) {
  return c.match(r, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(r).then(function (res) {
      if (res && res.ok) c.put(r, res.clone());
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  });
}

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  var p = new URL(r.url).pathname;
  var penting = r.mode === 'navigate' || /\.(html|json)$/i.test(p) || /\/$/.test(p);
  e.respondWith(caches.open(VERSI).then(function (c) {
    return penting ? jaringanDulu(r, c) : cacheDulu(r, c);
  }));
});
