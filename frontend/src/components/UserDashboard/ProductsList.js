// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';  // Individual product display component
//import { productsAPI } from '../../services/api';  // API service for product operations
import './ProductsList.css';  // Component-specific styles
import { productsAPI } from '../../services/api/products.api';

// PRODUCTS LIST COMPONENT - Main fragrance catalog and search interface for I Smell Shop
const ProductsList = ({ user, onViewChange, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [products, setProducts] = useState([]);          // Current displayed products
  const [allProducts, setAllProducts] = useState([]);    // All products for search filtering
  const [loading, setLoading] = useState(true);          // Loading state for data fetch
  const [currentPage, setCurrentPage] = useState(1);     // Current pagination page
  const [lastPage, setLastPage] = useState(1);           // Total number of pages
  const [totalProducts, setTotalProducts] = useState(0); // Total products count
  const [searchQuery, setSearchQuery] = useState('');    // Search input value

  // EFFECT HOOK - Fetch products when page changes (always fetch public catalog)
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);  // Dependencies: current page

  // Fetch first page on mount
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // FETCH PRODUCTS FUNCTION - Retrieve fragrances from API with pagination
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);  // Start loading state
      const response = await productsAPI.getAll(page);  // API call with page parameter
      
      // HANDLE API RESPONSE - Extract products data from different response structures
      const productsData = response.data.data || [];  // Get products array
      setProducts(productsData);      // Set current displayed products
      setAllProducts(productsData);   // Store all products for search functionality
      
      // PAGINATION DATA - Extract pagination information from response
      setLastPage(response.data.last_page || 1);        // Total pages available
      setCurrentPage(response.data.current_page || 1);  // Current page number
      setTotalProducts(response.data.total || 0);       // Total products count
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);        // Reset products on error
      setTotalProducts(0);    // Reset total count
      if (showNotification) {
        showNotification('Failed to load fragrances', 'error');  // Updated error notification
      }
    } finally {
      setLoading(false);  // End loading state regardless of outcome
    }
  };

  // SEARCH HANDLER - Filter fragrances based on search query
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchProducts(1);  // Reset to all fragrances if search is empty
      return;
    }

    setLoading(true);  // Start search loading state

    const searchTerm = searchQuery.toLowerCase().trim();  // Normalize search term
    
    // FILTER FRAGRANCES - Search across multiple product fields
    const filteredProducts = allProducts.filter(product => {
      const matchesName = product.name.toLowerCase().includes(searchTerm);        // Fragrance name match
      const matchesCategory = product.category && 
        product.category.name.toLowerCase().includes(searchTerm);                // Category name match
      const matchesDescription = product.description && 
        product.description.toLowerCase().includes(searchTerm);                  // Description match
      const matchesNotes = product.notes && 
        product.notes.toLowerCase().includes(searchTerm);                        // Fragrance notes match
      
      return matchesName || matchesCategory || matchesDescription || matchesNotes;  // Return if any field matches
    });

    // UPDATE STATE - Set filtered results
    setProducts(filteredProducts);
    setTotalProducts(filteredProducts.length);  // Update total count for filtered results
    setLastPage(1);      // Reset pagination for search results
    setCurrentPage(1);   // Reset to first page
    
    setLoading(false);   // End search loading state
  };

  // CLEAR SEARCH HANDLER - Reset search and show all fragrances
  const handleClearSearch = () => {
    setSearchQuery('');    // Clear search input
    fetchProducts(1);      // Fetch first page of all fragrances
  };

  // KEY PRESS HANDLER - Trigger search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();  // Execute search when Enter is pressed
    }
  };

  // PAGE CHANGE HANDLER - Navigate between pagination pages
  const handlePageChange = (page) => {
    setCurrentPage(page);  // Update current page state
  };

  // PAGINATION RENDERER - Generate pagination controls
  const renderPagination = () => {
    if (lastPage <= 1) return null;  // Hide pagination if only one page

    const pages = [];  // Array to hold pagination buttons
    const maxVisiblePages = 5;  // Maximum pages to show in pagination

    // CALCULATE VISIBLE PAGE RANGE - Center current page in visible range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    // ADJUST START PAGE - Ensure we show maximum visible pages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // FIRST PAGE BUTTON - Show if not on first page
    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          First
        </button>
      );
    }

    // PREVIOUS BUTTON - Show if not on first page
    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
      );
    }

    // PAGE NUMBER BUTTONS - Generate buttons for visible page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // NEXT BUTTON - Show if not on last page
    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      );
    }

    // LAST PAGE BUTTON - Show if not on last page
    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(lastPage)}>
          Last
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}  {/* Render pagination buttons */}
        </div>
        <div className="pagination-info">
          Showing {products.length} of {totalProducts} fragrances | Page {currentPage} of {lastPage}  {/* Updated info text */}
        </div>
      </div>
    );
  };



  // LOADING STATE - Display during data fetch
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading luxury fragrances...</p>  {/* Updated loading message */}
      </div>
    );
  }

  // MAIN COMPONENT RENDER - Fragrance catalog interface
  return (
    <div className="products-list-container">
      
      {/* HEADER SECTION - Page title and search functionality */}
      <div className="products-list-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Luxury Fragrances</h1>  {/* Updated main page title */}
            <p className="header-subtitle">Browse our exclusive collection of {totalProducts} premium perfumes</p>  {/* Updated product count */}
          </div>
        </div>

        {/* SEARCH SECTION - Fragrance search and filtering */}
        <div className="search-section">
          <div className="search-container">
            {/* SEARCH INPUT - Text input for fragrance search */}
            <input
              type="text"
              placeholder="Search by fragrance name, scent notes, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
              onKeyPress={handleKeyPress}  // Handle Enter key press
              className="search-input"
            />
            {/* SEARCH ACTIONS - Buttons for search operations */}
            <div className="search-actions">
              <button className="management-btn btn-primary" onClick={handleSearch}>
                Search Fragrances  {/* Updated search button */}
              </button>
              <button className="management-btn btn-secondary" onClick={handleClearSearch}>
                Show All Fragrances  {/* Updated clear search button */}
              </button>
            </div>
          </div>

          {/* SEARCH TIPS - Help text for search functionality */}
          <div className="search-tips">
            <strong>Search by:</strong>  {/* Search tips label */}
            <span>Fragrance Name</span>    {/* Updated searchable field */}
            <span>Scent Notes</span>       {/* New searchable field */}
            <span>Category</span>        {/* Searchable field */}
            <span>Description</span>     {/* Searchable field */}
          </div>

          {/* SEARCH RESULTS INFO - Display search results information */}
          {searchQuery && (
            <div className="search-results-info">
              Search Results: <strong>{products.length}</strong> fragrance{products.length !== 1 ? 's' : ''} found for "{searchQuery}"  {/* Updated results count */}
              {products.length === 0 && (
                <div className="no-results-message">
                  No fragrances found. Try different search terms or browse our full collection.  {/* Updated no results message */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS COUNT - Display current fragrances count */}
      <div className="products-count">
        Showing {products.length} of {totalProducts} luxury fragrances  {/* Updated products count */}
        {searchQuery && (
          <span className="search-term"> for "{searchQuery}"</span>  
        )}
      </div>

      {/* PRODUCTS GRID - Main fragrances display area */}
      {products.length > 0 ? (
        <>
          <div className="products-grid">
            {/* MAP THROUGH FRAGRANCES - Render each fragrance item */}
            {products.map(product => (
              <ProductItem 
                key={product.id}  // Unique product key
                product={product}
                user={user}
                onViewChange={onViewChange}
                showNotification={showNotification}  // Notification handler
              />
            ))}
          </div>
          
          {/* PAGINATION CONTROLS - Show if multiple pages exist */}
          {renderPagination()}
        </>
      ) : (
        /* EMPTY STATE - No fragrances available message */
        <div className="empty-state">
          <h3>
            {searchQuery ? 'No fragrances found' : 'No fragrances available'}  {/* Updated context-specific title */}
          </h3>
          <p>
            {searchQuery 
              ? `No results found for "${searchQuery}". Try searching by scent notes, fragrance name, or category.`  // Updated search no results
              : 'There are no luxury fragrances available in our collection yet.'  // Updated general no products
            }
          </p>
          <button 
            className="btn-primary"
            onClick={() => fetchProducts(1)}  // Reload fragrances
          >
            Reload Fragrances  {/* Updated reload action */}
          </button>
        </div>
      )}
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default ProductsList;