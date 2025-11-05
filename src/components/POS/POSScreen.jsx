import React, { useState, useEffect } from 'react';
import { productDB, customerDB, salesDB } from '../../utils/indexedDB';
import { syncManager } from '../../utils/syncManager';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../locales/id';
import Cart from './Cart';
import Receipt from './Receipt';
import BarcodeScanner from './BarcodeScanner';
import './POSScreen.css';

const POSScreen = () => {
  const { user } = useAuth();
  const { settings, formatCurrency, isOnline } = useApp();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedProducts = await productDB.getAll();
    const loadedCustomers = await customerDB.getAll();
    setProducts(loadedProducts);
    setCustomers(loadedCustomers);
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const product = await productDB.getByBarcode(barcodeInput.trim());
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Produk tidak ditemukan!');
    }
  };

  const handleScanResult = async (barcode) => {
    const product = await productDB.getByBarcode(barcode);
    if (product) {
      addToCart(product);
      setShowScanner(false);
    } else {
      alert('Produk tidak ditemukan!');
      setShowScanner(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        quantity: 1,
        discount: 0,
      }]);
    }
  };

  const updateCartItem = (productId, updates) => {
    setCart(cart.map(item =>
      item.id === productId ? { ...item, ...updates } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    if (confirm('Hapus semua item dari keranjang?')) {
      setCart([]);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity) - item.discount;
      return sum + itemTotal;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discountAmount;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }

    const total = calculateTotal();

    if (paymentMethod === 'cash' && paidAmount < total) {
      alert('Jumlah pembayaran kurang!');
      return;
    }

    try {
      const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sale = {
        id: saleId,
        date: new Date().toISOString(),
        cashierId: user.id,
        cashierName: user.name,
        customerId: selectedCustomer?.id || 'guest',
        customerName: selectedCustomer?.name || t('pos.guestCustomer'),
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          subtotal: (item.price * item.quantity) - item.discount,
        })),
        subtotal: calculateSubtotal(),
        discountAmount: discountAmount,
        taxAmount: 0,
        total: total,
        paymentMethod: paymentMethod,
        paidAmount: paymentMethod === 'cash' ? paidAmount : total,
        changeAmount: paymentMethod === 'cash' ? paidAmount - total : 0,
      };

      // Save to IndexedDB
      await salesDB.add(sale);

      // Update product stock
      for (const item of cart) {
        const product = await productDB.getById(item.id);
        if (product) {
          product.stock -= item.quantity;
          await productDB.update(product);
        }
      }

      // Queue for sync
      await syncManager.queueOperation('sale', sale);

      setLastSale(sale);
      setShowReceipt(true);

      // Reset form
      setCart([]);
      setSelectedCustomer(null);
      setDiscountAmount(0);
      setPaidAmount(0);
      
      // Reload products to update stock
      loadData();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat checkout!');
    }
  };

  const handleCancelTransaction = () => {
    if (cart.length > 0) {
      if (confirm('Batalkan transaksi?')) {
        setCart([]);
        setSelectedCustomer(null);
        setDiscountAmount(0);
        setPaidAmount(0);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.includes(searchQuery)
  );

  if (showReceipt && lastSale) {
    return (
      <Receipt
        sale={lastSale}
        settings={settings}
        onClose={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="pos-screen">
      <div className="pos-left">
        <div className="pos-search-bar">
          <form onSubmit={handleBarcodeSubmit} className="barcode-form">
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder={t('pos.scanBarcode')}
              className="barcode-input"
            />
            <button type="submit" className="btn-scan">
              📝
            </button>
            <button 
              type="button" 
              className="btn-camera"
              onClick={() => setShowScanner(true)}
              title="Scan dengan Kamera"
            >
              📷
            </button>
          </form>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('pos.searchProduct')}
            className="search-input"
          />
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => addToCart(product)}
            >
              {product.image && (
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
              )}
              <div className="product-name">{product.name}</div>
              <div className="product-price">{formatCurrency(product.price)}</div>
              <div className="product-stock">Stok: {product.stock}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-right">
        <div className="pos-customer-select">
          <label>{t('pos.customer')}</label>
          <select
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const customer = customers.find(c => c.id === e.target.value);
              setSelectedCustomer(customer);
            }}
          >
            <option value="">{t('pos.guestCustomer')}</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <Cart
          cart={cart}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          formatCurrency={formatCurrency}
        />

        <div className="pos-totals">
          <div className="total-row">
            <span>{t('pos.subtotal')}</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="total-row">
            <span>{t('pos.discount')}</span>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="discount-input"
              min="0"
            />
          </div>
          <div className="total-row grand-total">
            <span>{t('pos.total')}</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>

        <div className="pos-payment">
          <label>{t('pos.payment')}</label>
          <div className="payment-methods">
            <button
              className={`payment-method ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              {t('pos.cash')}
            </button>
            <button
              className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              {t('pos.card')}
            </button>
            <button
              className={`payment-method ${paymentMethod === 'ewallet' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('ewallet')}
            >
              {t('pos.ewallet')}
            </button>
          </div>

          {paymentMethod === 'cash' && (
            <div className="cash-payment">
              <label>Jumlah Dibayar</label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="paid-amount-input"
                min="0"
              />
              {paidAmount >= calculateTotal() && (
                <div className="change-amount">
                  Kembali: {formatCurrency(paidAmount - calculateTotal())}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pos-actions">
          <button
            className="btn-cancel"
            onClick={handleCancelTransaction}
          >
            {t('pos.cancel')}
          </button>
          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            {t('pos.checkout')}
          </button>
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default POSScreen;
