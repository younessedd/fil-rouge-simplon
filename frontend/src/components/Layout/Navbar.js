// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState, useEffect } from 'react';
import './Navbar.css';  // Import component-specific styles

// NAVBAR COMPONENT - Main navigation with user authentication handling
const Navbar = ({ user, onRequestLogout, onViewChange }) => {
  // STATE MANAGEMENT - Mobile menu visibility control
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // EFFECT HOOK - Control body scroll when mobile menu is open
  useEffect(() => {
    // Toggle scroll lock class on body element
    document.body.classList.toggle('menu-open', isMenuOpen);
    // Cleanup function to remove class when component unmounts
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]); // Dependency ensures effect runs when menu state changes

  // NAVIGATION HANDLER - Unified navigation with mobile menu management
  const handleNavigation = (view) => {
    onViewChange(view);      // Propagate view change to parent component
    setIsMenuOpen(false);    // Close mobile menu after navigation
  };

  // LOGOUT HANDLER - Enhanced logout with menu management
  const handleLogout = () => {
    if (typeof onRequestLogout === 'function') onRequestLogout(); // Ask parent to confirm logout
    setIsMenuOpen(false);   // Ensure mobile menu closes on logout
  };

  // COMPONENT RENDER - Navigation structure with conditional user menus
  return (
    <nav className="navbar">
      
      {/* NAVBAR HEADER SECTION - Contains brand and mobile toggle */}
      <div className="nav-header">
        
        {/* BRAND/LOGO AREA - Clickable application title */}
        <div 
          className="nav-brand" 
          onClick={() => handleNavigation(user ? 'products' : 'home')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleNavigation(user ? 'products' : 'home')}
        >
          I Smell Shop
        </div>

        {/* MOBILE MENU TOGGLE BUTTON - Hamburger menu for small screens */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {/* HAMBURGER ICON LINES - Visual menu indicator */}
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </div>

      {/* NAVIGATION LINKS CONTAINER - Conditional rendering based on user state */}
      <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
        
        {/* UNAUTHENTICATED USER MENU - Public navigation options */}
        {!user && (
          <>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('home')}
            >
              Home
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('login')}
            >
              Login
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('register')}
            >
              Register
            </button>
          </>
        )}

        {/* AUTHENTICATED CUSTOMER MENU - Shopping and user management */}
        {user && user.role === 'user' && (
          <>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('home')}
            >
              Home
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('products')}
            >
              All Products
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('cart')}
            >
              Shopping Cart
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('orders')}
            >
              My Orders
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('profile')}
            >
              My Profile
            </button>
            <button 
              className="nav-link nav-logout" 
              onClick={handleLogout}
            >
              Logout ({user.name || user.email})
            </button>
          </>
        )}

        {/* ADMINISTRATOR MENU - Management dashboard options */}
        {user && user.role === 'admin' && (
          <>
            {/* <button 
              className="nav-link" 
              onClick={() => handleNavigation('admin-home')}
            >
              Dashboard
            </button> */}
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('admin-products')}
            >
              Products Management
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('admin-users')}
            >
              Users Management
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('admin-orders')}
            >
              Orders Management
            </button>
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('admin-categories')}
            >
              Categories Management
            </button>
            <button 
              className="nav-link nav-logout" 
              onClick={handleLogout}
            >
              Logout ({user.name || user.email})
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

// DEFAULT EXPORT - Make component available for import
export default Navbar;