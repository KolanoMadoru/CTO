import React, { useState, useEffect } from 'react';
import { productDB, inventoryDB } from '../../utils/indexedDB';
import { syncManager } from '../../utils/syncManager';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import '../Products/ProductList.css';
import '../Products/ProductForm.css';

const Inventory = () => {
  const { formatCurrency } = useApp();
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState('in');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedProducts = await productDB.getAll();
    const loadedAdjustments = await inventoryDB.getAll();
    setProducts(loadedProducts);
    setAdjustments(loadedAdjustments.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleAdjust = async (e) => {
    e.preventDefault();

    if (!selectedProduct || quantity === 0) {
      alert('Pilih produk dan masukkan jumlah!');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const adjustment = {
      id: `adj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      quantity: type === 'in' ? quantity : -quantity,
      type,
      reason,
      date: new Date().toISOString(),
      previousStock: product.stock,
      newStock: type === 'in' ? product.stock + quantity : product.stock - quantity,
    };

    await inventoryDB.add(adjustment);

    product.stock = adjustment.newStock;
    await productDB.update(product);

    await syncManager.queueOperation('inventory', adjustment);

    setSelectedProduct('');
    setQuantity(0);
    setReason('');
    loadData();
  };

  return (
    <div className="product-list-container">
      <h2>{t('inventory.title')}</h2>

      <div className="form-container" style={{ marginBottom: '24px' }}>
        <h3>{t('inventory.adjust')}</h3>
        <form onSubmit={handleAdjust} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>{t('inventory.product')} *</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Pilih Produk</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stok: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('inventory.type')} *</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="in">{t('inventory.stockIn')}</option>
                <option value="out">{t('inventory.stockOut')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('inventory.quantity')} *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('inventory.reason')}</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {t('inventory.save')}
            </button>
          </div>
        </form>
      </div>

      <h3>{t('inventory.history')}</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('inventory.date')}</th>
              <th>{t('inventory.product')}</th>
              <th>{t('inventory.type')}</th>
              <th>{t('inventory.quantity')}</th>
              <th>Stok Sebelum</th>
              <th>Stok Setelah</th>
              <th>{t('inventory.reason')}</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map(adj => (
              <tr key={adj.id}>
                <td>{new Date(adj.date).toLocaleString('id-ID')}</td>
                <td>{adj.productName}</td>
                <td>
                  <span className={adj.type === 'in' ? 'badge-success' : 'badge-danger'}>
                    {adj.type === 'in' ? t('inventory.stockIn') : t('inventory.stockOut')}
                  </span>
                </td>
                <td>{Math.abs(adj.quantity)}</td>
                <td>{adj.previousStock}</td>
                <td>{adj.newStock}</td>
                <td>{adj.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
