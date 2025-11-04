# Contributing to SomansaPOS

Terima kasih atas minat Anda untuk berkontribusi pada SomansaPOS! 🎉

## 📋 Acceptance Criteria Summary

Sebelum submit PR, pastikan fitur Anda memenuhi kriteria berikut:

### ✅ Authentication
- Login berhasil dengan credentials yang benar
- Logout menghapus sesi dan token
- Role-based access control berfungsi (admin vs cashier)
- Token disimpan dan divalidasi dengan benar

### ✅ Products Management
- Create: Produk baru tersimpan di IndexedDB dan muncul di list
- Read: Semua produk ditampilkan dengan data lengkap
- Update: Perubahan produk ter-save dan ter-reflect di UI
- Delete: Produk terhapus dari database dan UI
- Barcode scan/input menambahkan produk ke cart

### ✅ POS / Checkout
- Produk dapat ditambahkan ke cart via barcode atau klik
- Quantity produk dapat diubah (+/-)
- Diskon per item dan diskon transaksi berfungsi
- Pajak dihitung dengan benar
- Multiple payment methods tersedia
- Receipt dapat di-print dengan format yang rapi
- Stock berkurang setelah checkout

### ✅ Offline Mode
- Aplikasi tetap berfungsi saat offline
- Transaksi offline masuk ke queue
- Queue tersinkronkan saat kembali online
- Data tetap konsisten antara IndexedDB dan server
- Tidak ada data loss saat offline/online

### ✅ Customers Management
- CRUD customers berfungsi lengkap
- Customer dapat dipilih saat checkout
- Data customer tersimpan dengan benar

### ✅ Inventory
- Stock adjustment (in/out) berfungsi
- History adjustment tersimpan dan ditampilkan
- Stock update ter-reflect di products list

### ✅ Reports
- Laporan menampilkan data sesuai filter tanggal
- Total penjualan dihitung dengan benar
- Top products ditampilkan berdasarkan revenue
- Export CSV berfungsi dengan format yang benar

### ✅ Settings
- Settings dapat disimpan dan diload
- Sync status ditampilkan dengan akurat
- Manual sync trigger berfungsi
- Queue items ditampilkan dengan detail

## 🚀 Getting Started

### Prerequisites

- Node.js 18 atau lebih baru
- npm atau yarn
- Git

### Setup Development Environment

1. **Fork dan Clone**:
   ```bash
   git clone https://github.com/your-username/somansapos.git
   cd somansapos
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

## 📝 Code Style Guidelines

### JavaScript/JSX

- Use ES6+ syntax
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic only

### Example:

```jsx
// ✅ Good
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// ❌ Bad
const calc = (x) => {
  let t = 0;
  for(let i = 0; i < x.length; i++) {
    t = t + x[i].p * x[i].q;
  }
  return t;
};
```

### CSS

- Use semantic class names
- Organize by component
- Use CSS variables for theming
- Mobile-first responsive design

### File Structure

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.jsx
│   │   ├── ComponentName.css
│   │   └── index.js (optional)
```

## 🔧 Making Changes

### Branch Naming

- `feature/feature-name` - for new features
- `fix/bug-description` - for bug fixes
- `refactor/what-refactored` - for refactoring
- `docs/what-documented` - for documentation

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```bash
feat(pos): add barcode scanning support
fix(cart): correct discount calculation
docs(readme): add installation instructions
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- Cart.test.jsx

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Manual Testing Checklist

Before submitting PR:

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test offline mode
- [ ] Test all user roles (admin, cashier)
- [ ] Check responsive design
- [ ] Verify no console errors
- [ ] Test edge cases

## 📤 Submitting Pull Request

1. **Update your fork**:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat(pos): add amazing feature"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**:
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template
   - Submit!

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested offline mode
- [ ] Tested on multiple browsers

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try latest version
3. Clear cache and try again

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 10]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions you've considered.

**Additional context**
Add any other context or screenshots.
```

## 📚 Documentation

If you're improving documentation:

- Use clear, concise language
- Add code examples where helpful
- Update table of contents if needed
- Check spelling and grammar
- Test all code examples

## 🎨 UI/UX Contributions

For UI/UX improvements:

- Follow existing design patterns
- Ensure accessibility (WCAG 2.1)
- Test responsive design
- Consider offline scenarios
- Add print styles where needed

## 🔐 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security@somansapos.com (or create private security advisory)
3. Include detailed steps to reproduce
4. Wait for response before public disclosure

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Not Acceptable

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

## ❓ Questions?

- Open a discussion on GitHub
- Join our Discord (if available)
- Check existing documentation

## 🙏 Thank You!

Every contribution helps make SomansaPOS better for everyone. Thank you for your time and effort!

---

**Happy Contributing! 🚀**
