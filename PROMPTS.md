# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.
**Hasil:**
komponen di app/page.jsx menangkap masalah koneksi ini dan menampilkannya dalam kotak pesan error merah agar tidak membuat web crash atau blank.
**Perbaikan:**
SUPABASE_URL sudah dikembalikan ke dalam .env.local dengan alamat proyek Supabase saya

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.
**Hasil:**
Saat mengklik produk id di url sudah muncul contohnya http://localhost:3000/produk/1
**Perbaikan:**
tidak ada

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.
**Hasil:**
Tab baru akan terbuka mengarah ke WhatsApp Web atau aplikasi WhatsApp dengan nomor tujuan dari lib/toko.js (6282268287135) serta pesan otomatis yang sudah terisi
**Perbaikan:**
tidak ada

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.
**Hasil:**
Login Berhasil
**Perbaikan:**
Tidak ada

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.
**Hasil:**
Pengujian Berhasil
**Perbaikan:**
Tidak ada.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.
**Hasil:**
File proxy.js berhasil dibuat di root proyek. Membuka rute /admin atau sub-rutenya tanpa login otomatis dialihkan ke /admin/login. Membuka /admin/login saat sudah login dialihkan ke /admin. CatatanBelumAktif di halaman /admin sudah dihapus.
**Perbaikan:**
Tidak ada.

## Debugging dan fitur bonus

### 1. Error Supabase URL Format (PGRST125 - Invalid path specified in request URL)
- **Penyebab:** Variabel `SUPABASE_URL` di `.env.local` sempat berisi URL REST endpoint (`https://<project-ref>.supabase.co/rest/v1/`) dan bukan Project URL dasar. Akibatnya `@supabase/supabase-js` menambahkan `/rest/v1/produk` di belakangnya sehingga menghasilkan path ganda.
- **Perbaikan:** 
  1. Menambahkan normalisasi otomatis di `lib/supabase/server.js` dan `lib/supabase/session.js` dengan regex `.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "")` agar aman dari format URL apa pun.
  2. Memperbaiki isi `SUPABASE_URL` di `.env.local` menjadi `https://<project-ref>.supabase.co`.

### 2. Error Missing SUPABASE_URL di Environment Variable
- **Penyebab:** Variabel `SUPABASE_URL` sempat terhapus dari file `.env.local`, sehingga Server Component di `app/page.jsx` menangkap ketiadaan variabel dan memunculkan banner error di layar.
- **Perbaikan:** Menuliskan kembali `SUPABASE_URL` yang valid ke dalam `.env.local` dan me-restart server development Next.js.

## Fitur Bonus: US-07 List produk di halaman admin dari database

**Prompt[SENDIRI]:**
Baca docs/user-stories.md bagian US-07.

Ubah app/admin/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server. Gunakan komponen TabelProduk yang sudah ada dan hapus penggunaan data contoh dari lib/data-contoh.js.

**Hasil:**
Daftar produk di halaman `/admin` berhasil diambil langsung dari tabel `produk` di Supabase di sisi server. Tampilan tabel produk menggunakan komponen `TabelProduk` dan data contoh dari `lib/data-contoh.js` sudah tidak lagi digunakan.

**Perbaikan:**
Tidak ada.

## Fitur Bonus: US-08 Tambah produk (harus terkunci login)

**Prompt[SENDIRI]:**
Baca docs/user-stories.md bagian US-08 dan aturan keamanan nomor 3 di AGENTS.md.

Buat Server Action tambahProduk di app/admin/actions.js yang memeriksa login admin di server, menyimpan produk baru ke tabel "produk" di Supabase, lalu mengalihkan ke /admin. Sambungkan form di app/admin/produk/baru/page.jsx ke Server Action tersebut dan hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Form di `/admin/produk/baru` berhasil menyimpan produk baru ke database Supabase setelah memverifikasi autentikasi admin di server. Setelah berhasil disimpan, pengguna dialihkan kembali ke `/admin` dan produk baru langsung terlihat di tabel. `CatatanBelumAktif` telah dihapus.

**Perbaikan:**
Tidak ada.

## Fitur Bonus: US-09 Ubah produk (harus terkunci login)

**Prompt [SENDIRI]:**
Baca docs/user-stories.md bagian US-09 dan aturan keamanan nomor 3 di AGENTS.md.

Buat Server Action ubahProduk di app/admin/actions.js yang memeriksa login admin di server, menyimpan perubahan data produk ke tabel "produk" di Supabase, lalu mengalihkan ke /admin. Ubah app/admin/produk/[id]/ubah/page.jsx agar mengambil data lama produk dari database Supabase dan sambungkan ke Server Action tersebut. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Halaman `/admin/produk/[id]/ubah` menampilkan data lama produk dari database Supabase. Form berhasil menyimpan perubahan data ke database setelah memverifikasi sesi admin, dan mengalihkan kembali ke `/admin`. `CatatanBelumAktif` telah dihapus.

**Perbaikan:**
Tidak ada.

## Fitur Bonus: US-10 Hapus produk (harus terkunci login)

**Prompt [SENDIRI]:**
Baca docs/user-stories.md bagian US-10 dan aturan keamanan nomor 3 di AGENTS.md.

Buat Server Action hapusProduk di app/admin/actions.js yang memeriksa login admin di server dan menghapus produk dari tabel "produk" di Supabase berdasarkan id. Ubah components/TabelProduk.jsx agar tombol "Hapus" meminta konfirmasi (confirm) sebelum menjalankan penghapusan.

**Hasil:**
Tombol "Hapus" pada tabel produk di `/admin` meminta konfirmasi terlebih dahulu melalui browser dialog. Jika disetujui, Server Action memverifikasi sesi login admin dan menghapus produk terkait dari database Supabase secara real-time.

**Perbaikan:**
Tidak ada.

## Fitur Bonus: US-11 Filter kategori atau pencarian

**Prompt [SENDIRI]:**
Baca docs/user-stories.md bagian US-11.

Buat komponen KatalogProduk dengan fitur pencarian nama produk dan penyaringan berdasarkan kategori. Hubungkan dengan daftar produk dari database di app/page.jsx tanpa mengorbankan keamanan akses server.

**Hasil:**
Pengunjung dapat mencari produk secara instan berdasarkan nama/deskripsi melalui input pencarian, serta menyaring katalog berdasarkan kategori yang tersedia melalui tombol kategori (pills). Tampilan tetap responsif dan data diambil di server.

**Perbaikan:**
Tidak ada.

## Fitur Bonus: US-12 Pilih jumlah atau varian

**Prompt [SENDIRI]:**
Baca docs/user-stories.md bagian US-12.

Ubah components/TombolWhatsApp.jsx agar pengunjung dapat memilih jumlah pesanan (counter +/-) dan memasukkan varian/catatan pemesanan sebelum memesan. Pastikan pilihan jumlah, varian, dan total harga otomatis tertera dalam teks pesan WhatsApp.

**Hasil:**
Pada halaman detail produk, pengunjung dapat memilih jumlah produk yang ingin dipesan (disertai perhitungan subtotal otomatis) dan mengisi catatan varian (opsional). Ketika tombol WhatsApp ditekan, pesan otomatis memuat rincian nama produk, jumlah, varian, dan total harga yang harus dibayar.

**Perbaikan:**
Tidak ada.


