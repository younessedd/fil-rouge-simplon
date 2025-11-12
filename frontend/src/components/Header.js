import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/products" className="logo">
          🛍️ Our Store
        </Link>

        {/* Navigation Menu */}
        <nav className="nav">
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link">Shopping Cart</Link>
          <Link to="/orders" className="nav-link">My Orders</Link>
          
          {/* Admin Links - Only show for admin users */}
          {user && user.role === 'admin' && (
            <div className="admin-links">
              <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="user-section">
          {user ? (
            <div className="user-info">
              <span className="welcome">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;