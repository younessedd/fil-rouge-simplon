import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import Loading from '../components/Loading';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllAdmin();
      setOrders(response.data.orders || response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total items in an order
  const calculateTotalItems = (order) => {
    return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // This would typically be a PUT request to update order status
      // For now, we'll update locally
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      setError('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(orderId);
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        alert('Order deleted successfully');
      } catch (error) {
        setError('Failed to delete order');
        console.error('Error deleting order:', error);
      }
    }
  };

  // Filter orders by status
  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        {/* Page Header */}
        <div className="admin-orders-header">
          <h1>Manage Orders</h1>
          <p>View and manage all customer orders</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="admin-error">
            {error}
            <button onClick={() => setError('')} className="error-close">
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="orders-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="orders-count">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">
                      Order #{order.id}
                    </h3>
                    <p className="order-date">
                      Placed on {formatDate(order.created_at)}
                    </p>
                    <p className="customer-info">
                      Customer: <strong>{order.user?.name || 'Unknown User'}</strong>
                      <br />
                      Email: {order.user?.email || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="order-meta">
                    <div className="order-status-section">
                      <label>Status:</label>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="order-total">
                      ${parseFloat(order.total).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="order-details-quick">
                    <span className="items-count">
                      {calculateTotalItems(order)} items
                    </span>
                    <span className="order-id">
                      ID: #{order.id}
                    </span>
                  </div>
                  
                  <div className="order-actions">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="view-details-btn"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="delete-order-btn"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="order-details">
                    <h4>Order Items</h4>
                    
                    <div className="order-items-list">
                      {order.items?.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-image">
                            <img
                              src={item.product?.image_url || 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=No+Image'}
                              alt={item.product?.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=No+Image';
                              }}
                            />
                          </div>
                          
                          <div className="item-details">
                            <h5 className="item-name">{item.product?.name || 'Product'}</h5>
                            <p className="item-price">${item.price} each</p>
                          </div>
                          
                          <div className="item-quantity">
                            Qty: {item.quantity}
                          </div>
                          
                          <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Information */}
                    <div className="customer-details">
                      <h4>Customer Information</h4>
                      <div className="customer-info-grid">
                        <div>
                          <strong>Name:</strong> {order.user?.name || 'N/A'}
                        </div>
                        <div>
                          <strong>Email:</strong> {order.user?.email || 'N/A'}
                        </div>
                        <div>
                          <strong>Phone:</strong> {order.user?.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>Address:</strong> {order.user?.address || 'N/A'}
                        </div>
                        <div>
                          <strong>City:</strong> {order.user?.city || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Order Totals */}
                    <div className="order-totals">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                      <div className="total-row">
                        <span>Shipping:</span>
                        <span>$0.00</span>
                      </div>
                      <div className="total-row">
                        <span>Tax:</span>
                        <span>$0.00</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Total:</span>
                        <span>${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty Orders State */
          <div className="empty-orders">
            <div className="empty-orders-content">
              <h2>No orders found</h2>
              <p>
                {filterStatus 
                  ? `No orders with status "${filterStatus}" found.`
                  : 'No orders have been placed yet.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;