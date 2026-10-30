/* Service worker Al-Qur'an Digital
   Strategi: tampilkan dari cache dulu (cepat & offline), lalu perbarui cache di latar belakang.
   Update dari repo utama akan terlihat pada pembukaan berikutnya. Naikkan VERSI untuk membuang cache lama. */
var VERSI = 'qk-v1';
var INTI = ['./', 'index.html', 'doa.json', 'font/LPMQ-Isep-Misbah.ttf',
            'logo/foto-keluarga-kecil.jpg', 'logo/logo-nu.jpg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) {
    /* satu per satu: kalau ada satu berkas gagal, yang lain tetap tersimpan */
    return Promise.all(INTI.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSI).then(function (c) {
    return c.match(r, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(r).then(function (res) {
        if (res && res.ok) c.put(r, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
