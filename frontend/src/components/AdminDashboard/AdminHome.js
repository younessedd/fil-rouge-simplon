import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';
import './AdminHome.css';

// ADMIN HOME COMPONENT - Dashboard for product overview and management
const AdminHome = ({ currentView, onViewChange, showNotification }) => {
  // STATE MANAGEMENT - Application data and UI state
  const [products, setProducts] = useState([]);                   // Currently displayed products
  const [allProducts, setAllProducts] = useState([]);             // Complete products dataset for search
  const [categories, setCategories] = useState([]);               // Product categories list
  const [loading, setLoading] = useState(true);                   // Initial data loading state
  const [searchQuery, setSearchQuery] = useState('');             // Search filter input
  const [currentPage, setCurrentPage] = useState(1);              // Current pagination page
  const [lastPage, setLastPage] = useState(1);                    // Total number of pages
  const [totalProducts, setTotalProducts] = useState(0);          // Total products count
  const [searchLoading, setSearchLoading] = useState(false);      // Search operation loading state

  // INITIAL DATA LOADING - Fetch products and categories on component mount
  useEffect(() => {
    fetchAllProductsForSearch();
    fetchCategories();
  }, []);

  // PAGINATION EFFECT - Fetch products when page changes (only when not searching)
  useEffect(() => {
    if (!searchQuery) {
      fetchBasicProducts(currentPage);
    }
  }, [currentPage]);

  // FETCH ALL PRODUCTS FOR SEARCH - Preload all products for client-side search
  const fetchAllProductsForSearch = async () => {
    try {
      const firstPageResponse = await productsAPI.getAll(1);
      const totalPages = firstPageResponse.data.last_page || 1;
      
      // Create promises for all pages
      const pagePromises = [];
      for (let page = 1; page <= totalPages; page++) {
        pagePromises.push(productsAPI.getAll(page));
      }
      
      // Fetch all pages concurrently
      const allResponses = await Promise.all(pagePromises);
      const allProductsData = allResponses.flatMap(response => 
        response.data.data || []
      );
      
      setAllProducts(allProductsData);
      
    } catch (error) {
      console.error('Error fetching all products for search:', error);
      // Fallback: Use first page data only
      const firstPageResponse = await productsAPI.getAll(1);
      setAllProducts(firstPageResponse.data.data || []);
    }
  };

  // FETCH BASIC PRODUCTS - Load paginated products for normal display
  const fetchBasicProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page);
      const productsData = response.data.data || [];
      
      setProducts(productsData);
      setLastPage(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalProducts(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Reset state on error
      setProducts([]);
      setLastPage(1);
      setCurrentPage(1);
      setTotalProducts(0);
      showNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  // FETCH CATEGORIES - Load product categories for reference
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // SEARCH HANDLER - Client-side product filtering and search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCurrentPage(1);
      fetchBasicProducts(1);
      return;
    }

    setSearchLoading(true);
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Filter products based on multiple criteria
    const filteredProducts = allProducts.filter(product => {
      const matchesId = product.id.toString().includes(searchTerm);
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = product.category && 
        product.category.name.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description && 
        product.description.toLowerCase().includes(searchTerm);
      const matchesPrice = product.price && 
        product.price.toString().includes(searchTerm);
      
      return matchesId || matchesName || matchesCategory || matchesDescription || matchesPrice;
    });

    // Sort results by relevance
    const sortedResults = filteredProducts.sort((a, b) => {
      const aExactIdMatch = a.id.toString() === searchTerm;
      const bExactIdMatch = b.id.toString() === searchTerm;
      
      // Exact ID matches first
      if (aExactIdMatch && !bExactIdMatch) return -1;
      if (!aExactIdMatch && bExactIdMatch) return 1;
      
      // Partial ID matches second
      const aIdMatch = a.id.toString().includes(searchTerm);
      const bIdMatch = b.id.toString().includes(searchTerm);
      
      if (aIdMatch && !bIdMatch) return -1;
      if (!aIdMatch && bIdMatch) return 1;
      
      // Name matches third
      const aNameMatch = a.name.toLowerCase().includes(searchTerm);
      const bNameMatch = b.name.toLowerCase().includes(searchTerm);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return 0;
    });

    // Update state with search results
    setProducts(sortedResults);
    setTotalProducts(sortedResults.length);
    setLastPage(1);
    setCurrentPage(1);
    setSearchLoading(false);
  };

  // PAGINATION HANDLER - Navigate between product pages
  const handlePageChange = (page) => {
    if (searchQuery) return; // Disable pagination during search
    setCurrentPage(page);
  };

  // PAGINATION RENDERER - Generate pagination controls
  const renderPagination = () => {
    // Search results display (no pagination)
    if (searchQuery) {
      return (
        <div className="pagination-container">
          <div className="pagination-info search-results-info">
            Search Results: <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''} found
          </div>
        </div>
      );
    }

    // No pagination needed for single page
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button 
          key="prev" 
          className="pagination-btn pagination-prev"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      );
    }

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button 
          key={1} 
          className={`pagination-btn ${1 === currentPage ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-btn ${i === currentPage ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Ellipsis and last page
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button 
          key={lastPage} 
          className={`pagination-btn ${lastPage === currentPage ? 'pagination-active' : ''}`}
          onClick={() => handlePageChange(lastPage)}
        >
          {lastPage}
        </button>
      );
    }

    // Next button
    if (currentPage < lastPage) {
      pages.push(
        <button 
          key="next" 
          className="pagination-btn pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}
        </div>
        <div className="pagination-info">
          Page {currentPage} of {lastPage} • {totalProducts} products total
        </div>
      </div>
    );
  };

  // PRODUCT ITEM COMPONENT - Individual product display card
  const AdminProductItem = ({ product, searchQuery = '' }) => {
    // IMAGE URL HANDLER - Process and validate product image URLs
    const getProductImage = (imagePath) => {
      if (!imagePath) {
        return 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image';
      }
      
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Handle different image path formats
      if (imagePath.includes('storage/')) {
        return `http://localhost:8000/${imagePath}`;
      }
      
      if (imagePath.includes('public/')) {
        return `http://localhost:8000/storage/${imagePath.replace('public/', '')}`;
      }
      
      return `http://localhost:8000/storage/${imagePath}`;
    };

    const imageUrl = getProductImage(product.image);

    // TEXT HIGHLIGHTER - Emphasize search matches in product text
    const highlightMatch = (text, query) => {
      if (!query || !text) return text;
      const lowerText = text.toString().toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);
      if (index === -1) return text;
      const before = text.toString().substring(0, index);
      const match = text.toString().substring(index, index + query.length);
      const after = text.toString().substring(index + query.length);
      return (
        <>
          {before}
          <span className="highlight">{match}</span>
          {after}
        </>
      );
    };

    const isExactIdMatch = searchQuery && product.id.toString() === searchQuery;

    return (
      <div className={`product-card ${isExactIdMatch ? 'exact-match' : ''}`}>
        {isExactIdMatch && (
          <div className="exact-match-badge">
            EXACT ID MATCH
          </div>
        )}
        
        {/* PRODUCT IMAGE - Large display with error handling */}
        <div className="product-image-wrapper">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-image-large"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image';
            }}
          />
        </div>
        
        <div className="product-info">
          <h3 className="product-name">
            {highlightMatch(product.name, searchQuery)}
          </h3>
          
          <div className="product-meta">
            <p className="product-id">
              ID: <strong>#{highlightMatch(product.id, searchQuery)}</strong>
            </p>
            
            <p className="product-category">
              Category: {highlightMatch(product.category?.name || 'No Category', searchQuery)}
            </p>
            
            <p className="product-description">
              {highlightMatch(product.description || 'No description available', searchQuery)}
            </p>
          </div>
          
          <div className="product-details">
            <span className="product-price">
              {highlightMatch(product.price, searchQuery)} DH
            </span>
            <span className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

         
        </div>
      </div>
    );
  };

  // SEARCH CONTROLS - Clear search and input handlers
  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchBasicProducts(1);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isLoading = loading || searchLoading;

  // MAIN COMPONENT RENDER - Admin dashboard interface
  return (
    <div className="admin-home">
      {/* HEADER SECTION - Title and navigation */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Products Overview</h1>
            <p className="admin-subtitle">
              Quick product browsing - {totalProducts} products available
            </p>
          </div>
          <button 
            className="management-button"
            onClick={() => onViewChange('admin-products')}
          >
            Full Management
          </button>
        </div>

        {/* SEARCH SECTION - Product filtering interface */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by ID, Name, Category, Description, or Price..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="search-input"
              disabled={isLoading}
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            <button 
              className="clear-button" 
              onClick={handleClearSearch}
              disabled={isLoading}
            >
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION - Products display */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            {searchLoading ? 'Searching products...' : 'Loading products...'}
          </p>
        </div>
      ) : (
        products.length > 0 ? (
          <>
            <div className="products-grid-large">
              {products.map(product => (
                <AdminProductItem 
                  key={product.id} 
                  product={product} 
                  searchQuery={searchQuery}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="empty-state">
            <h3>
              {searchQuery ? 'No products found' : 'No products available'}
            </h3>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No products available in the database'
              }
            </p>
            <button 
              className="reload-button"
              onClick={() => fetchBasicProducts(1)}
            >
              Reload Products
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AdminHome;