import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncManager } from '../utils/syncManager';
import { queueDB, settingsDB } from '../utils/indexedDB';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    queueCount: 0,
  });
  const [settings, setSettings] = useState({
    storeName: 'SomansaPOS',
    storeAddress: '',
    storePhone: '',
    taxRate: 10,
    currency: 'IDR',
    receiptFooter: 'Terima kasih atas kunjungan Anda!',
  });

  useEffect(() => {
    // Load settings
    loadSettings();

    // Setup online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup sync listener
    syncManager.addSyncListener((status) => {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: status.isSyncing,
        lastSyncTime: status.lastSyncTime,
      }));
    });

    // Update queue count periodically
    const updateQueueCount = async () => {
      const queue = await queueDB.getAll();
      setSyncStatus(prev => ({
        ...prev,
        queueCount: queue.length,
      }));
    };

    updateQueueCount();
    const interval = setInterval(updateQueueCount, 5000);

    // Start auto-sync
    syncManager.startAutoSync(5);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const keys = ['storeName', 'storeAddress', 'storePhone', 'taxRate', 'currency', 'receiptFooter'];
      const loadedSettings = {};

      for (const key of keys) {
        const setting = await settingsDB.get(key);
        if (setting) {
          loadedSettings[key] = setting.value;
        }
      }

      setSettings(prev => ({ ...prev, ...loadedSettings }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      for (const [key, value] of Object.entries(newSettings)) {
        await settingsDB.set(key, value);
      }
      setSettings(prev => ({ ...prev, ...newSettings }));
      return { success: true };
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { success: false, message: error.message };
    }
  };

  const triggerSync = async () => {
    await syncManager.syncNow();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const value = {
    isOnline,
    syncStatus,
    settings,
    updateSettings,
    triggerSync,
    formatCurrency,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
