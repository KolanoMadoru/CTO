# Deployment SomansaPOS ke Netlify

Panduan lengkap untuk deploy aplikasi SomansaPOS ke Netlify.

## 🚀 Quick Deploy

### Opsi 1: Deploy via Git (Recommended)

1. **Push code ke GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Setup Netlify deployment"
   git push origin main
   ```

2. **Connect ke Netlify**
   - Buka [Netlify Dashboard](https://app.netlify.com/)
   - Klik "Add new site" → "Import an existing project"
   - Pilih Git provider (GitHub/GitLab/Bitbucket)
   - Pilih repository SomansaPOS
   - Netlify akan otomatis detect konfigurasi dari `netlify.toml`

3. **Configure Build Settings** (sudah auto-detect dari netlify.toml)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Environment Variables** (Optional)
   - Klik "Site settings" → "Environment variables"
   - Tambahkan:
     ```
     VITE_API_BASE_URL=https://your-api-url.com
     VITE_APP_NAME=SomansaPOS
     VITE_APP_VERSION=1.0.0
     ```

5. **Deploy!**
   - Klik "Deploy site"
   - Tunggu proses build selesai (~2-3 menit)
   - Site akan tersedia di: `https://random-name.netlify.app`

### Opsi 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login ke Netlify**
   ```bash
   netlify login
   ```

3. **Build Project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   # Deploy ke draft URL (untuk testing)
   netlify deploy
   
   # Deploy ke production
   netlify deploy --prod
   ```

### Opsi 3: Drag & Drop

1. Build project lokal:
   ```bash
   npm run build
   ```

2. Buka [Netlify Drop](https://app.netlify.com/drop)

3. Drag folder `dist/` ke area drop

4. Selesai! Site akan live dalam beberapa detik

## 🔧 Konfigurasi yang Sudah Disiapkan

### netlify.toml
File konfigurasi utama yang berisi:
- **Build settings**: Command dan directory
- **Redirects**: SPA routing (semua route ke index.html)
- **Headers**: Security headers dan cache control
  - Service Worker: No cache
  - Static assets: Cache 1 tahun
  - Security headers: XSS protection, frame options, dll

### public/_redirects
Backup redirect rules untuk memastikan SPA routing bekerja.

## 🌐 Custom Domain

1. **Tambah Domain**
   - Site settings → Domain management
   - Klik "Add custom domain"
   - Masukkan domain Anda (contoh: `pos.somansa.com`)

2. **Configure DNS**
   
   **Opsi A - Netlify DNS (Recommended)**:
   - Update nameservers domain ke Netlify
   - Netlify akan handle semua DNS records
   
   **Opsi B - External DNS**:
   - Tambah A record: `104.198.14.52`
   - Atau CNAME record: `your-site.netlify.app`

3. **SSL Certificate**
   - Otomatis di-provision oleh Netlify (Let's Encrypt)
   - Gratis dan auto-renew
   - HTTPS tersedia dalam beberapa menit

## 🔄 Continuous Deployment

Setelah setup awal, setiap push ke branch `main` akan otomatis:
1. Trigger build di Netlify
2. Run tests (jika ada)
3. Build production
4. Deploy ke production URL

### Deploy Preview
- Setiap Pull Request mendapat preview URL unik
- Berguna untuk review sebelum merge
- Format: `deploy-preview-{PR#}--{site-name}.netlify.app`

### Branch Deploys
Configure branch deploys di:
- Site settings → Build & deploy → Deploy contexts
- Deploy branch tertentu (staging, dev, dll)

## 📊 Features Netlify yang Dimanfaatkan

### ✅ Sudah Dikonfigurasi
- [x] SPA routing dengan redirects
- [x] Cache optimization untuk assets
- [x] Service Worker handling
- [x] Security headers
- [x] Auto SSL/HTTPS
- [x] CDN global
- [x] Continuous deployment

### 🎯 Fitur Tambahan (Optional)

**Split Testing**:
```toml
[[redirects]]
  from = "/*"
  to = "/version-a/:splat"
  status = 200
  conditions = {Cookie = ["ab_test=a"]}
```

**Form Handling**:
```html
<form name="contact" netlify>
  <input type="text" name="name" />
  <button type="submit">Send</button>
</form>
```

**Functions (Serverless)**:
- Buat folder `netlify/functions/`
- Deploy serverless functions untuk backend logic

## 🔐 Environment Variables

### Development (Local)
Buat file `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production (Netlify)
Set di Netlify dashboard atau via CLI:
```bash
netlify env:set VITE_API_BASE_URL "https://api.production.com"
```

### Staging
Set deploy context di netlify.toml:
```toml
[context.staging.environment]
  VITE_API_BASE_URL = "https://api.staging.com"
```

## 🧪 Testing Before Deploy

```bash
# Build production locally
npm run build

# Test production build
npm run preview

# Open browser and test:
# - All routes work
# - Offline mode works
# - Service worker registers
# - No console errors
```

## 📈 Monitoring & Analytics

### Netlify Analytics (Paid)
- Real user monitoring
- Pageviews, bandwidth
- Top pages, sources

### Alternative: Google Analytics
Tambahkan di `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🚨 Troubleshooting

### Build Fails

**Error: Node version mismatch**
- Solution: Check netlify.toml has `NODE_VERSION = "18"`

**Error: Command not found**
- Solution: Pastikan `package.json` memiliki script `build`

**Error: Out of memory**
- Solution: Tambah di netlify.toml:
  ```toml
  [build.environment]
    NODE_OPTIONS = "--max-old-space-size=4096"
  ```

### Routes Not Working (404)

- Check `netlify.toml` redirects
- Check `public/_redirects` exists
- Clear deploy cache: Site settings → Build & deploy → Clear cache

### Service Worker Issues

- Check headers configuration untuk `/sw.js`
- Clear browser cache
- Update cache version di `sw.js`

### Offline Mode Not Working

- Check service worker registration
- Check HTTPS enabled (SW requires HTTPS)
- Check browser console for errors

## 💰 Pricing

### Free Tier (Starter)
- 100 GB bandwidth/month
- 300 build minutes/month
- 1 concurrent build
- HTTPS included
- **Cukup untuk kebanyakan aplikasi POS**

### Pro Tier ($19/month)
- 400 GB bandwidth/month
- 1000 build minutes/month
- 3 concurrent builds
- Priority support

## 📱 Progressive Web App (PWA)

Untuk install sebagai PWA:

1. **Add manifest.json**:
```json
{
  "name": "SomansaPOS",
  "short_name": "POS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Link di index.html**:
```html
<link rel="manifest" href="/manifest.json">
```

## 🎉 Success Checklist

- [ ] Site successfully deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All routes working
- [ ] Service worker registers
- [ ] Offline mode works
- [ ] No console errors
- [ ] Performance score > 90 (Lighthouse)
- [ ] Mobile responsive
- [ ] Print receipt works

## 📞 Support

- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

---

**Selamat! Aplikasi SomansaPOS sudah live di Netlify! 🎊**

URL Site: `https://your-site-name.netlify.app`
