// API CONFIGURATION - Base URL for all API endpoints
const API_BASE_URL = 'http://localhost:8000/api';

// CORE REQUEST HANDLER - Main function for all API calls
const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');  // Get authentication token
  
  const config = {
    headers: {
      'Content-Type': 'application/json',      // Default JSON content type
      'Accept': 'application/json',            // Expect JSON response
      ...(token && { 'Authorization': `Bearer ${token}` }),  // Add auth header if token exists
      ...options.headers,                      // Merge custom headers
    },
    ...options,                                // Merge other options
  };

  // Remove Content-Type for FormData (handled automatically by browser)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check response content type
    const contentType = response.headers.get('content-type');
    
    // Handle HTML responses (usually authentication redirects)
    if (contentType && contentType.includes('text/html')) {
      throw new Error('AUTH_REQUIRED: Please log in to access this resource');
    }
    
    // Process response data
    let data;
    const responseText = await response.text();
    
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);  // Parse JSON response
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid JSON response from server');
      }
    } else {
      // Empty response - success for DELETE operations
      data = { message: 'Success' };
    }

    // Handle HTTP error responses
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND: The requested resource was not found');
      } else if (response.status === 401) {
        throw new Error('AUTH_REQUIRED: Please log in to access this resource');
      } else if (response.status === 403) {
        throw new Error('FORBIDDEN: You do not have permission to access this resource');
      } else if (response.status === 422) {
        // Laravel validation errors
        const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(`VALIDATION_ERROR: ${errors}`);
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    return { data };  // Return successful response
  } catch (error) {
    console.error('Request error:', error);
    throw error;  // Re-throw for component handling
  }
};

// FORM DATA REQUEST HANDLER - Specialized for file uploads
const makeFormDataRequest = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  
  const config = {
    method: method,
    headers: {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,  // FormData object for file uploads
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('AUTH_REQUIRED: Please log in to access this resource');
    }
    
    let data;
    const responseText = await response.text();
    
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }
    } else {
      data = { message: 'Success' };
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND: The requested resource was not found');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('AUTH_REQUIRED: Please log in to access this resource');
      } else if (response.status === 422) {
        const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(`VALIDATION_ERROR: ${errors}`);
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }

    return { data };
  } catch (error) {
    console.error('FormData request error:', error);
    throw error;
  }
};

// IMAGE URL HELPER - Generate product image URLs
export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';  // Fallback image
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;  // Already full URL
  }
  
  const baseUrl = 'http://localhost:8000';
  
  // Handle different image path formats from Laravel
  if (imagePath.startsWith('storage/')) {
    return `${baseUrl}/${imagePath}`;
  } else if (imagePath.startsWith('public/')) {
    const cleanPath = imagePath.replace('public/', 'storage/');
    return `${baseUrl}/${cleanPath}`;
  } else {
    return `${baseUrl}/storage/${imagePath}`;
  }
};

// AUTHENTICATION API - User management endpoints
export const authAPI = {
  register: (userData) => makeRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => makeRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  logout: () => makeRequest('/logout', { 
    method: 'POST' 
  }),
  
  getMe: () => makeRequest('/me'),  // ✅ CORRECTED: Changed from '/user' to '/me'
  
  refresh: () => makeRequest('/refresh', { 
    method: 'POST' 
  }),
};

// PRODUCTS API - Product CRUD operations
export const productsAPI = {
  getAll: (page = 1, perPage = 10) => makeRequest(`/products?page=${page}&per_page=${perPage}`),
  
  search: (query, page = 1) => makeRequest(`/products/search?q=${encodeURIComponent(query)}&page=${page}`),
  
  getById: (id) => makeRequest(`/products/${id}`),
  
  create: (productData) => makeFormDataRequest('/products', productData, 'POST'),
  
  update: (id, productData) => {
    // Laravel requires POST with _method=PUT for FormData
    if (productData instanceof FormData) {
      productData.append('_method', 'PUT');
      return makeFormDataRequest(`/products/${id}`, productData, 'POST');
    } else {
      return makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    }
  },
  
  delete: (id) => makeRequest(`/products/${id}`, { 
    method: 'DELETE' 
  }),
};

// CATEGORIES API - Category management
export const categoriesAPI = {
  getAll: (page = 1, perPage = 1000) => makeRequest(`/categories?page=${page}&per_page=${perPage}`),
  
  getById: (id) => makeRequest(`/categories/${id}`),
  
  create: (categoryData) => makeRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  update: (id, categoryData) => makeRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  delete: (id) => makeRequest(`/categories/${id}`, { 
    method: 'DELETE' 
  }),
};

// USERS API - User management (admin)
export const usersAPI = {
  getAll: (page = 1, perPage = 10) => makeRequest(`/users?page=${page}&per_page=${perPage}`),
  
  getById: (id) => makeRequest(`/users/${id}`),
  
  create: (userData) => makeRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  update: (id, userData) => makeRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  delete: (id) => makeRequest(`/users/${id}`, { 
    method: 'DELETE' 
  }),
  
  updateProfile: (userData) => makeRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// CART API - Shopping cart operations
export const cartAPI = {
  get: async () => {
    try {
      return await makeRequest('/cart');
    } catch (error) {
      // Handle empty cart gracefully
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        return { data: [] };
      }
      throw error;
    }
  },
  
  add: (itemData) => makeRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  update: (id, quantity) => makeRequest(`/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  
  remove: async (id) => {
    try {
      return await makeRequest(`/cart/${id}`, { 
        method: 'DELETE' 
      });
    } catch (error) {
      // Handle already removed items
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        return { data: { message: 'Item already removed' } };
      }
      throw error;
    }
  },
  
  clear: async () => {
    try {
      return await makeRequest('/cart/clear', { 
        method: 'DELETE' 
      });
    } catch (error) {
      // Handle already empty cart
      if (error.message.includes('NOT_FOUND') || error.message.includes('404') || error.message.includes('empty')) {
        return { data: { message: 'Cart already empty' } };
      }
      throw error;
    }
  },
  
  checkout: (orderData = {}) => makeRequest('/cart/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};

// ORDERS API - Order management
export const ordersAPI = {
  // User orders
  getUserOrders: (page = 1) => makeRequest(`/orders?page=${page}`),
  
  getOrder: (id) => makeRequest(`/orders/${id}`),
  
  create: (orderData) => makeRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  cancel: (id) => makeRequest(`/orders/${id}/cancel`, { 
    method: 'POST' 
  }),

  delete: (id) => makeRequest(`/orders/${id}`, { 
    method: 'DELETE' 
  }),
  
  // Admin orders
  getAllOrders: (page = 1, perPage = 10) => makeRequest(`/admin/orders?page=${page}&per_page=${perPage}`),
  
  getAdminOrder: (id) => makeRequest(`/admin/orders/${id}`),
  
  updateOrderStatus: (id, status) => makeRequest(`/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  deleteOrder: (id) => makeRequest(`/admin/orders/${id}`, { 
    method: 'DELETE' 
  }),
};

// DASHBOARD API - Admin statistics
export const dashboardAPI = {
  getStats: () => makeRequest('/admin/dashboard/stats'),
  
  getRecentOrders: (limit = 5) => makeRequest(`/admin/dashboard/recent-orders?limit=${limit}`),
  
  getSalesData: (period = 'monthly') => makeRequest(`/admin/dashboard/sales?period=${period}`),
  
  getTopProducts: (limit = 10) => makeRequest(`/admin/dashboard/top-products?limit=${limit}`),
};

// FILE UPLOAD API - Image handling
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return makeFormDataRequest('/upload/image', formData, 'POST');
  },
  
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images[]', file);
    });
    return makeFormDataRequest('/upload/multiple', formData, 'POST');
  },
};

// SETTINGS API - Application configuration
export const settingsAPI = {
  get: () => makeRequest('/settings'),
  
  update: (settingsData) => makeRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  }),
};

// NOTIFICATIONS API - User notifications
export const notificationsAPI = {
  getAll: (page = 1) => makeRequest(`/notifications?page=${page}`),
  
  markAsRead: (id) => makeRequest(`/notifications/${id}/read`, { 
    method: 'POST' 
  }),
  
  markAllAsRead: () => makeRequest('/notifications/read-all', { 
    method: 'POST' 
  }),
  
  getUnreadCount: () => makeRequest('/notifications/unread-count'),
};

// AUTHENTICATION UTILITIES - User session management

// CHECK AUTHENTICATION STATUS - Verify user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;  // Returns true if token exists
};

// GET CURRENT USER DATA - Retrieve stored user information
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');      // Get user data from storage
  return user ? JSON.parse(user) : null;          // Parse JSON or return null
};

// SET AUTHENTICATION DATA - Store user session after login
export const setAuth = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));  // Store user object as JSON
  localStorage.setItem('token', token);                // Store authentication token
};

// REMOVE AUTHENTICATION DATA - Clear session on logout
export const removeAuth = () => {
  localStorage.removeItem('user');   // Remove user data from storage
  localStorage.removeItem('token');  // Remove authentication token
};

// CHECK ADMIN ROLE - Verify user has administrator privileges
export const isAdmin = () => {
  const user = getCurrentUser();                    // Get current user data
  return user && user.role === 'admin';            // Check if user exists and has admin role
};

// Export core functions for custom usage
export { makeRequest, makeFormDataRequest };

// Default export with all API modules
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  users: usersAPI,
  cart: cartAPI,
  orders: ordersAPI,
  dashboard: dashboardAPI,
  upload: uploadAPI,
  settings: settingsAPI,
  notifications: notificationsAPI,
  getProductImageUrl,
  makeRequest,
  makeFormDataRequest,
  isAuthenticated,
  getCurrentUser,
  setAuth,
  removeAuth,
  isAdmin,
};