// REACT IMPORT - Core React functionality
import React from 'react';
import { getProductImageUrl } from '../../services/api';  // API service for product images
import './CartItem.css';  // Component-specific styles

// CART ITEM COMPONENT - Individual cart item display with removal functionality
const CartItem = ({ item, onRemove }) => {
  // ENHANCED ITEM ID GETTER - Extract cart item identifier from various data structures
  const getItemId = (item) => {
    return item?.id || item?.cart_id || item?.cart_item_id || item?.pivot?.id;
  };

  // ENHANCED PRODUCT NAME GETTER - Extract product name with fallback
  const getProductName = (item) => {
    if (!item) return 'Unknown Product';  // Fallback for missing item
    return item.product?.name || item.name || 'Unknown Product';  // Handle nested product data
  };

  // ENHANCED PRODUCT PRICE GETTER - Extract product price with fallback
  const getProductPrice = (item) => {
    if (!item) return 0;  // Fallback for missing item
    return item.product?.price || item.price || item.pivot?.price || 0;  // Handle various price locations
  };

  // ENHANCED PRODUCT QUANTITY GETTER - Extract quantity with fallback
  const getProductQuantity = (item) => {
    if (!item) return 1;  // Default quantity
    return item.quantity || item.pivot?.quantity || 1;  // Handle various quantity locations
  };

  // ENHANCED IMAGE URL GETTER - Generate product image URL with fallback
  const getImageUrl = (item) => {
    if (!item) return 'https://via.placeholder.com/300x300/ECF4E8/93BFC7?text=No+Image';  // Fallback image
    
    const imagePath = item.product?.image || item.image;  // Extract image path
    return getProductImageUrl(imagePath);  // Generate full image URL
  };

  // ENHANCED STOCK STATUS GETTER - Determine stock availability
  const getStockStatus = (item) => {
    if (!item) return 'stock-out';  // Default to out of stock
    const stock = item.product?.stock || item.stock || 0;  // Extract stock quantity
    return stock > 0 ? 'stock-available' : 'stock-out';  // Return status based on stock
  };

  // DATA EXTRACTION - Get all necessary item properties using helper functions
  const itemId = getItemId(item);              // Unique cart item identifier
  const itemName = getProductName(item);       // Product name for display
  const itemPrice = getProductPrice(item);     // Unit price of the product
  const itemQuantity = getProductQuantity(item); // Quantity in cart
  const itemTotal = itemPrice * itemQuantity;  // Calculated total price
  const imageUrl = getImageUrl(item);          // Product image URL
  const stockStatus = getStockStatus(item);    // Stock availability status
  const stockText = stockStatus === 'stock-available' 
    ? `In Stock (${item.product?.stock || item.stock})`  // Show stock count if available
    : 'Out of Stock';  // Out of stock message

  // COMPONENT RENDER - Cart item display with product information
  return (
    <div className="cart-item-card">
      
      {/* PRODUCT IMAGE SECTION - Visual representation of product */}
      <div className="cart-item-image-container">
        <img 
          src={imageUrl} 
          alt={itemName}  // Accessibility alt text
          className="cart-item-image"
          onError={(e) => {
            // FALLBACK IMAGE HANDLER - Replace broken images with placeholder
            e.target.src = 'https://via.placeholder.com/400x300/ECF4E8/93BFC7?text=No+Image';
          }}
        />
      </div>
      
      {/* PRODUCT INFORMATION SECTION - Text details and pricing */}
      <div className="cart-item-info">
        
        {/* PRODUCT NAME - Main product title */}
        <h3 className="cart-item-name">{itemName}</h3>
        
        {/* PRODUCT DETAILS GRID - Organized product information */}
        <div className="cart-item-details-grid">
          
          {/* UNIT PRICE DETAIL - Display individual product price */}
          <div className="cart-item-detail">
            <span className="detail-label">Unit Price</span>  {/* Price label */}
            <span className="detail-value price-value">{itemPrice} DH</span>  {/* Price value */}
          </div>
          
          {/* QUANTITY DETAIL - Display quantity in cart */}
          <div className="cart-item-detail">
            <span className="detail-label">Quantity</span>  {/* Quantity label */}
            <span className="detail-value">{itemQuantity}</span>  {/* Quantity value */}
          </div>
          
          {/* STOCK STATUS DETAIL - Display availability information */}
          <div className="cart-item-detail">
            <span className="detail-label">Stock Status</span>  {/* Status label */}
            <span className={`stock-indicator ${stockStatus}`}>
              {stockText}  {/* Dynamic stock text */}
            </span>
          </div>
        </div>
        
        {/* ITEM TOTAL SECTION - Calculated total for this cart item */}
        <div className="cart-item-total">
          <p className="item-total-text">
            Item Total:  {/* Total label */}
            <span className="item-total-amount"> {itemTotal.toFixed(2)} DH</span>  {/* Calculated total */}
          </p>
        </div>
      </div>

      {/* REMOVE BUTTON SECTION - Action to remove item from cart */}
      <button 
        className="cart-item-remove-btn"
        onClick={() => onRemove(item)}  // Trigger removal handler from parent
      >
        Remove Item  {/* Button text */}
      </button>
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default CartItem;