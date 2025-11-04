import { userDB, productDB, settingsDB } from './indexedDB';

export const seedData = async () => {
  // Check if data already exists
  const existingUsers = await userDB.getAll();
  if (existingUsers.length > 0) {
    console.log('Data already seeded');
    return;
  }

  // Seed users
  const users = [
    {
      id: 'user_1',
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      name: 'Administrator',
    },
    {
      id: 'user_2',
      username: 'cashier',
      password: 'cashier', // In production, this should be hashed
      role: 'cashier',
      name: 'Kasir',
    },
  ];

  for (const user of users) {
    await userDB.add(user);
  }

  // Seed products
  const products = [
    {
      id: 'p1',
      name: 'Nasi Goreng',
      sku: 'FOOD-001',
      barcode: '111111',
      price: 15000,
      cost: 8000,
      stock: 20,
      category: 'Makanan',
      description: 'Nasi goreng spesial',
      lowStockThreshold: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      name: 'Es Teh',
      sku: 'DRINK-001',
      barcode: '222222',
      price: 5000,
      cost: 2000,
      stock: 50,
      category: 'Minuman',
      description: 'Es teh manis',
      lowStockThreshold: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p3',
      name: 'Roti Bakar',
      sku: 'FOOD-002',
      barcode: '333333',
      price: 12000,
      cost: 6000,
      stock: 15,
      category: 'Makanan',
      description: 'Roti bakar coklat keju',
      lowStockThreshold: 5,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const product of products) {
    await productDB.add(product);
  }

  // Seed settings
  const settings = [
    { key: 'storeName', value: 'SomansaPOS' },
    { key: 'storeAddress', value: 'Jl. Contoh No. 123, Jakarta' },
    { key: 'storePhone', value: '021-12345678' },
    { key: 'taxRate', value: 10 },
    { key: 'currency', value: 'IDR' },
    { key: 'receiptFooter', value: 'Terima kasih atas kunjungan Anda!' },
  ];

  for (const setting of settings) {
    await settingsDB.set(setting.key, setting.value);
  }

  console.log('Seed data inserted successfully');
};
