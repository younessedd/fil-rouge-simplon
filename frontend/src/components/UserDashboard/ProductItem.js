// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState } from 'react';
//import { cartAPI, getProductImageUrl } from '../../services/api';  // API services for cart and images
import './ProductItem.css';  // Component-specific styles
import { cartAPI } from '../../services/api/cart.api';import { getProductImageUrl } from '../../services/api/api.config';
// PRODUCT ITEM COMPONENT - Individual product display with cart functionality
const ProductItem = ({ product, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [addingToCart, setAddingToCart] = useState(false);      // Cart addition loading state
  const [showCartPopup, setShowCartPopup] = useState(false);    // Quantity selection popup visibility
  const [quantity, setQuantity] = useState(1);                  // Selected product quantity

  // ADD TO CART HANDLER - Open quantity selection popup
  const handleAddToCart = async () => {
    if (product.stock < 1) return;  // Prevent action if product is out of stock

    // Show the cart popup for quantity selection
    setShowCartPopup(true);
  };

  // CONFIRM ADD TO CART - Add selected quantity to cart
  const handleAddToCartConfirm = async () => {
    try {
      setAddingToCart(true);  // Start loading state for cart addition
      
      // API CALL - Add product to cart with selected quantity
      await cartAPI.add({
        product_id: product.id,  // Product identifier
        quantity: quantity       // Selected quantity
      });
      
      // SUCCESS NOTIFICATION - Confirm product addition
      showNotification(`Added ${quantity} x ${product.name} to cart successfully!`, 'success');
      
      // CLOSE POPUP AND RESET - Clean up popup state
      setShowCartPopup(false);  // Hide quantity selection popup
      setQuantity(1);           // Reset quantity to default
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart', 'error');  // Error notification
    } finally {
      setAddingToCart(false);  // End loading state regardless of outcome
    }
  };

  // CLOSE POPUP HANDLER - Reset popup state
  const closeCartPopup = () => {
    setShowCartPopup(false);  // Hide quantity selection popup
    setQuantity(1);           // Reset quantity to default
  };

  // INCREASE QUANTITY HANDLER - Increment selected quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);  // Increase quantity if within stock limits
    }
  };

  // DECREASE QUANTITY HANDLER - Decrement selected quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);  // Decrease quantity if above minimum
    }
  };

  // IMAGE URL HANDLING - Get product image URL with fallback
  const imageUrl = getProductImageUrl(product.image);
  
  // TOTAL PRICE CALCULATION - Compute price for selected quantity
  const totalPrice = (product.price * quantity).toFixed(2);

  // COMPONENT RENDER - Product card and popup interface
  return (
    <>
      {/* PRODUCT CARD - Main product display */}
      <div className="product-item-card">
        
        {/* PRODUCT IMAGE SECTION - Product visual representation */}
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={product.name}  // Accessibility alt text
            className="product-image"
            onError={(e) => {
              // FALLBACK IMAGE - Show placeholder if image fails to load
              e.target.src = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
            }}
          />
        </div>
        
        {/* PRODUCT INFORMATION SECTION - Text details */}
        <div className="product-info">
          {/* PRODUCT NAME - Main product title */}
          <h3 className="product-name">{product.name}</h3>
          
          {/* PRODUCT DESCRIPTION - Product details with truncation */}
          <p className="product-description">
            {product.description ? 
              (product.description.length > 100 ? 
                `${product.description.substring(0, 100)}...` :  // Truncate long descriptions
                product.description  // Show full description if short
              ) : 
              'No description available'  // Fallback for missing description
            }
          </p>
          
          {/* PRODUCT META SECTION - Price and stock information */}
          <div className="product-meta">
            {/* PRODUCT PRICE - Display product price */}
            <span className="product-price">{product.price} DH</span>
            {/* STOCK STATUS - Dynamic stock display with styling */}
            <span className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* ACTION BUTTON SECTION - Add to cart functionality */}
        <div className="product-actions">
          <button
            className={`product-btn ${product.stock < 1 ? 'btn-out-of-stock' : 'btn-add-cart'}`}
            onClick={handleAddToCart}  // Open quantity selection popup
            disabled={product.stock < 1}  // Disable if out of stock
          >
            {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}  {/* Dynamic button text */}
          </button>
        </div>
      </div>

      {/* CART POPUP MODAL - Quantity selection interface */}
      {showCartPopup && (
        <div className="cart-popup-overlay">
          <div className="cart-popup-container">
            {/* CLOSE BUTTON - Dismiss popup */}
            <button className="cart-popup-close" onClick={closeCartPopup}>
              Close  {/* Close button text */}
            </button>
            
            <div className="cart-popup-content">
              {/* PRODUCT INFORMATION IN POPUP - Quick product overview */}
              <div className="cart-popup-product">
                {/* PRODUCT IMAGE IN POPUP */}
                <div className="cart-popup-image">
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    onError={(e) => {
                      // FALLBACK IMAGE - Show placeholder if image fails to load
                      e.target.src = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
                    }}
                  />
                </div>
                {/* PRODUCT DETAILS IN POPUP */}
                <div className="cart-popup-info">
                  <h3 className="cart-popup-title">{product.name}</h3>  {/* Product name */}
                  <div className="cart-popup-price">{product.price} DH</div>  {/* Unit price */}
                  <span className={`cart-popup-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}  {/* Stock status */}
                  </span>
                </div>
              </div>

              {/* PRODUCT DESCRIPTION IN POPUP - Full description display */}
              {product.description && (
                <div className="cart-popup-description">
                  <p>{product.description}</p>  {/* Full product description */}
                </div>
              )}

              {/* QUANTITY SELECTOR SECTION - Quantity adjustment controls */}
              <div className="cart-popup-quantity">
                <span className="quantity-label">Quantity:</span>  {/* Quantity label */}
                <div className="quantity-controls">
                  {/* DECREASE QUANTITY BUTTON */}
                  <button 
                    className="quantity-btn decrease"
                    onClick={decreaseQuantity}  // Decrease quantity
                    disabled={quantity <= 1}    // Disable at minimum quantity
                  >
                    Decrease  {/* Decrease button text */}
                  </button>
                  {/* QUANTITY INPUT - Direct quantity entry */}
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      // VALIDATE INPUT - Ensure quantity stays within valid range
                      const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                      setQuantity(value);
                    }}
                    className="quantity-input"
                  />
                  {/* INCREASE QUANTITY BUTTON */}
                  <button 
                    className="quantity-btn increase"
                    onClick={increaseQuantity}    // Increase quantity
                    disabled={quantity >= product.stock}  // Disable at maximum stock
                  >
                    Increase  {/* Increase button text */}
                  </button>
                </div>
              </div>

              {/* TOTAL PRICE DISPLAY - Calculated total for selected quantity */}
              <div className="cart-popup-total">
                <span className="total-label">Total Price:</span>  {/* Total label */}
                <span className="total-amount">{totalPrice} DH</span>  {/* Calculated total */}
              </div>

              {/* ACTION BUTTONS SECTION - Final decision buttons */}
              <div className="cart-popup-actions">
                {/* CANCEL BUTTON - Close popup without action */}
                <button 
                  className="cart-popup-cancel" 
                  onClick={closeCartPopup}  // Close popup
                  disabled={addingToCart}   // Disable during loading
                >
                  Cancel  {/* Cancel button text */}
                </button>
                {/* CONFIRM BUTTON - Add to cart with selected quantity */}
                <button 
                  className="cart-popup-confirm"
                  onClick={handleAddToCartConfirm}  // Add to cart
                  disabled={addingToCart || product.stock < 1}  // Disable during loading or if out of stock
                >
                  {addingToCart ? (
                    <span className="loading-content">
                      <div className="loading-spinner"></div>
                      Adding to Cart...  {/* Loading state text */}
                    </span>
                  ) : (
                    `Add ${quantity} to Cart` 
                    
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// DEFAULT EXPORT - Make component available for import
export default ProductItem;