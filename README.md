# FinTrack

Aplikasi catatan keuangan pribadi berbahasa Indonesia. Dibangun dengan Next.js App Router, **JavaScript/JSX**, React, Tailwind CSS, komponen bergaya shadcn/ui berbasis Radix, Lucide, dan Vaul. Tidak ada backend, login, atau layanan berbayar.

## Menjalankan

Prasyarat: Node.js 22.12+ (jalur 22 LTS), 24+, atau 26+ dan npm. Implementasi diperiksa pada Node 26.13.0/npm 11.20.0 di Windows.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. Tidak perlu file `.env`. Untuk produksi lokal:

```powershell
npm run build
npm start
```

Dev dan build menggunakan Webpack bawaan Next.js karena proses PostCSS Turbopack gagal pada lingkungan Windows pengembangan ini. Tidak ada pemeriksaan TypeScript; kontrak data divalidasi saat runtime.

## Fitur

- Dashboard: saldo sepanjang waktu, pemasukan/pengeluaran periode terpilih, 5 transaksi terbaru, dan budget bulanan.
- Transaksi: tambah, edit, hapus dengan konfirmasi, pencarian dan filter jenis/kategori/bulan yang digabungkan.
- Budget: batas per kategori dan bulan, pemakaian dari transaksi, sisa, serta indikator melampaui batas.
- Pengaturan: tema terang/gelap/sistem, ekspor dan impor JSON, reset dengan konfirmasi.
- Seluruh form dan konfirmasi memakai drawer Vaul/Radix: dari kanan di desktop dan dari bawah di mobile. Aplikasi dimulai dengan data kosong.
- Input/Label dan RadioGroup memakai primitives UI bersama. Di desktop, kategori/filter memakai Radix Select, tanggal memakai Radix Popover + React DayPicker, dan periode memakai popover bulan. Di mobile seluruh pilihan, termasuk bulan/tahun kalender, menggunakan bottom drawer bertingkat. Tidak ada dropdown, input tanggal, atau input bulan native yang terlihat.
- Palet forest green, sage, dan krem lembut memberi hierarki pada saldo dan ringkasan; tema gelap memakai hijau arang dan mint.

## Data dan backup

Data disimpan pada origin browser yang sama dengan key `fintrack:data:v1`; tema memakai `fintrack:theme`. Mengganti host, port, profil browser, atau perangkat tidak memindahkan data. Data situs yang dihapus dapat menghilangkan seluruh catatan. Penyimpanan ini bukan vault terenkripsi dan dapat dibuka oleh pengguna profil browser yang sama.

Ekspor backup melalui Pengaturan, lalu simpan file JSON sendiri. Impor maksimal 5 MB memvalidasi schema versi 1, kategori, nominal, tanggal, timestamp, ID, dan pasangan budget unik sebelum meminta konfirmasi penggantian data. File tidak valid atau kegagalan simpan tidak mengganti state yang sudah berhasil tersimpan. Jika data rusak, aplikasi menyediakan ekspor data mentah untuk pemulihan dan tidak menimpanya secara otomatis. Reset hanya menghapus data FinTrack, tanpa menyentuh data situs lain.

Nominal adalah rupiah bulat 1 sampai 999.999.999.999. Tanggal transaksi disimpan sebagai tanggal lokal `YYYY-MM-DD` dan tidak boleh melebihi hari ini. Saldo awal nol dan dapat menjadi negatif. Total nominal absolut dibatasi pada kapasitas integer aman JavaScript.

Perubahan tab lain dimuat lewat storage event; operasi CRUD membaca ulang data sebelum simpan. localStorage tidak menyediakan transaksi atomik antar-tab: hindari menyimpan dari dua tab tepat bersamaan. Sinkronisasi antarperangkat, integrasi bank, dan multi-user di luar MVP.

## Pemeriksaan

```powershell
npm run lint
npm test
npm run build
npm run test:e2e
```

Tes browser menggunakan Microsoft Edge terpasang (`channel: msedge`). Jika belum ada, pasang Edge atau ubah channel Playwright sesuai browser pengujian yang tersedia. Tes menyalakan server lokal sendiri bila port 3000 belum digunakan. Tes memakai konteks browser terisolasi dan tidak mengisi browser pengguna dengan data contoh.

Unit test mencakup saldo/periode, budget, filter gabungan, validasi, round-trip backup, penolakan impor, kegagalan kuota, dan reset terarah. Tes browser memeriksa alur CRUD, tema, backup, responsivitas, pemulihan data rusak, kegagalan simpan, serta aksesibilitas otomatis. Hasil aktual dicatat pada `IMPLEMENTATION_STATUS.md` dan `QA_REPORT.md`.

## Struktur

- `src/app`: empat route App Router, metadata, dan stylesheet.
- `src/components`: shell, provider bersama, form responsif, halaman interaktif, dan primitives UI.
- `src/lib`: kategori, format, validasi, perhitungan, dan repository penyimpanan.
- `tests`: unit dan pengujian browser.

Antislop-ai 3.2.27 terpasang sebagai skill proyek di `.codex/skills`, terpisah dari dependency runtime. Aturan dibaca langsung pada sesi implementasi. `DESIGN.md` mencatat arah dan alasan keputusan visual. Tidak perlu antislop untuk menjalankan aplikasi; ia dipakai saat pengembangan.

## Logo dan favicon

Logo monogram F/tracker mengikuti warna forest green, krem, dan mint. Logo tampil pada sidebar desktop serta header mobile. Sumber vektor berada pada `public/fintrack-mark.svg` dan `public/fintrack-logo.svg`; favicon SVG/PNG serta ikon Apple/192/512 juga tersedia. `src/app/favicon.ico` berisi ukuran 16/32/48 dan dilayani otomatis oleh Next.js.

## Deploy ke Vercel

Repo: https://github.com/dausmuhammad/fintrack.

Impor repo tersebut melalui Vercel dengan framework **Next.js**, root directory `.`, Node.js **24.x**, install command `npm ci`, dan build command `npm run build`. Biarkan output directory mengikuti deteksi Next.js. Tidak ada environment variable atau database yang perlu dibuat. Hubungkan GitHub agar push berikutnya ke `main` dapat dideploy otomatis.

Data localStorage di localhost tidak ikut pindah ke domain Vercel. Gunakan ekspor/impor backup untuk memindahkan catatan ke domain baru.
