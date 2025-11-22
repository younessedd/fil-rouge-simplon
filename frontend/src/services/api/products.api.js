// PRODUCTS API - Products Management
// 🛍️ CRUD operations for products and search functionality

// Import both request functions from API configuration:
// - makeRequest: For standard JSON requests
// - makeFormDataRequest: For file uploads with FormData
import { makeRequest, makeFormDataRequest } from './api.config.js';

// Export productsAPI object containing all product-related API methods
export const productsAPI = {
  
  // GET ALL PRODUCTS - Retrieve paginated list of all products
  // Parameters:
  // - page: Page number for pagination (default: 1)
  // - perPage: Number of products per page (default: 10)
  // Returns: Promise with products array and pagination metadata
  getAll: (page = 1, perPage = 10) => 
    makeRequest(`/products?page=${page}&per_page=${perPage}`),
  
  // SEARCH PRODUCTS - Search products using query string
  // Parameters:
  // - query: Search term to find matching products
  // - page: Page number for paginated results (default: 1)
  // Process: Encodes query to handle special characters and spaces
  // Returns: Promise with filtered products matching search criteria
  search: (query, page = 1) => 
    makeRequest(`/products/search?q=${encodeURIComponent(query)}&page=${page}`),
  
  // GET PRODUCT BY ID - Retrieve specific product details by ID
  // Parameters:
  // - id: Unique identifier of the product
  // Returns: Promise with complete product object including details, images, category
  getById: (id) => 
    makeRequest(`/products/${id}`),
  
  // CREATE PRODUCT - Add new product to catalog
  // Parameters:
  // - productData: FormData object containing product info and image file
  // Method: Uses FormData for file upload support
  // Returns: Promise with created product data
  create: (productData) => 
    makeFormDataRequest('/products', productData, 'POST'),
  
  // UPDATE PRODUCT - Modify existing product information
  // Parameters:
  // - id: Product ID to update
  // - productData: Either FormData (with image) or plain object (without image)
  // Smart Detection: Automatically detects if updating with or without image
  // Laravel Compatibility: Uses _method=PUT for FormData to work with Laravel
  update: (id, productData) => {
    // Check if productData is FormData (contains file upload)
    if (productData instanceof FormData) {
      // For FormData with file uploads, use POST with _method=PUT
      // This is required for Laravel to handle file uploads with PUT method
      productData.append('_method', 'PUT');
      return makeFormDataRequest(`/products/${id}`, productData, 'POST');
    } else {
      // For regular JSON data without files, use standard PUT request
      return makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    }
  },
  
  // DELETE PRODUCT - Remove product from catalog
  // Parameters:
  // - id: Product ID to delete
  // Method: DELETE - Permanently removes product
  // Returns: Promise with success confirmation
  delete: (id) => 
    makeRequest(`/products/${id}`, { 
      method: 'DELETE' 
    }),
};

// Default export for easier importing
// Usage: import productsAPI from './products.api.js'
export default productsAPI;