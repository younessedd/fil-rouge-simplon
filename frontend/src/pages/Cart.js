import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import Loading from '../components/Loading';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCartItems(response.data);
    } catch (error) {
      setError('Failed to load cart items');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      // This would typically be a PUT request to update quantity
      // For now, we'll update locally
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      setError('Failed to remove item from cart');
      console.error('Error removing item:', error);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clear();
        setCartItems([]);
      } catch (error) {
        setError('Failed to clear cart');
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const response = await cartAPI.checkout();
      alert('Order placed successfully!');
      setCartItems([]);
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Checkout failed');
      console.error('Error during checkout:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  // Calculate total items count
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Page Header */}
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="cart-error">
            {error}
            <button onClick={() => setError('')} className="error-close">
              ×
            </button>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="cart-content">
            {/* Cart Items List */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h2>Cart Items ({calculateTotalItems()})</h2>
                <button
                  onClick={handleClearCart}
                  className="clear-cart-btn"
                >
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({calculateTotalItems()}):</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="checkout-btn"
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="empty-cart">
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => navigate('/products')}
                className="start-shopping-btn"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;