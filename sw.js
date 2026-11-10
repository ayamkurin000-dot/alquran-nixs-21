/* Service worker Al-Qur'an Digital
   Strategi baru:
   - index.html, doa.json & navigasi  -> CACHE DULU (buka instan), lalu diam-diam diperbarui di latar belakang;
                                         versi baru tampil di pembukaan berikutnya. Kunjungan pertama / cache kosong -> jaringan.
   - font & gambar                    -> cache dulu, diperbarui di latar belakang.
   Naikkan VERSI setiap ada perubahan agar cache lama dibuang dan pengguna langsung mendapat versi baru. */
var VERSI = 'qk-v165';
var INTI = ['./', 'index.html', 'doa.json', 'ensiklopedia.json', 'font/LPMQ-Isep-Misbah.ttf',
            'logo/foto-keluarga-kecil.jpg', 'logo/logo-nu.jpg', 'logo/bingkai-hijau.webp', 'logo/kertas.webp'];

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
      if (res && res.ok) {
        /* isi tidak berubah (ETag / Last-Modified sama) -> tidak perlu menulis ulang 3 MB ke cache setiap kali dibuka */
        var sama = false;
        if (hit) {
          var e1 = hit.headers.get('etag'), e2 = res.headers.get('etag'),
              m1 = hit.headers.get('last-modified'), m2 = res.headers.get('last-modified');
          sama = !!((e1 && e2 && e1 === e2) || (!e1 && !e2 && m1 && m2 && m1 === m2));
        }
        if (!sama) c.put(r, res.clone());
      }
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
  if (/\/audio\//i.test(p) || /\.(mp3|ogg|m4a|wav)$/i.test(p)) return;   /* adzan/takbir: langsung dari jaringan agar bisa di-seek & tidak memenuhi cache */
  var penting = r.mode === 'navigate' || /\.(html|json)$/i.test(p) || /\/$/.test(p);
  e.respondWith(caches.open(VERSI).then(function (c) {
    return penting ? cacheDuluSegarkan(e, r, c) : cacheDulu(r, c);
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ('focus' in cs[i]) return cs[i].focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  }));
});
