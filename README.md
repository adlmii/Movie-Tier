# 🎬 WatchTier - Ultimate Movie Ranking App

**WatchTier** adalah aplikasi web interaktif modern untuk menemukan, mengoleksi, dan memeringkat film favorit kamu ke dalam Tier List.

🔗 **Live Demo:** [https://watchtier-app.vercel.app/](https://watchtier-app.vercel.app/)

---

## ✨ Fitur Utama

- **🔍 Infinite Discovery:** Jelajahi ribuan film populer dan trending dengan sistem Pagination yang mulus.
- **📂 Collection Pool:** Tambahkan film ke dalam "kolam" koleksi (Unranked) sebelum memeringkatnya.
- **drag_and_drop Interactive Ranking:** Gunakan fitur *Drag-and-Drop* canggih yang dioptimalkan untuk Mouse (Desktop) dan Touchscreen (Mobile/Tablet).
- **📸 Export to Image:** Simpan hasil Tier List kamu sebagai gambar (PNG) berkualitas tinggi dengan satu klik.
- **💡 Smart Recommendations:** Temukan film serupa di halaman detail film ("You Might Also Like") untuk eksplorasi tanpa henti.
- **⚡ High Performance:** Dilengkapi dengan *Skeleton Loading*, *Lazy Image Loading*, dan optimasi rendering untuk pengalaman pengguna yang cepat.
- **🎨 Premium UI/UX:** Desain *Dark Mode* dengan gaya Glassmorphism, animasi halus (Framer Motion), dan responsif di semua ukuran layar.
- **🛡️ Data Persistence:** Tier list kamu tersimpan otomatis di browser (Local Storage), jadi tidak akan hilang saat di-refresh.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan *Modern Frontend Stack*:

- **Core:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (Super cepat)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (dengan LocalStorage persistence)
- **Drag & Drop:** [dnd-kit](https://dndkit.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API:** [The Movie Database (TMDB)](https://www.themoviedb.org/)

---

## 🚀 Cara Menjalankan di Lokal

Ikuti langkah ini untuk menjalankan proyek di komputer kamu:

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/watchtier.git](https://github.com/username-kamu/watchtier.git)
cd watchtier
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
VITE_TMDB_API_KEY=masukkan_api_key_tmdb_disini
```
(Dapatkan API Key gratis di themoviedb.org)

#### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser dan akses http://localhost:5173.

---

## 🔒 Keamanan API Key
Aplikasi ini menggunakan restriksi HTTP Referrer untuk mengamankan API Key TMDB.
- API Key tidak disembunyikan di sisi klien (karena ini SPA/Frontend-only).
- Pengamanan dilakukan dengan mendaftarkan domain produksi (misal: watchtier-app.vercel.app) di dashboard TMDB, sehingga key tidak bisa disalahgunakan di website lain.

---

## 📂 Struktur Folder Utama
```
src/
├── components/      
│   ├── movie/       # Komponen Kartu Film
│   ├── search/      # Search Bar & Hasil Pencarian
│   ├── tier/        # Papan Tier List & Logic Drag-n-Drop
│   └── ui/          # Komponen UI Umum (Skeleton, ErrorBoundary)
├── hooks/           # Custom Hooks (useDebounce, useScreenshot)
├── lib/             # Konfigurasi Library (axios, utils)
├── pages/           # Halaman Utama (Home, MovieDetail)
├── store/           # Global State Management (Zustand)
└── types/           # Definisi Tipe TypeScript
```

---

## 🤝 Kontribusi
Pull Request dipersilakan! Untuk perubahan besar, harap buka Issue terlebih dahulu untuk mendiskusikan apa yang ingin kamu ubah.

---

## 📝 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).
