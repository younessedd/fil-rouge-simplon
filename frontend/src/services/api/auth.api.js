// AUTHENTICATION API - User Authentication
// 🔐 Management of user login, registration, and sessions

// Import the core request function from API configuration
// Handles HTTP requests with automatic authentication header injection
import { makeRequest } from './api.config.js';

// Export authAPI object containing all authentication-related API methods
// These endpoints manage user identity, sessions, and access tokens
export const authAPI = {
  
  // USER REGISTRATION - Create new user account
  // Parameters:
  // - userData: Object containing user registration information
  //   Expected: { name: string, email: string, password: string, password_confirmation: string, ... }
  // Method: POST - Creates new user resource
  // Purpose: Register new users in the system
  // Returns: Promise with user data and authentication token
  // Typical Flow: Registration → Auto-login → Redirect to dashboard
  register: (userData) => makeRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData), // Convert user data to JSON
  }),
  
  // USER LOGIN - Authenticate user credentials
  // Parameters:
  // - credentials: Object containing login credentials
  //   Expected: { email: string, password: string }
  // Method: POST - Validates credentials and creates session
  // Purpose: Authenticate existing users and create session
  // Returns: Promise with user data and authentication token
  // Side Effects: Sets authentication token in localStorage/session
  login: (credentials) => makeRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials), // Convert credentials to JSON
  }),
  
  // USER LOGOUT - Terminate user session
  // Purpose: End current user session and invalidate token
  // Method: POST - Logout endpoint (sometimes uses POST instead of GET for security)
  // Returns: Promise with logout confirmation
  // Side Effects: Removes authentication token from storage
  // Security: Invalidates server-side session/token
  logout: () => makeRequest('/logout', { 
    method: 'POST' // Using POST for logout is common practice
  }),
  
  // GET CURRENT USER - Retrieve authenticated user's data
  // Purpose: Get current logged-in user's profile information
  // Method: GET - Fetches user data using current authentication token
  // Returns: Promise with complete user object
  // Use Cases: 
  // - Display user info in header/navigation
  // - Check authentication status on app load
  // - Populate user profile pages
  getMe: () => makeRequest('/me'),
  
  // REFRESH TOKEN - Renew authentication token
  // Purpose: Extend user session without requiring re-login
  // Method: POST - Requests new token using current refresh token
  // Returns: Promise with new authentication token
  // Use Case: Automatic token refresh before expiration
  // Security: Uses refresh token (if implemented) to get new access token
  refresh: () => makeRequest('/refresh', { 
    method: 'POST' 
  }),
};

// Default export for easier importing
// Usage: import authAPI from './auth.api.js'
export default authAPI;