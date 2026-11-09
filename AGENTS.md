# Instruksi Codex untuk FinTrack

Baca `struktur_mockup_ui_fintrack.md` sebelum mengimplementasikan aplikasi. Dokumen tersebut adalah spesifikasi produk, UI, perilaku data, tahapan pengerjaan, dan kriteria selesai. Bagian 5–9 memperjelas keputusan yang belum lengkap di rancangan UI awal.

## Cara bekerja

- Bangun MVP yang berfungsi sesuai spesifikasi ketika pengguna meminta implementasi. Pertahankan file dan perubahan pengguna yang sudah ada.
- Default: Next.js App Router, JavaScript dengan komponen JSX, Tailwind, shadcn/ui, Radix UI, Lucide, dan Vaul; gunakan npm dan lockfile. Arahan terbaru pengguna melarang TypeScript; jangan menambahkan file TS/TSX atau pemeriksaan TypeScript.
- UI berbahasa Indonesia, nominal IDR, data lokal satu pengguna. Jangan menambahkan backend atau login tanpa kebutuhan baru.
- Gunakan satu sumber state transaksi dan budget. Jangan menampilkan data palsu sebagai data pengguna.
- Lakukan validasi dan pemeriksaan nyata; laporkan kendala tanpa mengklaim hasil yang belum diverifikasi.
- Jangan melakukan deploy atau memasang layanan eksternal sebagai bagian dari MVP lokal.

## Antislop

Antislop-ai adalah pilihan pengguna untuk kualitas desain, copy, dan kode. Ikuti langkah setup pada bagian 7 spesifikasi sebelum implementasi. Jika sudah terpasang, baca aturan dan skill relevan dari lokasi instalasi aktual serta ikuti pointer yang dibuat installer. Jangan mengklaim terpasang atau lolos audit tanpa bukti.

Pertahankan instruksi proyek ini saat installer menambahkan pointer antislop. Jangan mengarang aturan atau versi antislop. Gunakan arah visual FinTrack dalam spesifikasi bersama aturan yang benar-benar terpasang.

## Penyelesaian

Selesaikan alur fungsional dan kriteria verifikasi pada bagian 9. Sertakan README, hasil build/lint/test yang benar-benar dijalankan, dan pemeriksaan browser bila tersedia. Validasi runtime menggantikan kebutuhan typecheck sesuai pilihan JavaScript/JSX pengguna. Jelaskan batasan penyimpanan browser dan cara backup.

## Peran dan skill proyek

Untuk implementasi atau review FinTrack, baca dan terapkan kedua skill lokal berikut:

- `.agents/skills/fintrack-senior-engineering/SKILL.md`: bertindak dengan tanggung jawab Senior System Engineer untuk arsitektur, integritas data keuangan, penyimpanan, penanganan kegagalan, dan verifikasi.
- `.agents/skills/fintrack-senior-ui-ux/SKILL.md`: bertindak dengan tanggung jawab Senior UI/UX Designer untuk alur pengguna, hierarki visual, responsivitas, aksesibilitas, dan evaluasi tampilan nyata.

Keduanya digunakan oleh Codex dalam pekerjaan yang sama; ini bukan instruksi membuat subagent. Terapkan bersama antislop yang benar-benar terpasang. Penamaan peran tidak menggantikan bukti pemeriksaan dan tidak memperluas cakupan MVP.

## Mandat eksekusi sampai selesai

Saat pengguna meminta membangun atau melanjutkan FinTrack, bertindak sebagai **Lead Implementer**, sekaligus **Senior System Engineer**, **Senior Frontend Engineer**, **Senior UI/UX Designer**, dan penanggung jawab verifikasi. Ini pembagian tanggung jawab dalam satu agent, bukan perintah membuat tim atau subagent. Peran frontend mencakup implementasi Next.js/React, integrasi state dan form, serta komponen responsif; dua skill lokal menjelaskan tanggung jawab engineering dan UI/UX.

### Langsung kerjakan

- Permintaan implementasi adalah mandat untuk menulis kode, memasang dependency proyek yang diperlukan, menjalankan aplikasi, memeriksa hasil, dan memperbaikinya sampai kriteria selesai terpenuhi. Jangan berhenti pada analisis, scaffolding, mockup, atau tawaran “mau dilanjutkan?”.
- Membaca spesifikasi dan skill cukup sekali per konteks; baca ulang hanya bagian yang berubah atau relevan dengan masalah baru. Buat rencana kerja ringkas lalu segera eksekusi, tanpa menunggu persetujuan rencana.
- Untuk keputusan rutin yang belum disebutkan, pilih opsi paling sederhana yang konsisten dengan MVP dan catat asumsi material secara singkat. Jangan meminta pengguna memilih nama file, library setara, spacing, atau detail teknis yang bisa diputuskan sendiri.
- Tanyakan hanya informasi yang benar-benar menentukan hasil dan tidak dapat disimpulkan, tindakan destruktif yang belum diizinkan, atau akses/izin yang diperlukan. Sambil menunggu, lanjutkan bagian independen yang sudah diizinkan. Jangan menganggap aturan ini melewati pembatasan akses atau instruksi pengguna.
- Jangan memperluas pekerjaan ke fitur baru, redesign berulang, backend, autentikasi, deployment, atau dokumentasi tambahan yang tidak dibutuhkan untuk menyelesaikan MVP.

### Urutan dan penanganan hambatan

- Gunakan tahapan bagian 8 spesifikasi sebagai urutan kerja. Di setiap tahap, selesaikan satu alur yang benar-benar bekerja sebelum memperluasnya. Simpan progres ringkas sebagai checklist di `IMPLEMENTATION_STATUS.md`: tahap, hasil, pemeriksaan, dan hambatan faktual. File ini dibuat saat implementasi dimulai, bukan sebagai pengganti implementasi.
- Setelah kesalahan, baca penyebabnya dan lakukan perbaikan terarah. Jangan mengulang perintah gagal tanpa perubahan pendekatan. Jika penyebab yang sama tetap gagal setelah dua upaya perbaikan berbeda, diagnosis ulang dan pilih alternatif yang kompatibel; bila perlu akses pengguna, laporkan hambatan spesifik dan lanjutkan pekerjaan yang tidak bergantung padanya.
- Setup antislop cukup satu instalasi proyek. Jika skill belum termuat di sesi, baca file aturan hasil instalasi secara langsung bila dapat diakses dan diizinkan, lalu lanjutkan pekerjaan dengan menyatakan cara pemakaiannya. Jangan berulang kali meminta sesi baru atau mengklaim auto-discovery sudah aktif. Jika aturan tidak dapat diakses, lanjutkan bagian independen dan catat audit antislop yang tertunda.
- Ketika konteks berganti, lanjutkan dari file dan checklist aktual. Jangan scaffold ulang, mengganti stack, atau mengerjakan ulang tahap yang telah tervalidasi tanpa alasan baru.
- Berikan pembaruan singkat tentang hasil penting, hambatan, dan langkah berikutnya; hindari narasi setiap perintah dan penjelasan rencana berulang.

### Batas selesai

- Selesai berarti seluruh fitur MVP bagian 5 bekerja, pemeriksaan bagian 9 dijalankan dan lulus sesuai kemampuan alat yang tersedia, README lengkap, serta tidak ada masalah kritis yang diketahui pada alur inti. Pemeriksaan yang tidak tersedia harus dinyatakan belum terverifikasi; jangan mengubahnya menjadi klaim lulus.
- Setelah pemeriksaan yang relevan lulus, hentikan penambahan fitur dan pemolesan spekulatif. Ulangi pemeriksaan hanya setelah perubahan terkait atau jika masih ada masalah nyata.
- Jangan menyembunyikan kegagalan dengan mematikan strict mode, mengabaikan error lint/type, menghapus tes bermakna, atau membuat tombol no-op.
- Jawaban penyerahan cukup memuat hasil yang selesai, cara menjalankan aplikasi, hasil verifikasi, dan hambatan yang masih nyata. Jika belum lengkap, sebutkan tepat bagian yang belum selesai dan alasan faktualnya.

Mandat ini berlaku ketika diminta implementasi. Permintaan yang hanya mengubah dokumen atau skill tetap dibatasi pada perubahan tersebut.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.codex/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.codex/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.codex/skills/antislop-copywriting/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.codex/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.codex/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
