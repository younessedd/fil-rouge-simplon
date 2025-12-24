import React, { useState, useEffect } from 'react';
import { getProductImageUrl } from '../../services/api/api.config';
import { cartAPI } from '../../services/api/cart.api';
import './CartItem.css';

const CartItem = ({ item, onRemove, showNotification }) => {
  const getProductName = () => {
    if (!item) return 'Unknown Product';
    return item.product?.name || item.name || 'Unknown Product';
  };

  const getProductPrice = () => {
    if (!item) return 0;
    return item.product?.price || item.price || item.pivot?.price || 0;
  };

  const getProductQuantity = () => {
    if (!item) return 1;
    return item.quantity || item.pivot?.quantity || 1;
  };

  const getCartItemId = () => {
    return item?.id || item?.cart_id || item?.cart_item_id || item?.pivot?.id;
  };

  const [quantity, setQuantity] = useState(getProductQuantity());
  const [updating, setUpdating] = useState(false);
  const [quantityInput, setQuantityInput] = useState(String(getProductQuantity()));

  useEffect(() => {
    setQuantity(getProductQuantity());
    setQuantityInput(String(getProductQuantity()));
  }, [item]);

  const updateQuantity = async (newQty) => {
    const cartItemId = getCartItemId();
    if (!cartItemId) {
      if (showNotification) showNotification('Cannot update quantity: missing cart item id', 'error');
      setQuantityInput(String(getProductQuantity()));
      return;
    }

    if (newQty < 1) {
      // treat as remove
      if (onRemove) onRemove(item);
      return;
    }

    try {
      setUpdating(true);
      setQuantity(newQty); // optimistic
      setQuantityInput(String(newQty));
      await cartAPI.update(cartItemId, newQty);
      // notify other components: send a lightweight update so UI can patch locally
      window.dispatchEvent(new CustomEvent('cartItemUpdated', { detail: { cart_item_id: cartItemId, quantity: newQty } }));
      if (showNotification) showNotification('Cart updated', 'success');
    } catch (err) {
      console.error('Failed to update cart item:', err);
      // revert optimistic change
      const original = getProductQuantity();
      setQuantity(original);
      setQuantityInput(String(original));

      // Determine a user-friendly message
      let msg = 'Failed to update quantity';
      if (err && err.message) {
        if (err.message.includes('AUTH_REQUIRED')) {
          msg = 'Please log in to update your cart';
        } else if (err.message.includes('NOT_FOUND')) {
          msg = 'Item not found in your cart';
        } else if (err.message.startsWith('Server error:') || err.message.includes('500')) {
          msg = 'Server error updating cart, please try again later';
        } else {
          msg = err.message;
        }
      }

      if (showNotification) showNotification(msg, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const decreaseQuantity = () => {
    // If already at minimum (1), do nothing — do not trigger removal or notifications
    if (quantity <= 1) return;
    updateQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    const max = item.product?.stock || item.stock || 9999;
    if (quantity >= max) {
      if (showNotification) showNotification('Cannot exceed available stock', 'error');
      return;
    }
    updateQuantity(quantity + 1);
  };

  const handleQuantityInputChange = (e) => {
    const val = e.target.value;
    // allow empty while typing
    if (val === '') {
      setQuantityInput('');
      return;
    }
    // only allow positive integers
    if (!/^\d+$/.test(val)) return;
    const num = parseInt(val, 10);
    const max = item.product?.stock || item.stock || 9999;
    if (num > max) {
      setQuantityInput(String(max));
      if (showNotification) showNotification('Cannot exceed available stock', 'error');
      return;
    }
    setQuantityInput(String(num));
  };

  const commitQuantity = () => {
    const val = quantityInput === '' ? 0 : parseInt(quantityInput, 10);
    if (isNaN(val) || val < 1) {
      // reset to current quantity
      setQuantityInput(String(quantity));
      if (showNotification) showNotification('Quantity must be at least 1', 'error');
      return;
    }
    if (val === quantity) return; // nothing to do
    updateQuantity(val);
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') commitQuantity();
  };

  const getImageUrl = () => {
    if (!item) {
      return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
    }
    
    if (item.product?.image_url) {
      return item.product.image_url;
    }
    
    if (item.product?.image) {
      return getProductImageUrl(item.product.image);
    }
    
    if (item.image) {
      return getProductImageUrl(item.image);
    }
    
    if (item.pivot?.image) {
      return getProductImageUrl(item.pivot.image);
    }
    
    return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
  };

  const getStockStatus = () => {
    if (!item) return 'stock-out';
    const stock = item.product?.stock || item.stock || 0;
    return stock > 0 ? 'stock-available' : 'stock-out';
  };

  const getFragranceNotes = () => {
    if (!item) return null;
    return item.product?.notes || item.notes || null;
  };

  const itemName = getProductName();
  const itemPrice = getProductPrice();
  const itemQuantity = getProductQuantity();
  const itemTotal = itemPrice * itemQuantity;
  const imageUrl = getImageUrl();
  const stockStatus = getStockStatus();
  const fragranceNotes = getFragranceNotes();
  const stockText = stockStatus === 'stock-available' 
    ? `${item?.product?.stock || item?.stock || 0} Available`
    : 'Out of Stock';

  return (
    <div className="cart-item-card">
      <div className="cart-item-image-container">
        <img 
          src={imageUrl} 
          alt={itemName}
          className="cart-item-image"
          onError={(e) => {
            e.target.src = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
          }}
        />
        <div className="cart-item-badge">Premium</div>
      </div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{itemName}</h3>
        
        {fragranceNotes && (
          <div className="cart-item-notes">
            <span className="notes-label">Scent Profile:</span>
            <span className="notes-value">{fragranceNotes}</span>
          </div>
        )}
        
        <div className="cart-item-details-grid">
          <div className="cart-item-detail">
            <span className="detail-label">Price</span>
            <span className="detail-value price-value">{itemPrice} DH</span>
          </div>
          
          <div className="cart-item-detail">
            <span className="detail-label">Quantity</span>
            <div className="quantity-controls">
              <button className="qty-btn" onClick={decreaseQuantity} disabled={updating || quantity <= 1} aria-label="Decrease quantity">-</button>
              <input
                className="quantity-input"
                type="number"
                min={1}
                value={quantityInput}
                onChange={handleQuantityInputChange}
                onBlur={commitQuantity}
                onKeyDown={handleQuantityKeyDown}
                disabled={updating}
                aria-label="Quantity"
              />
              <button className="qty-btn" onClick={increaseQuantity} disabled={updating || (item.product?.stock && quantity >= item.product.stock)} aria-label="Increase quantity">+</button>
            </div>
          </div>
          
          <div className="cart-item-detail">
            <span className="detail-label">Stock</span>
            <span className={`stock-indicator ${stockStatus}`}>
              {stockText}
            </span>
          </div>
        </div>
        
        <div className="cart-item-total">
          <p className="item-total-text">
            Total: <span className="item-total-amount">{itemTotal.toFixed(2)} DH</span>
          </p>
        </div>
      </div>

      <button 
        className="cart-item-remove-btn"
        onClick={() => onRemove(item)}
        aria-label={`Remove ${itemName} from cart`}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;