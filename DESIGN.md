# FinTrack design direction

Reading this as: alat pencatat keuangan pribadi untuk pengguna Indonesia, dengan bahasa visual buku kas digital berpalet forest/sage/krem yang hangat dan tegas. ENERGY 2 / RHYTHM 2 / MOTION 1.

- Revisi pengguna memilih palet forest green, sage, dan krem lembut agar desktop tidak didominasi putih; tema gelap memakai hijau arang dengan aksen mint.
- Forest green menandai saldo dan aksi utama, emerald menandai pemasukan, rose menandai pengeluaran/risiko; tanda dan label tetap menyampaikan maknanya.
- Saldo sepanjang waktu adalah fokus dashboard; dua total bulanan menjadi pendamping, lalu daftar transaksi dan budget menjawab ke mana uang pergi.
- Tipografi Segoe UI/system sans menjaga angka rupiah mudah dibaca tanpa unduhan font; tabular numerals menyamakan posisi digit.
- Motif buku kas: label periode eksplisit, nominal rata kanan, divider transaksi, dan catatan singkat. Tidak ada grafik sebelum ada pertanyaan yang perlu dijawab.
- Spacing 4/8/12/16/24/32 mengelompokkan field rapat dan memisahkan keputusan utama dengan ruang lebih besar.
- Radius 8 untuk kontrol, 12 untuk panel, 16 untuk dialog; FAB lingkaran untuk aksi tambah yang diminta brief.
- Lucide dipakai sesuai brief untuk fungsi: Wallet untuk transaksi, LayoutDashboard untuk ringkasan, ChartNoAxesCombined untuk budget, Settings untuk pengaturan, panah untuk arus uang.
- Logo dibuat atas permintaan pengguna: monogram F berwarna krem pada forest green, dengan garis tracker mint sebagai motif pencatatan/perkembangan keuangan. Wordmark tetap FinTrack. Logo SVG yang sama menjadi sumber favicon ICO/PNG dan ikon perangkat; tidak ada avatar, ilustrasi pengisi, atau angka palsu.
- Semua form dan konfirmasi memakai drawer dengan permukaan solid dan overlay: kanan pada desktop untuk mempertahankan konteks halaman, bawah pada mobile agar mudah dijangkau.
- Input/Label/RadioGroup/Select/Popover/Calendar memakai primitives bersama dengan border, radius, state fokus/error, dan warna tema yang sama. Dropdown dan kalender popover memiliki elevasi untuk membedakan lapisan pilihan dari form.
- Mobile memakai bottom drawer untuk semua pilihan kategori/filter, kalender, periode, dan bulan/tahun kalender. Nested drawer menjaga form induk tetap terbuka, memberi lapisan overlay yang benar, serta mengembalikan fokus ke trigger pilihan.
- Gerakan hanya feedback kontrol dan drawer untuk menunjukkan letak form; reduced-motion menonaktifkan transisi non-esensial.
