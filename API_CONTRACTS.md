# SomansaPOS - API Contracts

Dokumentasi lengkap API endpoints untuk backend SomansaPOS.

## Base URL

```
Development: http://localhost:5000
Production: https://api.somansapos.com
```

## Authentication

Semua endpoint (kecuali `/api/auth/login`) memerlukan JWT token di header:

```
Authorization: Bearer {token}
```

---

## 1. Authentication

### POST `/api/auth/login`

Login user dan dapatkan JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1",
    "username": "admin",
    "role": "admin",
    "name": "Administrator"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 2. Products

### GET `/api/products`

Get all products.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "p1",
    "name": "Nasi Goreng",
    "sku": "FOOD-001",
    "barcode": "111111",
    "price": 15000,
    "cost": 8000,
    "stock": 20,
    "category": "Makanan",
    "description": "Nasi goreng spesial",
    "lowStockThreshold": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/api/products/:id`

Get single product by ID.

**Response (200):**
```json
{
  "id": "p1",
  "name": "Nasi Goreng",
  "sku": "FOOD-001",
  "barcode": "111111",
  "price": 15000,
  "cost": 8000,
  "stock": 20,
  "category": "Makanan",
  "description": "Nasi goreng spesial",
  "lowStockThreshold": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/products`

Create new product.

**Request Body:**
```json
{
  "name": "Kopi Hitam",
  "sku": "DRINK-002",
  "barcode": "444444",
  "price": 8000,
  "cost": 3000,
  "stock": 30,
  "category": "Minuman",
  "description": "Kopi hitam original",
  "lowStockThreshold": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "id": "p4",
  "message": "Product created successfully"
}
```

### PUT `/api/products/:id`

Update existing product.

**Request Body:** (same as POST)

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

### DELETE `/api/products/:id`

Delete product.

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 3. Customers

### GET `/api/customers`

Get all customers.

**Response (200):**
```json
[
  {
    "id": "c1",
    "name": "John Doe",
    "phone": "08123456789",
    "email": "john@example.com",
    "notes": "Pelanggan setia",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST `/api/customers`

Create new customer.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "08198765432",
  "email": "jane@example.com",
  "notes": "Pelanggan baru"
}
```

**Response (201):**
```json
{
  "success": true,
  "id": "c2",
  "message": "Customer created successfully"
}
```

### PUT `/api/customers/:id`

Update customer.

**Request Body:** (same as POST)

**Response (200):**
```json
{
  "success": true,
  "message": "Customer updated successfully"
}
```

### DELETE `/api/customers/:id`

Delete customer.

**Response (200):**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## 4. Sales

### GET `/api/sales`

Get all sales.

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `customerId` (optional): Customer ID

**Response (200):**
```json
[
  {
    "id": "sale_1234567890",
    "date": "2024-01-15T10:30:00.000Z",
    "cashierId": "user_2",
    "cashierName": "Kasir",
    "customerId": "c1",
    "customerName": "John Doe",
    "items": [
      {
        "productId": "p1",
        "productName": "Nasi Goreng",
        "quantity": 2,
        "price": 15000,
        "discount": 0,
        "subtotal": 30000
      }
    ],
    "subtotal": 35000,
    "discountAmount": 5000,
    "taxAmount": 3000,
    "total": 33000,
    "paymentMethod": "cash",
    "paidAmount": 50000,
    "changeAmount": 17000
  }
]
```

### POST `/api/sales`

Create new sale.

**Request Body:**
```json
{
  "id": "sale_1234567890",
  "date": "2024-01-15T10:30:00.000Z",
  "cashierId": "user_2",
  "cashierName": "Kasir",
  "customerId": "c1",
  "customerName": "John Doe",
  "items": [
    {
      "productId": "p1",
      "productName": "Nasi Goreng",
      "quantity": 2,
      "price": 15000,
      "discount": 0,
      "subtotal": 30000
    }
  ],
  "subtotal": 35000,
  "discountAmount": 5000,
  "taxAmount": 3000,
  "total": 33000,
  "paymentMethod": "cash",
  "paidAmount": 50000,
  "changeAmount": 17000
}
```

**Response (201):**
```json
{
  "success": true,
  "id": "sale_1234567890",
  "message": "Sale recorded successfully"
}
```

---

## 5. Sync

### POST `/api/sync`

Bulk sync queued data from offline mode.

**Request Body:**
```json
{
  "sales": [
    {
      "id": "sale_offline_1",
      "date": "2024-01-15T10:30:00.000Z",
      "cashierId": "user_2",
      "items": [...],
      "total": 50000,
      "paymentMethod": "cash"
    }
  ],
  "products": [
    {
      "id": "local_p4",
      "name": "New Product",
      "price": 10000,
      "stock": 50
    }
  ],
  "customers": [
    {
      "id": "local_c3",
      "name": "New Customer",
      "phone": "08123456789"
    }
  ],
  "inventory": [
    {
      "productId": "p1",
      "quantity": 10,
      "type": "in",
      "reason": "Restock"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "synced": {
    "sales": 1,
    "products": 1,
    "customers": 1,
    "inventory": 1
  },
  "conflicts": [
    {
      "type": "product",
      "id": "p1",
      "reason": "Version conflict - stock mismatch",
      "resolution": "server_version_kept",
      "serverValue": 25,
      "clientValue": 20
    }
  ],
  "newIds": {
    "local_p4": "p4",
    "local_c3": "c3"
  },
  "message": "Sync completed with 1 conflict"
}
```

**Conflict Resolution Strategy:**

1. **Timestamp-based**: Newer timestamp wins
2. **Sales**: No conflicts (append-only, unique IDs)
3. **Stock**: Server version has priority
4. **Duplicate Detection**: Check by ID and barcode
5. **Local IDs**: Replace with server-generated IDs

---

## 6. Inventory

### POST `/api/inventory/adjust`

Adjust product stock.

**Request Body:**
```json
{
  "productId": "p1",
  "quantity": 10,
  "type": "in",
  "reason": "Restock from supplier",
  "date": "2024-01-15T10:00:00.000Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "productId": "p1",
  "previousStock": 20,
  "newStock": 30,
  "message": "Stock adjusted successfully"
}
```

### GET `/api/inventory/history`

Get inventory adjustment history.

**Query Parameters:**
- `productId` (optional): Filter by product
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response (200):**
```json
[
  {
    "id": "adj_1",
    "productId": "p1",
    "productName": "Nasi Goreng",
    "quantity": 10,
    "type": "in",
    "reason": "Restock",
    "previousStock": 20,
    "newStock": 30,
    "date": "2024-01-15T10:00:00.000Z",
    "createdBy": "user_1"
  }
]
```

---

## 7. Reports

### GET `/api/reports/daily`

Get daily sales report.

**Query Parameters:**
- `date` (required): YYYY-MM-DD

**Response (200):**
```json
{
  "date": "2024-01-15",
  "totalSales": 500000,
  "totalTransactions": 25,
  "averageTransaction": 20000,
  "topProducts": [
    {
      "productId": "p1",
      "productName": "Nasi Goreng",
      "quantitySold": 30,
      "revenue": 450000
    }
  ],
  "paymentMethods": {
    "cash": 300000,
    "card": 150000,
    "ewallet": 50000
  }
}
```

### GET `/api/reports/period`

Get period sales report.

**Query Parameters:**
- `startDate` (required): YYYY-MM-DD
- `endDate` (required): YYYY-MM-DD

**Response (200):**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "totalSales": 15000000,
  "totalTransactions": 750,
  "averageTransaction": 20000,
  "topProducts": [...],
  "dailyBreakdown": [
    {
      "date": "2024-01-01",
      "sales": 500000,
      "transactions": 25
    }
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

---

## Database Schema (Reference)

### users
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cashier') NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products
```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE,
  barcode VARCHAR(50) UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(50),
  description TEXT,
  low_stock_threshold INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### customers
```sql
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sales
```sql
CREATE TABLE sales (
  id VARCHAR(50) PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  cashier_id VARCHAR(50) NOT NULL,
  customer_id VARCHAR(50),
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  paid_amount DECIMAL(10, 2),
  change_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cashier_id) REFERENCES users(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### sale_items
```sql
CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### inventory_adjustments
```sql
CREATE TABLE inventory_adjustments (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  reason VARCHAR(255),
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  date TIMESTAMP NOT NULL,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

## Security Best Practices

### Production Checklist

- [ ] Use HTTPS only
- [ ] Implement bcrypt/argon2 for password hashing
- [ ] Add rate limiting (express-rate-limit)
- [ ] Implement CORS properly
- [ ] Use helmet.js for security headers
- [ ] Validate all inputs (joi/yup)
- [ ] Sanitize SQL queries (use parameterized queries)
- [ ] Implement JWT refresh tokens
- [ ] Add logging (winston/morgan)
- [ ] Set up monitoring (Sentry/New Relic)
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Example: JWT Implementation

```javascript
// Generate token
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verify token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    req.user = user;
    next();
  });
}
```

---

## Testing API Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get products (with token)
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Kopi","price":8000,"stock":30}'
```

### Using Postman

Import this collection or create requests for each endpoint.

---

**Last Updated**: 2024
**API Version**: 1.0.0
