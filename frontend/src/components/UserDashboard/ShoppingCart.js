// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';  // Individual cart item component
//import { cartAPI } from '../../services/api';  // API service for cart operations
import './ShoppingCart.css';  // Component-specific styles
import { cartAPI } from '../../services/api/cart.api';

// SHOPPING CART COMPONENT - Cart management and checkout interface for I Smell Shop
const ShoppingCart = ({ onViewChange, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [cartItems, setCartItems] = useState([]);                    // Array of cart items
  const [loading, setLoading] = useState(true);                      // Initial loading state
  const [checkoutLoading, setCheckoutLoading] = useState(false);     // Checkout process loading
  
  // MODAL STATES - Confirmation dialog visibility
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);  // Checkout confirmation
  const [showRemoveModal, setShowRemoveModal] = useState(false);      // Remove item confirmation
  const [selectedItem, setSelectedItem] = useState(null);            // Item selected for removal

  // EFFECT HOOK - Fetch cart data when component mounts
  useEffect(() => {
    fetchCart();

    // Listen for cart updates from other components (e.g., Add to Cart button)
    const handleCartUpdated = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdated);

    // Listen for lightweight item updates to patch local state without full fetch
    const handleCartItemUpdated = (e) => {
      const detail = e && e.detail ? e.detail : null;
      if (!detail) return;
      const { cart_item_id, quantity } = detail;
      setCartItems(prev => prev.map(item => {
        const id = getItemId(item);
        if (id === cart_item_id) {
          const updated = { ...item };
          // update both top-level and pivot quantity if present
          updated.quantity = quantity;
          if (updated.pivot) updated.pivot.quantity = quantity;
          return updated;
        }
        return item;
      }));
    };

    window.addEventListener('cartItemUpdated', handleCartItemUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('cartItemUpdated', handleCartItemUpdated);
    };
  }, []);  // Empty dependency array ensures this runs only once on mount

  // FETCH CART FUNCTION - Retrieve current cart contents from API
  const fetchCart = async () => {
    try {
      setLoading(true);  // Start loading state
      const response = await cartAPI.get();  // API call to get cart data
      
      // HANDLE DIFFERENT RESPONSE STRUCTURES - API compatibility
      let cartData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          cartData = response.data;  // Direct array response
        } else if (response.data.items && Array.isArray(response.data.items)) {
          cartData = response.data.items;  // Nested items array
        } else if (response.data.data && Array.isArray(response.data.data)) {
          cartData = response.data.data;  // Nested data array
        }
      }
      
      setCartItems(cartData);  // Update cart items state
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('Failed to load shopping cart', 'error');
      setCartItems([]);  // Reset to empty cart on error
    } finally {
      setLoading(false);  // End loading state regardless of outcome
    }
  };

  // REMOVE ITEM HANDLER - Remove product from cart with confirmation
  const handleRemoveItem = async (itemId) => {
    if (!itemId) {
      showNotification('Invalid item ID', 'error');
      return;
    }

    try {
      // FIND ITEM FOR NOTIFICATION - Get product name before removal
      const itemToRemove = cartItems.find(item => getItemId(item) === itemId);
      const itemName = getProductName(itemToRemove);
      
      // OPTIMISTIC UI UPDATE - Remove from local state immediately
      const updatedItems = cartItems.filter(item => getItemId(item) !== itemId);
      setCartItems(updatedItems);
      
      // CLOSE MODAL - Immediate user feedback
      closeModals();
      
      // API CALL - Remove from server database
      await cartAPI.remove(itemId);
      
      // SUCCESS NOTIFICATION - Confirm removal
      showNotification(`"${itemName}" removed from cart successfully!`, 'success');
      
    } catch (error) {
      console.error('Error removing item:', error);
      
      // SYNC WITH SERVER - Reload cart to ensure consistency
      fetchCart();
      
      // ENHANCED ERROR HANDLING - Specific error messages
      let errorMessage = 'Failed to remove product from cart';
      if (error.message) {
        if (error.message.includes('AUTH_REQUIRED')) {
          errorMessage = 'Please log in to manage your cart';
        } else if (error.message.includes('NOT_FOUND')) {
          errorMessage = 'Product was already removed';
        } else {
          errorMessage = error.message;
        }
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  // CHECKOUT PROCESS HANDLER - Complete purchase and create order
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);  // Start checkout loading state
      
      // API CALL - Process checkout and create order
      const response = await cartAPI.checkout();
      console.log('Checkout response:', response);
      
      // CLEAR CART - Empty local cart state after successful checkout
      setCartItems([]);
      
      // CLOSE MODAL - Close confirmation dialog
      closeModals();
      
      // SUCCESS NOTIFICATION - Confirm order creation
      showNotification('Order placed successfully! Thank you for your purchase at I Smell Shop.', 'success');
      
      // REDIRECT TO ORDERS - Navigate to order history after delay
      setTimeout(() => {
        if (typeof onViewChange === 'function') {
          onViewChange('orders');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      
      // ENHANCED ERROR HANDLING - Specific checkout errors
      let errorMessage = 'Checkout failed. Please try again.';
      if (error.message) {
        if (error.message.includes('AUTH_REQUIRED')) {
          errorMessage = 'Please log in to complete checkout';
        } else if (error.message.includes('empty') || error.message.includes('EMPTY')) {
          errorMessage = 'Your cart is empty';
        } else if (error.message.includes('stock') || error.message.includes('STOCK')) {
          errorMessage = 'Some fragrances are out of stock';
        } else {
          errorMessage = error.message;
        }
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setCheckoutLoading(false);  // End checkout loading state
    }
  };

  // MODAL HANDLERS - Control confirmation dialog visibility

  // OPEN REMOVE MODAL - Prepare item removal confirmation
  const openRemoveModal = (item) => {
    if (!item) {
      showNotification('No item selected', 'error');
      return;
    }
    
    const itemId = getItemId(item);
    if (!itemId) {
      showNotification('Invalid cart item: Missing ID', 'error');
      return;
    }
    
    setSelectedItem(item);        // Store selected item
    setShowRemoveModal(true);     // Show removal confirmation
  };

  // OPEN CHECKOUT MODAL - Prepare checkout confirmation
  const openCheckoutModal = () => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }
    setShowCheckoutModal(true);  // Show checkout confirmation
  };

  // CLOSE MODALS - Reset all modal states
  const closeModals = () => {
    setShowCheckoutModal(false);  // Hide checkout modal
    setShowRemoveModal(false);    // Hide remove modal
    setSelectedItem(null);        // Clear selected item
  };

  // NAVIGATION HANDLER - Browse products navigation
  const handleBrowseProducts = () => {
    if (typeof onViewChange === 'function') {
      onViewChange('products');  // Use parent navigation
    } else {
      window.location.hash = 'products';  // Fallback navigation
    }
  };

  // SAFE DATA ACCESSORS - Handle various API response structures

  // GET ITEM ID - Extract cart item identifier
  const getItemId = (item) => {
    return item?.id || item?.cart_id || item?.cart_item_id || item?.pivot?.id;
  };

  // GET PRODUCT NAME - Extract product name from item
  const getProductName = (item) => {
    if (!item) return 'Unknown Fragrance';
    return item.product?.name || item.name || 'Unknown Fragrance';
  };

  // GET PRODUCT PRICE - Extract product price from item
  const getProductPrice = (item) => {
    if (!item) return 0;
    return item.product?.price || item.price || item.pivot?.price || 0;
  };

  // GET PRODUCT QUANTITY - Extract product quantity from item
  const getProductQuantity = (item) => {
    if (!item) return 1;
    return item.quantity || item.pivot?.quantity || 1;
  };

  // CALCULATE CART TOTALS - Compute cart summary statistics
  const calculateTotals = () => {
    const totalItems = cartItems.reduce((total, item) => total + getProductQuantity(item), 0);  // Total quantity
    const totalAmount = cartItems.reduce((total, item) => {
      const price = getProductPrice(item);      // Item price
      const quantity = getProductQuantity(item); // Item quantity
      return total + (price * quantity);        // Accumulate total
    }, 0);

    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateTotals();  // Destructure totals

  // LOADING STATE - Display during initial data fetch
  if (loading) {
    return (
      <div className="shopping-cart-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your fragrance cart...</p>
        </div>
      </div>
    );
  }

  // COMPONENT RENDER - Main cart management interface
  return (
    <div className="shopping-cart-container">
      
      {/* CART HEADER SECTION - Title and action buttons */}
      <div className="cart-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Shopping Cart</h1>  {/* Main page title */}
            <p className="header-subtitle">Review and manage your luxury fragrances</p>  {/* Updated subtitle */}
          </div>
          
          {/* ACTION BUTTONS - Only show when cart has items */}
          {cartItems.length > 0 && (
            <div className="header-actions">
              <button 
                className="management-btn btn-secondary" 
                onClick={fetchCart}  // Refresh cart data
              >
                Refresh Cart
              </button>
              <button 
                className="management-btn btn-success" 
                onClick={openCheckoutModal}  // Open checkout confirmation
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CART SUMMARY SECTION - Cart statistics */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-value items">{cartItems.length}</div>  {/* Unique items count */}
              <div className="summary-label">Unique Fragrances</div>  {/* Updated label */}
            </div>
            <div className="summary-item">
              <div className="summary-value quantity">{totalItems}</div>  {/* Total quantity */}
              <div className="summary-label">Total Bottles</div>  {/* Updated label */}
            </div>
            <div className="summary-item">
              <div className="summary-value amount">{totalAmount.toFixed(2)} DH</div>  {/* Total amount */}
              <div className="summary-label">Total Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* CART ITEMS CONTAINER - Main content area */}
      <div className="cart-items-container">
        {cartItems.length > 0 ? (
          <div>
            {/* RENDER CART ITEMS - Map through cart items */}
            {cartItems.map((item, index) => (
              <CartItem 
                key={getItemId(item) || index}  // Unique key for each item
                item={item} 
                onRemove={openRemoveModal}  // Remove item handler
                showNotification={showNotification} // Notification handler
              />
            ))}
            
            {/* ORDER SUMMARY SECTION - Checkout information */}
            <div className="order-summary">
              <div className="order-summary-content">
                <div className="order-summary-info">
                  <h3>Order Summary</h3>  {/* Summary title */}
                  <p>{totalItems} fragrance bottles in cart</p>  {/* Updated item count */}
                </div>
                <div className="order-total-display">
                  <div className="order-total-label">Total Amount</div>
                  <div className="order-total-amount">{totalAmount.toFixed(2)} DH</div>  {/* Final total */}
                </div>
              </div>
              
              {/* CHECKOUT BUTTON - Primary call to action */}
              <button 
                className="management-btn btn-success checkout-btn"
                onClick={openCheckoutModal}  // Open checkout confirmation
              >
                Complete Your Fragrance Order
              </button>  {/* Updated button text */}
            </div>
          </div>
        ) : (
          /* EMPTY CART STATE - No items message */
          <div className="empty-state">
            <h3>Your Fragrance Cart is Empty</h3>  {/* Updated empty state title */}
            <p>
              Discover our luxury perfumes and add your favorite scents to start building your collection.
            </p>  {/* Updated empty state message */}
            <button 
              className="management-btn btn-primary"
              onClick={handleBrowseProducts}  // Navigate to products
            >
              Explore Luxury Fragrances  {/* Updated call to action */}
            </button>
          </div>
        )}
      </div>

      {/* CHECKOUT CONFIRMATION MODAL - Order confirmation dialog */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Your Fragrance Order</h3>  {/* Updated modal title */}
              <button className="modal-close" onClick={closeModals}>Close</button>  {/* Close button */}
            </div>
            
            <div className="modal-body">
              <div className="confirmation-content">
                <h4>Ready to Complete Your Fragrance Order?</h4>  {/* Updated confirmation question */}
                <p>You're about to purchase {totalItems} fragrance bottles for a total of <strong>{totalAmount.toFixed(2)} DH</strong></p>  {/* Updated order details */}
                
                {/* ORDER PREVIEW - Show first few items */}
                <div className="order-preview">
                  <h5>Your Fragrance Selection:</h5>  {/* Updated preview title */}
                  <div className="preview-items">
                    {cartItems.slice(0, 3).map(item => (
                      <div key={getItemId(item)} className="preview-item">
                        <span>{getProductName(item)}</span>  {/* Product name */}
                        <span>{getProductQuantity(item)} × {getProductPrice(item)} DH</span>  {/* Quantity and price */}
                      </div>
                    ))}
                    {/* TRUNCATED ITEMS - Show if more than 3 items */}
                    {cartItems.length > 3 && (
                      <div className="preview-more">
                        +{cartItems.length - 3} more fragrances...
                      </div>  /* Updated text */
                    )}
                  </div>
                </div>

                {/* CHECKOUT NOTICE - Important information */}
                <div className="checkout-notice">
                  <p>Your fragrance order will be processed immediately</p>  {/* Updated notice */}
                  <p>You will receive an order confirmation from I Smell Shop</p>  {/* Updated notice */}
                  <p>Fragrances will be added to your order history</p>  {/* Updated notice */}
                </div>

                {/* CONFIRMATION ACTIONS - Final decision buttons */}
                <div className="confirmation-actions">
                  <button 
                    className="management-btn btn-secondary" 
                    onClick={closeModals}  // Cancel checkout
                    disabled={checkoutLoading}  // Disable during processing
                  >
                    Continue Shopping
                  </button>  {/* Updated button text */}
                  <button 
                    className="management-btn btn-success" 
                    onClick={handleCheckout}  // Confirm purchase
                    disabled={checkoutLoading}  // Disable during processing
                  >
                    {checkoutLoading ? (
                      <span className="loading-content">
                        <div className="loading-spinner-small"></div>
                        Processing Your Order...  {/* Loading state */}
                      </span>
                    ) : (
                      'Confirm Fragrance Purchase'  /* Updated button text */
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE ITEM CONFIRMATION MODAL - Item removal dialog */}
      {showRemoveModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Remove Fragrance</h3>  {/* Updated modal title */}
              <button className="modal-close" onClick={closeModals}>Close</button>  {/* Close button */}
            </div>
            
            <div className="modal-body">
              <div className="confirmation-content">
                <h4>Remove from Cart?</h4>  {/* Confirmation question */}
                <p>Are you sure you want to remove <strong>"{getProductName(selectedItem)}"</strong> from your fragrance cart?</p>  {/* Updated item reference */}
                
                {/* ITEM PREVIEW - Show item details */}
                <div className="item-preview">
                  <p><strong>Quantity:</strong> {getProductQuantity(selectedItem)} bottles</p>  {/* Updated quantity label */}
                  <p><strong>Price:</strong> {getProductPrice(selectedItem)} DH each</p>  {/* Item price */}
                  <p><strong>Total:</strong> {(getProductQuantity(selectedItem) * getProductPrice(selectedItem)).toFixed(2)} DH</p>  {/* Item total */}
                </div>

                {/* CONFIRMATION ACTIONS - Final decision buttons */}
                <div className="confirmation-actions">
                  <button 
                    className="management-btn btn-secondary" 
                    onClick={closeModals}  // Keep item in cart
                  >
                    Keep in Cart
                  </button>
                  <button 
                    className="management-btn btn-danger" 
                    onClick={() => handleRemoveItem(getItemId(selectedItem))}  // Remove item
                  >
                    Remove Fragrance
                  </button>  {/* Updated button text */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default ShoppingCart;