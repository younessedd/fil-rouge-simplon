// =====================================================
// I SMELL SHOP - MINI E-COMMERCE FRONTEND (React)
// Main Application Controller - App.js
// Handles authentication, routing, notifications,
// admin dashboard, and user shopping workflow.
// =====================================================

import React, { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Authentication Components
import Login from './components/Shared/Login';
import Register from './components/Shared/Register';

// Public Landing Page
import HeroPage from './components/Shared/HeroPage';

// Admin Dashboard Pages
import AdminHome from './components/AdminDashboard/AdminHome';
import ProductsManagement from './components/AdminDashboard/ProductsManagement';
import UsersManagement from './components/AdminDashboard/UsersManagement';
import OrdersManagement from './components/AdminDashboard/OrdersManagement';
import CategoriesManagement from './components/AdminDashboard/CategoriesManagement';

// User Pages
import ProductsList from './components/UserDashboard/ProductsList';
import ShoppingCart from './components/UserDashboard/ShoppingCart';
import UserOrders from './components/UserDashboard/UserOrders';
import UserProfile from './components/UserDashboard/UserProfile';

// Authentication Utilities
import { getCurrentUser, isAuthenticated } from './utils/auth';


// =====================================================
// MAIN APP COMPONENT
// =====================================================
function App() {

  // -------------------------------
  // APPLICATION STATE
  // -------------------------------
  const [user, setUser] = useState(null);   
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });


  // -------------------------------
  // NOTIFICATION HANDLER (TOAST)
  // -------------------------------
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });

    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };


  // -------------------------------
  // CHECK AUTHENTICATION ON START
  // -------------------------------
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      }
      setLoading(false);
    };
    checkAuth();

    // Listen for requests to open the cart (e.g., after adding an item)
    const handleOpenCart = () => {
      setCurrentView('cart');
    };
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);


  // -------------------------------
  // LOGIN HANDLER
  // -------------------------------
  const handleLogin = (userData, token) => {
    setUser(userData);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    const targetView = userData.role === 'admin' ? 'admin' : 'products';
    setCurrentView(targetView);

    showNotification(`Welcome back, ${userData.name || userData.email}!`);
  };


  // -------------------------------
  // LOGOUT HANDLER
  // -------------------------------
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentView('home');

    showNotification('Logged out successfully', 'info');
  };


  // -------------------------------
  // NOTIFICATION UI COMPONENT
  // -------------------------------
  const Notification = () => {
    if (!notification.show) return null;

    return (
      <div className={`notification notification-${notification.type}`}>
        <span className="notification-message">{notification.message}</span>
        <button
          className="notification-close"
          onClick={() => setNotification({ show: false, message: '', type: 'success' })}
        >
          ×
        </button>
      </div>
    );
  };


  // -------------------------------
  // LOADING SCREEN
  // -------------------------------
  if (loading) {
    return (
      <div className="loading">
        <div>Loading I Smell Shop...</div>
      </div>
    );
  }


  // -------------------------------
  // ROUTER LOGIC (WITHOUT React Router)
  // -------------------------------
  const renderContent = () => {

    // PUBLIC PAGES (NOT LOGGED IN)
    if (!user) {
      switch (currentView) {
        case 'register':
          return <Register onSwitchToLogin={() => setCurrentView('login')} showNotification={showNotification} />;
        case 'login':
          return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} showNotification={showNotification} />;
        default:
          return <HeroPage onViewChange={setCurrentView} />;
      }
    }

    // ADMIN ROUTES
    if (user.role === 'admin') {
      switch (currentView) {
       // case 'admin-products': return <ProductsManagement showNotification={showNotification} />;
        case 'admin-users': return <UsersManagement showNotification={showNotification} />;
        case 'admin-orders': return <OrdersManagement showNotification={showNotification} />;
        case 'admin-categories': return <CategoriesManagement showNotification={showNotification} />;
       // case 'admin-home': return <AdminHome showNotification={showNotification} />;
       // default: return <AdminHome onViewChange={setCurrentView} showNotification={showNotification} />;
        default: return <ProductsManagement onViewChange={setCurrentView} showNotification={showNotification} />;
      }
    }

    // USER ROUTES
    switch (currentView) {
      case 'products': return <ProductsList user={user} onViewChange={setCurrentView} showNotification={showNotification} />;
      case 'cart': return <ShoppingCart onViewChange={setCurrentView} showNotification={showNotification} />;
      case 'orders': return <UserOrders onViewChange={setCurrentView} showNotification={showNotification} />;
      case 'profile': return <UserProfile user={user} onViewChange={setCurrentView} showNotification={showNotification} />;
      default: return <ProductsList user={user} onViewChange={setCurrentView} showNotification={showNotification} />;
    }
  };


  // -------------------------------
  // MAIN LAYOUT
  // -------------------------------
  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} onViewChange={setCurrentView} />

      <main className="container">
        <Notification />
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;