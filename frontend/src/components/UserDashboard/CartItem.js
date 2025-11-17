import React from 'react';
import { getProductImageUrl } from '../../services/api';

const CartItem = ({ item, onRemove }) => {
  const imageUrl = getProductImageUrl(item.product.image);
  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="card" style={{ 
      display: 'flex', 
      gap: '1rem', 
      alignItems: 'center',
      marginBottom: '1rem'
    }}>
      {/* Product Image */}
      <div style={{ 
        width: '80px', 
        height: '80px', 
        overflow: 'hidden', 
        borderRadius: '4px',
        flexShrink: 0
      }}>
        <img 
          src={imageUrl} 
          alt={item.product.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=No+Image';
          }}
        />
      </div>
      
      {/* Product Information */}
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{item.product.name}</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <strong>Price:</strong> {item.product.price} SAR
          </p>
          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <strong>Quantity:</strong> {item.quantity}
          </p>
          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <strong>Stock:</strong> 
            <span style={{ 
              color: item.product.stock > 0 ? '#27ae60' : '#e74c3c',
              fontWeight: 'bold',
              marginLeft: '0.25rem'
            }}>
              {item.product.stock > 0 ? `Available (${item.product.stock})` : 'Out of Stock'}
            </span>
          </p>
        </div>
        
        {/* Item Total */}
        <div style={{ 
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#e8f4fd',
          borderRadius: '4px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            color: '#2c3e50', 
            margin: 0,
            fontSize: '1rem'
          }}>
            Item Total: <span style={{ color: '#e74c3c' }}>{itemTotal.toFixed(2)} SAR</span>
          </p>
        </div>
      </div>

      {/* Remove Button */}
      <button 
        className="btn btn-danger"
        onClick={() => onRemove(item.id)}
        style={{ 
          minWidth: '80px',
          alignSelf: 'flex-start'
        }}
      >
        🗑️ Remove
      </button>
    </div>
  );
};

export default CartItem;