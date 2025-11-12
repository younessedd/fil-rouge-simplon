import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';

// Components
import Header from './components/Header';
import Loading from './components/Loading';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';

// CSS
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        // Verify token is still valid
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        // Token is invalid, logout
        handleLogout();
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/products" replace />;
    }

    return children;
  };

  // Public Route Component (redirect if already logged in)
  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/products" replace />;
    }
    return children;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        {user && <Header user={user} onLogout={handleLogout} />}
        
        <main className={user ? 'main-with-header' : 'main-full'}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register onLogin={handleLogin} />
                </PublicRoute>
              } 
            />

            {/* Protected Routes - All Users */}
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <Products user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCategories />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={user ? "/products" : "/"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;