# FinTrack UI/UX Layout & Component Structure
**Pilihan bahasa pengguna:** implementasi wajib JavaScript (`.js`) dan JSX (`.jsx`), dengan kontrak data diperiksa lewat validasi runtime dan tes.
**Revisi komponen setelah review pengguna:** seluruh form dan konfirmasi menggunakan Drawer (kanan di desktop, bawah di mobile). Gunakan Input/Label bersama, RadioGroup dan Select berbasis Radix, tanggal memakai Popover Radix + Calendar React DayPicker, serta periode memakai popover bulan. Revisi ini menggantikan rancangan lama Dialog desktop dan input date/month native di bawah.
**Revisi pengalaman mobile dan palet terbaru:** dropdown, kalender, periode, dan pilihan bulan/tahun kalender pada mobile wajib membuka bottom drawer, termasuk sebagai nested drawer di dalam form. Desktop tetap memakai dropdown/popover. Palet terbaru adalah forest green, sage, dan krem lembut; tema gelap memakai hijau arang dan mint, menggantikan dasar zinc/putih pada rancangan awal.
**Tech Stack:** Next.js (App Router), Tailwind CSS, shadcn/ui, Radix UI, Lucide React.
**Design Concept:** Modern SaaS, Dark Mode (default/preferred), Responsive Hybrid.

## 1. Global Layout State
Aplikasi menggunakan desain *full-height* (`h-screen`) dan *hidden overflow* pada container utama agar terasa seperti aplikasi *native*.

### Warna Tema (Tailwind)
*   **Background Utama:** `bg-zinc-50` (Light) / `bg-zinc-950` (Dark)
*   **Card/Surface:** `bg-white` (Light) / `bg-zinc-900` (Dark)
*   **Teks Utama:** `text-zinc-900` (Light) / `text-zinc-50` (Dark)
*   **Teks Sekunder/Muted:** `text-zinc-500`
*   **Aksen Pemasukan:** `text-emerald-500`
*   **Aksen Pengeluaran:** `text-rose-500`

---

## 2. Desktop View (Breakpoint `md:` / $\ge 768\text{px}$)

### A. Sidebar (Kiri)
*   **Width:** Fixed `w-64`.
*   **Border:** `border-r border-zinc-200 dark:border-zinc-800`.
*   **Isi:** 
    *   Logo "FinTrack." di atas.
    *   Menu navigasi vertikal (Dashboard, Transaksi, Budget) menggunakan komponen `Button variant="ghost" className="justify-start"`.
    *   Menu "Settings" di area paling bawah (*mt-auto*).

### B. Main Area (Kanan)
*   **Header:** Tinggi fixed, ada title "Overview". (Note: Tombol "Tambah Transaksi" disembunyikan di sini atau dipindah ke dalam modal).
*   **Scrollable Content (`ScrollArea`):**
    *   **Summary Cards:** Grid 3 kolom (`grid-cols-3`). Menampilkan Saldo, Pemasukan (icon hijau), Pengeluaran (icon merah).
    *   **Recent Transactions:** List transaksi bergaya tabel rapi dengan *avatar/icon* di sebelah kiri, nama & waktu di tengah, nominal di kanan.

### C. Desktop Modal Dialog (Trigger: Tombol "Tambah")
*   Menggunakan `Dialog` dari shadcn/ui.
*   Muncul di tengah layar dengan *overlay background* gelap (`bg-black/80 backdrop-blur-sm`).
*   **Ukuran:** `sm:max-w-[425px]`.

---

## 3. Mobile View (Breakpoint `< 768\text{px}$)

### A. Mobile Header & Content
*   **Header:** Hanya text "FinTrack." dan Avatar user, *padding* responsif.
*   **Content:** Scrollable secara vertikal. Summary Cards dibuat tumpuk (`grid-cols-1`) atau 2-kolom ringkas. List transaksi memenuhi sisa layar ke bawah.
*   **Padding Bawah:** Diberi *padding-bottom* yang cukup besar (misal `pb-24`) agar konten terakhir tidak tertutup *Bottom Nav*.

### B. Bottom Navigation & FAB (Floating Action Button)
*   **Posisi:** `fixed bottom-0 w-full`.
*   **Efek:** Kaca transparan (`bg-zinc-950/80 backdrop-blur-md`).
*   **Isi Navigasi:** 4 icon Lucide (Home, Wallet, Chart, Settings) menggunakan `Button variant="ghost" size="icon"`.
*   **FAB (Tengah):** Tombol utama "Tambah Transaksi" berbentuk lingkaran besar (`rounded-full h-12 w-12`).
*   **Posisi FAB:** Berada tepat di tengah *bottom nav*, sedikit dinaikkan ke atas dengan *transform* (`-translate-y-4 shadow-lg`).

### C. Mobile Bottom Drawer (Trigger: FAB)
*   Menggunakan `Drawer` (Vaul) dari shadcn/ui.
*   Muncul dari bawah (*slide up*), menempel pada tepi layar bawah (`rounded-t-2xl`).
*   Terdapat *handle/drag bar* kecil di bagian atas drawer.
*   Isi form input sama persis dengan yang ada di Desktop Modal.

---

## 4. Reusable Form Element (Isi Modal & Drawer)

Form ini dibungkus secara dinamis sesuai resolusi layar.

*   **Layout Form:** Grid vertikal (`gap-4`).
*   **Field Nominal:** Input angka ukuran besar (`text-lg font-semibold`), ada prefix "Rp" absolute di dalam input box.
*   **Field Kategori:** Dropdown/Select (Makan, Transportasi, Tagihan).
*   **Field Tanggal:** Date picker standar (`type="date"`).
*   **Field Catatan:** Input text standar.
*   **Tombol Submit:** "Simpan Transaksi" (`w-full`).
---

## 5. Spesifikasi Eksekusi MVP

Bagian ini melengkapi rancangan UI di atas agar Codex dapat membangun aplikasi yang berfungsi. Default produk: pencatat keuangan pribadi satu pengguna, bahasa Indonesia, mata uang IDR, tanpa login dan tanpa backend pada MVP. Data tersimpan di browser perangkat yang sama. Sinkronisasi, integrasi bank, pembayaran, dan multi-user di luar cakupan awal.

### Halaman dan perilaku

| Route | Kebutuhan |
| --- | --- |
| `/` | Dashboard: saldo total sepanjang waktu, pemasukan dan pengeluaran bulan terpilih, ringkasan budget bulan tersebut, dan 5 transaksi terbaru pada bulan tersebut. Label periode harus jelas. |
| `/transaksi` | Daftar transaksi, tambah/edit/hapus dengan konfirmasi, pencarian catatan/kategori, filter bulan, jenis dan kategori. Filter digabung dengan logika AND. Urutan tanggal terbaru, lalu waktu pembuatan terbaru. |
| `/budget` | Atur batas pengeluaran per kategori per bulan; tampilkan terpakai, sisa, persentase, serta kondisi melebihi budget. |
| `/pengaturan` | Tema gelap/terang/sistem, ekspor backup JSON, impor backup JSON, dan reset data dengan konfirmasi. |

- Desktop harus memiliki tombol **Tambah Transaksi** yang selalu mudah ditemukan di header; ini memperjelas trigger yang masih ambigu di bagian 2.
- Gunakan satu form bersama di Dialog desktop dan Drawer mobile. Tambahkan field **Jenis** (Pemasukan/Pengeluaran). Pilihan kategori mengikuti jenis transaksi.
- Kategori pemasukan: Gaji, Freelance, Hadiah, Lainnya. Kategori pengeluaran: Makan, Transportasi, Tagihan, Belanja, Hiburan, Kesehatan, Lainnya. Simpan ID kategori yang stabil dan berbeda antarjenis.
- Default tanggal mengikuti tanggal lokal perangkat; pilihan bulan awal mengikuti bulan lokal saat aplikasi dibuka.
- Tidak ada data contoh yang otomatis dianggap sebagai uang pengguna. Kondisi awal kosong, dengan petunjuk singkat dan aksi tambah transaksi.
- Semua tombol dan navigasi berfungsi. Jangan menampilkan avatar profil seolah-olah ada akun; gunakan akses Pengaturan atau hilangkan avatar pada MVP.

### Aturan perhitungan dan validasi

- Nominal disimpan sebagai bilangan bulat rupiah positif: minimal 1, maksimal 999.999.999.999; tolak pecahan, NaN, infinity, dan input negatif. Tampilan menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
- Saldo total = seluruh pemasukan dikurangi seluruh pengeluaran; saldo awal MVP adalah 0. Saldo boleh negatif.
- Total bulanan memakai tanggal transaksi, bukan waktu pembuatan. Simpan tanggal sebagai `YYYY-MM-DD`; jangan mengubahnya melalui UTC sehingga tanggal bisa bergeser.
- Kategori wajib sesuai jenis; catatan opsional maksimal 200 karakter. Tanggal harus valid. Transaksi masa depan ditolak pada MVP.
- Budget wajib positif dengan batas nominal yang sama; unik untuk pasangan bulan dan kategori pengeluaran. Bulan menggunakan `YYYY-MM`.
- Pemakaian budget = pengeluaran kategori tersebut pada bulan yang sama. Sisa boleh negatif; teks persentase boleh lebih dari 100%, tetapi panjang progress bar maksimal 100%. Jangan membagi dengan nol.
- Edit/hapus transaksi langsung memperbarui seluruh ringkasan dan budget. Ganti jenis transaksi harus mereset kategori yang tidak cocok.
- Form menampilkan error dekat field dan mempertahankan input jika penyimpanan gagal. Dialog/Drawer hanya ditutup setelah simpan berhasil.

### Model data dan penyimpanan

| Objek | Field dan kontrak runtime |
| --- | --- |
| Transaction | id unik, type `income`/`expense`, amount rupiah bulat positif, categoryId sesuai jenis, date `YYYY-MM-DD`, note maksimal 200 karakter, createdAt dan updatedAt timestamp ISO |
| Budget | id unik, month `YYYY-MM`, categoryId pengeluaran, amount rupiah bulat positif |
| FinTrackData | schemaVersion bernilai 1, transactions berupa array Transaction, budgets berupa array Budget |

- Gunakan `crypto.randomUUID()` untuk ID dan satu lapisan repository untuk baca/tulis `localStorage`, key `fintrack:data:v1`. Preferensi tema disimpan terpisah.
- Baca browser storage setelah mount. Tampilkan state pemuatan sampai hidrasi selesai; jangan menimpa data tersimpan dengan state kosong saat render awal.
- Tangani JSON rusak, storage tidak tersedia, dan kuota penuh. Tampilkan kegagalan secara jelas; jangan menghapus data rusak otomatis atau mengklaim perubahan sudah tersimpan.
- Backup menyertakan schemaVersion, transaksi, dan budget. Impor memvalidasi seluruh struktur, nominal, tanggal, kategori, keunikan ID serta budget, dan versi schema sebelum mengubah data.
- Impor menggantikan data setelah konfirmasi yang menjelaskan jumlah transaksi/budget. File tidak valid tidak mengubah data lama. Batasi file impor 5 MB.
- Ekspor menghasilkan file JSON yang dapat diimpor kembali. Reset hanya menghapus key milik FinTrack setelah konfirmasi; jangan memakai `localStorage.clear()`.
- Jelaskan di Pengaturan bahwa data berada di browser ini, dapat hilang ketika data situs dihapus, dan backup perlu diekspor sendiri.

## 6. Struktur Implementasi

Gunakan Next.js App Router, JavaScript/JSX, Tailwind CSS, shadcn/ui, Radix UI, Lucide React, dan Drawer berbasis Vaul sesuai kompatibilitas versi terpasang. Gunakan npm dan sertakan lockfile. Tentukan versi stabil yang kompatibel pada saat implementasi; jangan mengarang nomor versi atau mencampur konfigurasi lint/Tailwind lintas versi.

```text
src/
  app/
    layout.jsx
    page.jsx
    transaksi/page.jsx
    budget/page.jsx
    pengaturan/page.jsx
    globals.css
  components/
    ui/
    layout/
    transactions/
    budget/
    dashboard/
    providers/
  lib/
    categories.js
    data.js
    validation.js
    calculations.js
    storage.js
    format.js
```

Pisahkan perhitungan murni, validasi, storage, dan komponen tampilan. Gunakan provider bersama untuk state data dan tema; hindari state transaksi terpisah per halaman. Server Component tetap default; tambahkan client boundary hanya untuk interaksi/browser API. Jangan menambahkan API palsu, autentikasi kosong, layanan berbayar, atau dependency yang belum diperlukan.

### Responsivitas dan aksesibilitas

- Interpretasi `h-screen` di bagian awal: shell menggunakan tinggi viewport dinamis (`100dvh`) dan area utama boleh scroll. Jangan mengunci scrolling form saat keyboard mobile terbuka.
- Desktop sidebar mulai 768 px; mobile bottom navigation menyertakan label dan status aktif. FAB memiliki nama aksesibel. Berikan safe-area inset bawah.
- Uji ukuran 360, 390, 768, dan 1440 px; tidak boleh ada overflow horizontal. Pada tablet, summary grid menyesuaikan ruang yang tersedia.
- Nominal memakai tabular numerals dan rata kanan. Warna hijau/merah didampingi tanda, label, atau ikon; warna bukan satu-satunya pembeda.
- Setiap input punya label; icon-only button memiliki accessible name. Dialog/Drawer punya judul, focus trap, penutupan Escape, serta pengembalian fokus ke trigger.
- Focus keyboard terlihat, kontras teks memadai pada kedua tema, target sentuh minimal 44 px, dan animasi menghormati `prefers-reduced-motion`.
- Siapkan state kosong, hasil pencarian kosong, pemuatan, error, dan feedback berhasil yang relevan.

## 7. Penggunaan antislop-ai

Referensi resmi: https://github.com/miqdadbadjuber/anti-slop dan https://github.com/miqdadbadjuber/anti-slop/blob/main/GUIDE.md.

Antislop adalah aturan/skill untuk agent, bukan library runtime FinTrack. Jangan menambahkannya sebagai dependency aplikasi atau menganggapnya pembuat desain otomatis. Arah visual tetap mengacu pada dokumen ini.

### Setup sebelum implementasi

1. Periksa instalasi antislop yang sudah ada agar tidak membuat instalasi ganda.
2. Dari root proyek jalankan `npx antislop-ai` dengan Node.js yang memenuhi persyaratan installer resmi (panduan yang diperiksa mensyaratkan minimal 20.12).
3. Pilih scope **This project**, agent **Codex**, serta skill tambahan yang relevan untuk UI, aksesibilitas, dan copy berdasarkan opsi installer saat itu. Core selalu disertakan.
4. Pertahankan instruksi FinTrack di `AGENTS.md` ketika installer menambahkan pointer. Periksa file hasil instalasi dan lokasi yang benar-benar dilaporkan installer.
5. Mulai sesi Codex baru agar skill termuat. Baca aturan yang terpasang sebelum mengerjakan UI; jangan mengklaim antislop aktif hanya karena bagian ini ada.
6. Terapkan selama pembangunan dan jalankan pemeriksaan akhir/Delivery Gate sesuai aturan versi terpasang. Laporkan temuan dan perbaikannya. Jika pemasangan gagal, laporkan kendalanya dan jangan mengklaim audit resmi telah lolos.

Status implementasi: antislop-ai 3.2.27 telah dipasang untuk Codex pada `.codex/skills` dan pointer ditambahkan ke `AGENTS.md`. Aturannya dibaca langsung selama sesi implementasi. Bagian ini tetap menjadi panduan setup untuk checkout baru.

### Arah visual khusus FinTrack

- Buat alat pencatat keuangan yang mengutamakan keterbacaan nominal dan kecepatan mencatat transaksi.
- Pertahankan zinc sebagai warna dasar dan emerald/rose sebagai sinyal keuangan. Hierarki lahir dari tipografi, jarak, divider, dan alignment.
- Tiga summary cards punya fungsi data yang jelas; hindari membungkus setiap bagian kecil dalam kartu dekoratif.
- Hindari gradient hero, glow, emoji dekoratif, grafik palsu, badge berlebihan, dan glass effect di semua permukaan. Blur pada bottom nav hanya dipakai jika kontras tetap terbaca.
- Gunakan teks langsung seperti “Belum ada transaksi”, “Tambah transaksi pertama”, dan “Budget terlampaui”. Tidak ada klaim pertumbuhan atau insight yang tidak dihitung dari data.
- Ikon konsisten dari Lucide, radius dan spacing konsisten, animasi singkat hanya untuk menjelaskan perubahan state. Jangan menyamakan antislop dengan UI kosong tanpa karakter.

## 8. Tahapan Pengerjaan Codex

1. Baca `AGENTS.md`, dokumen ini, dan aturan antislop yang terpasang. Periksa isi proyek; pertahankan pekerjaan pengguna jika sudah ada.
2. Selesaikan setup antislop, lalu scaffold Next.js dan komponen dasar bila aplikasi belum ada. Jangan menimpa dokumen spesifikasi.
3. Implementasikan model data, validasi, storage, hidrasi, dan perhitungan terlebih dahulu.
4. Buat shell responsif, tema, empat route, dan navigasi aktif.
5. Selesaikan CRUD transaksi dengan satu form responsif, pencarian, dan filter; hubungkan dashboard ke data yang sama.
6. Implementasikan budget, pengaturan, backup/impor, dan reset.
7. Periksa perilaku, aksesibilitas, responsivitas, dan aturan antislop. Perbaiki temuan sebelum menyerahkan.
8. Lengkapi README: prasyarat, instalasi, `npm run dev`, build, pemeriksaan, batasan penyimpanan, serta penggunaan backup. Laporkan yang selesai, hasil pemeriksaan, dan kendala faktual.

## 9. Kriteria Selesai dan Verifikasi

- `npm install`, `npm run dev`, dan `npm run build` bekerja dari checkout bersih. Sediakan script `lint` dan `test` yang sesuai toolchain; semuanya harus lulus. Gunakan validasi runtime untuk kontrak JavaScript, tanpa pemeriksaan TypeScript.
- Tes unit bermakna mencakup saldo, pergantian bulan, budget terlampaui, validasi nominal/tanggal, dan penolakan backup tidak valid tanpa perubahan data.
- Uji alur tambah pemasukan/pengeluaran, edit, hapus, filter gabungan, budget, reload, perubahan tema, ekspor lalu impor kembali, serta pembatalan reset.
- Contoh verifikasi: pemasukan Rp5.000.000 dan pengeluaran Makan Rp50.000 menghasilkan saldo Rp4.950.000. Budget Makan Rp100.000 pada bulan yang sama terpakai 50%; perubahan pengeluaran menjadi Rp150.000 menghasilkan 150%, sisa -Rp50.000, dan progress bar tidak melebihi lebar container.
- Uji error storage dan data rusak, pemuatan awal tanpa kehilangan data, serta tanggal di batas bulan tanpa pergeseran timezone.
- Periksa browser desktop/mobile dan keyboard: tidak ada error runtime/hidrasi, navigasi dapat diakses, form tidak tertutup keyboard/bottom nav, dan data tetap konsisten setelah refresh.
- Tidak ada tombol placeholder, total hardcoded, fake API, atau daftar transaksi contoh yang muncul sebagai data pengguna.
- Bedakan pemeriksaan yang benar-benar dijalankan dari yang belum dapat dijalankan. Jangan menyebut aplikasi selesai jika alur inti gagal.

## 10. Prompt Eksekusi

Salin prompt berikut ke sesi Codex setelah setup antislop:

```text
Bangun aplikasi FinTrack di workspace ini sampai MVP dapat dijalankan, bukan hanya mockup.
Baca AGENTS.md dan struktur_mockup_ui_fintrack.md, lalu ikuti spesifikasi fitur,
model data, desain responsif, validasi, dan kriteria selesai di dalamnya.
Gunakan antislop yang terpasang selama implementasi dan pemeriksaan akhir.
Jika belum tersedia, selesaikan setup sesuai bagian 7 dan jelaskan jika perlu sesi baru.
Periksa file yang ada sebelum mengubahnya. Kerjakan seluruh alur transaksi, dashboard,
budget, tema, penyimpanan lokal, backup/impor, dan reset. Jalankan pemeriksaan yang
relevan, perbaiki kegagalan, dan tulis README untuk menjalankan aplikasi.
Laporkan hasil nyata, cara menjalankan, dan batasan yang masih ada.
```

## 11. Mandat Peran dan Penyelesaian

Saat implementasi diminta, Codex menjadi Lead Implementer dengan tanggung jawab Senior System Engineer, Senior Frontend Engineer, Senior UI/UX Designer, dan verifikasi. Baca kedua skill lokal yang ditautkan `AGENTS.md`, lalu langsung kerjakan bagian 8 sampai kriteria bagian 9 terpenuhi. Detail mandat, penanganan hambatan, dan batas selesai ada di bagian **Mandat eksekusi sampai selesai** pada `AGENTS.md`.

Keputusan teknis rutin dibuat mandiri sesuai MVP. Jangan berhenti di rencana atau meminta persetujuan setiap tahap. Jangan menambahkan fitur di luar cakupan. Pemeriksaan yang gagal harus diperbaiki; pemeriksaan yang tidak dapat dijalankan harus dilaporkan apa adanya.

Prompt singkat untuk memulai implementasi:

```text
Eksekusi MVP FinTrack sampai selesai sesuai AGENTS.md dan struktur_mockup_ui_fintrack.md.
Bertindak sebagai Lead Implementer dengan tanggung jawab senior engineering, frontend,
UI/UX, dan verifikasi. Terapkan kedua skill lokal serta aturan antislop yang tersedia.
Langsung implementasikan, ambil keputusan rutin sendiri, perbaiki kegagalan, dan jangan
berhenti di rencana. Serahkan aplikasi yang bisa dijalankan beserta hasil pemeriksaannya.
```
