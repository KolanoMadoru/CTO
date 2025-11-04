import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../src/components/POS/Cart';

describe('Cart Component', () => {
  const mockFormatCurrency = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;
  const mockUpdateCartItem = vi.fn();
  const mockRemoveFromCart = vi.fn();

  it('should render empty cart message when cart is empty', () => {
    render(
      <Cart
        cart={[]}
        updateCartItem={mockUpdateCartItem}
        removeFromCart={mockRemoveFromCart}
        formatCurrency={mockFormatCurrency}
      />
    );

    expect(screen.getByText(/Keranjang Kosong/i)).toBeInTheDocument();
  });

  it('should render cart items correctly', () => {
    const cart = [
      {
        id: 'p1',
        name: 'Nasi Goreng',
        price: 15000,
        quantity: 2,
        discount: 0,
      },
    ];

    render(
      <Cart
        cart={cart}
        updateCartItem={mockUpdateCartItem}
        removeFromCart={mockRemoveFromCart}
        formatCurrency={mockFormatCurrency}
      />
    );

    expect(screen.getByText('Nasi Goreng')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should call removeFromCart when remove button is clicked', () => {
    const cart = [
      {
        id: 'p1',
        name: 'Nasi Goreng',
        price: 15000,
        quantity: 2,
        discount: 0,
      },
    ];

    render(
      <Cart
        cart={cart}
        updateCartItem={mockUpdateCartItem}
        removeFromCart={mockRemoveFromCart}
        formatCurrency={mockFormatCurrency}
      />
    );

    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('p1');
  });

  it('should update quantity when + button is clicked', () => {
    const cart = [
      {
        id: 'p1',
        name: 'Nasi Goreng',
        price: 15000,
        quantity: 1,
        discount: 0,
      },
    ];

    render(
      <Cart
        cart={cart}
        updateCartItem={mockUpdateCartItem}
        removeFromCart={mockRemoveFromCart}
        formatCurrency={mockFormatCurrency}
      />
    );

    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);

    expect(mockUpdateCartItem).toHaveBeenCalledWith('p1', { quantity: 2 });
  });

  it('should calculate total correctly', () => {
    const cart = [
      {
        id: 'p1',
        name: 'Nasi Goreng',
        price: 15000,
        quantity: 2,
        discount: 5000,
      },
    ];

    render(
      <Cart
        cart={cart}
        updateCartItem={mockUpdateCartItem}
        removeFromCart={mockRemoveFromCart}
        formatCurrency={mockFormatCurrency}
      />
    );

    // Expected total: (15000 * 2) - 5000 = 25000
    expect(screen.getByText(/Total: Rp 25.000/i)).toBeInTheDocument();
  });
});
