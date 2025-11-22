import React, { useState, useEffect, useRef } from 'react';
import { getProductImageUrl } from '../../services/api';
import './ProductDetails.css';

const ProductDetails = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const modalRef = useRef(null);

  const imageUrl = getProductImageUrl(product.image);

  const handleAddToCart = async () => {
    if (product.stock < 1) return;

    try {
      setAddingToCart(true);
      await onAddToCart(product, quantity);
      // NO CART CONFIRMATION POPUP - just close the details popup
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Close with ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="product-details-overlay">
      <div className="product-details-container" ref={modalRef}>
        
        {/* Close Button */}
        <button className="details-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="product-details-content">
          
          {/* Product Image */}
          <div className="product-image-section">
            <div className="main-image-container">
              <img 
                src={imageUrl} 
                alt={product.name}
                className="main-product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400/ECF4E8/93BFC7?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <h1 className="product-details-title">{product.name}</h1>
            
            <div className="product-details-price">{product.price} DH</div>
            
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>

            {product.description && (
              <p className="product-description">
                {product.description}
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="quantity-section">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-controls">
              <button 
                className="quantity-btn decrease"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                  setQuantity(value);
                }}
                className="quantity-input"
              />
              <button 
                className="quantity-btn increase"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="total-price-section">
            <span className="total-price-label">Total Price:</span>
            <span className="total-price-amount">{totalPrice} DH</span>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-to-cart-btn ${product.stock < 1 ? 'out-of-stock' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock < 1}
          >
            {addingToCart ? (
              <span className="loading-content">
                <div className="loading-spinner"></div>
                Adding to Cart...
              </span>
            ) : product.stock < 1 ? (
              'Out of Stock'
            ) : (
              `Add ${quantity} to Cart`
            )}
          </button>

          <button className="close-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;