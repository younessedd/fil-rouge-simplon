import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import { cartAPI } from '../../services/api';

const ShoppingCart = ({ onViewChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCartItems(response.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to load shopping cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      alert('Product removed from cart successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove product from cart');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;

    try {
      await cartAPI.clear();
      setCartItems([]);
      alert('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setCheckoutLoading(true);
      const response = await cartAPI.checkout();
      alert('Order placed successfully! Thank you for your purchase.');
      setCartItems([]);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Safe navigation function
  const handleBrowseProducts = () => {
    if (typeof onViewChange === 'function') {
      onViewChange('products');
    } else {
      // Fallback: Use hash navigation
      window.location.hash = 'products';
    }
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateTotals();

  if (loading) {
    return (
      <div className="loading">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div 
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}
          ></div>
          <p style={{ color: '#666', margin: 0 }}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cart Header */}
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>🛒 Shopping Cart</h2>
            <p style={{ color: '#666', margin: 0 }}>Review and manage your items</p>
          </div>
          
          {cartItems.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-danger" 
                onClick={handleClearCart}
              >
                🗑️ Clear Cart
              </button>
              <button 
                className="btn btn-success" 
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? '🔄 Processing...' : '✅ Checkout Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="card mb-2" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                {cartItems.length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Unique Items</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                {totalItems}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Quantity</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
                {totalAmount.toFixed(2)} SAR
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div>
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={handleRemoveItem}
              />
            ))}
            
            {/* Order Summary */}
            <div className="card" style={{ 
              backgroundColor: '#2c3e50', 
              color: 'white',
              marginTop: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1.5rem'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Order Summary</h3>
                  <p style={{ margin: '0', color: '#bdc3c7', fontSize: '0.9rem' }}>
                    {totalItems} items in cart
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', color: '#bdc3c7' }}>Total</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                    {totalAmount.toFixed(2)} SAR
                  </div>
                </div>
              </div>
              
              <button 
                className="btn btn-success" 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                style={{ 
                  width: '100%', 
                  marginTop: '1rem',
                  fontSize: '1.1rem',
                  padding: '1rem'
                }}
              >
                {checkoutLoading ? '🔄 Processing Your Order...' : '🚀 Proceed to Checkout'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>Your Cart is Empty</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Looks like you haven't added any products to your cart yet.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleBrowseProducts}  // Use safe navigation function
              style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}
            >
              🛍️ Browse Products
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ShoppingCart;