import React, { useState, useEffect } from 'react';
import { productDB } from '../../utils/indexedDB';
import { syncManager } from '../../utils/syncManager';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import ProductForm from './ProductForm';
import './ProductList.css';

const ProductList = () => {
  const { formatCurrency } = useApp();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const loadedProducts = await productDB.getAll();
    setProducts(loadedProducts);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      await productDB.delete(product.id);
      loadProducts();
    }
  };

  const handleSave = async (productData) => {
    const product = {
      ...productData,
      id: editingProduct?.id || `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await productDB.add(product);
    await syncManager.queueOperation('product', product);
    
    setShowForm(false);
    loadProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.includes(searchQuery)
  );

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSave}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>{t('products.title')}</h2>
        <button className="btn-primary" onClick={handleAdd}>
          + {t('products.add')}
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
              <th>{t('products.name')}</th>
              <th>{t('products.sku')}</th>
              <th>{t('products.barcode')}</th>
              <th>{t('products.category')}</th>
              <th>{t('products.price')}</th>
              <th>{t('products.stock')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.barcode}</td>
                <td>{product.category}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <span className={product.stock <= product.lowStockThreshold ? 'low-stock' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product)}
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

export default ProductList;
