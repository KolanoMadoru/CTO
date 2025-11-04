import { queueDB, salesDB, productDB, customerDB } from './indexedDB';
import { API_BASE_URL } from '../api/config';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.syncListeners = [];
  }

  addSyncListener(callback) {
    this.syncListeners.push(callback);
  }

  notifyListeners() {
    this.syncListeners.forEach(callback => callback({
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
    }));
  }

  async queueOperation(type, data) {
    const queueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    await queueDB.add(queueItem);
    console.log('Operation queued:', queueItem);

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncNow();
    }
  }

  async syncNow() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Cannot sync: offline');
      return;
    }

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const queue = await queueDB.getAll();
      console.log(`Syncing ${queue.length} items...`);

      for (const item of queue) {
        try {
          await this.processQueueItem(item);
          await queueDB.delete(item.id);
          console.log('Synced item:', item.id);
        } catch (error) {
          console.error('Failed to sync item:', item.id, error);
          
          // Increment retry count
          item.retries = (item.retries || 0) + 1;
          
          // Remove from queue if too many retries
          if (item.retries >= 5) {
            console.error('Max retries reached, removing from queue:', item.id);
            await queueDB.delete(item.id);
          } else {
            await queueDB.add(item);
          }
        }
      }

      this.lastSyncTime = new Date().toISOString();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  async processQueueItem(item) {
    const { type, data } = item;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };

    switch (type) {
      case 'sale':
        await fetch(`${API_BASE_URL}/api/sales`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        break;

      case 'product':
        if (data.id && data.id.startsWith('local_')) {
          // New product created offline
          await fetch(`${API_BASE_URL}/api/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
          });
        } else {
          // Existing product updated
          await fetch(`${API_BASE_URL}/api/products/${data.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
          });
        }
        break;

      case 'customer':
        if (data.id && data.id.startsWith('local_')) {
          await fetch(`${API_BASE_URL}/api/customers`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
          });
        } else {
          await fetch(`${API_BASE_URL}/api/customers/${data.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
          });
        }
        break;

      case 'inventory':
        await fetch(`${API_BASE_URL}/api/inventory/adjust`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        break;

      default:
        console.warn('Unknown queue item type:', type);
    }
  }

  async syncFromServer() {
    if (!navigator.onLine) {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
    };

    try {
      // Sync products from server
      const productsResponse = await fetch(`${API_BASE_URL}/api/products`, { headers });
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        for (const product of products) {
          await productDB.add(product);
        }
      }

      // Sync customers from server
      const customersResponse = await fetch(`${API_BASE_URL}/api/customers`, { headers });
      if (customersResponse.ok) {
        const customers = await customersResponse.json();
        for (const customer of customers) {
          await customerDB.add(customer);
        }
      }

      console.log('Data synced from server');
    } catch (error) {
      console.error('Failed to sync from server:', error);
    }
  }

  startAutoSync(intervalMinutes = 5) {
    setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncNow();
      }
    }, intervalMinutes * 60 * 1000);

    // Sync when coming back online
    window.addEventListener('online', () => {
      console.log('Back online, syncing...');
      this.syncNow();
    });
  }
}

export const syncManager = new SyncManager();
