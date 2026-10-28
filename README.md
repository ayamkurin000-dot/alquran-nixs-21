# Al-Qur'an Digital — Mushaf Standar Indonesia (Kemenag RI)
### nixs-21 — Repo Utama (Mannixs-21)

Al-Qur'an Digital berbasis Mushaf Standar Indonesia dari Kemenag RI. Dibuat untuk dibaca offline, ringan, dan bisa dibagikan dengan foto keluarga custom per pengguna.

**Live Demo Utama:** https://ayamkurin000-dot.github.io/alquran-nixs-21/

> Repo ini adalah **repo utama / sumber**. Semua repo anak disinkronkan otomatis dari sini.

---

### ✨ Fitur

- **Mushaf Standar Indonesia** - Font LPMQ Isep Misbah tertanam (offline 100%)
- **Offline Ready** - Bisa dibaca tanpa internet setelah dibuka pertama kali
- **Pencarian Cepat** - Cari surat, ayat, atau `2:255`
- **3 Mode Tampilan:** Surat, Juz, Penanda
- **Audio & Doa Harian** - Doa harian, wudhu, adzan, sholat sunnah
- **Foto Keluarga Custom** - Foto tengah (`logo/foto-keluarga-kecil.jpg`) bisa diganti per repo tanpa tertimpa saat update
- **Pratinjau WhatsApp** - `og:image` otomatis menyesuaikan repo (`logo/pratinjau.jpg`)
- **Mata Rantai Islam** - Terhubung ke https://ayamkurin000-dot.github.io/mata-rantai-islam/

### 📁 Struktur File Penting

```
/
├── index.html                         # File utama aplikasi
├── logo/
│   ├── foto-keluarga-kecil.jpg        # Foto kecil di header (yang tampil)
│   ├── foto-keluarga.png              # Foto resolusi asli (saat diklik)
│   ├── pratinjau.jpg                  # Gambar pratinjau saat share WA/Telegram
│   └── logo-nu.jpg                    # Logo NU
├── .github/workflows/sinkron.yml      # Workflow sinkron otomatis ke repo anak
└── README.md
```

### 🔄 Sistem Sinkron Otomatis (21 Repo Anak)

Repo utama ini adalah satu-satunya yang diedit. Setiap push ke branch `main`, GitHub Actions akan menyalin semua file ke repo-repo anak, **kecuali 3 file foto**.

**Daftar repo anak yang disinkron:**

- alquran-huda, alquran4all, alquran-01, alquran-valel, alquran-lia, alquran-nina
- alquran-rido, alquran-msol, alquran-wahydudi, alquran-yudi, alquran-nanik
- alquran-hanik, alquran-yayun, alquran-aziz, alquran-mila, alquran-mannixs
- alquran-supriyanto, alquran-mufid, alquran-nanang, alquran-purnomo, alquran-asrori

**File yang TIDAK ikut tertimpa (di-exclude):**
```
logo/foto-keluarga-kecil.jpg
logo/foto-keluarga.png
logo/pratinjau.jpg
```

**Khusus `alquran4all`:**
Repo ini punya fitur **Ganti Foto Sendiri**. Pengunjung bisa upload foto dari HP nya sendiri, foto disimpan di `localStorage` HP nya (bukan di file repo). Jadi 1 link bisa dipakai banyak orang dengan foto masing-masing. Foto custom ini tidak akan hilang saat ada update dari repo utama.

Lihat file workflow: `.github/workflows/sinkron.yml`

### 🚀 Cara Update

1. Edit hanya di repo `alquran-nixs-21` ini
2. Commit ke `main`
3. Workflow `Sinkron ke repo user` akan jalan otomatis di tab Actions
4. Tunggu 2-4 menit, semua repo anak akan ikut terupdate

Untuk menambah user baru, tambahkan nama reponya di `matrix.repo` pada file `sinkron.yml` dan pastikan token `SYNC_TOKEN` mencakup repo baru tersebut.

### 🔑 Setup Token (Sekali Saja)

1. Buat Fine-grained token di: `Settings > Developer settings > Personal access tokens`
2. Repository access: Pilih semua repo anak (atau `All repositories`)
3. Permission: `Contents = Read and write`
4. Simpan di repo utama: `Settings > Secrets and variables > Actions > New repository secret` dengan nama `SYNC_TOKEN`

### 📄 Lisensi & Kredit

- Teks Al-Qur'an: Mushaf Standar Indonesia Kemenag RI
- Font LPMQ: Lajnah Pentashihan Mushaf Al-Qur'an
- Desain & Pengembang: **Mannixs-21 ❤️**
- Logo: NU & NKRI

> Dibuat untuk kemudahan umat membaca Al-Qur'an digital dengan sentuhan keluarga.

---

**Mannixs-21 © 2026 — NU & NKRI**
