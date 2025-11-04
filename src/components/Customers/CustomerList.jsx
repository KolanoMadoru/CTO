import React, { useState, useEffect } from 'react';
import { customerDB } from '../../utils/indexedDB';
import { syncManager } from '../../utils/syncManager';
import { t } from '../../locales/id';
import CustomerForm from './CustomerForm';
import '../Products/ProductList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const loadedCustomers = await customerDB.getAll();
    setCustomers(loadedCustomers);
  };

  const handleSave = async (customerData) => {
    const customer = {
      ...customerData,
      id: editingCustomer?.id || `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: editingCustomer?.createdAt || new Date().toISOString(),
    };

    await customerDB.add(customer);
    await syncManager.queueOperation('customer', customer);
    
    setShowForm(false);
    loadCustomers();
  };

  const handleDelete = async (customer) => {
    if (confirm(`Hapus pelanggan "${customer.name}"?`)) {
      await customerDB.delete(customer.id);
      loadCustomers();
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showForm) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>{t('customers.title')}</h2>
        <button className="btn-primary" onClick={() => { setEditingCustomer(null); setShowForm(true); }}>
          + {t('customers.add')}
        </button>
      </div>

      <div className="list-controls">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('common.search')}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('customers.name')}</th>
              <th>{t('customers.phone')}</th>
              <th>{t('customers.email')}</th>
              <th>{t('customers.notes')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.notes}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(customer)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
