import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';

const OrdersManagement = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [perPage] = useState(5); // Increased from 1 to 5 for better usability

  useEffect(() => {
    fetchAllOrders();
  }, []);

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
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedOrders = (ordersData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setOrders(ordersData.slice(startIndex, endIndex));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedOrders(allOrders, 1);
      setCurrentPage(1);
      return;
    }

    // Search by Order ID (if query is number) or by user name/email/total
    const filteredOrders = allOrders.filter(order =>
      order.id.toString().includes(searchQuery) || // Search by Order ID
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.total.toString().includes(searchQuery)
    );

    setTotalOrders(filteredOrders.length);
    const calculatedLastPage = Math.ceil(filteredOrders.length / perPage);
    setLastPage(calculatedLastPage);
    updateDisplayedOrders(filteredOrders, 1);
    setCurrentPage(1);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;

    try {
      await ordersAPI.delete(selectedOrder.id);
      alert('Order deleted successfully');
      closeModals();
      fetchAllOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedOrders(allOrders, page);
  };

  // Function to calculate total items in order
  const calculateOrderItemsTotal = (order) => {
    if (!order.items || order.items.length === 0) return { totalQuantity: 0, totalAmount: 0 };

    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    return { totalQuantity, totalAmount };
  };

  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" className="btn" onClick={() => handlePageChange(1)}>
          ⏮️ First
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="btn" onClick={() => handlePageChange(currentPage - 1)}>
          ◀️ Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${currentPage === i ? 'btn-primary' : ''}`}
          onClick={() => handlePageChange(i)}
          style={{ minWidth: '40px', fontWeight: currentPage === i ? 'bold' : 'normal' }}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="btn" onClick={() => handlePageChange(currentPage + 1)}>
          Next ▶️
        </button>
      );
    }

    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="btn" onClick={() => handlePageChange(lastPage)}>
          Last ⏭️
        </button>
      );
    }

    return (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {pages}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Showing {orders.length} of {totalOrders} orders | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div 
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}
          ></div>
          <p style={{ color: '#666', margin: 0 }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>📦 Orders Management</h2>
          <button className="btn" onClick={() => fetchAllOrders()}>
            Refresh List
          </button>
        </div>

        {/* Search Bar - Updated for ID search */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by order ID, user name, email, or total..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1,
                minWidth: '250px',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              🔍 Search
            </button>
            <button className="btn" onClick={() => {
              setSearchQuery('');
              fetchAllOrders();
            }}>
              🔄 Show All
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 Search tip: You can search by Order ID, user name, email, or total amount
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Delete Order</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete order <strong>#{selectedOrder?.id}</strong>?
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>User:</strong> {selectedOrder?.user?.name} ({selectedOrder?.user?.email})
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Total:</strong> {selectedOrder?.total} SAR
              </p>
              <p style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>
                This action cannot be undone!
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn" 
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length > 0 ? (
        <>
          {orders.map(order => {
            const { totalQuantity, totalAmount } = calculateOrderItemsTotal(order);
            
            return (
              <div key={order.id} className="card mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3>Order #{order.id}</h3>
                    <p><strong>User ID:</strong> {order.user?.id}</p>
                    <p><strong>User:</strong> {order.user?.name} ({order.user?.email})</p>
                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString('en-US')}</p>
                    <p><strong>Total:</strong> {order.total} SAR</p>
                    <p><strong>Number of Products:</strong> {order.items?.length || 0}</p>
                    <p><strong>Total Items Quantity:</strong> {totalQuantity} pieces</p>
                  </div>
                  
                  <button 
                    className="btn btn-danger"
                    onClick={() => openDeleteModal(order)}
                  >
                    Delete Order
                  </button>
                </div>

                {order.items && order.items.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4>Order Details:</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.id}>
                            <td><strong>#{item.product?.id}</strong></td>
                            <td>{item.product?.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} SAR</td>
                            <td>{(item.quantity * item.price).toFixed(2)} SAR</td>
                          </tr>
                        ))}
                        {/* Total row */}
                        <tr style={{ 
                          backgroundColor: '#f8f9fa', 
                          fontWeight: 'bold',
                          borderTop: '2px solid #dee2e6'
                        }}>
                          <td colSpan="2" style={{ textAlign: 'right', paddingRight: '1rem' }}>
                            📦 ORDER TOTAL:
                          </td>
                          <td>
                            {totalQuantity} {totalQuantity === 1 ? 'piece' : 'pieces'}
                          </td>
                          <td></td>
                          <td>
                            {totalAmount.toFixed(2)} SAR
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          
          {renderPagination()}
        </>
      ) : (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <p>No orders found</p>
          {searchQuery && (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              No results for "{searchQuery}"
            </p>
          )}
        </div>
      )}

      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: '#666';
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            color: #000;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OrdersManagement;