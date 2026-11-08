/* Service worker Al-Qur'an Digital
   Strategi baru:
   - index.html, doa.json & navigasi  -> CACHE DULU (buka instan), lalu diam-diam diperbarui di latar belakang;
                                         versi baru tampil di pembukaan berikutnya. Kunjungan pertama / cache kosong -> jaringan.
   - font & gambar                    -> cache dulu, diperbarui di latar belakang.
   Naikkan VERSI setiap ada perubahan agar cache lama dibuang dan pengguna langsung mendapat versi baru. */
var VERSI = 'qk-v105';
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

function cacheDuluSegarkan(e, r, c) {
  return c.match(r, { ignoreSearch: true }).then(function (hit) {
    /* selalu minta versi terbaru ke jaringan (lewati cache HTTP) dan simpan untuk pembukaan berikutnya */
    var net = fetch(r, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) c.put(r, res.clone());
      return res;
    }).catch(function () { return null; });
    if (hit) {
      e.waitUntil(net);          /* pembaruan latar belakang tetap selesai walau halaman sudah tampil */
      return hit;                /* tampil langsung dari cache */
    }
    return net.then(function (res) {   /* belum ada cache (kunjungan pertama) atau cache terhapus */
      return res || c.match('index.html');
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
    return penting ? cacheDuluSegarkan(e, r, c) : cacheDulu(r, c);
  }));
});
