import React, { useState } from 'react';
import { cartAPI, getProductImageUrl } from '../../services/api';

const ProductItem = ({ product, onViewDetails }) => {
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock < 1) {
      alert('Product is out of stock');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.add({
        product_id: product.id,
        quantity: 1
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const imageUrl = getProductImageUrl(product.image);

  return (
    <div className="card">
      <div 
        style={{ 
          height: '200px', 
          overflow: 'hidden', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        <img 
          src={imageUrl} 
          alt={product.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
          }}
        />
      </div>
      
      <h3 style={{ margin: '1rem 0 0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#666', margin: '0.5rem 0', fontSize: '0.9rem' }}>
        {product.description ? 
          (product.description.length > 80 ? 
            `${product.description.substring(0, 80)}...` : 
            product.description
          ) : 
          'No description available'
        }
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1.1rem' }}>
          {product.price} SAR
        </span>
        <span style={{ 
          color: product.stock > 0 ? '#27ae60' : '#e74c3c',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          className="btn"
          style={{ flex: 1 }}
          onClick={() => onViewDetails && onViewDetails(product)}
        >
          View Details
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock < 1}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;