import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';

const UserOrders = ({ onViewChange }) => { // Added onViewChange prop
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
      await ordersAPI.delete(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  // Safe navigation function
  const handleBrowseProducts = () => {
    if (typeof onViewChange === 'function') {
      onViewChange('products');
    } else {
      // Fallback: Use hash navigation
      window.location.hash = 'products';
    }
  };

  // Calculate order statistics - REMOVED AVERAGE ORDER
  const calculateOrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((total, order) => total + parseFloat(order.total), 0);

    return { totalOrders, totalSpent };
  };

  const { totalOrders, totalSpent } = calculateOrderStats();

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
          <p style={{ color: '#666', margin: 0 }}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Orders Header */}
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>📦 My Orders</h2>
            <p style={{ color: '#666', margin: 0 }}>Track and manage your purchase history</p>
          </div>
          <button className="btn" onClick={fetchOrders}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Order Statistics - REMOVED AVERAGE ORDER */}
      {orders.length > 0 && (
        <div className="card mb-2" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                {totalOrders}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Orders</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                {totalSpent.toFixed(2)} SAR
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Spent</div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        orders.map(order => {
          const orderDate = new Date(order.created_at);
          const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

          return (
            <div key={order.id} className="card mb-2">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                flexWrap: 'wrap', 
                gap: '1rem' 
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Order #{order.id}</h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Date:</strong> {orderDate.toLocaleDateString('en-US')}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Time:</strong> {orderDate.toLocaleTimeString('en-US')}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Items:</strong> {order.items?.length || 0}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Total Quantity:</strong> {totalItems}
                      </p>
                    </div>
                    <div>
                      <p style={{ 
                        margin: '0.25rem 0', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold',
                        color: '#e74c3c'
                      }}>
                        {order.total} SAR
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteOrder(order.id)}
                  style={{ minWidth: '100px' }}
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#34495e' }}>Order Items:</h4>
                  <div style={{ 
                    display: 'grid', 
                    gap: '0.5rem'
                  }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.75rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <strong>{item.product?.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {item.quantity} × {item.price} SAR each
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                          {(item.quantity * item.price).toFixed(2)} SAR
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Total */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    <span>ORDER TOTAL:</span>
                    <span>{order.total} SAR</span>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No Orders Yet</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleBrowseProducts} // Use safe navigation function
            style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}
          >
            🛍️ Browse Products
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default UserOrders;