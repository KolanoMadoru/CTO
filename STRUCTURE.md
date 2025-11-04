# SomansaPOS - Project Structure

Struktur lengkap aplikasi SomansaPOS dengan penjelasan setiap folder dan file.

```
somansapos/
│
├── 📁 public/                          # Static assets
│   └── sw.js                          # Service Worker untuk offline support
│
├── 📁 src/                             # Source code aplikasi
│   │
│   ├── 📁 api/                         # API configuration & contracts
│   │   ├── config.js                  # API base URL dan endpoints
│   │   └── stubs.js                   # Mock API & contract documentation
│   │
│   ├── 📁 components/                  # React components
│   │   │
│   │   ├── 📁 Auth/                    # Authentication components
│   │   │   ├── Login.jsx              # Login form
│   │   │   └── Login.css              # Login styles
│   │   │
│   │   ├── 📁 POS/                     # Point of Sale components
│   │   │   ├── POSScreen.jsx          # Main POS screen
│   │   │   ├── POSScreen.css          # POS layout styles
│   │   │   ├── Cart.jsx               # Shopping cart component
│   │   │   ├── Cart.css               # Cart styles
│   │   │   ├── Receipt.jsx            # Receipt/invoice component
│   │   │   └── Receipt.css            # Receipt styles (print-friendly)
│   │   │
│   │   ├── 📁 Products/                # Product management
│   │   │   ├── ProductList.jsx        # Product list/table
│   │   │   ├── ProductList.css        # List styles
│   │   │   ├── ProductForm.jsx        # Add/edit product form
│   │   │   └── ProductForm.css        # Form styles
│   │   │
│   │   ├── 📁 Customers/               # Customer management
│   │   │   ├── CustomerList.jsx       # Customer list/table
│   │   │   └── CustomerForm.jsx       # Add/edit customer form
│   │   │
│   │   ├── 📁 Inventory/               # Inventory management
│   │   │   └── Inventory.jsx          # Stock adjustment & history
│   │   │
│   │   ├── 📁 Reports/                 # Reporting & analytics
│   │   │   └── Reports.jsx            # Sales reports & charts
│   │   │
│   │   ├── 📁 Settings/                # App settings
│   │   │   └── Settings.jsx           # Store config & sync settings
│   │   │
│   │   └── 📁 Layout/                  # Layout components
│   │       ├── Header.jsx             # App header with user info
│   │       ├── Header.css             # Header styles
│   │       ├── Navigation.jsx         # Tab navigation
│   │       └── Navigation.css         # Navigation styles
│   │
│   ├── 📁 contexts/                    # React Context providers
│   │   ├── AuthContext.jsx            # Authentication state & methods
│   │   └── AppContext.jsx             # App-wide state (settings, sync, etc)
│   │
│   ├── 📁 utils/                       # Utility functions & helpers
│   │   ├── indexedDB.js               # IndexedDB wrapper & operations
│   │   ├── syncManager.js             # Offline sync queue manager
│   │   └── seedData.js                # Initial data seeding
│   │
│   ├── 📁 locales/                     # Internationalization
│   │   └── id.js                      # Indonesian translations
│   │
│   ├── App.jsx                         # Main App component
│   ├── App.css                         # Global styles
│   └── main.jsx                        # Application entry point
│
├── 📁 tests/                           # Test files
│   ├── setup.js                       # Test configuration
│   └── Cart.test.jsx                  # Cart component tests
│
├── 📄 index.html                       # HTML template
├── 📄 vite.config.js                   # Vite configuration
├── 📄 package.json                     # Dependencies & scripts
├── 📄 package-lock.json                # Dependency lock file
│
├── 📄 .gitignore                       # Git ignore rules
├── 📄 .env.example                     # Environment variables example
│
├── 📚 README.md                        # Main documentation
├── 📚 API_CONTRACTS.md                 # API documentation
├── 📚 DEPLOYMENT.md                    # Deployment guide
├── 📚 CONTRIBUTING.md                  # Contribution guidelines
├── 📚 ACCEPTANCE_CRITERIA.md           # Testing acceptance criteria
├── 📚 CHANGELOG.md                     # Version history
├── 📚 STRUCTURE.md                     # This file
└── 📄 LICENSE                          # MIT License
```

---

## 📂 Folder Descriptions

### `/public`
Static assets yang akan di-copy langsung ke build folder. Berisi service worker untuk offline functionality.

### `/src`
Source code utama aplikasi.

### `/src/api`
Konfigurasi API dan dokumentasi contract. Berisi:
- **config.js**: Base URL dan endpoint definitions
- **stubs.js**: Mock API untuk development + dokumentasi lengkap contract

### `/src/components`
React components terorganisir berdasarkan fitur.

#### `/src/components/Auth`
Komponen autentikasi (login/logout).

#### `/src/components/POS`
Komponen untuk Point of Sale system:
- **POSScreen**: Main screen dengan product grid dan cart
- **Cart**: Shopping cart dengan qty adjustment, discount
- **Receipt**: Invoice component dengan print support

#### `/src/components/Products`
Manajemen produk:
- **ProductList**: Table view dengan search & filter
- **ProductForm**: Form untuk create/update produk

#### `/src/components/Customers`
Manajemen customer (CRUD operations).

#### `/src/components/Inventory`
Stock management dengan adjustment history.

#### `/src/components/Reports`
Sales reporting dengan date range filter dan export CSV.

#### `/src/components/Settings`
App settings (store info, tax rate, sync config).

#### `/src/components/Layout`
Layout components:
- **Header**: Top bar dengan user info dan online/offline status
- **Navigation**: Tab-based navigation dengan role-based access

### `/src/contexts`
React Context untuk state management:
- **AuthContext**: User authentication, login/logout, role checking
- **AppContext**: App settings, sync status, online/offline state

### `/src/utils`
Utility functions:
- **indexedDB.js**: IndexedDB wrapper dengan CRUD operations untuk semua stores
- **syncManager.js**: Queue manager untuk offline transactions, auto-sync, retry logic
- **seedData.js**: Initial data seeding (users, products, settings)

### `/src/locales`
Internationalization files. Currently supports Indonesian (`id.js`).

### `/tests`
Test files:
- **setup.js**: Test configuration (cleanup, jest-dom)
- **Cart.test.jsx**: Example unit tests untuk Cart component

---

## 📊 Database Schema (IndexedDB)

### Object Stores

#### `products`
```javascript
{
  id: string,              // Primary key
  name: string,
  sku: string,
  barcode: string,         // Indexed
  price: number,
  cost: number,
  stock: number,
  category: string,        // Indexed
  description: string,
  lowStockThreshold: number,
  createdAt: string,
  updatedAt: string
}
```

#### `customers`
```javascript
{
  id: string,              // Primary key
  name: string,
  phone: string,           // Indexed
  email: string,
  notes: string,
  createdAt: string
}
```

#### `sales`
```javascript
{
  id: string,              // Primary key
  date: string,            // Indexed
  cashierId: string,
  cashierName: string,
  customerId: string,      // Indexed
  customerName: string,
  items: [{
    productId: string,
    productName: string,
    quantity: number,
    price: number,
    discount: number,
    subtotal: number
  }],
  subtotal: number,
  discountAmount: number,
  taxAmount: number,
  total: number,
  paymentMethod: string,
  paidAmount: number,
  changeAmount: number
}
```

#### `users`
```javascript
{
  id: string,              // Primary key
  username: string,
  password: string,        // Plain text in demo (use bcrypt in production!)
  role: string,            // 'admin' or 'cashier'
  name: string
}
```

#### `queue`
```javascript
{
  id: string,              // Primary key
  type: string,            // Indexed: 'sale', 'product', 'customer', 'inventory'
  data: object,            // The actual data to sync
  timestamp: string,       // Indexed
  retries: number
}
```

#### `settings`
```javascript
{
  key: string,             // Primary key
  value: any               // Setting value
}
```

#### `inventoryAdjustments`
```javascript
{
  id: string,              // Primary key
  productId: string,       // Indexed
  productName: string,
  quantity: number,
  type: string,            // 'in' or 'out'
  reason: string,
  date: string,            // Indexed
  previousStock: number,
  newStock: number
}
```

---

## 🔄 Data Flow

### Authentication Flow
```
User Input → AuthContext.login()
  → Check IndexedDB users
  → If found → Save token & user to localStorage
  → Update user state
  → Redirect to POS
```

### POS Transaction Flow
```
Add Product → Cart State Update
  → Calculate Totals
  → User Checkout
  → Create Sale Record
  → Save to IndexedDB (sales)
  → Update Product Stock
  → Queue for Sync (if needed)
  → Show Receipt
```

### Offline Sync Flow
```
Offline Action → Save to IndexedDB
  → Add to Queue
  → Wait for Online
  → SyncManager detects online
  → Process Queue Items
  → POST to API
  → On Success: Remove from Queue
  → On Fail: Increment retry count
  → Max retries reached: Remove with log
```

---

## 🚀 Component Hierarchy

```
App
├── AuthProvider
│   └── AppProvider
│       ├── Login (if not authenticated)
│       └── (if authenticated)
│           ├── Header
│           ├── Navigation
│           └── Main Content
│               ├── POSScreen
│               │   ├── Product Grid
│               │   ├── Cart
│               │   └── Receipt (modal)
│               ├── ProductList
│               │   └── ProductForm (conditional)
│               ├── CustomerList
│               │   └── CustomerForm (conditional)
│               ├── Inventory
│               ├── Reports
│               └── Settings
```

---

## 🎨 Styling Architecture

### Global Styles
- `App.css`: Reset, global styles, utility classes

### Component Styles
- Each component has its own CSS file
- Scoped by component name prefix
- Shared patterns across similar components (e.g., ProductList.css used by CustomerList)

### Responsive Breakpoints
```css
/* Mobile: < 768px */
@media (max-width: 768px) { }

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop: > 1024px */
@media (min-width: 1024px) { }
```

### Print Styles
```css
@media print {
  /* Receipt optimizations */
}
```

---

## 🔧 Configuration Files

### `vite.config.js`
```javascript
{
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
  test: { environment: 'jsdom' }
}
```

### `package.json` Scripts
```json
{
  "dev": "vite",              // Development server
  "build": "vite build",       // Production build
  "preview": "vite preview",   // Preview build
  "test": "vitest"             // Run tests
}
```

---

## 📝 Environment Variables

Create `.env` file (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🧪 Testing Structure

### Unit Tests
- Located in `/tests` folder
- Named `*.test.jsx`
- Uses Vitest + React Testing Library
- Run with `npm test`

### Test Example
```javascript
describe('Component', () => {
  it('should do something', () => {
    render(<Component />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
```

---

## 📦 Build Output

After `npm run build`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main JS bundle (~213KB gzipped)
│   └── index-[hash].css     # Main CSS bundle (~13KB gzipped)
└── sw.js                     # Service Worker
```

---

## 🔗 Key Dependencies

### Production
- `react` & `react-dom`: ^18.3.1
- `idb`: ^8.0.0 (IndexedDB wrapper)
- `date-fns`: ^3.0.0 (Date utilities)

### Development
- `vite`: ^5.4.10 (Build tool)
- `vitest`: ^1.0.0 (Testing)
- `@testing-library/react`: ^14.1.2
- `@vitejs/plugin-react`: ^4.3.3

---

## 📚 Documentation Files

- **README.md**: Quick start, features, setup
- **API_CONTRACTS.md**: Complete API documentation
- **DEPLOYMENT.md**: Deployment guides for various platforms
- **CONTRIBUTING.md**: Contribution guidelines
- **ACCEPTANCE_CRITERIA.md**: Testing checklist (45 criteria)
- **CHANGELOG.md**: Version history
- **STRUCTURE.md**: This file
- **LICENSE**: MIT License

---

## 🔐 Security Considerations

### Current Implementation (Demo)
- ⚠️ Plain text passwords in IndexedDB
- ⚠️ No token expiry validation
- ⚠️ Basic input validation

### Production Requirements
- ✅ Use bcrypt for password hashing
- ✅ Implement JWT with expiry
- ✅ Add HTTPS/SSL
- ✅ Server-side validation
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ XSS protection
- ✅ CSRF protection

---

## 🚦 Getting Started

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd somansapos
   npm install
   ```

2. **Run Development**
   ```bash
   npm run dev
   ```

3. **Build Production**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

---

## 📞 Support

For questions or issues:
- Open GitHub Issue
- Check existing documentation
- Review acceptance criteria for expected behavior

---

**Last Updated**: January 2024
**Version**: 1.0.0
