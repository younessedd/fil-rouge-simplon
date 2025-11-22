import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import './OrdersManagement.css';

// ORDERS MANAGEMENT COMPONENT - Admin interface for order management
const OrdersManagement = ({ showNotification }) => {
  // STATE MANAGEMENT - Application data and UI state
  const [allOrders, setAllOrders] = useState([]);           // Complete orders dataset
  const [orders, setOrders] = useState([]);                 // Currently displayed orders
  const [loading, setLoading] = useState(true);             // Initial data loading state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // Order selected for deletion
  const [searchQuery, setSearchQuery] = useState('');       // Search filter input
  const [isMobile, setIsMobile] = useState(false);          // Responsive layout detection
  const [deleteLoading, setDeleteLoading] = useState(false); // Delete operation loading state
  
  // PAGINATION STATE - Data pagination controls
  const [currentPage, setCurrentPage] = useState(1);        // Current page number
  const [lastPage, setLastPage] = useState(1);              // Total number of pages
  const [totalOrders, setTotalOrders] = useState(0);        // Total orders count
  const [perPage] = useState(5);                            // Items per page (constant)

  // FORMAT PRICE UTILITY - Display prices in Moroccan Dirham format
  const formatPrice = (price) => {
    return `${parseFloat(price).toFixed(2)} DH`;
  };

  // RESPONSIVE LAYOUT EFFECT - Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // INITIAL DATA LOADING - Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // FETCH ALL ORDERS - Retrieve complete orders dataset from API
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllOrders(1, 1000);
      const ordersData = response.data.data || response.data;
      
      setAllOrders(ordersData);
      setTotalOrders(ordersData.length);
      
      const calculatedLastPage = Math.ceil(ordersData.length / perPage);
      setLastPage(calculatedLastPage);
      
      updateDisplayedOrders(ordersData, 1);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.message.includes('AUTH_REQUIRED')) {
        showNotification('Please log in to access orders', 'error');
      } else {
        showNotification('Failed to load orders', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // UPDATE DISPLAYED ORDERS - Paginate and filter orders for display
  const updateDisplayedOrders = (ordersData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setOrders(ordersData.slice(startIndex, endIndex));
  };

  // SEARCH HANDLER - Filter orders based on search criteria
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedOrders(allOrders, 1);
      setCurrentPage(1);
      setTotalOrders(allOrders.length);
      setLastPage(Math.ceil(allOrders.length / perPage));
      showNotification('Showing all orders', 'info');
      return;
    }

    const filteredOrders = allOrders.filter(order =>
      order.id.toString().includes(searchQuery) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.total?.toString().includes(searchQuery)
    );

    setTotalOrders(filteredOrders.length);
    const calculatedLastPage = Math.ceil(filteredOrders.length / perPage) || 1;
    setLastPage(calculatedLastPage);
    updateDisplayedOrders(filteredOrders, 1);
    setCurrentPage(1);

    if (filteredOrders.length > 0) {
      showNotification(`Found ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} for "${searchQuery}"`, 'success');
    } else {
      showNotification(`No orders found for "${searchQuery}"`, 'info');
    }
  };

  // KEYBOARD NAVIGATION - Handle Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // DELETE MODAL CONTROLS - Open confirmation dialog for order deletion
  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // CLOSE MODALS - Reset modal state
  const closeModals = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  // ORDER DELETION HANDLER - Remove order from system
  const handleDelete = async () => {
    if (!selectedOrder) return;

    const orderIdToDelete = selectedOrder.id;
    const orderNumber = selectedOrder.id;
    
    try {
      setDeleteLoading(true);
      
      await ordersAPI.deleteOrder(orderIdToDelete);
      
      // Update local state after successful deletion
      const updatedOrders = allOrders.filter(order => order.id !== orderIdToDelete);
      setAllOrders(updatedOrders);
      setTotalOrders(updatedOrders.length);
      
      const calculatedLastPage = Math.ceil(updatedOrders.length / perPage) || 1;
      setLastPage(calculatedLastPage);
      
      const newCurrentPage = currentPage > calculatedLastPage ? Math.max(1, calculatedLastPage) : currentPage;
      setCurrentPage(newCurrentPage);
      updateDisplayedOrders(updatedOrders, newCurrentPage);
      
      showNotification(`Order #${orderNumber} deleted successfully!`, 'success');
      closeModals();
      
    } catch (error) {
      console.error('Delete error:', error);
      
      // Fallback: Remove from local state even if API fails
      const updatedOrders = allOrders.filter(order => order.id !== orderIdToDelete);
      setAllOrders(updatedOrders);
      setTotalOrders(updatedOrders.length);
      
      const calculatedLastPage = Math.ceil(updatedOrders.length / perPage) || 1;
      setLastPage(calculatedLastPage);
      
      const newCurrentPage = currentPage > calculatedLastPage ? Math.max(1, calculatedLastPage) : currentPage;
      setCurrentPage(newCurrentPage);
      updateDisplayedOrders(updatedOrders, newCurrentPage);
      
      // Error-specific notification messages
      if (error.message.includes('AUTH_REQUIRED')) {
        showNotification('Please log in to delete orders', 'error');
      } else if (error.message.includes('NOT_FOUND') || error.message.includes('No query results')) {
        showNotification(`Order #${orderNumber} was deleted successfully!`, 'success');
      } else {
        showNotification(`${error.message}`, 'error');
      }
      
      closeModals();
    } finally {
      setDeleteLoading(false);
    }
  };

  // PAGINATION HANDLER - Navigate between order pages
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedOrders(allOrders, page);
  };

  // ORDER ITEMS CALCULATOR - Compute totals for order items
  const calculateOrderItemsTotal = (order) => {
    if (!order.items || order.items.length === 0) return { totalQuantity: 0, totalAmount: 0 };

    const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = order.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
    
    return { totalQuantity, totalAmount };
  };

  // PAGINATION RENDERER - Generate pagination controls
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          {isMobile ? 'First' : 'First'}
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)}>
          {isMobile ? 'Prev' : 'Previous'}
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)}>
          {isMobile ? 'Next' : 'Next'}
        </button>
      );
    }

    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(lastPage)}>
          {isMobile ? 'Last' : 'Last'}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}
        </div>
        <div className="pagination-info">
          Showing {orders.length} of {totalOrders} orders | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  // ORDER ROW RENDERER - Display order information based on screen size
  const renderOrderRow = (order) => {
    const { totalQuantity, totalAmount } = calculateOrderItemsTotal(order);

    // MOBILE LAYOUT - Card-based design for small screens
    if (isMobile) {
      return (
        <div key={order.id} className="data-card-mobile">
          <div className="order-card-header">
            <div className="order-id-mobile">
              #{order.id}
            </div>
            <div className="order-total-mobile">
              {formatPrice(order.total || 0)}
            </div>
          </div>
          
          <div className="order-card-body">
            <div className="order-info-grid">
              <div className="order-info-item">
                <span className="info-label">Customer</span>
                <span className="info-value">
                  {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})
                </span>
              </div>
              
              <div className="order-info-item">
                <span className="info-label">Date</span>
                <span className="info-value">
                  {order.created_at ? new Date(order.created_at).toLocaleString('en-US') : 'N/A'}
                </span>
              </div>
              
              <div className="order-info-item">
                <span className="info-label">Items</span>
                <span className="info-value">
                  {order.items?.length || 0} products ({totalQuantity} pieces)
                </span>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items-section">
                <h4 className="items-title">Order Items:</h4>
                <div className="items-list">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item-mobile">
                      <div className="item-name">{item.product?.name || 'Unknown Product'}</div>
                      <div className="item-details">
                        <span>Qty: {item.quantity || 0}</span>
                        <span>Price: {formatPrice(item.price || 0)}</span>
                        <span>Total: {formatPrice((item.quantity || 0) * (item.price || 0))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total-mobile">
                  <strong>ORDER TOTAL: {formatPrice(totalAmount)}</strong>
                </div>
              </div>
            )}
          </div>
          
          <div className="order-card-actions">
            <button 
              className="management-btn btn-danger"
              onClick={() => openDeleteModal(order)}
            >
              Delete Order
            </button>
          </div>
        </div>
      );
    }

    // DESKTOP LAYOUT - Table-based design for large screens
    return (
      <div key={order.id} className="order-card-desktop">
        <div className="order-header-desktop">
          <div className="order-main-info">
            <div className="order-id-desktop">
              <strong>Order #{order.id}</strong>
            </div>
            <div className="order-customer-info">
              <span className="customer-name">{order.user?.name || 'N/A'}</span>
              <span className="customer-email">{order.user?.email || 'N/A'}</span>
            </div>
            <div className="order-meta-info">
              <span className="order-date">{order.created_at ? new Date(order.created_at).toLocaleString('en-US') : 'N/A'}</span>
              <span className="order-total">{formatPrice(order.total || 0)}</span>
            </div>
          </div>
          <button 
            className="management-btn btn-danger"
            onClick={() => openDeleteModal(order)}
          >
            Delete Order
          </button>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="order-items-desktop">
            <h4 className="items-title">Order Items:</h4>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price (DH)</th>
                  <th>Total (DH)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="product-id-cell">#{item.product?.id || 'N/A'}</td>
                    <td className="product-name-cell">{item.product?.name || 'Unknown Product'}</td>
                    <td className="quantity-cell">{item.quantity || 0}</td>
                    <td className="price-cell">{formatPrice(item.price || 0)}</td>
                    <td className="total-cell">{formatPrice((item.quantity || 0) * (item.price || 0))}</td>
                  </tr>
                ))}
                <tr className="order-total-row">
                  <td colSpan="2" className="total-label">
                    ORDER TOTAL ({totalQuantity} {totalQuantity === 1 ? 'piece' : 'pieces'}):
                  </td>
                  <td className="total-quantity">{totalQuantity}</td>
                  <td></td>
                  <td className="total-amount">{formatPrice(totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // LOADING STATE - Display during initial data fetch
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading orders...</p>
      </div>
    );
  }

  // MAIN COMPONENT RENDER - Order management interface
  return (
    <div className="management-container">
      {/* HEADER SECTION - Title and refresh controls */}
      <div className="management-card">
        <div className="management-header">
          <div className="header-title">
            <h1>Orders Management</h1>
            <p className="header-subtitle">Manage and track customer orders efficiently</p>
          </div>
          <button 
            className="management-btn btn-primary"
            onClick={() => fetchAllOrders()}
          >
            Refresh List
          </button>
        </div>

        {/* SEARCH SECTION - Order filtering interface */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by order ID, customer name, email, or total..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <div className="search-actions">
              <button className="management-btn btn-primary btn-search" onClick={handleSearch}>
                Search
              </button>
              <button className="management-btn btn-secondary" onClick={() => {
                setSearchQuery('');
                fetchAllOrders();
              }}>
                Clear
              </button>
            </div>
          </div>
          <div className="search-tips">
            Search tips: Enter order ID, customer name, email, or total amount to find specific orders
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL - Order deletion safety check */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Order</h3>
              <button className="modal-close" onClick={closeModals}>Close</button>
            </div>
            
            <div className="delete-modal-content">
              <div className="delete-icon">Warning</div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to delete order <strong>#{selectedOrder?.id}</strong>?
              </p>
              <div className="order-details-preview">
                <p><strong>Customer:</strong> {selectedOrder?.user?.name || 'N/A'} ({selectedOrder?.user?.email || 'N/A'})</p>
                <p><strong>Total:</strong> {formatPrice(selectedOrder?.total || 0)}</p>
                <p><strong>Date:</strong> {selectedOrder?.created_at ? new Date(selectedOrder.created_at).toLocaleString('en-US') : 'N/A'}</p>
              </div>
              <div className="delete-warning">
                This action cannot be undone and all order data will be permanently lost!
              </div>
              
              <div className="delete-actions">
                <button 
                  className="management-btn btn-secondary" 
                  onClick={closeModals}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button 
                  className="management-btn btn-danger" 
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Deleting...
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

      {/* ORDERS LIST SECTION - Main orders display area */}
      <div className="management-card">
        <div className="section-header">
          <h3>Orders List</h3>
          <div className="orders-count">
            {totalOrders} order{totalOrders !== 1 ? 's' : ''} total
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">No Orders</div>
            <h4>No Orders Found</h4>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'There are no orders in your system yet.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map(order => renderOrderRow(order))}
            </div>
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;