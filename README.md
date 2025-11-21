## 💻 Modul 6 - Tugas (Praktikum PPB)

Selamat datang di repositori proyek Praktikum Pemrograman Perangkat Bergerak (PPB) Modul 6 Kelompok 27.

### ⚙️ Instalasi Proyek

Ikuti langkah-langkah di bawah ini untuk menyiapkan dan menjalankan proyek ini di lingkungan pengembangan lokal Anda.

#### 1\. Persiapan Umum

Pastikan Anda telah menginstal:

  * **Node.js** (Versi 18 atau lebih tinggi)
  * **npm** atau **Yarn**
  * **Expo CLI** (untuk aplikasi mobile)

#### 2\. Instalasi Backend (Express API)

Arahkan ke direktori `backend/` dan instal dependensi Node.js:

```bash
cd backend
npm install 
```

#### 3\. Instalasi Frontend (React Native/Expo)

Arahkan ke direktori `app/` dan instal dependensi React Native:

```bash
cd ../app
npm install
```

-----

### 🔑 Konfigurasi File Lingkungan (`.env`)

Aplikasi ini sangat bergantung pada variabel lingkungan untuk koneksi ke layanan eksternal (Supabase). Anda harus membuat dan mengisi file **`.env`** di direktori **`backend/`** dan file **`src/services/config.js`** di direktori **`app/`**.

#### 1\. File `.env` (untuk Backend)

Buat file bernama `.env` di dalam direktori **`backend/`** dan isi dengan detail koneksi Supabase dan MQTT Anda.

```
SUPABASE_URL="[URL_PROJECT_SUPABASE_ANDA]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_SECRET_KEY_ANDA]"
PORT="[PORT_ANDA]"
```

#### 1\. File `.env` (untuk Frontend)
Buka file **`app/`** dan pastikan variabel-variabel di dalamnya terisi dengan benar (terutama URL untuk Backend API):

```
EXPO_PUBLIC_SUPABASE_URL="[URL_PROJECT_SUPABASE_ANDA]"
EXPO_PUBLIC_SUPABASE_ANON_KEY="[PUBLIC_SUPABASE_ANON_KEY_ANDA]"
```

-----

###  Konfigurasi IP Lokal
#### 1\. Buka app/src/services/api.js di app, lalu ganti :
```
const API_URL = 'http://192.168.1.29:3000/api'; 
```
dengan IP lokal
#### 2\. Buka app/app.json di app, lalu ganti :
```
"backendUrl": "http://192.168.1.29:3000",
```
dengan IP lokal

-----

###  Konfigurasi Policy Supabase agar tidak Confirm Email
Buka Supabase lalu pergi ke Authentication lalu cari Sign In / Providers di Configuration 
Matikan Confirm Email, agar saat registrasi akun tidak perlu confirm email

-----

### 🚀 Menjalankan Aplikasi

#### 1\. Menjalankan Backend API

Arahkan ke direktori `backend/` dan jalankan server Node.js:

```bash
cd backend
npm run dev
```

Server akan berjalan di port yang telah ditentukan (default biasanya **3000**).


#### 2\. Menjalankan Sensor-Simulator

Arahkan ke direktori `sensor-simulator/` dan jalankan aplikasi Expo:

```bash
cd sensor-simulator
npm start
```

#### 3\. Menjalankan Frontend Mobile App

Arahkan ke direktori `app/` dan jalankan aplikasi Expo:

```bash
cd app
npm start
```

Setelah Expo memulai bundler, pindai kode QR menggunakan aplikasi **Expo Go** di perangkat seluler Anda untuk melihat aplikasi berjalan.

-----

### ✨ Fitur Utama Aplikasi

Aplikasi ini mengimplementasikan konsep IoT sederhana untuk memonitor dan mengontrol perangkat keras secara *real-time*.

| Fitur | Deskripsi | Teknologi Kunci |
| :--- | :--- | :--- |
| **Autentikasi Pengguna** | Pendaftaran dan login pengguna yang aman. | **Supabase Auth** |
| **Monitoring Real-Time** | Menampilkan data sensor terbaru (misalnya, suhu, kelembaban) secara *real-time*. | **MQTT** & **Supabase Realtime** |
| **Data Historis** | Menampilkan riwayat data sensor dalam bentuk tabel (fitur pagination). | **Express API** & **Supabase PostgreSQL** |
| **Manajemen *Threshold*** | Mengatur batas atas dan bawah nilai sensor yang akan memicu notifikasi atau tindakan tertentu. | **Express API** & **Supabase PostgreSQL** |
