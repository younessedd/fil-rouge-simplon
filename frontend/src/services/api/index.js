// MAIN API EXPORTS - Export All API Modules
// 🏠 Main file that aggregates all API modules for centralized access

// ===== IMPORT ALL API MODULES =====
// Import individual API modules to make them available in this file

// Authentication API - User login, registration, session management
import { authAPI } from './auth.api.js';

// Products API - Product CRUD operations, search, and catalog management
import { productsAPI } from './products.api.js';

// Categories API - Product category management and organization
import { categoriesAPI } from './categories.api.js';

// Users API - User management, profiles, and administrative user operations
import { usersAPI } from './users.api.js';

// Cart API - Shopping cart operations, item management, and checkout
import { cartAPI } from './cart.api.js';

// Orders API - Order processing, history, and status management
import { ordersAPI } from './orders.api.js';

// Dashboard API - Administrative statistics and analytics
import { dashboardAPI } from './dashboard.api.js';

// Upload API - File and image upload functionality
import { uploadAPI } from './upload.api.js';

// ===== IMPORT CORE UTILITY FUNCTIONS =====
// Import fundamental functions from API configuration

import { 
  makeRequest,           // Core HTTP request handler for JSON data
  makeFormDataRequest,   // Specialized handler for file uploads (FormData)
  getProductImageUrl,    // URL generator for product images with fallbacks
  isAuthenticated,       // Check if user has valid authentication token
  getCurrentUser,        // Retrieve current logged-in user data
  setAuth,               // Store authentication data after successful login
  removeAuth,            // Clear authentication data on logout
  isAdmin                // Check if current user has administrator privileges
} from './api.config.js';

// ===== INDIVIDUAL NAMED EXPORTS =====
// Export each API module individually for selective importing
// Usage: import { productsAPI, authAPI } from './api/index.js'

export { authAPI } from './auth.api.js';        // Authentication operations
export { productsAPI } from './products.api.js'; // Product management
export { categoriesAPI } from './categories.api.js'; // Category operations
export { usersAPI } from './users.api.js';      // User management
export { cartAPI } from './cart.api.js';        // Shopping cart
export { ordersAPI } from './orders.api.js';    // Order processing
export { dashboardAPI } from './dashboard.api.js'; // Admin dashboard
export { uploadAPI } from './upload.api.js';    // File uploads

// ===== CORE UTILITIES EXPORTS =====
// Export core utility functions for direct access
// Usage: import { getProductImageUrl, isAuthenticated } from './api/index.js'

export {
  makeRequest,           // For custom API calls outside predefined modules
  makeFormDataRequest,   // For custom file upload operations
  getProductImageUrl,    // To generate product image URLs throughout the app
  isAuthenticated,       // To check login status in components
  getCurrentUser,        // To access current user data
  setAuth,               // To manually set authentication (advanced use)
  removeAuth,            // To manually clear authentication
  isAdmin                // To check admin privileges for role-based access
};

// ===== DEFAULT EXPORT FOR BACKWARD COMPATIBILITY =====
// Create a consolidated API object for legacy import style
// Usage: import API from './api/index.js' then use API.products.getAll()

const API = {
  // Core utility functions - direct access to fundamental operations
  makeRequest,           // API.makeRequest('/custom-endpoint')
  makeFormDataRequest,   // API.makeFormDataRequest(formData, endpoint)
  getProductImageUrl,    // API.getProductImageUrl(product.image)
  isAuthenticated,       // API.isAuthenticated()
  getCurrentUser,        // API.getCurrentUser()
  setAuth,               // API.setAuth(user, token)
  removeAuth,            // API.removeAuth()
  isAdmin,               // API.isAdmin()
  
  // API modules - organized by functionality
  auth: authAPI,         // API.auth.login(), API.auth.register()
  products: productsAPI, // API.products.getAll(), API.products.create()
  categories: categoriesAPI, // API.categories.getAll(), API.categories.create()
  users: usersAPI,       // API.users.getAll(), API.users.updateProfile()
  cart: cartAPI,         // API.cart.get(), API.cart.add(), API.cart.checkout()
  orders: ordersAPI,     // API.orders.getUserOrders(), API.orders.create()
  dashboard: dashboardAPI, // API.dashboard.getStats(), API.dashboard.getTopProducts()
  upload: uploadAPI,     // API.upload.uploadImage(), API.upload.uploadMultiple()
};

// Export the consolidated API object as default
// This maintains compatibility with older import patterns
export default API;