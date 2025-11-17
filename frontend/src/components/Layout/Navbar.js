import React from 'react';

const Navbar = ({ user, onLogout, onViewChange }) => {
  // Handle navigation between different views
  const handleNavigation = (view) => {
    console.log('Navigating to:', view); // Debug log
    onViewChange(view);
  };

  return (
    <nav className="navbar">
      {/* Brand/Logo section - click to go to home */}
      <div 
        className="nav-brand" 
        onClick={() => handleNavigation(user ? (user.role === 'admin' ? 'admin' : 'home') : 'products')} 
        style={{cursor: 'pointer'}}
      >
        🛒 E-Store
      </div>
      
      <div className="nav-links">
        {/* Show different links based on user role */}
        {user ? (
          <>
            {/* Links for regular users */}
            {user.role === 'user' && (
              <>
                <a 
                  href="#products" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('products'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Products
                </a>
                <a 
                  href="#cart" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('cart'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  My Cart
                </a>
                <a 
                  href="#orders" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('orders'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  My Orders
                </a>
              </>
            )}
            
            {/* Links for ADMIN users only */}
            {user.role === 'admin' && (
              <>
                <a 
                  href="#products" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('products'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Products
                </a>
                <a 
                  href="#admin-products" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('admin-products'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Manage Products
                </a>
                <a 
                  href="#admin-users" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('admin-users'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Manage Users
                </a>
                <a 
                  href="#admin-orders" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('admin-orders'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Manage Orders
                </a>
                <a 
                  href="#admin-categories" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNavigation('admin-categories'); 
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Manage Categories
                </a>
              </>
            )}
            
            {/* Logout button */}
            <button 
              onClick={onLogout}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Logout ({user.name})
            </button>
          </>
        ) : (
          /* Links for visitors (not logged in) */
          <>
            <a 
              href="#products" 
              onClick={(e) => { 
                e.preventDefault(); 
                handleNavigation('products'); 
              }}
              style={{ cursor: 'pointer' }}
            >
              Products
            </a>
            <a 
              href="#login" 
              onClick={(e) => { 
                e.preventDefault(); 
                handleNavigation('login'); 
              }}
              style={{ cursor: 'pointer' }}
            >
              Login
            </a>
            <a 
              href="#register" 
              onClick={(e) => { 
                e.preventDefault(); 
                handleNavigation('register'); 
              }}
              style={{ cursor: 'pointer' }}
            >
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;