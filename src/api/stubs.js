// API Stubs - Contoh implementasi backend endpoints
// Ini adalah contoh untuk referensi, backend sebenarnya perlu dibuat terpisah

/*
===========================================
BACKEND API CONTRACTS & EXAMPLES
===========================================

1. POST /api/auth/login
   Request:
   {
     "username": "admin",
     "password": "admin123"
   }
   
   Response (200):
   {
     "success": true,
     "token": "jwt_token_here",
     "user": {
       "id": "user_1",
       "username": "admin",
       "role": "admin",
       "name": "Administrator"
     }
   }
   
   Response (401):
   {
     "success": false,
     "message": "Invalid credentials"
   }

-------------------------------------------

2. GET /api/products
   Headers: Authorization: Bearer {token}
   
   Response (200):
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
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
   ]

-------------------------------------------

3. POST /api/products
   Headers: Authorization: Bearer {token}
   Request:
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
   
   Response (201):
   {
     "success": true,
     "id": "p4",
     "message": "Product created"
   }

-------------------------------------------

4. PUT /api/products/:id
   Headers: Authorization: Bearer {token}
   Request: (same as POST)
   
   Response (200):
   {
     "success": true,
     "message": "Product updated"
   }

-------------------------------------------

5. DELETE /api/products/:id
   Headers: Authorization: Bearer {token}
   
   Response (200):
   {
     "success": true,
     "message": "Product deleted"
   }

-------------------------------------------

6. GET /api/customers
   Headers: Authorization: Bearer {token}
   
   Response (200):
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

-------------------------------------------

7. POST /api/customers
   Headers: Authorization: Bearer {token}
   Request:
   {
     "name": "Jane Doe",
     "phone": "08198765432",
     "email": "jane@example.com",
     "notes": "Pelanggan baru"
   }
   
   Response (201):
   {
     "success": true,
     "id": "c2",
     "message": "Customer created"
   }

-------------------------------------------

8. POST /api/sales
   Headers: Authorization: Bearer {token}
   Request:
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
       },
       {
         "productId": "p2",
         "productName": "Es Teh",
         "quantity": 1,
         "price": 5000,
         "discount": 0,
         "subtotal": 5000
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
   
   Response (201):
   {
     "success": true,
     "id": "sale_1234567890",
     "message": "Sale recorded"
   }

-------------------------------------------

9. POST /api/sync
   Headers: Authorization: Bearer {token}
   Request:
   {
     "sales": [
       // Array of sales objects (same structure as POST /api/sales)
     ],
     "products": [
       // Array of product updates
     ],
     "customers": [
       // Array of customer updates
     ],
     "inventory": [
       // Array of inventory adjustments
     ]
   }
   
   Response (200):
   {
     "success": true,
     "synced": {
       "sales": 5,
       "products": 2,
       "customers": 1,
       "inventory": 3
     },
     "conflicts": [
       {
         "type": "product",
         "id": "p1",
         "reason": "Version conflict",
         "resolution": "server_version_kept"
       }
     ],
     "message": "Sync completed"
   }
   
   Conflict Resolution Strategy:
   - Timestamp-based: newer timestamp wins
   - Server version has priority for product stock
   - Sales transactions are append-only (no conflicts)
   - Duplicate detection by ID

-------------------------------------------

10. POST /api/inventory/adjust
    Headers: Authorization: Bearer {token}
    Request:
    {
      "productId": "p1",
      "quantity": 10,
      "type": "in", // or "out"
      "reason": "Restock",
      "date": "2024-01-15T10:00:00.000Z"
    }
    
    Response (200):
    {
      "success": true,
      "newStock": 30,
      "message": "Inventory adjusted"
    }

-------------------------------------------

11. GET /api/reports/daily?date=2024-01-15
    Headers: Authorization: Bearer {token}
    
    Response (200):
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
      ]
    }

===========================================
ERROR HANDLING
===========================================

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

Error Response Format:
{
  "success": false,
  "message": "Error message here",
  "errors": [] // optional validation errors
}

===========================================
AUTHENTICATION
===========================================

Use JWT tokens for authentication.
Token should be sent in Authorization header: "Bearer {token}"
Token should contain: userId, username, role
Token expiry: 24 hours (configurable)

In production:
- Use bcrypt for password hashing
- Use HTTPS only
- Implement rate limiting
- Add CORS configuration
- Implement refresh tokens

===========================================
DATABASE SCHEMA (Reference)
===========================================

Users Table:
- id (primary key)
- username (unique)
- password (hashed)
- role (admin/cashier)
- name
- created_at

Products Table:
- id (primary key)
- name
- sku (unique)
- barcode (unique)
- price
- cost
- stock
- category
- description
- low_stock_threshold
- created_at
- updated_at

Customers Table:
- id (primary key)
- name
- phone
- email
- notes
- created_at

Sales Table:
- id (primary key)
- date
- cashier_id
- customer_id
- subtotal
- discount_amount
- tax_amount
- total
- payment_method
- paid_amount
- change_amount
- created_at

Sale_Items Table:
- id (primary key)
- sale_id
- product_id
- quantity
- price
- discount
- subtotal

Inventory_Adjustments Table:
- id (primary key)
- product_id
- quantity
- type (in/out)
- reason
- date
- created_by

*/

// Mock API implementation for development (optional)
export const mockAPI = {
  async login(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'mock_token_admin',
        user: {
          id: 'user_1',
          username: 'admin',
          role: 'admin',
          name: 'Administrator',
        },
      };
    } else if (username === 'cashier' && password === 'cashier') {
      return {
        success: true,
        token: 'mock_token_cashier',
        user: {
          id: 'user_2',
          username: 'cashier',
          role: 'cashier',
          name: 'Kasir',
        },
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },
};
