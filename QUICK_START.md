# 🚀 SomansaPOS - Quick Start Guide

Panduan cepat untuk mulai menggunakan aplikasi dalam 5 menit.

## ⚡ Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:3000

# 4. Login
# Username: admin
# Password: admin123
```

**Done!** Aplikasi siap digunakan.

---

## 📱 First Use - Demo Scenario

### Langkah 1: Login
1. Buka http://localhost:3000
2. Login sebagai **Admin**:
   - Username: `admin`
   - Password: `admin123`

### Langkah 2: Lihat Produk Seed Data
1. Klik menu **Produk**
2. Anda akan melihat 3 produk:
   - Nasi Goreng - Rp 15.000 (Barcode: 111111)
   - Es Teh - Rp 5.000 (Barcode: 222222)
   - Roti Bakar - Rp 12.000 (Barcode: 333333)

### Langkah 3: Buat Transaksi Pertama
1. Klik menu **Kasir** (POS)
2. Cara 1 - Via Barcode:
   - Input `111111` di field barcode
   - Klik "Scan" atau tekan Enter
   - Nasi Goreng masuk ke cart
3. Cara 2 - Via Click:
   - Klik card "Es Teh"
   - Es Teh masuk ke cart
4. Adjust quantity jika perlu (pakai tombol +/-)
5. Pilih payment method: **Tunai**
6. Input jumlah dibayar: `50000`
7. Lihat kembali: Rp 18.000
8. Klik **Checkout**
9. Receipt muncul - bisa di-print!

### Langkah 4: Test Offline Mode
1. Buka DevTools (F12)
2. Network tab → Check **Offline**
3. Refresh page - aplikasi tetap jalan!
4. Buat transaksi lagi
5. Lihat IndexedDB → queue → ada item baru
6. Uncheck **Offline**
7. Item otomatis sync (lihat console log)

### Langkah 5: Lihat Laporan
1. Klik menu **Laporan** (admin only)
2. Generate laporan hari ini
3. Lihat total penjualan & top products
4. Export CSV jika perlu

---

## 👥 User Accounts (Seed Data)

### Admin Account
```
Username: admin
Password: admin123
Access: Full (semua menu)
```

### Cashier Account
```
Username: cashier
Password: cashier
Access: Limited (POS, Products, Customers only)
```

---

## 🎯 Quick Feature Tour

### 1️⃣ POS (Kasir)
**Lokasi**: Menu "Kasir"  
**Fitur**:
- Scan barcode atau klik produk
- Adjust quantity & discount
- Multiple payment methods
- Print receipt
- Customer selection

**Quick Test**:
```
Barcode: 111111 → Add Nasi Goreng
Barcode: 222222 → Add Es Teh
Qty Nasi Goreng → 2
Payment: Tunai → 50000
Checkout → Print!
```

### 2️⃣ Products
**Lokasi**: Menu "Produk"  
**Fitur**:
- CRUD produk
- Search & filter
- Low stock alert

**Quick Test**:
```
Tambah Produk:
- Name: Kopi Hitam
- Barcode: 444444
- Price: 8000
- Stock: 30
Save → Check list
```

### 3️⃣ Customers
**Lokasi**: Menu "Pelanggan"  
**Fitur**:
- CRUD customer
- Search by name/phone

**Quick Test**:
```
Tambah Pelanggan:
- Name: Budi Santoso
- Phone: 08123456789
Save → Use in POS
```

### 4️⃣ Inventory (Admin Only)
**Lokasi**: Menu "Inventaris"  
**Fitur**:
- Stock adjustment (in/out)
- History tracking

**Quick Test**:
```
Stock In:
- Product: Nasi Goreng
- Quantity: 10
- Reason: Restock
Save → Check stock increase
```

### 5️⃣ Reports (Admin Only)
**Lokasi**: Menu "Laporan"  
**Fitur**:
- Daily/period reports
- Top products
- Export CSV

**Quick Test**:
```
Set date: Today → Today
Generate → See totals
Export CSV → Download
```

### 6️⃣ Settings (Admin Only)
**Lokasi**: Menu "Pengaturan"  
**Fitur**:
- Store info
- Tax rate
- Manual sync

**Quick Test**:
```
Update:
- Store Name: My Store
- Tax Rate: 11
Save → Check receipt
```

---

## 🧪 Testing Checklist

### ✅ Basic Functionality
- [ ] Login works (admin & cashier)
- [ ] Can add product to cart
- [ ] Can checkout & see receipt
- [ ] Receipt can be printed
- [ ] Stock decreases after sale

### ✅ Offline Mode
- [ ] App works offline
- [ ] Can create transaction offline
- [ ] Transaction goes to queue
- [ ] Auto-sync when back online
- [ ] Queue clears after sync

### ✅ CRUD Operations
- [ ] Can create product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Same for customers

### ✅ Reports
- [ ] Report shows correct data
- [ ] CSV export works
- [ ] Date filter works

### ✅ Role-Based Access
- [ ] Admin sees all menus
- [ ] Cashier sees limited menus
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**:
```bash
# Change port in vite.config.js
server: { port: 3001 }
```

### Issue: npm install errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Service Worker not working
**Solution**:
```bash
# Clear browser cache
# DevTools > Application > Clear Storage
# Or use incognito mode
```

### Issue: IndexedDB errors
**Solution**:
```bash
# Clear IndexedDB
# DevTools > Application > IndexedDB > Delete
# Refresh page (will re-seed data)
```

### Issue: Offline mode not working
**Solution**:
```bash
# Make sure you're running from localhost (not file://)
# Service Worker only works on localhost or HTTPS
```

---

## 📖 Next Steps

After quick start, explore:

1. **Deep Dive**: Read [README.md](README.md) for complete documentation
2. **API Backend**: Check [API_CONTRACTS.md](API_CONTRACTS.md) to build backend
3. **Deployment**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy
4. **Testing**: Use [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) for thorough testing
5. **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

---

## 🎓 Learning Path

### Beginner
1. Follow this quick start
2. Try all features manually
3. Test offline mode
4. View reports

### Intermediate
1. Read full README
2. Check IndexedDB structure (DevTools)
3. Understand sync mechanism
4. Modify a component (e.g., add field to product)

### Advanced
1. Study codebase structure
2. Implement custom features
3. Build backend API
4. Deploy to production
5. Add new modules

---

## 💡 Pro Tips

### Tip 1: Keyboard Shortcuts
- In barcode field, press **Enter** to scan
- In any form, **Tab** to navigate fields
- **Ctrl+P** in receipt to print

### Tip 2: DevTools is Your Friend
- **F12** to open DevTools
- **Application tab** to see:
  - IndexedDB (all data)
  - Service Workers
  - Local Storage (tokens)
- **Network tab** for offline simulation
- **Console** for error debugging

### Tip 3: Data Reset
To reset to initial seed data:
```javascript
// In browser console:
indexedDB.deleteDatabase('SomansaPOS');
location.reload();
```

### Tip 4: Mock Multiple Transactions
```javascript
// Run in console after login:
for(let i = 0; i < 10; i++) {
  // Create 10 sample transactions
  // (or use the app normally)
}
```

### Tip 5: Quick Product Search
In POS screen, search box accepts:
- Product name (partial match)
- Barcode (exact match)
- Category (if you group products)

---

## 🎬 Video Walkthrough (Imaginary)

*Jika ada video tutorial, letakkan link di sini*

1. Introduction & Setup (0:00-2:00)
2. First Transaction (2:00-5:00)
3. Offline Mode Demo (5:00-8:00)
4. Product Management (8:00-11:00)
5. Reports & Export (11:00-14:00)
6. Settings & Sync (14:00-17:00)

---

## 🆘 Need Help?

- **Documentation**: Check [README.md](README.md)
- **API Questions**: See [API_CONTRACTS.md](API_CONTRACTS.md)
- **Issues**: Open GitHub issue
- **Discussions**: GitHub Discussions tab

---

## ✨ That's It!

You're now ready to use SomansaPOS!

**Enjoy your Point of Sale system! 🎉**

---

**Built with ❤️ using React + Vite**  
**MIT License - Free to use & modify**
