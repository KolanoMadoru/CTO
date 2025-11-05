import React from 'react';
import { t } from '../../locales/id';
import './Cart.css';

const Cart = ({ cart, updateCartItem, removeFromCart, formatCurrency, clearCart }) => {
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h3>{t('pos.cart')}</h3>
        <div className="cart-empty">{t('pos.empty')}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h3>{t('pos.cart')}</h3>
        <button 
          className="btn-clear-cart" 
          onClick={clearCart}
          title="Hapus Semua Item"
        >
          🗑️ Hapus Semua
        </button>
      </div>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-header">
              <span className="cart-item-name">{item.name}</span>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
                title="Hapus item"
              >
                ×
              </button>
            </div>
            
            <div className="cart-item-details">
              <div className="quantity-control">
                <button
                  onClick={() => {
                    if (item.quantity === 1) {
                      removeFromCart(item.id);
                    } else {
                      updateCartItem(item.id, {
                        quantity: item.quantity - 1
                      });
                    }
                  }}
                  title={item.quantity === 1 ? "Hapus item" : "Kurangi 1"}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQty = Math.max(1, parseInt(e.target.value) || 1);
                    updateCartItem(item.id, { quantity: newQty });
                  }}
                  min="1"
                  max={item.stock}
                />
                <button
                  onClick={() => {
                    if (item.quantity < item.stock) {
                      updateCartItem(item.id, {
                        quantity: item.quantity + 1
                      });
                    } else {
                      alert('Stok tidak mencukupi!');
                    }
                  }}
                  title="Tambah 1"
                  disabled={item.quantity >= item.stock}
                  style={{ 
                    background: item.quantity >= item.stock ? '#ccc' : '#667eea',
                    cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </div>

              <div className="cart-item-price">
                {formatCurrency(item.price)}
              </div>
            </div>

            {item.quantity >= item.stock && (
              <div style={{ fontSize: '11px', color: '#ff5722', marginTop: '4px' }}>
                ⚠️ Stok maksimal: {item.stock}
              </div>
            )}

            <div style={{ display: 'flex', gap: '4px', marginTop: '8px', marginBottom: '8px' }}>
              <button
                onClick={() => updateCartItem(item.id, {
                  quantity: Math.min(item.stock, item.quantity + 5)
                })}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={item.quantity >= item.stock}
              >
                +5
              </button>
              <button
                onClick={() => updateCartItem(item.id, {
                  quantity: Math.min(item.stock, item.quantity + 10)
                })}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={item.quantity >= item.stock}
              >
                +10
              </button>
              <button
                onClick={() => updateCartItem(item.id, {
                  quantity: item.stock
                })}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={item.quantity >= item.stock}
              >
                Max
              </button>
            </div>

            <div className="cart-item-discount">
              <label>Diskon:</label>
              <input
                type="number"
                value={item.discount}
                onChange={(e) => updateCartItem(item.id, {
                  discount: Math.max(0, parseInt(e.target.value) || 0)
                })}
                min="0"
                max={item.price * item.quantity}
              />
            </div>

            <div className="cart-item-total">
              Total: {formatCurrency((item.price * item.quantity) - item.discount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
