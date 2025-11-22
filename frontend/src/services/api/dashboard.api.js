// DASHBOARD API - Admin Dashboard Statistics
// 📊 Statistics and data for admin control panel

// Import the core request function from API configuration
// Handles authentication, headers, and error management for HTTP requests
import { makeRequest } from './api.config.js';

// Export dashboardAPI object containing all admin dashboard statistical methods
// These endpoints are typically admin-only and provide business intelligence data
export const dashboardAPI = {
  
  // GET STATS - Retrieve general statistics and overview metrics
  // Purpose: Provides high-level business overview for admin dashboard
  // Returns: Promise with comprehensive statistics object including:
  // - Total revenue, orders, users, products
  // - Growth percentages, comparison metrics
  // - System health indicators
  // Authentication: Requires admin privileges
  getStats: () => 
    makeRequest('/admin/dashboard/stats'),
  
  // GET RECENT ORDERS - Retrieve most recent orders for quick review
  // Parameters:
  // - limit: Maximum number of orders to return (default: 5)
  // Purpose: Display recent activity and pending orders
  // Returns: Promise with array of recent order objects including:
  // - Order ID, customer info, total amount, status, timestamp
  // - Quick access to latest transactions for monitoring
  getRecentOrders: (limit = 5) => 
    makeRequest(`/admin/dashboard/recent-orders?limit=${limit}`),
  
  // GET SALES DATA - Retrieve sales analytics for specified time period
  // Parameters:
  // - period: Time period for sales analysis (default: 'monthly')
  //   Options: 'daily', 'weekly', 'monthly', 'yearly', 'custom'
  // Purpose: Generate sales charts and trend analysis
  // Returns: Promise with structured sales data including:
  // - Time-series data for charting
  // - Revenue breakdown by period
  // - Comparison with previous periods
  // - Best performing days/weeks/months
  getSalesData: (period = 'monthly') => 
    makeRequest(`/admin/dashboard/sales?period=${period}`),
  
  // GET TOP PRODUCTS - Retrieve best-selling products
  // Parameters:
  // - limit: Maximum number of products to return (default: 10)
  // Purpose: Identify popular products and sales performance
  // Returns: Promise with array of top-performing products including:
  // - Product details (name, price, category)
  // - Sales quantity and revenue metrics
  // - Stock levels and performance trends
  // - Customer purchase patterns
  getTopProducts: (limit = 10) => 
    makeRequest(`/admin/dashboard/top-products?limit=${limit}`),
};

// Default export for easier importing
// Usage: import dashboardAPI from './dashboard.api.js'
export default dashboardAPI;