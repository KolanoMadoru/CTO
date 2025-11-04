import React, { useState } from 'react';
import { t } from '../../locales/id';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    category: product?.category || '',
    description: product?.description || '',
    lowStockThreshold: product?.lowStockThreshold || 5,
    image: product?.image || '',
  });
  const [imagePreview, setImagePreview] = useState(product?.image || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'cost', 'stock', 'lowStockThreshold'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{product ? t('products.edit') : t('products.add')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label>{t('products.name')} *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('products.sku')}</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('products.barcode')}</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('products.category')}</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('products.cost')} *</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('products.price')} *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('products.stock')} *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('products.lowStock')}</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group full-width">
            <label>{t('products.description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label>Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '10px' }}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-secondary"
                  style={{ marginLeft: '10px', padding: '5px 10px' }}
                >
                  Hapus Gambar
                </button>
              </div>
            )}
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

export default ProductForm;
