import React from 'react';
import { t } from '../../locales/id';
import './Cart.css';

const Cart = ({ cart, updateCartItem, removeFromCart, formatCurrency }) => {
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
      <h3>{t('pos.cart')}</h3>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-header">
              <span className="cart-item-name">{item.name}</span>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
              >
                ×
              </button>
            </div>
            
            <div className="cart-item-details">
              <div className="quantity-control">
                <button
                  onClick={() => updateCartItem(item.id, {
                    quantity: Math.max(1, item.quantity - 1)
                  })}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.id, {
                    quantity: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  min="1"
                />
                <button
                  onClick={() => updateCartItem(item.id, {
                    quantity: item.quantity + 1
                  })}
                >
                  +
                </button>
              </div>

              <div className="cart-item-price">
                {formatCurrency(item.price)}
              </div>
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
