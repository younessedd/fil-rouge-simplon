// ORDERS API - Orders Management
// 📦 Order management operations for both users and administrators

// Import the core request function from API configuration
// Handles authentication, headers, and error management for all HTTP requests
import { makeRequest } from './api.config.js';

// Export ordersAPI object containing all order-related API methods
// Organized into user-facing and admin-only operations
export const ordersAPI = {
  
  // ===== USER ORDERS - Customer-facing order operations =====
  
  // GET USER ORDERS - Retrieve paginated list of current user's orders
  // Parameters:
  // - page: Page number for pagination (default: 1)
  // Returns: Promise with user's order history and pagination info
  // Authentication: Requires user to be logged in
  getUserOrders: (page = 1) => 
    makeRequest(`/orders?page=${page}`),
  
  // GET ORDER - Retrieve specific order details by ID
  // Parameters:
  // - id: Unique identifier of the order
  // Returns: Promise with complete order object including items, totals, status
  // Security: User can only access their own orders
  getOrder: (id) => 
    makeRequest(`/orders/${id}`),
  
  // CREATE ORDER - Create new order from shopping cart
  // Parameters:
  // - orderData: Object containing order information (items, shipping, payment)
  // Method: POST - Creates new order resource
  // Returns: Promise with created order confirmation and details
  create: (orderData) => 
    makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData), // Convert to JSON for API
    }),
  
  // CANCEL ORDER - Cancel an existing order
  // Parameters:
  // - id: Order ID to cancel
  // Method: POST - Custom action endpoint for order cancellation
  // Returns: Promise with cancellation confirmation
  // Note: Uses POST instead of PUT/DELETE for cancellation workflow
  cancel: (id) => 
    makeRequest(`/orders/${id}/cancel`, { 
      method: 'POST' 
    }),

  // DELETE ORDER - Permanently remove order (user soft delete)
  // Parameters:
  // - id: Order ID to delete
  // Method: DELETE - Removes order from user view
  // Returns: Promise with deletion confirmation
  // Note: Typically soft delete that hides order from user interface
  delete: (id) => 
    makeRequest(`/orders/${id}`, { 
      method: 'DELETE' 
    }),
  
  // ===== ADMIN ORDERS - Administrative order operations =====
  // These endpoints require admin privileges and access all orders
  
  // GET ALL ORDERS - Retrieve paginated list of all orders in system
  // Parameters:
  // - page: Page number for pagination (default: 1)
  // - perPage: Number of orders per page (default: 10)
  // Returns: Promise with all system orders for admin management
  // Authentication: Requires admin role
  getAllOrders: (page = 1, perPage = 10) => 
    makeRequest(`/admin/orders?page=${page}&per_page=${perPage}`),
  
  // GET ADMIN ORDER - Retrieve any order details (admin access)
  // Parameters:
  // - id: Order ID to retrieve
  // Returns: Promise with complete order details from any user
  // Security: Admin can access any order regardless of owner
  getAdminOrder: (id) => 
    makeRequest(`/admin/orders/${id}`),
  
  // UPDATE ORDER STATUS - Change order status (processing, shipped, delivered, etc.)
  // Parameters:
  // - id: Order ID to update
  // - status: New status value (e.g., 'processing', 'shipped', 'delivered', 'cancelled')
  // Method: PUT - Updates order status field
  // Returns: Promise with updated order data
  updateOrderStatus: (id, status) => 
    makeRequest(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }), // Send status in request body
    }),
  
  // DELETE ORDER - Permanently remove order from system (admin hard delete)
  // Parameters:
  // - id: Order ID to delete
  // Method: DELETE - Completely removes order from database
  // Returns: Promise with permanent deletion confirmation
  // Warning: This is typically a hard delete for administrative purposes
  deleteOrder: (id) => 
    makeRequest(`/admin/orders/${id}`, { 
      method: 'DELETE' 
    }),
};

// Default export for easier importing
// Usage: import ordersAPI from './orders.api.js'
export default ordersAPI;