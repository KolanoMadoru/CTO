import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { queueDB } from '../../utils/indexedDB';
import { t } from '../../locales/id';
import '../Products/ProductForm.css';

const Settings = () => {
  const { settings, updateSettings, triggerSync, syncStatus } = useApp();
  const [formData, setFormData] = useState(settings);
  const [queueItems, setQueueItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
    loadQueueItems();
  }, [settings]);

  const loadQueueItems = async () => {
    const items = await queueDB.getAll();
    setQueueItems(items);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateSettings(formData);
    if (result.success) {
      alert('Pengaturan berhasil disimpan!');
    } else {
      alert('Gagal menyimpan pengaturan!');
    }

    setIsSaving(false);
  };

  const handleSync = async () => {
    await triggerSync();
    setTimeout(loadQueueItems, 1000);
  };

  return (
    <div className="product-list-container">
      <h2>{t('settings.title')}</h2>

      <div className="form-container" style={{ marginBottom: '24px' }}>
        <h3>Informasi Toko</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>{t('settings.storeName')}</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>{t('settings.storePhone')}</label>
              <input
                type="tel"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>{t('settings.storeAddress')}</label>
              <input
                type="text"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>{t('settings.taxRate')}</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>{t('settings.currency')}</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="IDR">IDR - Rupiah</option>
                <option value="USD">USD - Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>{t('settings.receiptFooter')}</label>
              <textarea
                name="receiptFooter"
                value={formData.receiptFooter}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : t('settings.save')}
            </button>
          </div>
        </form>
      </div>

      <div className="form-container">
        <h3>{t('settings.sync')}</h3>
        <div style={{ marginBottom: '16px' }}>
          <p><strong>{t('settings.lastSync')}:</strong>{' '}
            {syncStatus.lastSyncTime 
              ? new Date(syncStatus.lastSyncTime).toLocaleString('id-ID')
              : 'Belum pernah disinkronkan'
            }
          </p>
          <p><strong>{t('settings.queuedItems')}:</strong> {queueItems.length}</p>
        </div>

        <button 
          onClick={handleSync} 
          className="btn-primary" 
          disabled={syncStatus.isSyncing}
        >
          {syncStatus.isSyncing ? t('settings.syncing') : t('settings.syncNow')}
        </button>

        {queueItems.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Item dalam Antrian</h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tipe</th>
                    <th>Waktu</th>
                    <th>Retries</th>
                  </tr>
                </thead>
                <tbody>
                  {queueItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.type}</td>
                      <td>{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                      <td>{item.retries || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
