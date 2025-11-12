import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, ordersAPI, usersAPI } from '../services/api';
import Loading from '../components/Loading';
import './Admin.css';

const Admin = ({ user }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch admin dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch all data for admin dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products, orders, and users in parallel
      const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAllAdmin(),
        usersAPI.getAll()
      ]);

      const products = productsResponse.data.data || productsResponse.data;
      const orders = ordersResponse.data.orders || ordersResponse.data;
      const users = usersResponse.data;

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      // Get recent orders (last 5)
      const recent = orders.slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue
      });

      setRecentOrders(recent);

    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Page Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}! Here's your store overview.</p>
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

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">
              📦
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
            <Link to="/admin/products" className="stat-link">
              View All →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              📋
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
            <Link to="/admin/orders" className="stat-link">
              View All →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              👥
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <Link to="/admin/users" className="stat-link">
              View All →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              💰
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
            <span className="stat-link">All Time</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products/new" className="action-card">
              <div className="action-icon">➕</div>
              <h4>Add New Product</h4>
              <p>Create a new product listing</p>
            </Link>

            <Link to="/admin/categories" className="action-card">
              <div className="action-icon">📁</div>
              <h4>Manage Categories</h4>
              <p>Add or edit product categories</p>
            </Link>

            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👤</div>
              <h4>Manage Users</h4>
              <p>View and manage user accounts</p>
            </Link>

            <Link to="/products" className="action-card">
              <div className="action-icon">🏪</div>
              <h4>View Store</h4>
              <p>See how customers view your store</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">
              View All Orders →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="orders-table">
              <div className="table-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              
              <div className="table-body">
                {recentOrders.map(order => (
                  <div key={order.id} className="table-row">
                    <span className="order-id">#{order.id}</span>
                    <span className="customer-name">
                      {order.user?.name || 'Unknown User'}
                    </span>
                    <span className="order-date">
                      {formatDate(order.created_at)}
                    </span>
                    <span className="order-amount">
                      {formatCurrency(parseFloat(order.total))}
                    </span>
                    <span className={`status-badge ${order.status || 'completed'}`}>
                      {order.status || 'Completed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-orders">
              <p>No recent orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;