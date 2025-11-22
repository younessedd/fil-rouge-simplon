// CART API - Shopping Cart Operations
// 🛒 Shopping cart management and checkout functionality

// Import the core request function from API configuration
// Handles authentication, headers, and error management for HTTP requests
import { makeRequest } from './api.config.js';

// Export cartAPI object containing all shopping cart related API methods
// The cart is typically user-specific and stored server-side for persistence
export const cartAPI = {
  
  // GET CART - Retrieve current user's shopping cart contents
  // Purpose: Load all items in the user's cart for display and management
  // Error Handling: Gracefully handles empty cart (404) by returning empty array
  // Returns: Promise with cart items array or empty array if cart is empty
  // Authentication: Requires user to be logged in
  get: async () => {
    try {
      return await makeRequest('/cart');
    } catch (error) {
      // Handle empty cart scenario gracefully
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        return { data: [] }; // Return empty cart instead of throwing error
      }
      throw error; // Re-throw other errors (network, auth, etc.)
    }
  },
  
  // ADD TO CART - Add item to shopping cart
  // Parameters:
  // - itemData: Object containing product information
  //   Expected: { product_id: number, quantity: number }
  // Method: POST - Adds new item to cart or updates quantity if exists
  // Purpose: Add products to cart with specified quantity
  // Returns: Promise with updated cart data
  // Authentication: Requires user to be logged in
  add: (itemData) => makeRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(itemData), // Convert to JSON
  }),
  
  // UPDATE CART ITEM - Update quantity of existing cart item
  // Parameters:
  // - id: Cart item ID (not product ID)
  // - quantity: New quantity for the item
  // Method: PUT - Updates existing cart item
  // Purpose: Change item quantities (increase/decrease)
  // Returns: Promise with updated cart item
  // Note: Quantity 0 should trigger removal (or use remove method)
  update: (id, quantity) => makeRequest(`/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }), // Send only quantity to update
  }),
  
  // REMOVE FROM CART - Remove specific item from cart
  // Parameters:
  // - id: Cart item ID to remove
  // Method: DELETE - Removes item from cart
  // Error Handling: Gracefully handles already-removed items
  // Purpose: Remove unwanted items from shopping cart
  // Returns: Promise with success message
  remove: async (id) => {
    try {
      return await makeRequest(`/cart/${id}`, { 
        method: 'DELETE' 
      });
    } catch (error) {
      // Handle case where item was already removed
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        return { data: { message: 'Item already removed' } };
      }
      throw error; // Re-throw other errors
    }
  },
  
  // CLEAR CART - Remove all items from shopping cart
  // Purpose: Empty the entire cart in one operation
  // Method: DELETE - Clears all cart items
  // Error Handling: Gracefully handles already-empty cart
  // Returns: Promise with success message
  // Use Case: User wants to start fresh or after successful checkout
  clear: async () => {
    try {
      return await makeRequest('/cart/clear', { 
        method: 'DELETE' 
      });
    } catch (error) {
      // Handle already empty cart gracefully
      if (error.message.includes('NOT_FOUND') || error.message.includes('404') || error.message.includes('empty')) {
        return { data: { message: 'Cart already empty' } };
      }
      throw error; // Re-throw other errors
    }
  },
  
  // CHECKOUT - Complete purchase and create order from cart
  // Parameters:
  // - orderData: Optional additional order information
  //   Example: { shipping_address: string, payment_method: string, notes: string }
  // Method: POST - Converts cart items into a permanent order
  // Purpose: Finalize purchase and process payment
  // Returns: Promise with created order details
  // Side Effect: Typically clears cart after successful checkout
  checkout: (orderData = {}) => makeRequest('/cart/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData), // Additional checkout information
  }),
};

// Default export for easier importing
// Usage: import cartAPI from './cart.api.js'
export default cartAPI;