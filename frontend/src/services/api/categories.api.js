// CATEGORIES API - Categories Management
// 🏷️ CRUD operations for product categories

// Import the core request function from API configuration
// Handles authentication, headers, and error management for HTTP requests
import { makeRequest } from './api.config.js';

// Export categoriesAPI object containing all category-related API methods
// Categories are used to organize products in the catalog
export const categoriesAPI = {
  
  // GET ALL CATEGORIES - Retrieve paginated list of all categories
  // Parameters:
  // - page: Page number for pagination (default: 1)
  // - perPage: Number of categories per page (default: 1000 - effectively "all")
  // Purpose: Load all categories for dropdowns, filters, and category management
  // Returns: Promise with categories array and pagination info
  // Note: High perPage default assumes limited number of categories in system
  getAll: (page = 1, perPage = 1000) => 
    makeRequest(`/categories?page=${page}&per_page=${perPage}`),
  
  // GET CATEGORY BY ID - Retrieve specific category details by ID
  // Parameters:
  // - id: Unique identifier of the category
  // Purpose: Get detailed information about a specific category
  // Returns: Promise with complete category object including:
  // - Category name, slug, description
  // - Product count, creation date
  // - Parent category relationships (if hierarchical)
  getById: (id) => 
    makeRequest(`/categories/${id}`),
  
  // CREATE CATEGORY - Add new category to the system
  // Parameters:
  // - categoryData: Object containing category information
  //   Expected fields: { name: string, slug: string, description?: string }
  // Method: POST - Creates new category resource
  // Purpose: Add new product categories for organizing inventory
  // Returns: Promise with created category data
  // Authentication: Typically requires admin privileges
  create: (categoryData) => 
    makeRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData), // Convert to JSON for API
    }),
  
  // UPDATE CATEGORY - Modify existing category information
  // Parameters:
  // - id: Category ID to update
  // - categoryData: Object with updated category fields
  // Method: PUT - Updates entire category resource
  // Purpose: Edit category names, slugs, or descriptions
  // Returns: Promise with updated category data
  // Authentication: Typically requires admin privileges
  update: (id, categoryData) => 
    makeRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),
  
  // DELETE CATEGORY - Remove category from system
  // Parameters:
  // - id: Category ID to delete
  // Method: DELETE - Removes category resource
  // Purpose: Remove unused or obsolete categories
  // Returns: Promise with deletion confirmation
  // Important: Should handle product reassignment if category has products
  // Authentication: Requires admin privileges
  delete: (id) => 
    makeRequest(`/categories/${id}`, { 
      method: 'DELETE' 
    }),
};

// Default export for easier importing
// Usage: import categoriesAPI from './categories.api.js'
export default categoriesAPI;