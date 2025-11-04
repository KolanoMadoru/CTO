# 🔧 SomansaPOS - Troubleshooting Guide

Panduan lengkap mengatasi masalah umum pada aplikasi SomansaPOS.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Runtime Errors](#runtime-errors)
3. [Service Worker Issues](#service-worker-issues)
4. [IndexedDB Issues](#indexeddb-issues)
5. [Offline/Sync Issues](#offlinesynch-issues)
6. [Build & Deployment Issues](#build--deployment-issues)
7. [Performance Issues](#performance-issues)
8. [Browser Compatibility](#browser-compatibility)

---

## Installation Issues

### Problem: `npm install` fails

**Symptoms**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Clear cache and retry**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps** (if peer dependency conflict):
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update npm**:
   ```bash
   npm install -g npm@latest
   npm install
   ```

4. **Check Node version** (should be 18+):
   ```bash
   node --version  # Should be v18.x or higher
   ```

### Problem: Port 3000 already in use

**Symptoms**:
```
Port 3000 is in use
```

**Solutions**:

1. **Use different port**:
   ```bash
   npm run dev -- --port 3001
   ```

2. **Or edit `vite.config.js`**:
   ```javascript
   server: {
     port: 3001,
   }
   ```

3. **Kill process on port 3000** (macOS/Linux):
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

   Windows:
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID [PID_NUMBER] /F
   ```

---

## Runtime Errors

### Problem: White screen / Nothing renders

**Symptoms**:
- Browser shows blank white screen
- Console shows errors

**Debugging Steps**:

1. **Check browser console** (F12):
   - Look for error messages
   - Note the file and line number

2. **Common causes**:
   - Syntax error in JSX
   - Missing import
   - Undefined variable

3. **Quick fix**:
   ```bash
   # Restart dev server
   Ctrl+C
   npm run dev
   ```

### Problem: "Cannot read property of undefined"

**Symptoms**:
```
TypeError: Cannot read property 'xxx' of undefined
```

**Solutions**:

1. **Add optional chaining**:
   ```javascript
   // ❌ Bad
   const name = user.name;
   
   // ✅ Good
   const name = user?.name;
   ```

2. **Add default values**:
   ```javascript
   const { user = {} } = useAuth();
   ```

3. **Add null checks**:
   ```javascript
   if (!user) return <Loading />;
   return <div>{user.name}</div>;
   ```

### Problem: "Module not found"

**Symptoms**:
```
Error: Cannot find module './Component'
```

**Solutions**:

1. **Check file path** (case-sensitive!):
   ```javascript
   // ❌ Wrong case
   import Login from './components/auth/Login';
   
   // ✅ Correct case
   import Login from './components/Auth/Login';
   ```

2. **Check file extension**:
   ```javascript
   // Make sure file is .jsx not .js
   import Login from './Login.jsx'; // or
   import Login from './Login';     // Vite auto-resolves
   ```

3. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## Service Worker Issues

### Problem: Service Worker not registering

**Symptoms**:
- Offline mode not working
- Console: "Service Worker registration failed"

**Solutions**:

1. **Check browser support**:
   ```javascript
   // In console:
   'serviceWorker' in navigator  // Should return true
   ```

2. **Use HTTPS or localhost**:
   - Service Workers only work on:
     - `localhost`
     - `127.0.0.1`
     - HTTPS domains
   - NOT on `file://` or non-secure HTTP

3. **Check sw.js path**:
   - File should be at `/public/sw.js`
   - Accessible at `http://localhost:3000/sw.js`

4. **Clear and re-register**:
   ```javascript
   // In browser console:
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister());
   });
   location.reload();
   ```

### Problem: Old Service Worker cached

**Symptoms**:
- Changes not reflecting
- Old version still running

**Solutions**:

1. **Hard refresh**:
   - Chrome: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5`

2. **Unregister via DevTools**:
   - F12 → Application → Service Workers
   - Click "Unregister"
   - Refresh page

3. **Clear storage**:
   - F12 → Application → Clear Storage
   - Check all boxes
   - Click "Clear site data"

4. **Use incognito mode** for testing:
   - `Ctrl+Shift+N` (Chrome)
   - Fresh environment each time

---

## IndexedDB Issues

### Problem: Data not persisting

**Symptoms**:
- Login data lost on refresh
- Products disappear

**Solutions**:

1. **Check if IndexedDB is enabled**:
   ```javascript
   // In console:
   window.indexedDB  // Should exist
   ```

2. **Check browser storage settings**:
   - Chrome: Settings → Privacy → Cookies
   - Allow "All cookies and site data"

3. **Check incognito mode**:
   - IndexedDB might not persist in incognito
   - Use normal browsing mode

4. **Clear and re-initialize**:
   ```javascript
   // In console:
   indexedDB.deleteDatabase('SomansaPOS');
   location.reload();  // Will re-seed data
   ```

### Problem: "QuotaExceededError"

**Symptoms**:
```
DOMException: QuotaExceededError
```

**Solutions**:

1. **Clear old data**:
   - F12 → Application → IndexedDB
   - Right-click → Delete database

2. **Check available storage**:
   ```javascript
   // In console:
   navigator.storage.estimate().then(estimate => {
     console.log(`Used: ${estimate.usage} bytes`);
     console.log(`Quota: ${estimate.quota} bytes`);
   });
   ```

3. **Increase browser storage limit**:
   - Usually not needed (default is 50-100MB)
   - Consider implementing data cleanup

### Problem: Seed data not loading

**Symptoms**:
- No products on first load
- Users not available

**Solutions**:

1. **Check console for errors**:
   - Look for IndexedDB errors
   - Check network tab for blocks

2. **Manual seed**:
   ```javascript
   // In console after opening app:
   import { seedData } from './src/utils/seedData';
   seedData();
   ```

3. **Verify database creation**:
   - F12 → Application → IndexedDB
   - Should see "SomansaPOS" database
   - Should have stores: products, users, customers, etc.

---

## Offline/Sync Issues

### Problem: Offline mode not working

**Symptoms**:
- Error when going offline
- "Offline" badge not showing

**Solutions**:

1. **Check network status detection**:
   ```javascript
   // In console:
   navigator.onLine  // Should return true/false
   ```

2. **Verify Service Worker active**:
   - F12 → Application → Service Workers
   - Should show "activated and is running"

3. **Test manually**:
   ```javascript
   // In console:
   window.dispatchEvent(new Event('offline'));
   // Check if badge appears
   ```

### Problem: Sync not triggering

**Symptoms**:
- Queue items not syncing
- "Last synced" never updates

**Solutions**:

1. **Check queue items**:
   ```javascript
   // In console:
   import { queueDB } from './src/utils/indexedDB';
   queueDB.getAll().then(items => console.log(items));
   ```

2. **Trigger manual sync**:
   - Go to Settings
   - Click "Sinkronkan Sekarang"
   - Check console for errors

3. **Check API configuration**:
   ```javascript
   // In src/api/config.js
   console.log(API_BASE_URL);  // Should be valid URL
   ```

4. **Verify backend is running** (if using real backend):
   ```bash
   curl http://localhost:5000/api/products
   ```

### Problem: Sync retries exhausted

**Symptoms**:
- Queue items stuck
- Console: "Max retries reached"

**Solutions**:

1. **Check backend errors**:
   - Look at backend logs
   - Verify endpoint exists
   - Check authentication

2. **Clear failed items**:
   ```javascript
   // In console:
   import { queueDB } from './src/utils/indexedDB';
   queueDB.clear();
   ```

3. **Fix and retry**:
   - Fix the backend issue
   - Manually re-create transaction

---

## Build & Deployment Issues

### Problem: Build fails

**Symptoms**:
```
npm run build
ERROR: ...
```

**Solutions**:

1. **Check for TypeScript errors** (if using TS):
   ```bash
   npm run type-check
   ```

2. **Check for linting errors**:
   ```bash
   npm run lint
   ```

3. **Clean and rebuild**:
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build
   ```

4. **Check environment variables**:
   - Create `.env` file
   - Add required variables
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

### Problem: Production build too large

**Symptoms**:
```
dist/assets/index-xxx.js: 500+ KB
```

**Solutions**:

1. **Analyze bundle**:
   ```bash
   npm run build -- --stats
   ```

2. **Code splitting** (already done by Vite):
   - Vite automatically splits code
   - Check if lazy loading is implemented

3. **Remove unused dependencies**:
   ```bash
   npm uninstall [unused-package]
   ```

4. **Enable compression** (on server):
   - Enable Gzip/Brotli on Nginx/Apache
   - Reduces size by ~70%

### Problem: Deployed app shows blank page

**Symptoms**:
- Works locally
- Blank on production

**Solutions**:

1. **Check base path** (if not on root):
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/somansapos/',  // If deployed to subdirectory
   });
   ```

2. **Check console for 404s**:
   - F12 → Console
   - Look for missing asset files

3. **Verify .htaccess / nginx config**:
   - Should redirect all routes to index.html
   - See DEPLOYMENT.md for configs

4. **Check CORS**:
   - If API on different domain
   - Enable CORS on backend

---

## Performance Issues

### Problem: App is slow

**Symptoms**:
- Laggy UI
- Slow rendering

**Solutions**:

1. **Check React DevTools**:
   - Install React DevTools extension
   - Look for unnecessary re-renders

2. **Optimize re-renders**:
   ```javascript
   // Use React.memo for expensive components
   export default React.memo(ExpensiveComponent);
   
   // Use useCallback for functions
   const handleClick = useCallback(() => {
     // ...
   }, [dependencies]);
   ```

3. **Lazy load routes**:
   ```javascript
   const Reports = React.lazy(() => import('./Reports'));
   ```

4. **Check IndexedDB queries**:
   - Use indexes for filtering
   - Limit results if large dataset

### Problem: Large dataset slows down

**Symptoms**:
- Thousands of products/sales
- UI freezes

**Solutions**:

1. **Implement pagination**:
   ```javascript
   const [page, setPage] = useState(1);
   const itemsPerPage = 50;
   const displayedItems = items.slice((page-1)*itemsPerPage, page*itemsPerPage);
   ```

2. **Virtualize long lists**:
   ```bash
   npm install react-window
   ```

3. **Debounce search**:
   ```javascript
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     []
   );
   ```

---

## Browser Compatibility

### Problem: App not working on Safari

**Symptoms**:
- Works on Chrome
- Broken on Safari

**Solutions**:

1. **Check Safari version**:
   - Safari 14+ required
   - Update Safari

2. **Check IndexedDB support**:
   - Older Safari has limited IDB support
   - Test on latest version

3. **Check Service Worker support**:
   - Safari added SW support in v11.1
   - Ensure you're on recent version

### Problem: IE11 not supported

**Info**:
- SomansaPOS uses modern JS (ES6+)
- Vite doesn't support IE11
- Minimum browser requirements:
  - Chrome 87+
  - Firefox 78+
  - Safari 14+
  - Edge 88+

**Solution**:
- Inform users to upgrade browser
- Or use polyfills (not recommended)

---

## General Debugging Tips

### 1. Check Console First
Always check browser console (F12) for errors.

### 2. Use React DevTools
Install React DevTools extension to inspect component state.

### 3. Check Network Tab
See what requests are failing (F12 → Network).

### 4. Test in Incognito
Rules out cache/extension issues.

### 5. Reproduce Bug
Try to reproduce with minimal steps.

### 6. Check GitHub Issues
Someone might have had same problem.

---

## Still Having Issues?

### Before Asking for Help:

1. ✅ Checked console for errors
2. ✅ Searched this troubleshooting guide
3. ✅ Searched GitHub issues
4. ✅ Tried clearing cache/storage
5. ✅ Tried incognito mode
6. ✅ Checked browser version

### When Creating Issue:

Include:
- **OS**: Windows 10 / macOS 14 / Ubuntu 22.04
- **Browser**: Chrome 120 / Firefox 121 / Safari 17
- **Node**: v18.17.0
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if UI issue)
- **Console errors** (if any)

### Create Issue:
```
https://github.com/your-repo/somansapos/issues/new
```

---

## Emergency Reset

If all else fails:

```bash
# 1. Delete everything
rm -rf node_modules package-lock.json dist

# 2. Clear browser storage
# F12 → Application → Clear Storage → Clear all

# 3. Clear IndexedDB
# F12 → Application → IndexedDB → Delete SomansaPOS

# 4. Reinstall & restart
npm install
npm run dev

# 5. Open in incognito
# Test fresh
```

---

## Useful Commands

```bash
# Check versions
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install

# Build fresh
rm -rf dist && npm run build

# Run tests
npm test

# Check for updates
npm outdated

# Update dependencies
npm update
```

---

## Debug Checklist

Use this checklist when debugging:

- [ ] Checked browser console
- [ ] Checked network tab
- [ ] Cleared browser cache
- [ ] Cleared localStorage
- [ ] Cleared IndexedDB
- [ ] Unregistered Service Worker
- [ ] Tried incognito mode
- [ ] Restarted dev server
- [ ] Reinstalled dependencies
- [ ] Checked Node version
- [ ] Checked browser version
- [ ] Read error message carefully
- [ ] Searched documentation
- [ ] Searched GitHub issues

---

**Good luck debugging! 🐛🔨**

If this guide helped you, please star the repo! ⭐
