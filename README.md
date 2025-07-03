# 🫧✨ E-Laundry - Fullstack Laundry Management App

E-Laundry adalah aplikasi manajemen usaha laundry berbasis web yang memungkinkan pelaku UMKM untuk mengelola transaksi, admin, dan laporan pendapatan dengan mudah dan efisien.

---

## 🚀 Fitur Utama

### 🔐 Autentikasi Admin
- Registrasi dan login admin menggunakan email dan password (bcrypt + JWT)
- Validasi input dengan Zod
- Middleware otorisasi untuk setiap akses admin

### 👤 Manajemen Admin
- Get profile admin saat ini (`/admin/profile`)
- Get seluruh data admin (`/admin/all`)
- Update & delete admin berdasarkan email
- Cegah penghapusan admin jika masih memiliki data order
- Fitur delete massal admin yang tidak punya order

### 🧾 Manajemen Order
- CRUD transaksi laundry oleh admin
- Hitung otomatis harga berdasarkan berat dan kategori harga
- Get order milik admin
- Get seluruh order oleh super admin
- Statistik pendapatan:
  - Total keseluruhan
  - Bulanan (current year)
  - Tahunan (seluruh tahun)

### 📊 Dashboard Ringkasan
- Total Transaksi
- Jumlah Admin
- Total Pendapatan (semua order)
- Pendapatan Saya (per admin)
- Statistik Pendapatan per Bulan dan per Tahun

---

## ⚙️ Teknologi yang Digunakan

### Backend
- **Node.js + Express**
- **Prisma ORM** dengan PostgreSQL/MySQL
- **JWT** untuk autentikasi token
- **Zod** untuk validasi schema
- **Bcrypt** untuk enkripsi password

### Frontend
- **React + TypeScript**
- **Material UI & ApexCharts**
- **Tailwind CSS (opsional styling tambahan)**


---

## 🔐 Autentikasi Token (JWT)

Token akan di-*generate* saat login dan disertakan di `Authorization` header (Bearer Token) untuk akses endpoint yang dilindungi.

---

## 📦 Instalasi & Setup

```bash
# 1. Clone repositori
git clone https://github.com/username/e-laundry.git

# 2. Masuk ke folder backend
cd e-laundry/backend

# 3. Install dependencies
npm install

# 4. Setup environment
cp .env.example .env

# 5. Jalankan migrasi Prisma
npx prisma migrate dev --name init

# 6. Jalankan server
npm run dev



