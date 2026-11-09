# Pemeriksaan FinTrack

Tanggal: 9 November 2026. Lingkungan: Windows, Node 26.13.0, npm 11.20.0, Microsoft Edge melalui Playwright. Bahasa implementasi JavaScript/JSX.

Hasil review terbaru: lint, 20 unit test, 5 tes end-to-end (sekitar 1,8 menit), dan build produksi lulus. Tes mencakup drawer, dropdown, kalender, periode, serta pilihan tahun bertingkat. Setiap tes browser memeriksa console error, dan alur UI juga memeriksa pageerror; tidak ada error pada run terakhir. Pemeriksaan axe pada kedua tema dan panel pilihan tidak melaporkan pelanggaran pada cakupan WCAG A/AA yang dipindai. Dependency tambahan dipasang dengan lockfile dan audit melaporkan 0 kerentanan.

Review menemukan dropdown/date/month native, Dialog desktop, dominasi putih, dan fokus latar dropdown desktop yang belum konsisten dengan kebutuhan terbaru. Semuanya telah diperbaiki: semua form/konfirmasi menggunakan Drawer; pilihan mobile menggunakan bottom/nested Drawer; desktop menggunakan Radix Select/Popover; kalender memakai React DayPicker dengan pilihan bulan/tahun responsif. Palet kini forest green/sage/krem dan hijau arang/mint untuk tema gelap. Elemen latar yang disembunyikan oleh modal dibuat inert, dan notifikasi diletakkan di bawah lapisan drawer agar tidak menutupi opsi.

## Bukti alur browser

`npm start` dari hasil build produksi berhasil dijalankan; pemeriksaan HTTP untuk `/`, `/transaksi`, `/budget`, dan `/pengaturan` masing-masing menghasilkan status 200. Server pemeriksaan dihentikan setelah verifikasi.

- Dashboard kosong → petunjuk tambah transaksi, tanpa data palsu.
- Tambah kosong → error nominal/kategori dekat input, dialog tetap terbuka; Escape menutupnya.
- Tambah Gaji Rp5.000.000 dan Makan Rp50.000 → saldo Rp4.950.000; reload mempertahankan data.
- Tambah budget Makan Rp100.000 → 50% terpakai; edit pengeluaran Rp150.000 → 150%, batas progress 100%, status terlampaui.
- Edit budget Rp200.000 → 75%; batal hapus mempertahankan budget; konfirmasi hapus menghapus budget tanpa menghapus transaksi.
- Filter pencarian + jenis + kategori → satu transaksi yang sesuai; bersihkan filter → daftar kembali lengkap.
- Edit/hapus transaksi → ringkasan berubah sesuai catatan yang tersimpan.
- Tema terang/gelap/sistem → pilihan bekerja; kedua tema diperiksa di empat route.
- Ekspor → file JSON terunduh; JSON rusak ditolak; reset dibatalkan tanpa perubahan; reset dikonfirmasi mengosongkan data; impor backup mengembalikan 2 transaksi dan 1 budget.
- Data storage rusak → peringatan pemulihan, data mentah dipertahankan; reset memulihkan penggunaan.
- Kegagalan setItem → pesan belum tersimpan, nominal form tetap terisi, dialog tidak ditutup.
- Tab/Shift+Tab dalam dialog/drawer → fokus dibatasi di dialog; Escape → menutup dan mengembalikan fokus ke tombol tambah.
- Navigasi desktop/mobile → route yang nyata; judul tidak tersembunyi di balik header setelah berpindah halaman.
- Empat route pada 360, 390, 768, dan 1440 px dalam kedua tema → tidak ada overflow horizontal dokumen. Nominal maksimum dan catatan panjang turut diuji.

## Antislop Delivery Gate

Aturan versi 3.2.27 dibaca langsung dari instalasi proyek. Arah visual dan alasan teknik tercatat pada DESIGN.md. Penilaian berikut berlaku pada MVP dan skenario yang diperiksa, bukan sertifikasi aksesibilitas atau performa lapangan.

### Hard Gate

- R-02 PASS: salinan UI tidak memakai em dash; tanda minus nominal adalah simbol matematis.
- R-03 PASS: pengujian browser pada empat lebar dan kedua tema tidak menemukan overflow; catatan panjang dibungkus, FAB memiliki ruang bawah.
- R-17 PASS: semua total berasal dari data pengguna, tanpa persentase pertumbuhan buatan.
- R-18 PASS: tidak ada testimonial atau identitas orang fiktif.
- R-23 PASS: merek teks, navigasi, dan ikon fungsi mengikuti brief; tidak membuat avatar atau aset gambar.
- R-24 PASS: dashboard, transaksi, budget, pengaturan adalah route nyata yang diuji.
- R-25 PASS: pemindaian axe WCAG A/AA pada kedua tema dan dialog tidak menemukan pelanggaran kontras yang terdeteksi alat.
- R-26 PASS: navigasi, form, filter, konfirmasi, tema, ekspor, impor, reset punya aksi nyata; bukti alur tercatat di atas.
- R-27 PASS: pemuatan storage, data kosong, pencarian kosong, error validasi, storage rusak, dan gagal simpan ditangani.
- R-28 PASS: tidak ada FAQ pengisi.
- R-32 PASS: uji fokus berulang dalam dialog/drawer, Escape, dan pengembalian fokus; outline fokus disediakan di CSS.
- R-33 PASS: fitur ditulis langsung di sumber; formatter hanya merapikan format dan tidak menambahkan fitur.
- R-34 PASS: kedua tema diperiksa di semua route dan empat lebar.
- R-35 PASS: build dan tes browser dijalankan; daftar aksi beserta hasilnya ada di atas.
- R-36 PASS: tidak ada klaim keamanan, kepatuhan, performa, atau pelanggan yang dibuat-buat.
- R-37 PASS: spesifikasi dan revisi pengguna memberi arah; DESIGN.md kini menetapkan ENERGY 2 / RHYTHM 2 / MOTION 1.
- R-38 PASS: data awal kosong; fixture pengujian hanya berada di konteks browser terisolasi.
- R-39 PASS: label, nama kontrol, landmark, lang=id, metadata judul, fokus, target sentuh, cursor, serta reduced-motion diterapkan; pemindaian axe dan tes keyboard dijalankan.
- R-40 PASS: tidak ada media tak berdimensi atau skrip pihak ketiga; tidak ada angka performa yang diklaim.

### Purpose-Gate

- R-01 PASS: forest green/sage/krem sebagai dasar, green/rose sebagai sinyal arus uang; alasan dan revisi pengguna tercatat di DESIGN.md.
- R-04 PASS: Lucide dipilih sesuai brief dan makna fungsi, bukan ikon dekoratif.
- R-06 PASS: Segoe UI/system sans untuk keterbacaan tanpa unduhan font; nominal memakai tabular numerals.
- R-07 PASS: tidak ada pola/grid latar dekoratif.
- R-08 PASS: panah hanya menyatakan pemasukan/pengeluaran, bukan hiasan setiap tombol.
- R-09 PASS: tidak ada capsule badge dekoratif atau status palsu.
- R-10 PASS: permukaan solid; tidak ada tumpukan blur.
- R-12 PASS: shadow hanya mengangkat lapisan modal dari halaman.
- R-13 PASS: tidak ada glow dekoratif.
- R-14 PASS: saldo diprioritaskan; daftar transaksi dan budget memakai komposisi sesuai data, bukan kartu fitur seragam.
- R-19 PASS: motion dibatasi feedback kontrol dan perpindahan drawer; reduced-motion tersedia.
- R-22 PASS: tidak ada ilustrasi generik.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 2 / MOTION 1 mencerminkan revisi palet yang diminta pengguna pada DESIGN.md.
- Konsistensi PASS: komposisi tenang dengan variasi ringkasan, daftar, meter budget, dan pengaturan; tidak ada animasi berulang.
- Fokus PASS: saldo di dashboard, daftar/filter di transaksi, pemakaian kategori di budget, dan kontrol data di pengaturan.
- Ruang PASS: spacing memisahkan periode, ringkasan, catatan, dan tindakan tanpa hero kosong.
- Aksen PASS: emerald pada aksi utama/arus masuk, rose untuk arus keluar/risiko; warna didampingi label/tanda.
- Motif PASS: buku kas digital dengan periode jelas, nominal rata kanan, divider, serta label kategori/tanggal.
- Design Read PASS: tercatat pada baris pembuka DESIGN.md sebelum implementasi visual.

### Craftsmanship dan Quality Locks

- C-1 PASS: alasan warna, huruf, layout, spacing, radius, ikon, dan modal tercatat.
- C-2 PASS: alur kontrol inti diuji melalui browser dan hasilnya tercatat.
- C-3 PASS: setiap bagian mendukung pencatatan, membaca saldo, memantau batas, atau pemulihan data.
- C-4 PASS: kondisi kosong, gagal, dua tema, empat lebar, dan keyboard diperiksa; batas alat dicatat di bawah.
- C-5 PASS: angka berasal dari data tersimpan, tanpa klaim palsu.
- R-05 PASS: susunan dibangun untuk tugas pencatatan keuangan sesuai brief; tidak ada template landing page.
- R-11 PASS: radius 8/12/16 dan FAB lingkaran membedakan kontrol, panel, dan modal.
- R-15 PASS: CTA menyebut aksi, misalnya Simpan Transaksi, Impor backup, dan Reset data.
- R-16 PASS: copy menggunakan bahasa Indonesia langsung tanpa buzzword pemasaran.
- R-20 PASS: hierarki saldo, periode, tanda arus uang, dan motif buku kas mengikat identitas FinTrack.
- R-21 PASS: default gelap mengikuti pilihan pengguna; tema terang dan sistem tetap berfungsi.
- R-29 PASS: palet netral dengan emerald/rose sebagai warna semantik.
- R-30 PASS: tidak menyalin produk tertentu; komposisi mengikuti brief FinTrack.
- R-31 PASS: keputusan besar memiliki alasan satu baris di DESIGN.md.

## Batas verifikasi

Pengujian mobile memakai viewport Edge desktop, bukan perangkat Android/iOS fisik. Perilaku keyboard virtual perangkat nyata, pembaca layar, dan Safari belum diuji. Audit axe hanya mendeteksi sebagian masalah aksesibilitas. Lighthouse dan Web Vitals lapangan tidak diukur. Penyimpanan antar-tab serentak tidak atomik; batas ini dijelaskan pada README. Tidak ada deployment publik.

## Verifikasi logo/favicon

Logo monogram dipasang pada sidebar desktop dan header mobile. Aset SVG, ICO, PNG 32, dan Apple 180 merespons HTTP 200 dengan content type sesuai. Metadata head berisi favicon ICO/SVG/PNG dan apple-touch-icon. Pemeriksaan browser pada 360/1440 px memastikan logo ter-render tanpa overflow atau error runtime. Lint dan build produksi lulus setelah penambahan branding.
