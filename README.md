# Patungan Wishlist

Starter Next.js untuk registry pernikahan. Tanpa konfigurasi, aplikasi menggunakan data demo sehingga desain dan alur kontribusi bisa dicoba segera.

## Jalankan

1. Pastikan Node.js 20+ terpasang.
2. Jalankan `npm install`, lalu `npm run dev`.
3. Buka `http://localhost:3000`.

## Hubungkan Supabase saat siap

1. Buat project Supabase, lalu jalankan [`supabase/schema.sql`](supabase/schema.sql) di SQL Editor.
2. Salin `.env.example` menjadi `.env.local`, kemudian isi URL dan key Supabase.
3. Restart server. Homepage otomatis membaca view `item_progress`; form publik otomatis menyimpan ke `contributions`.

Jika Anda sudah pernah menjalankan skema versi awal, jalankan juga [`supabase/migrations/001_add_item_description.sql`](supabase/migrations/001_add_item_description.sql) untuk menambahkan kolom deskripsi dan memperbarui view progres.

## Data yang perlu Anda isi

- Ganti nama pasangan dan teks sambutan di `app/registry.tsx`.
- Tambahkan gambar QRIS pada area `.qris` setelah Anda memiliki QRIS statis.
- Masukkan item wishlist melalui Supabase Table Editor atau import CSV, sesuai panduan migrasi. Gunakan kolom `id`, `name`, `description`, `target_price`, dan `photo_url`; kolom `current_total` tidak perlu diimpor.

## Endpoint admin

Setelah mengisi `ADMIN_PASSWORD` dan `SESSION_SECRET`, gunakan `POST /api/admin/login` dengan body `{ "password": "..." }`. Cookie aman yang dihasilkan diperlukan oleh `GET /api/admin/contributions` dan operasi `POST`/`PUT`/`DELETE` pada `/api/admin/items`. Antarmuka admin sengaja belum dibuat, sehingga pengelolaan awal bisa dilakukan di Supabase Dashboard tanpa menduplikasi fitur saat data sedang disiapkan.

## Catatan keamanan

`SUPABASE_SERVICE_ROLE_KEY` hanya dipersiapkan untuk endpoint admin masa depan dan tidak pernah dikirim ke browser. RLS pada skema hanya memberi akses publik untuk membaca progres agregat dan menambah kontribusi; nama serta nominal donor tidak dapat dibaca publik.
