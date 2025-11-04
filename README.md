# SomansaPOS

Aplikasi Point of Sale (POS) lengkap dengan dukungan offline-first, dibangun menggunakan React.js + Vite.

> 📚 **[Lihat Semua Dokumentasi](INDEX.md)** - Panduan navigasi lengkap untuk 11 dokumen

## 🚀 Fitur Utama

### 1. **Autentikasi & Otorisasi**
- Login/logout dengan role-based access (Admin & Cashier)
- Penyimpanan sesi lokal
- Role-based UI components

### 2. **Katalog Produk**
- CRUD produk lengkap (Create, Read, Update, Delete)
- Manajemen SKU, barcode, harga, stok, kategori
- Alert stok rendah

### 3. **Pemindaian Barcode**
- Input barcode manual atau scanning
- Quick add ke keranjang

### 4. **POS / Checkout**
- Keranjang transaksi dinamis
- Diskon per item dan diskon transaksi
- Multiple payment methods (Cash, Card, E-Wallet)
- Generate & print receipt

### 5. **Manajemen Inventaris**
- Stock adjustment (in/out)
- Riwayat penyesuaian stok
- Alert stok rendah

### 6. **Manajemen Pelanggan**
- CRUD pelanggan
- Tracking customer per transaksi

### 7. **Laporan**
- Laporan penjualan harian & periode
- Produk terlaris
- Export ke CSV

### 8. **Offline-First + Sinkronisasi**
- Semua data disimpan di IndexedDB
- Service Worker untuk offline support
- Queue system untuk transaksi offline
- Auto-sync saat kembali online
- Conflict resolution (timestamp-based)

### 9. **User Roles & Permissions**
- Admin: Full access
- Cashier: Restricted access (POS, Products, Customers only)

### 10. **Settings & Sync**
- Konfigurasi toko
- Manual sync button
- Queue monitoring

## 📦 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.4
- **State Management**: Context API
- **Offline Storage**: IndexedDB (via idb)
- **Service Worker**: Custom SW for caching & offline support
- **Testing**: Vitest + React Testing Library
- **Date Handling**: date-fns
- **Internationalization**: Custom i18n (Bahasa Indonesia)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ dan npm/yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd somansapos

# Install dependencies
npm install

# Start development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🎯 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Buka browser**: http://localhost:3000

4. **Login dengan akun demo**:
   - **Admin**: username `admin`, password `admin123`
   - **Cashier**: username `cashier`, password `cashier`

## 📊 Data Seed

Aplikasi secara otomatis akan melakukan seed data saat pertama kali dijalankan:

### Users
| Username | Password  | Role    |
|----------|-----------|---------|
| admin    | admin123  | admin   |
| cashier  | cashier   | cashier |

### Products
| ID | Name        | Barcode | Price   | Stock |
|----|-------------|---------|---------|-------|
| p1 | Nasi Goreng | 111111  | 15,000  | 20    |
| p2 | Es Teh      | 222222  | 5,000   | 50    |
| p3 | Roti Bakar  | 333333  | 12,000  | 15    |

## 🧪 Testing Offline Mode

### Menggunakan Chrome DevTools:

1. Buka DevTools (F12)
2. Pergi ke tab **Network**
3. Centang **Offline** di bagian atas
4. Aplikasi tetap berfungsi dalam mode offline
5. Lakukan transaksi - akan masuk ke queue
6. Uncheck **Offline** untuk kembali online
7. Data akan otomatis disinkronkan

### Menggunakan Application Tab:

1. Buka DevTools → **Application** tab
2. Klik **Service Workers** di sidebar
3. Check **Offline** untuk simulasi offline
4. Lihat **IndexedDB** → **SomansaPOS** untuk melihat data lokal
5. Lihat **queue** store untuk melihat transaksi yang belum disinkronkan

## 📁 Struktur Proyek

```
somansapos/
├── public/
│   └── sw.js                    # Service Worker
├── src/
│   ├── api/
│   │   ├── config.js            # API configuration
│   │   └── stubs.js             # API contracts & examples
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── POS/
│   │   │   ├── POSScreen.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Receipt.jsx
│   │   │   └── *.css
│   │   ├── Products/
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── *.css
│   │   ├── Customers/
│   │   │   ├── CustomerList.jsx
│   │   │   └── CustomerForm.jsx
│   │   ├── Reports/
│   │   │   └── Reports.jsx
│   │   ├── Inventory/
│   │   │   └── Inventory.jsx
│   │   ├── Settings/
│   │   │   └── Settings.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       └── Navigation.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── AppContext.jsx      # App-wide state & settings
│   ├── utils/
│   │   ├── indexedDB.js        # IndexedDB wrapper
│   │   ├── syncManager.js      # Sync queue manager
│   │   └── seedData.js         # Initial data seeding
│   ├── locales/
│   │   └── id.js               # Indonesian translations
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   └── main.jsx
├── tests/
│   ├── setup.js
│   └── Cart.test.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔄 Sync & Conflict Resolution

### Strategi Sinkronisasi

1. **Queue System**: Semua operasi offline ditambahkan ke queue
2. **Auto Sync**: Otomatis sync setiap 5 menit atau saat online
3. **Manual Sync**: Button manual di Settings
4. **Retry Logic**: Max 5 retries untuk failed items

### Penanganan Konflik

- **Sales**: Append-only, no conflicts (setiap sale punya ID unik)
- **Products/Customers**: Last-write-wins (timestamp-based)
- **Stock**: Server version has priority
- **Duplicate Detection**: By ID (local_ prefix untuk offline-created items)

### Alur Sinkronisasi

```
1. User melakukan transaksi offline
   ↓
2. Data disimpan ke IndexedDB + Queue
   ↓
3. Saat online, SyncManager detect queue items
   ↓
4. POST ke /api/sync dengan batch data
   ↓
5. Server validate & merge
   ↓
6. Return conflicts (jika ada)
   ↓
7. Remove dari queue jika success
```

## 🔌 API Endpoints

Lihat file `src/api/stubs.js` untuk dokumentasi lengkap API contracts.

### Authentication
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer

### Sales
- `POST /api/sales` - Create sale
- `GET /api/sales` - Get all sales

### Sync
- `POST /api/sync` - Bulk sync queued data

### Inventory
- `POST /api/inventory/adjust` - Adjust stock

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily report

## ✅ Acceptance Criteria

### 1. Authentication
- ✅ Login berhasil untuk user seed
- ✅ Role memengaruhi UI (admin vs cashier)
- ✅ Logout menghapus sesi

### 2. Products
- ✅ Tambah produk baru muncul di daftar
- ✅ Edit produk meng-update data
- ✅ Delete produk menghapus dari daftar
- ✅ Data tersimpan di IndexedDB

### 3. POS / Checkout
- ✅ Barcode scan menambahkan produk ke cart
- ✅ Cart dapat diupdate (qty, discount)
- ✅ Checkout dengan berbagai payment method
- ✅ Receipt dapat dicetak

### 4. Offline Mode
- ✅ Transaksi dapat dibuat saat offline
- ✅ Data tersimpan ke queue
- ✅ Saat online, queue dikirim ke server
- ✅ Sales tersimpan di server setelah sync

### 5. Reports
- ✅ Laporan harian menampilkan data sesuai
- ✅ Export CSV berfungsi
- ✅ Top products ditampilkan benar

### 6. Inventory
- ✅ Stock adjustment mengupdate stok produk
- ✅ History adjustment tersimpan

## 🔒 Security Notes

⚠️ **PENTING UNTUK PRODUCTION**:

1. **Password Hashing**: Gunakan bcrypt/argon2 di backend
2. **HTTPS**: Wajib untuk production
3. **JWT Tokens**: Implement proper JWT dengan expiry & refresh
4. **Rate Limiting**: Protect login & API endpoints
5. **Input Validation**: Server-side validation wajib
6. **CORS**: Configure proper CORS policy
7. **Environment Variables**: Gunakan `.env` untuk sensitive data

## 🌐 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Build Production

```bash
npm run build
```

Output akan ada di folder `dist/`.

### Deploy Options

1. **Netlify (Recommended)** ⚡:
   ```bash
   # Via CLI
   npm install -g netlify-cli
   netlify login
   npm run build
   netlify deploy --prod
   
   # Or via Git - Push ke GitHub lalu connect di Netlify Dashboard
   # Konfigurasi sudah siap di netlify.toml
   ```
   
   📖 **[Panduan Lengkap Deploy ke Netlify](NETLIFY_DEPLOY.md)**

2. **Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Traditional Server**:
   - Upload folder `dist/` ke web server
   - Configure server untuk serve `index.html` untuk semua routes

📚 Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan deployment lengkap semua platform.

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

## 📝 Environment Variables

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙋‍♂️ Support

Untuk pertanyaan atau issue, silakan buka issue di GitHub repository.

---

**Built with ❤️ using React + Vite**
