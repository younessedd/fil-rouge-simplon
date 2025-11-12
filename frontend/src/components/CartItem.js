import React from 'react';
import { imageHelpers } from '../services/api';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  
  // Handle quantity increase
  const handleIncrease = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1 && onUpdateQuantity) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  // Handle remove item from cart
  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  // Calculate total price for this item
  const totalPrice = item.product ? item.product.price * item.quantity : 0;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <img 
          src={imageHelpers.getProductImageUrl(item.product?.image)} 
          alt={item.product?.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=No+Image';
          }}
        />
      </div>

      {/* Product Information */}
      <div className="cart-item-info">
        <h4 className="product-title">{item.product?.name || 'Product'}</h4>
        <p className="product-price">${item.product?.price || 0} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="quantity-controls">
        <button 
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="quantity-btn"
        >
          -
        </button>
        
        <span className="quantity-display">{item.quantity}</span>
        
        <button 
          onClick={handleIncrease}
          className="quantity-btn"
        >
          +
        </button>
      </div>

      {/* Total Price and Remove Button */}
      <div className="cart-item-actions">
        <p className="total-price">${totalPrice.toFixed(2)}</p>
        <button 
          onClick={handleRemove}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;