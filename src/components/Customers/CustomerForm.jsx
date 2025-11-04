import React, { useState } from 'react';
import { t } from '../../locales/id';
import '../Products/ProductForm.css';

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    notes: customer?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{customer ? t('customers.edit') : t('customers.add')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label>{t('customers.name')} *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('customers.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>{t('customers.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>{t('customers.notes')}</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary">
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
