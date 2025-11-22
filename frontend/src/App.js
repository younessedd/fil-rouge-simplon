// REACT & COMPONENT IMPORTS - Core dependencies and component modules
import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Shared/Login';
import Register from './components/Shared/Register';
import HeroPage from './components/Shared/HeroPage';
import AdminHome from './components/AdminDashboard/AdminHome';
import ProductsManagement from './components/AdminDashboard/ProductsManagement';
import UsersManagement from './components/AdminDashboard/UsersManagement';
import OrdersManagement from './components/AdminDashboard/OrdersManagement';
import CategoriesManagement from './components/AdminDashboard/CategoriesManagement';
import ProductsList from './components/UserDashboard/ProductsList';
import ShoppingCart from './components/UserDashboard/ShoppingCart';
import UserOrders from './components/UserDashboard/UserOrders';
import UserProfile from './components/UserDashboard/UserProfile';
import { getCurrentUser, isAuthenticated } from './utils/auth';
import './styles/style.css';

// MAIN APP COMPONENT - Root application container
function App() {
  // STATE MANAGEMENT - Application-wide state variables
  const [user, setUser] = useState(null);                    // Current authenticated user data
  const [currentView, setCurrentView] = useState('home');    // Active view/page identifier
  const [loading, setLoading] = useState(true);              // Initial loading state
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  // NOTIFICATION HANDLER - Unified toast message system
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // AUTHENTICATION CHECK - Verify user session on app startup
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);  // Set user state if authenticated
      }
      setLoading(false);       // Mark initial loading as complete
    };
    checkAuth();
  }, []);  // Empty dependency array ensures this runs only once on mount

  // LOGIN HANDLER - Process successful user authentication
  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));  // Persist user data
    localStorage.setItem('token', token);                    // Store authentication token
    // Redirect based on user role
    const targetView = userData.role === 'admin' ? 'admin' : 'products';
    setCurrentView(targetView);
    showNotification(`Welcome back, ${userData.name || userData.email}!`, 'success');
  };

  // LOGOUT HANDLER - Clear user session and reset state
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');    // Clear persisted user data
    localStorage.removeItem('token');   // Remove authentication token
    setCurrentView('home');             // Redirect to landing page
    showNotification('Logged out successfully', 'info');
  };

  // NOTIFICATION COMPONENT - Reusable toast message display
  const Notification = () => {
    if (!notification.show) return null;

    return (
      <div className={`notification notification-${notification.type}`}>
        <span className="notification-message">{notification.message}</span>
        <button 
          className="notification-close"
          onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    );
  };

  // LOADING STATE - Display during initial authentication check
  if (loading) {
    return (
      <div className="loading">
        <div>Loading Application...</div>
      </div>
    );
  }

  // CONTENT RENDERER - Main view routing logic based on authentication and role
  const renderContent = () => {
    // UNAUTHENTICATED USER FLOW - Public routes
    if (!user) {
      switch (currentView) {
        case 'register':
          return <Register 
            onSwitchToLogin={() => setCurrentView('login')} 
            showNotification={showNotification}
          />;
        case 'login':
          return <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setCurrentView('register')}
            showNotification={showNotification}
          />;
        default:
          return <HeroPage onViewChange={setCurrentView} />;
      }
    }

    // ADMIN USER FLOW - Administrative dashboard routes
    if (user.role === 'admin') {
      switch (currentView) {
        case 'admin-products': 
          return <ProductsManagement showNotification={showNotification} />;
        case 'admin-users': 
          return <UsersManagement showNotification={showNotification} />;
        case 'admin-orders': 
          return <OrdersManagement showNotification={showNotification} />;
        case 'admin-categories': 
          return <CategoriesManagement showNotification={showNotification} />;

              case 'admin-home': 
          return <AdminHome showNotification={showNotification} />;



        default: 
          return <AdminHome currentView={currentView} onViewChange={setCurrentView} showNotification={showNotification} />;
      }



    } 
    // CUSTOMER USER FLOW - Shopping and user management routes
    else {
      switch (currentView) {
        case 'products': 
          return <ProductsList user={user} onViewChange={setCurrentView} showNotification={showNotification} />;
        case 'cart': 
          return <ShoppingCart onViewChange={setCurrentView} showNotification={showNotification} />;
        case 'orders': 
          return <UserOrders onViewChange={setCurrentView} showNotification={showNotification} />;
        case 'profile': 
          return <UserProfile user={user} onViewChange={setCurrentView} showNotification={showNotification} />;
        default: 
          return <ProductsList currentView={currentView} onViewChange={setCurrentView} user={user} showNotification={showNotification} />;
      }
    }
  };

  // MAIN APP RENDER - Root component structure
  return (
    <div className="App">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onViewChange={setCurrentView} 
      />
      <main className="container">
        <Notification />
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;