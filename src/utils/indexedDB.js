import { openDB } from 'idb';

const DB_NAME = 'SomansaPOS';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('barcode', 'barcode', { unique: true });
        productStore.createIndex('category', 'category');
      }

      // Customers store
      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
        customerStore.createIndex('phone', 'phone');
      }

      // Sales store
      if (!db.objectStoreNames.contains('sales')) {
        const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
        salesStore.createIndex('date', 'date');
        salesStore.createIndex('customerId', 'customerId');
      }

      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }

      // Queue store (for offline transactions)
      if (!db.objectStoreNames.contains('queue')) {
        const queueStore = db.createObjectStore('queue', { keyPath: 'id' });
        queueStore.createIndex('timestamp', 'timestamp');
        queueStore.createIndex('type', 'type');
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Inventory adjustments store
      if (!db.objectStoreNames.contains('inventoryAdjustments')) {
        const inventoryStore = db.createObjectStore('inventoryAdjustments', { keyPath: 'id' });
        inventoryStore.createIndex('productId', 'productId');
        inventoryStore.createIndex('date', 'date');
      }
    },
  });

  return db;
};

// Generic CRUD operations
export const dbOperations = {
  async getAll(storeName) {
    const db = await initDB();
    return await db.getAll(storeName);
  },

  async getById(storeName, id) {
    const db = await initDB();
    return await db.get(storeName, id);
  },

  async add(storeName, data) {
    const db = await initDB();
    return await db.add(storeName, data);
  },

  async put(storeName, data) {
    const db = await initDB();
    return await db.put(storeName, data);
  },

  async delete(storeName, id) {
    const db = await initDB();
    return await db.delete(storeName, id);
  },

  async clear(storeName) {
    const db = await initDB();
    return await db.clear(storeName);
  },

  async getByIndex(storeName, indexName, key) {
    const db = await initDB();
    return await db.getAllFromIndex(storeName, indexName, key);
  },
};

// Specific operations
export const productDB = {
  async getAll() {
    return await dbOperations.getAll('products');
  },

  async getById(id) {
    return await dbOperations.getById('products', id);
  },

  async getByBarcode(barcode) {
    const db = await initDB();
    return await db.getFromIndex('products', 'barcode', barcode);
  },

  async add(product) {
    return await dbOperations.put('products', product);
  },

  async update(product) {
    return await dbOperations.put('products', product);
  },

  async delete(id) {
    return await dbOperations.delete('products', id);
  },
};

export const customerDB = {
  async getAll() {
    return await dbOperations.getAll('customers');
  },

  async getById(id) {
    return await dbOperations.getById('customers', id);
  },

  async add(customer) {
    return await dbOperations.put('customers', customer);
  },

  async update(customer) {
    return await dbOperations.put('customers', customer);
  },

  async delete(id) {
    return await dbOperations.delete('customers', id);
  },
};

export const salesDB = {
  async getAll() {
    return await dbOperations.getAll('sales');
  },

  async getById(id) {
    return await dbOperations.getById('sales', id);
  },

  async add(sale) {
    return await dbOperations.put('sales', sale);
  },

  async getByDateRange(startDate, endDate) {
    const db = await initDB();
    const tx = db.transaction('sales', 'readonly');
    const index = tx.store.index('date');
    const range = IDBKeyRange.bound(startDate, endDate);
    return await index.getAll(range);
  },
};

export const queueDB = {
  async getAll() {
    return await dbOperations.getAll('queue');
  },

  async add(item) {
    return await dbOperations.put('queue', item);
  },

  async delete(id) {
    return await dbOperations.delete('queue', id);
  },

  async clear() {
    return await dbOperations.clear('queue');
  },
};

export const settingsDB = {
  async get(key) {
    return await dbOperations.getById('settings', key);
  },

  async set(key, value) {
    return await dbOperations.put('settings', { key, value });
  },
};

export const userDB = {
  async getAll() {
    return await dbOperations.getAll('users');
  },

  async getById(id) {
    return await dbOperations.getById('users', id);
  },

  async add(user) {
    return await dbOperations.put('users', user);
  },
};

export const inventoryDB = {
  async getAll() {
    return await dbOperations.getAll('inventoryAdjustments');
  },

  async add(adjustment) {
    return await dbOperations.put('inventoryAdjustments', adjustment);
  },

  async getByProductId(productId) {
    return await dbOperations.getByIndex('inventoryAdjustments', 'productId', productId);
  },
};
