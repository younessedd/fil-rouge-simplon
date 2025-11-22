// AUTHENTICATION UTILITIES - User session and role management

// CHECK AUTHENTICATION STATUS - Verify user has valid session
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;  // Returns true if token exists in storage
};

// GET CURRENT USER DATA - Retrieve parsed user information from storage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');      // Get raw user data string
  return user ? JSON.parse(user) : null;          // Parse to object or return null
};

// SET AUTHENTICATION DATA - Store user session after successful login
export const setAuth = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));  // Store user object as JSON string
  localStorage.setItem('token', token);                // Store authentication token
};

// REMOVE AUTHENTICATION DATA - Clear all session data on logout
export const removeAuth = () => {
  localStorage.removeItem('user');   // Remove user data from storage
  localStorage.removeItem('token');  // Remove authentication token
};

// CHECK ADMIN ROLE - Verify user has administrator privileges
export const isAdmin = () => {
  const user = getCurrentUser();                    // Retrieve current user data
  return user && user.role === 'admin';            // Check if user exists and has admin role
};