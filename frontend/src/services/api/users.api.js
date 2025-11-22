// USERS API - User Management
// 👥 User management operations (Admin only)

// Import the core request function from API configuration
// This handles all HTTP requests with authentication and error handling
import { makeRequest } from './api.config.js';

// Export usersAPI object containing all user-related API methods
export const usersAPI = {
  
  // GET ALL USERS - Retrieve paginated list of all users
  // Parameters:
  // - page: Page number for pagination (default: 1)
  // - perPage: Number of users per page (default: 10)
  // Returns: Promise with users data array and pagination info
  getAll: (page = 1, perPage = 10) => 
    makeRequest(`/users?page=${page}&per_page=${perPage}`),
  
  // GET USER BY ID - Retrieve specific user details by ID
  // Parameters:
  // - id: Unique identifier of the user
  // Returns: Promise with single user object
  getById: (id) => 
    makeRequest(`/users/${id}`),
  
  // CREATE USER - Add new user to the system (Admin only)
  // Parameters:
  // - userData: Object containing user information (name, email, password, etc.)
  // Method: POST - Creates new resource
  // Returns: Promise with created user data
  create: (userData) => 
    makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData), // Convert JS object to JSON string
    }),
  
  // UPDATE USER - Modify existing user information
  // Parameters:
  // - id: User ID to update
  // - userData: Object with updated user fields
  // Method: PUT - Updates entire resource
  // Returns: Promise with updated user data
  update: (id, userData) => 
    makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // DELETE USER - Remove user account from system
  // Parameters:
  // - id: User ID to delete
  // Method: DELETE - Removes resource
  // Returns: Promise with success message
  delete: (id) => 
    makeRequest(`/users/${id}`, { 
      method: 'DELETE' 
    }),
  
  // UPDATE PROFILE - Update current authenticated user's profile
  // Parameters:
  // - userData: Object with profile fields to update
  // Method: PUT - Updates profile information
  // Returns: Promise with updated user profile
  updateProfile: (userData) => 
    makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Default export for easier importing
// Usage: import usersAPI from './users.api.js'
export default usersAPI;