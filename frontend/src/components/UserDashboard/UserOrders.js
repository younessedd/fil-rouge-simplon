// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';  // API service for order operations
import './UserOrders.css';  // Component-specific styles

// USER ORDERS COMPONENT - Order history and management interface
const UserOrders = ({ onViewChange, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [orders, setOrders] = useState([]);                    // User's order list
  const [loading, setLoading] = useState(true);                // Initial loading state
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // Delete modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null);    // Order selected for deletion
  const [deleteLoading, setDeleteLoading] = useState(false);   // Delete operation loading state

  // EFFECT HOOK - Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);  // Empty dependency array ensures this runs only once on mount

  // FETCH ORDERS FUNCTION - Retrieve user's order history
  const fetchOrders = async () => {
    try {
      setLoading(true);  // Start loading state
      const response = await ordersAPI.getUserOrders();  // API call to get orders
      const ordersData = response.data.data || response.data || [];  // Handle different response formats
      setOrders(ordersData);  // Update orders state with fetched data
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Failed to load your orders', 'error');  // Show error notification
    } finally {
      setLoading(false);  // End loading state regardless of outcome
    }
  };

  // OPEN DELETE MODAL - Prepare order for deletion confirmation
  const openDeleteModal = (order) => {
    setSelectedOrder(order);        // Store selected order
    setShowDeleteModal(true);       // Show confirmation modal
  };

  // CLOSE DELETE MODAL - Reset deletion state
  const closeDeleteModal = () => {
    setShowDeleteModal(false);      // Hide modal
    setSelectedOrder(null);         // Clear selected order
    setDeleteLoading(false);        // Reset loading state
  };

  // DELETE ORDER HANDLER - Process order deletion
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;  // Guard clause if no order selected

    const orderIdToDelete = selectedOrder.id;    // Extract order ID
    const orderNumber = selectedOrder.id;        // Order number for display
    
    try {
      setDeleteLoading(true);  // Start delete operation loading
      
      // API CALL ATTEMPT - Try different deletion methods for compatibility
      let response;
      try {
        // First attempt with deleteOrder method
        response = await ordersAPI.deleteOrder(orderIdToDelete);
      } catch (firstError) {
        console.log('deleteOrder method failed, trying delete method...');
        // Fallback to delete method if deleteOrder fails
        response = await ordersAPI.delete(orderIdToDelete);
      }
      
      // SUCCESS HANDLING - Update local state and show confirmation
      const updatedOrders = orders.filter(order => order.id !== orderIdToDelete);
      setOrders(updatedOrders);  // Remove deleted order from local state
      
      showNotification(`Order #${orderNumber} deleted successfully!`, 'success');
      closeDeleteModal();  // Close confirmation modal
      
    } catch (error) {
      console.error('Delete error:', error);
      
      // ENHANCED ERROR HANDLING - Provide specific error messages
      let errorMessage = 'Failed to delete order';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Other error types
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      showNotification(errorMessage, 'error');
      // Order remains in local state since deletion failed
    } finally {
      setDeleteLoading(false);  // End delete operation loading
    }
  };

  // BROWSE PRODUCTS HANDLER - Navigate to products view
  const handleBrowseProducts = () => {
    if (typeof onViewChange === 'function') {
      onViewChange('products');  // Use parent navigation if available
    } else {
      window.location.hash = 'products';  // Fallback navigation
    }
  };

  // CALCULATE ORDER STATISTICS - Generate order summary data
  const calculateOrderStats = () => {
    const totalOrders = orders.length;  // Count total orders
    const totalSpent = orders.reduce((total, order) => total + parseFloat(order.total || 0), 0);  // Sum order totals
    return { totalOrders, totalSpent };
  };

  const { totalOrders, totalSpent } = calculateOrderStats();  // Destructure statistics

  // LOADING STATE - Display during data fetch
  if (loading) {
    return (
      <div className="user-orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // COMPONENT RENDER - Main order management interface
  return (
    <div className="user-orders-container">
      
      {/* ORDERS HEADER SECTION - Title and refresh button */}
      <div className="management-card">
        <div className="orders-header">
          <div className="header-title">
            <h1>My Orders</h1>  {/* Main page title */}
            <p className="header-subtitle">Track and manage your purchase history</p>  {/* Subtitle */}
          </div>
          <button className="management-btn btn-secondary" onClick={fetchOrders}>
            Refresh Orders  {/* Refresh button text */}
          </button>
        </div>
      </div>

      {/* ORDER STATISTICS SECTION - Summary of order history */}
      {orders.length > 0 && (
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{totalOrders}</div>  {/* Total orders count */}
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value total-spent">{totalSpent.toFixed(2)} DH</div>  {/* Total spent amount */}
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS LIST SECTION - Display individual orders */}
      {orders.length > 0 ? (
        orders.map(order => {
          const orderDate = new Date(order.created_at);  // Parse order date
          const totalItems = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;  // Calculate total items

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-main-info">
                  <div className="order-title">
                    <h3 className="order-id">Order #{order.id}</h3>  {/* Order number */}
                    <span className="items-badge">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}  {/* Item count badge */}
                    </span>
                  </div>
                  
                  {/* ORDER METADATA GRID - Order details */}
                  <div className="order-meta-grid">
                    <div className="order-meta-item">
                      <span className="meta-label">Date</span>
                      <span className="meta-value">{orderDate.toLocaleDateString('en-US')}</span>  {/* Order date */}
                    </div>
                    <div className="order-meta-item">
                      <span className="meta-label">Time</span>
                      <span className="meta-value">{orderDate.toLocaleTimeString('en-US')}</span>  {/* Order time */}
                    </div>
                    <div className="order-meta-item">
                      <span className="meta-label">Items</span>
                      <span className="meta-value">{order.items?.length || 0}</span>  {/* Number of item types */}
                    </div>
                    <div className="order-meta-item">
                      <span className="meta-label">Total Quantity</span>
                      <span className="meta-value">{totalItems}</span>  {/* Total items count */}
                    </div>
                    <div className="order-meta-item">
                      <span className="meta-label">Total Amount</span>
                      <span className="order-total">{order.total || 0} DH</span>  {/* Order total amount */}
                    </div>
                  </div>
                </div>
                
                {/* DELETE ORDER BUTTON */}
                <button 
                  className="management-btn btn-danger"
                  onClick={() => openDeleteModal(order)}  // Open delete confirmation
                >
                  Delete Order  {/* Button text */}
                </button>
              </div>

              {/* ORDER ITEMS SECTION - Detailed item list */}
              {order.items && order.items.length > 0 && (
                <div className="order-items-section">
                  <h4 className="items-title">Order Items</h4>  {/* Items section title */}
                  <div className="items-list">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-info">
                          <div className="item-name">{item.product?.name || 'Unknown Product'}</div>  {/* Product name */}
                          <div className="item-details">
                            {item.quantity || 0} × {item.price || 0} DH each  {/* Quantity and price */}
                          </div>
                        </div>
                        <div className="item-total">
                          {((item.quantity || 0) * (item.price || 0)).toFixed(2)} DH  {/* Item total */}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* ORDER TOTAL DISPLAY - Final order amount */}
                  <div className="order-total-section">
                    <span className="order-total-label">ORDER TOTAL</span>
                    <span className="order-total-amount">{order.total || 0} DH</span>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        /* EMPTY STATE - No orders message */
        <div className="empty-state">
          <h3>No Orders Yet</h3>  {/* Empty state title */}
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>  {/* Empty state message */}
          <button 
            className="management-btn btn-primary"
            onClick={handleBrowseProducts}  // Navigate to products
          >
            Browse Products  {/* Call to action button */}
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL - Order deletion confirmation */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Order</h3>  {/* Modal title */}
              <button className="modal-close" onClick={closeDeleteModal}>Close</button>  {/* Close button */}
            </div>
            
            <div className="delete-modal-content">
              <h4>Confirm Deletion</h4>  {/* Confirmation title */}
              <p>
                Are you sure you want to delete order <strong>#{selectedOrder?.id}</strong>?  {/* Order reference */}
              </p>
              
              {/* ORDER DETAILS PREVIEW - Show what will be deleted */}
              {selectedOrder && (
                <div className="order-details-preview">
                  <p><strong>Date:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('en-US') : 'N/A'}</p>
                  <p><strong>Total:</strong> {selectedOrder.total || 0} DH</p>
                  <p><strong>Items:</strong> {selectedOrder.items?.length || 0}</p>
                </div>
              )}
              
              <div className="delete-warning">
                This action cannot be undone and all order data will be permanently lost!  {/* Warning message */}
              </div>
              
              {/* DELETE ACTION BUTTONS - Confirm or cancel */}
              <div className="delete-actions">
                <button 
                  className="management-btn btn-secondary" 
                  onClick={closeDeleteModal}  // Cancel deletion
                  disabled={deleteLoading}    // Disable during loading
                >
                  Cancel  {/* Cancel button */}
                </button>
                <button 
                  className="management-btn btn-danger" 
                  onClick={handleDeleteOrder}  // Confirm deletion
                  disabled={deleteLoading}     // Disable during loading
                >
                  {deleteLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Deleting...  {/* Loading state */}
                    </span>
                  ) : (
                    'Confirm Delete' 
                    
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default UserOrders;