# SomansaPOS - Deployment Guide

Panduan lengkap untuk deploy aplikasi SomansaPOS ke berbagai platform.

## 📋 Pre-Deployment Checklist

- [ ] Update environment variables
- [ ] Test offline functionality
- [ ] Run production build locally
- [ ] Check all features working
- [ ] Review security settings
- [ ] Update API base URL
- [ ] Configure CORS on backend
- [ ] Set up SSL/HTTPS

## 🚀 Deployment Options

### 1. Netlify (Recommended for Frontend)

#### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Via Git

1. Push code ke GitHub/GitLab
2. Connect repo di Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy!

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Vercel

#### Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

#### Via Git

1. Import project di Vercel dashboard
2. Configure build settings
3. Add environment variables
4. Deploy

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Update vite.config.js with base path
# base: '/repo-name/'

# Deploy
npm run deploy
```

### 4. Docker

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }
}
```

**Build & Run**:
```bash
# Build image
docker build -t somansapos .

# Run container
docker run -p 8080:80 somansapos
```

### 5. Traditional Server (VPS/Shared Hosting)

#### Build

```bash
npm run build
```

#### Upload

1. Upload `dist/` folder ke server
2. Configure web server (Apache/Nginx)

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/somansapos;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}
```

## 🔧 Environment Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Staging
```env
VITE_API_BASE_URL=https://staging-api.somansapos.com
```

### Production
```env
VITE_API_BASE_URL=https://api.somansapos.com
```

## 🗄️ Backend Deployment

### Node.js + Express Example

**server.js**:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/reports', require('./routes/reports'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Deploy Backend Options

1. **Heroku**:
   ```bash
   heroku create somansapos-api
   git push heroku main
   ```

2. **Railway**:
   - Connect GitHub repo
   - Set environment variables
   - Deploy automatically

3. **DigitalOcean App Platform**:
   - Create new app
   - Connect repo
   - Configure build & run commands

4. **AWS EC2**:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone & setup
   git clone <repo>
   cd somansapos-backend
   npm install
   
   # Use PM2 for process management
   sudo npm install -g pm2
   pm2 start server.js --name somansapos-api
   pm2 startup
   pm2 save
   ```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

### Cloudflare (Easiest)

1. Add site to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full or Full Strict)
4. Force HTTPS redirect

## 📊 Monitoring & Analytics

### Frontend

1. **Google Analytics**:
   Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   ```

2. **Sentry (Error Tracking)**:
   ```bash
   npm install @sentry/react
   ```

### Backend

1. **PM2 Monitoring**:
   ```bash
   pm2 monit
   pm2 logs somansapos-api
   ```

2. **New Relic / DataDog**:
   - Install agent
   - Configure API keys

## 🔄 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=dist
```

## 🧪 Pre-Deployment Testing

```bash
# Build for production
npm run build

# Serve locally
npm run preview

# Test offline mode
# 1. Open DevTools
# 2. Go to Network tab
# 3. Check "Offline"
# 4. Test all features

# Check bundle size
npm run build -- --stats
```

## 📈 Performance Optimization

1. **Code Splitting**: Already done by Vite
2. **Lazy Loading**: Implement for routes
3. **Image Optimization**: Use WebP format
4. **Caching**: Service Worker already configured
5. **CDN**: Use Cloudflare or similar
6. **Compression**: Enable Gzip/Brotli

## 🔐 Security Hardening

### Frontend

```javascript
// Add Content Security Policy
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### Backend

```javascript
// Use helmet.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Service Worker Issues

```bash
# Clear service workers in browser
# Chrome DevTools > Application > Service Workers > Unregister

# Check console for SW errors
# Update sw.js if needed
```

### CORS Errors

```javascript
// Backend: Update CORS config
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

## 📞 Support

Untuk bantuan deployment, buka issue di GitHub atau hubungi support.

---

**Happy Deploying! 🚀**
