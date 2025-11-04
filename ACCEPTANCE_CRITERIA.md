# SomansaPOS - Acceptance Criteria

Kriteria penerimaan lengkap untuk pengujian manual semua fitur aplikasi.

## 📋 Testing Environment Setup

### Prerequisites
1. Browser modern (Chrome, Firefox, Safari)
2. Node.js 18+ installed
3. Application running (`npm run dev`)
4. DevTools available (F12)

### Initial Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 1. Authentication & Authorization

### AC 1.1: Login dengan Admin
**Given**: User berada di halaman login  
**When**: User memasukkan username "admin" dan password "admin123"  
**Then**:
- ✅ Login berhasil
- ✅ Redirect ke halaman POS
- ✅ Header menampilkan nama "Administrator" dengan role "admin"
- ✅ Navigation menampilkan semua menu (POS, Products, Customers, Inventory, Reports, Settings)
- ✅ Token tersimpan di localStorage
- ✅ User data tersimpan di localStorage

**Test Steps**:
1. Buka aplikasi
2. Input username: `admin`
3. Input password: `admin123`
4. Klik tombol "Masuk"
5. Verify semua kondisi di atas

---

### AC 1.2: Login dengan Cashier
**Given**: User berada di halaman login  
**When**: User memasukkan username "cashier" dan password "cashier"  
**Then**:
- ✅ Login berhasil
- ✅ Header menampilkan nama "Kasir" dengan role "cashier"
- ✅ Navigation HANYA menampilkan menu: POS, Products, Customers
- ✅ Menu Inventory, Reports, Settings TIDAK terlihat
- ✅ Token tersimpan di localStorage

**Test Steps**:
1. Logout jika sudah login
2. Input username: `cashier`
3. Input password: `cashier`
4. Klik tombol "Masuk"
5. Verify navigation menu sesuai role

---

### AC 1.3: Login dengan Kredensial Salah
**Given**: User berada di halaman login  
**When**: User memasukkan kredensial yang salah  
**Then**:
- ❌ Login gagal
- ✅ Error message muncul: "Username atau password salah"
- ✅ User tetap di halaman login
- ✅ Tidak ada token yang tersimpan

**Test Steps**:
1. Input username: `wrong`
2. Input password: `wrong123`
3. Klik tombol "Masuk"
4. Verify error message muncul

---

### AC 1.4: Logout
**Given**: User sudah login  
**When**: User klik tombol "Keluar"  
**Then**:
- ✅ Logout berhasil
- ✅ Redirect ke halaman login
- ✅ Token dihapus dari localStorage
- ✅ User data dihapus dari localStorage

**Test Steps**:
1. Login sebagai admin
2. Klik tombol "Keluar" di header
3. Verify redirect ke login
4. Check localStorage (F12 > Application > Local Storage)

---

## 2. Product Management

### AC 2.1: View Product List
**Given**: User login sebagai admin/cashier  
**When**: User klik menu "Produk"  
**Then**:
- ✅ Tampil list 3 produk seed data:
  - Nasi Goreng (111111) - Rp 15.000 - Stok: 20
  - Es Teh (222222) - Rp 5.000 - Stok: 50
  - Roti Bakar (333333) - Rp 12.000 - Stok: 15
- ✅ Table menampilkan kolom: Name, SKU, Barcode, Category, Price, Stock, Actions
- ✅ Button "Tambah Produk" visible
- ✅ Search box visible

---

### AC 2.2: Create New Product
**Given**: User berada di halaman Product List  
**When**: User klik "Tambah Produk" dan isi form:
- Name: "Kopi Hitam"
- SKU: "DRINK-003"
- Barcode: "444444"
- Category: "Minuman"
- Cost: 3000
- Price: 8000
- Stock: 30
- Low Stock Threshold: 10

**Then**:
- ✅ Form tersimpan
- ✅ Kembali ke product list
- ✅ Produk baru muncul di list
- ✅ Data tersimpan di IndexedDB (F12 > Application > IndexedDB > products)
- ✅ Search "Kopi" menampilkan produk baru

**Test Steps**:
1. Klik "Tambah Produk"
2. Isi semua field
3. Klik "Simpan"
4. Verify produk muncul di list

---

### AC 2.3: Edit Existing Product
**Given**: Produk "Nasi Goreng" ada di list  
**When**: User klik "Edit" pada produk dan ubah:
- Stock dari 20 menjadi 25
- Price dari 15000 menjadi 17000

**Then**:
- ✅ Perubahan tersimpan
- ✅ Stock berubah menjadi 25
- ✅ Price berubah menjadi Rp 17.000
- ✅ Data ter-update di IndexedDB

---

### AC 2.4: Delete Product
**Given**: Produk "Kopi Hitam" ada di list  
**When**: User klik "Hapus" dan confirm  
**Then**:
- ✅ Confirmation dialog muncul
- ✅ Produk terhapus dari list
- ✅ Produk terhapus dari IndexedDB

---

### AC 2.5: Search Products
**Given**: Ada 4 produk di list  
**When**: User ketik "Nasi" di search box  
**Then**:
- ✅ Hanya "Nasi Goreng" yang tampil
- ✅ Produk lain hidden
- ✅ Clear search menampilkan semua produk

---

## 3. POS / Checkout

### AC 3.1: Add Product to Cart via Barcode
**Given**: User di halaman POS  
**When**: User input barcode "111111" dan klik "Scan"  
**Then**:
- ✅ Produk "Nasi Goreng" masuk ke cart
- ✅ Quantity = 1
- ✅ Price = Rp 15.000
- ✅ Total = Rp 15.000
- ✅ Subtotal section ter-update

**Test Steps**:
1. Klik menu "Kasir"
2. Input "111111" di barcode field
3. Klik "Scan" atau Enter
4. Verify produk di cart

---

### AC 3.2: Add Product via Click
**Given**: User di halaman POS  
**When**: User klik card produk "Es Teh"  
**Then**:
- ✅ Produk masuk ke cart
- ✅ Jika sudah ada, quantity bertambah 1

---

### AC 3.3: Update Cart Item Quantity
**Given**: "Nasi Goreng" ada di cart dengan qty 1  
**When**: User klik tombol "+" dua kali  
**Then**:
- ✅ Quantity berubah menjadi 3
- ✅ Total item = 3 × Rp 15.000 = Rp 45.000
- ✅ Subtotal ter-update

**When**: User klik tombol "-"  
**Then**:
- ✅ Quantity berkurang menjadi 2
- ✅ Minimum quantity = 1 (tidak bisa kurang)

---

### AC 3.4: Apply Item Discount
**Given**: "Nasi Goreng" qty 2 ada di cart  
**When**: User input diskon item = 5000  
**Then**:
- ✅ Total item = (2 × 15000) - 5000 = Rp 25.000
- ✅ Subtotal ter-update

---

### AC 3.5: Apply Transaction Discount
**Given**: Cart dengan subtotal Rp 50.000  
**When**: User input diskon transaksi = 10000  
**Then**:
- ✅ Subtotal = Rp 50.000
- ✅ Diskon = Rp 10.000
- ✅ Setelah diskon = Rp 40.000
- ✅ Pajak (10%) = Rp 4.000
- ✅ Total = Rp 44.000

---

### AC 3.6: Remove Item from Cart
**Given**: Ada item di cart  
**When**: User klik tombol "×" (remove)  
**Then**:
- ✅ Item terhapus dari cart
- ✅ Subtotal ter-update
- ✅ Jika cart kosong, tampil "Keranjang Kosong"

---

### AC 3.7: Select Customer
**Given**: User di halaman POS  
**When**: User pilih customer dari dropdown  
**Then**:
- ✅ Customer terpilih
- ✅ Customer akan tercatat di transaksi
- ✅ Jika tidak pilih, default = "Tamu"

---

### AC 3.8: Checkout with Cash Payment
**Given**: Cart ada item dengan total Rp 35.000  
**When**: User:
1. Pilih payment method "Tunai"
2. Input jumlah dibayar = 50000
3. Klik "Checkout"

**Then**:
- ✅ Tampil kembali = Rp 15.000
- ✅ Receipt popup muncul
- ✅ Receipt menampilkan:
  - Nama toko, alamat, telp
  - Tanggal & waktu transaksi
  - Nama kasir
  - List items dengan qty & harga
  - Subtotal, diskon, pajak, total
  - Dibayar & kembali
  - Footer toko
- ✅ Transaksi tersimpan di IndexedDB (sales)
- ✅ Stock produk berkurang
- ✅ Cart ter-reset

---

### AC 3.9: Checkout with Card Payment
**Given**: Cart ada item  
**When**: User pilih "Kartu" dan checkout  
**Then**:
- ✅ Tidak perlu input jumlah dibayar
- ✅ Paid amount = total
- ✅ Change amount = 0
- ✅ Receipt muncul

---

### AC 3.10: Print Receipt
**Given**: Receipt popup terbuka  
**When**: User klik "Cetak"  
**Then**:
- ✅ Print dialog browser muncul
- ✅ Receipt format print-friendly (tanpa button, background bersih)
- ✅ Semua data tercetak dengan rapi

---

### AC 3.11: Cancel Transaction
**Given**: Cart ada item  
**When**: User klik "Batal" dan confirm  
**Then**:
- ✅ Confirmation muncul
- ✅ Cart ter-reset
- ✅ Diskon ter-reset
- ✅ Customer ter-reset

---

## 4. Offline Mode & Synchronization

### AC 4.1: App Works Offline
**Given**: App running dan user sudah login  
**When**: 
1. Buka DevTools (F12)
2. Network tab > Check "Offline"
3. Refresh page

**Then**:
- ✅ App tetap load dan berfungsi
- ✅ Status badge "Offline" muncul di header
- ✅ Semua data dari IndexedDB tetap accessible
- ✅ Navigation tetap berfungsi

---

### AC 4.2: Create Transaction Offline
**Given**: App dalam mode offline  
**When**: User buat transaksi seperti biasa dan checkout  
**Then**:
- ✅ Transaksi berhasil
- ✅ Data tersimpan di IndexedDB (sales)
- ✅ Item masuk ke queue (IndexedDB > queue)
- ✅ Stock berkurang di local
- ✅ Badge menampilkan "X queued" di header

**Test Steps**:
1. Set offline via DevTools
2. Buat transaksi
3. Checkout
4. Check IndexedDB > queue

---

### AC 4.3: Auto Sync When Back Online
**Given**: Ada item di queue  
**When**: User kembali online (uncheck "Offline")  
**Then**:
- ✅ Status badge berubah menjadi "Online"
- ✅ Auto sync triggered (dalam 5 detik)
- ✅ Queue items dikirim ke server (check console log)
- ✅ Queue cleared setelah sync berhasil
- ✅ Badge "X queued" hilang

---

### AC 4.4: Manual Sync
**Given**: User di halaman Settings  
**When**: User klik "Sinkronkan Sekarang"  
**Then**:
- ✅ Button disabled & text "Menyinkronkan..."
- ✅ Queue items processed
- ✅ Last sync time ter-update
- ✅ Button enabled kembali

---

### AC 4.5: Queue Monitoring
**Given**: Ada item di queue  
**When**: User buka Settings  
**Then**:
- ✅ Menampilkan jumlah item dalam antrian
- ✅ Table menampilkan list queue items dengan:
  - Tipe (sale, product, customer, inventory)
  - Timestamp
  - Retry count

---

## 5. Customer Management

### AC 5.1: View Customer List
**Given**: User login  
**When**: User klik menu "Pelanggan"  
**Then**:
- ✅ Tampil list customers (awalnya kosong atau data seed)
- ✅ Button "Tambah Pelanggan" visible
- ✅ Search box visible

---

### AC 5.2: Create New Customer
**Given**: User di halaman Customer List  
**When**: User klik "Tambah Pelanggan" dan isi:
- Name: "Budi Santoso"
- Phone: "08123456789"
- Email: "budi@email.com"
- Notes: "Pelanggan setia"

**Then**:
- ✅ Customer tersimpan
- ✅ Muncul di list
- ✅ Tersimpan di IndexedDB (customers)

---

### AC 5.3: Edit Customer
**Given**: Customer "Budi Santoso" ada  
**When**: User edit dan ubah phone ke "08198765432"  
**Then**:
- ✅ Perubahan tersimpan
- ✅ Phone ter-update di list

---

### AC 5.4: Delete Customer
**Given**: Customer ada di list  
**When**: User klik "Hapus" dan confirm  
**Then**:
- ✅ Customer terhapus
- ✅ Terhapus dari IndexedDB

---

### AC 5.5: Search Customer
**Given**: Ada beberapa customer  
**When**: User search by name/phone  
**Then**:
- ✅ Filter bekerja
- ✅ Hanya matching customer yang tampil

---

## 6. Inventory Management

### AC 6.1: Stock In
**Given**: User di halaman Inventory  
**When**: User:
1. Pilih produk "Nasi Goreng" (stock awal 20)
2. Pilih tipe "Stok Masuk"
3. Input quantity: 10
4. Input reason: "Restock dari supplier"
5. Klik Simpan

**Then**:
- ✅ Adjustment tersimpan
- ✅ Stock "Nasi Goreng" bertambah menjadi 30
- ✅ History adjustment muncul di table
- ✅ Tersimpan di IndexedDB (inventoryAdjustments)

---

### AC 6.2: Stock Out
**Given**: Produk stock = 30  
**When**: User stock out 5  
**Then**:
- ✅ Stock berkurang menjadi 25
- ✅ History tercatat

---

### AC 6.3: View Adjustment History
**Given**: Ada beberapa adjustment  
**When**: User scroll history table  
**Then**:
- ✅ Tampil semua adjustment
- ✅ Sorted by date (newest first)
- ✅ Menampilkan:
  - Date & time
  - Product name
  - Type (in/out)
  - Quantity
  - Previous stock
  - New stock
  - Reason

---

## 7. Reports & Analytics

### AC 7.1: Daily Report
**Given**: Ada transaksi hari ini  
**When**: User:
1. Buka halaman Reports
2. Set start date = today
3. Set end date = today
4. Klik "Generate"

**Then**:
- ✅ Tampil summary cards:
  - Total Penjualan (total rupiah)
  - Total Transaksi (count)
  - Rata-rata Transaksi
- ✅ Tampil Top Products table
- ✅ Data sesuai dengan transaksi yang dibuat

---

### AC 7.2: Period Report
**Given**: Ada transaksi dalam beberapa hari  
**When**: User set date range (e.g., 7 hari terakhir)  
**Then**:
- ✅ Report menampilkan aggregate semua transaksi
- ✅ Top products berdasarkan total revenue

---

### AC 7.3: Export to CSV
**Given**: Report sudah di-generate  
**When**: User klik "Export CSV"  
**Then**:
- ✅ File CSV ter-download
- ✅ File name: `laporan-YYYY-MM-DD-YYYY-MM-DD.csv`
- ✅ CSV contains:
  - Report summary
  - Top products list
  - Properly formatted

---

## 8. Settings & Configuration

### AC 8.1: Update Store Settings
**Given**: User di halaman Settings  
**When**: User update:
- Nama Toko: "Warung Makan Sederhana"
- Alamat: "Jl. Mangga No. 45"
- Telp: "021-98765432"
- Pajak: 11

**Then**:
- ✅ Settings tersimpan
- ✅ Tersimpan di IndexedDB (settings)
- ✅ Alert "Pengaturan berhasil disimpan!"

---

### AC 8.2: Settings Applied to Receipt
**Given**: Settings sudah di-update  
**When**: User buat transaksi dan lihat receipt  
**Then**:
- ✅ Receipt menampilkan nama toko baru
- ✅ Alamat dan telp baru
- ✅ Tax calculation menggunakan rate baru (11%)
- ✅ Footer sesuai pengaturan

---

### AC 8.3: Currency Setting
**Given**: User di Settings  
**When**: User ubah currency dari IDR ke USD  
**Then**:
- ✅ Semua tampilan harga berubah format
- ✅ Format: $X,XXX.XX (USD) atau Rp XX.XXX (IDR)

---

## 9. User Experience & UI

### AC 9.1: Responsive Design
**Given**: App running  
**When**: User resize browser window atau buka di mobile  
**Then**:
- ✅ Layout adjust sesuai screen size
- ✅ Navigation collapse jadi icons di mobile
- ✅ Tables scrollable horizontal di mobile
- ✅ Forms tetap usable
- ✅ Buttons accessible

---

### AC 9.2: Loading States
**Given**: User melakukan action  
**When**: Ada proses async (save, sync, etc.)  
**Then**:
- ✅ Button disabled
- ✅ Text berubah (e.g., "Menyimpan...")
- ✅ User tidak bisa double-submit

---

### AC 9.3: Error Handling
**Given**: Terjadi error (e.g., validation, network)  
**When**: Error occurs  
**Then**:
- ✅ Error message user-friendly
- ✅ No crash/white screen
- ✅ Console log error details

---

## 10. Security & Validation

### AC 10.1: Form Validation
**Given**: User isi form  
**When**: Required field kosong  
**Then**:
- ✅ Form tidak bisa submit
- ✅ Browser validation message muncul
- ✅ Field marked as required (*)

---

### AC 10.2: Role-Based Access
**Given**: User login sebagai cashier  
**When**: User coba access admin-only features  
**Then**:
- ✅ Menu admin tidak visible
- ✅ Direct URL access (if any) blocked

---

### AC 10.3: Token Expiry Handling
**Given**: Token expired atau invalid  
**When**: User coba action yang butuh auth  
**Then**:
- ✅ Redirect ke login
- ✅ Session cleared

---

## ✅ Test Summary Checklist

Copy checklist ini untuk manual testing:

### Authentication
- [ ] AC 1.1: Login Admin
- [ ] AC 1.2: Login Cashier
- [ ] AC 1.3: Login Failed
- [ ] AC 1.4: Logout

### Products
- [ ] AC 2.1: View Products
- [ ] AC 2.2: Create Product
- [ ] AC 2.3: Edit Product
- [ ] AC 2.4: Delete Product
- [ ] AC 2.5: Search Products

### POS
- [ ] AC 3.1: Add via Barcode
- [ ] AC 3.2: Add via Click
- [ ] AC 3.3: Update Quantity
- [ ] AC 3.4: Item Discount
- [ ] AC 3.5: Transaction Discount
- [ ] AC 3.6: Remove Item
- [ ] AC 3.7: Select Customer
- [ ] AC 3.8: Cash Checkout
- [ ] AC 3.9: Card Checkout
- [ ] AC 3.10: Print Receipt
- [ ] AC 3.11: Cancel Transaction

### Offline
- [ ] AC 4.1: Works Offline
- [ ] AC 4.2: Transaction Offline
- [ ] AC 4.3: Auto Sync
- [ ] AC 4.4: Manual Sync
- [ ] AC 4.5: Queue Monitoring

### Customers
- [ ] AC 5.1: View Customers
- [ ] AC 5.2: Create Customer
- [ ] AC 5.3: Edit Customer
- [ ] AC 5.4: Delete Customer
- [ ] AC 5.5: Search Customer

### Inventory
- [ ] AC 6.1: Stock In
- [ ] AC 6.2: Stock Out
- [ ] AC 6.3: View History

### Reports
- [ ] AC 7.1: Daily Report
- [ ] AC 7.2: Period Report
- [ ] AC 7.3: Export CSV

### Settings
- [ ] AC 8.1: Update Settings
- [ ] AC 8.2: Settings in Receipt
- [ ] AC 8.3: Currency Setting

### UX/UI
- [ ] AC 9.1: Responsive Design
- [ ] AC 9.2: Loading States
- [ ] AC 9.3: Error Handling

### Security
- [ ] AC 10.1: Form Validation
- [ ] AC 10.2: Role-Based Access
- [ ] AC 10.3: Token Handling

---

**Total Acceptance Criteria: 45**

Jika semua AC pass, aplikasi siap untuk production! 🎉
