import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Shared/Login';
import Register from './components/Shared/Register';
import UserHome from './components/UserDashboard/UserHome';
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

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setCurrentView(userData.role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentView('home');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const renderContent = () => {
    if (!user) {
      switch (currentView) {
        case 'register':
          return <Register onSwitchToLogin={() => setCurrentView('login')} />;
        case 'login':
        default:
          return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />;
      }
    }

    if (user.role === 'admin') {
      // Admin routes
      switch (currentView) {
        case 'admin-products':
          return <ProductsManagement />;
        case 'admin-users':
          return <UsersManagement />;
        case 'admin-orders':
          return <OrdersManagement />;
        case 'admin-categories':
          return <CategoriesManagement />;
        case 'admin':
        default:
          return <AdminHome currentView={currentView} onViewChange={setCurrentView} />;
      }
    } else {
      // User routes
      switch (currentView) {
        case 'products':
          return <ProductsList user={user} onViewChange={setCurrentView} />;
        case 'cart':
          return <ShoppingCart onViewChange={setCurrentView} />;
        case 'orders':
          return <UserOrders onViewChange={setCurrentView} />;
        case 'profile':
          return <UserProfile user={user} onViewChange={setCurrentView} />;
        case 'home':
        default:
          return <UserHome currentView={currentView} onViewChange={setCurrentView} user={user} />;
      }
    }
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <div className="container">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}

export default App;