import React from 'react';
import { imageHelpers } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, showAddButton = true }) => {
  
  // Handle add to cart button click
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <img 
        src={imageHelpers.getProductImageUrl(product.image)} 
        alt={product.name}
        className="product-image"
        onError={handleImageError}
      />
      
      {/* Product Information */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description || 'No description available'}
        </p>
        
        {/* Price and Stock Information */}
        <div className="product-details">
          <p className="product-price">${product.price}</p>
          <p className="product-stock">
            Stock: {product.stock} {product.stock === 0 && '(Out of Stock)'}
          </p>
        </div>

        {/* Add to Cart Button - Only show if enabled and product in stock */}
        {showAddButton && (
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`add-to-cart-btn ${product.stock === 0 ? 'out-of-stock' : ''}`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;