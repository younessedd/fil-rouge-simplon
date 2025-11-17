import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';

const AdminHome = ({ currentView, onViewChange }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for search
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Load products and categories on component mount                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  useEffect(() => {
    fetchBasicProducts();
    fetchCategories();
  }, [currentPage]);

  // Fetch all products for search functionality
  const fetchBasicProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(1);
      
      // Set products for display
      const productsData = response.data.data || [];
      setProducts(productsData);
      setAllProducts(productsData); // Store all products for search
      
      setLastPage(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalProducts(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for search
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Enhanced search function that searches by ID AND Name simultaneously
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, show all products with pagination
      fetchBasicProducts();
      return;
    }

    setLoading(true);

    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Search across ALL fields simultaneously
    const filteredProducts = allProducts.filter(product => {
      // Search by Product ID (exact and partial)
      const matchesId = product.id.toString().includes(searchTerm);
      
      // Search by Product Name
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      
      // Search by Category Name
      const matchesCategory = product.category && 
        product.category.name.toLowerCase().includes(searchTerm);
      
      // Return true if ANY of the search criteria match
      // This means it searches ID AND Name AND Category at the same time
      return matchesId || matchesName || matchesCategory;
    });

    // Sort results: Exact ID matches first, then other matches
    const sortedResults = filteredProducts.sort((a, b) => {
      // Check if product ID exactly matches search term
      const aExactIdMatch = a.id.toString() === searchTerm;
      const bExactIdMatch = b.id.toString() === searchTerm;
      
      if (aExactIdMatch && !bExactIdMatch) return -1;
      if (!aExactIdMatch && bExactIdMatch) return 1;
      
      // If no exact ID matches, sort by relevance
      const aIdMatch = a.id.toString().includes(searchTerm);
      const bIdMatch = b.id.toString().includes(searchTerm);
      
      if (aIdMatch && !bIdMatch) return -1;
      if (!aIdMatch && bIdMatch) return 1;
      
      return 0;
    });

    // Update state with search results
    setProducts(sortedResults);
    setTotalProducts(sortedResults.length);
    setLastPage(1);
    setCurrentPage(1);
    
    setLoading(false);
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Simple pagination component
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    
    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="btn" onClick={() => handlePageChange(currentPage - 1)}>
          ◀️ Previous
        </button>
      );
    }

    // Current page
    pages.push(
      <button key="current" className="btn btn-primary" style={{ minWidth: '40px' }}>
        {currentPage}
      </button>
    );

    // Next button
    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="btn" onClick={() => handlePageChange(currentPage + 1)}>
          Next ▶️
        </button>
      );
    }

    return (
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {pages}
        </div>
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          color: '#666',
          padding: '0.5rem'
        }}>
          Page {currentPage} of {lastPage} • {totalProducts} products total
        </div>
      </div>
    );
  };

  // Custom ProductItem component for Admin without Add to Cart button
  const AdminProductItem = ({ product, searchQuery = '' }) => {
    const imageUrl = product.image ? 
      (product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image.replace('public/', '')}`) 
      : 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';

    // Highlight matching text in product name
    const highlightMatch = (text, query) => {
      if (!query) return text;
      
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);
      
      if (index === -1) return text;
      
      const before = text.substring(0, index);
      const match = text.substring(index, index + query.length);
      const after = text.substring(index + query.length);
      
      return (
        <>
          {before}
          <span style={{ backgroundColor: '#ffeaa7', padding: '0 2px', borderRadius: '2px' }}>
            {match}
          </span>
          {after}
        </>
      );
    };

    // Check if this product has exact ID match
    const isExactIdMatch = searchQuery && product.id.toString() === searchQuery;

    return (
      <div className="card" style={isExactIdMatch ? { 
        border: '2px solid #e74c3c', 
        boxShadow: '0 0 10px rgba(231, 76, 60, 0.3)' 
      } : {}}>
        {isExactIdMatch && (
          <div style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px 4px 0 0',
            textAlign: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            margin: '-1rem -1rem 1rem -1rem'
          }}>
            ✅ EXACT ID MATCH
          </div>
        )}
        
        <div style={{ height: '200px', overflow: 'hidden', borderRadius: '4px' }}>
          <img 
            src={imageUrl} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
            }}
          />
        </div>
        
        <h3 style={{ margin: '1rem 0 0.5rem 0' }}>
          {highlightMatch(product.name, searchQuery)}
        </h3>
        
        {/* Product information with highlighted ID */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ 
            backgroundColor: isExactIdMatch ? '#ffeaa7' : '#e8f4fd', 
            padding: '0.5rem', 
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}>
            <p style={{ color: '#2c3e50', margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>
              🆔 Product ID: <strong style={{ color: '#e74c3c' }}>#{product.id}</strong>
              {isExactIdMatch && (
                <span style={{ 
                  color: '#27ae60', 
                  fontSize: '0.7rem',
                  marginLeft: '0.5rem'
                }}>
                  (Exact Match)
                </span>
              )}
            </p>
          </div>
          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <strong>Category:</strong> {highlightMatch(product.category?.name || 'No Category', searchQuery)}
          </p>
          <p style={{ color: '#666', margin: '0.25rem 0', fontSize: '0.9rem' }}>
            {product.description || 'No description available'}
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1.1rem' }}>
            {product.price} SAR
          </span>
          <span style={{ 
            color: product.stock > 0 ? '#27ae60' : '#e74c3c',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* View Details button */}
        <button
          className="btn"
          style={{ 
            width: '100%', 
            marginTop: '1rem',
            backgroundColor: '#6c757d',
            color: 'white'
          }}
          onClick={() => onViewChange('admin-products')}
        >
          View Details in Management
        </button>
      </div>
    );
  };

  // Clear search and show all products
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchBasicProducts();
  };

  // Simple input change handler - NO automatic search
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div 
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}
          ></div>
          <p style={{ color: '#666', margin: 0 }}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>🛍️ Products Overview</h2>
            <p style={{ color: '#666', margin: 0 }}>Quick product browsing - {totalProducts} products available</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onViewChange('admin-products')}
          >
            🛠️ Full Management
          </button>
        </div>

        {/* Manual Search Bar - Only searches when button is clicked */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by Product ID, Name, or Category..."
              value={searchQuery}
              onChange={handleInputChange}
              style={{ 
                flex: 1,
                minWidth: '250px',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              🔍 Search
            </button>
            <button className="btn" onClick={handleClearSearch}>
              🔄 Show All
            </button>
          </div>
          
          {/* Enhanced Search Tips */}
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 <strong>Click "Search" to find products by:</strong>
            <span style={{ marginLeft: '0.5rem' }}>
              • <strong style={{ color: '#e74c3c' }}>Product ID</strong> (e.g., "1", "25")
            </span>
            <span style={{ marginLeft: '0.5rem' }}>
              • <strong>Product Name</strong> (e.g., "laptop", "phone")
            </span>
            <span style={{ marginLeft: '0.5rem' }}>
              • <strong>Category</strong> (e.g., "electronics")
            </span>
          </div>

          {/* Search Examples */}
          {!searchQuery && (
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}>
              <strong>💡 Try These Searches:</strong> 
              <span style={{ marginLeft: '0.5rem' }}>"1", "laptop", "25 phone", "electronics"</span>
            </div>
          )}
        </div>

        {/* Enhanced Search Results Info */}
        {searchQuery && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#e8f4fd',
            border: '1px solid #b6d7e8',
            borderRadius: '4px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <strong>🔍 Search Results:</strong> 
              <span style={{ marginLeft: '0.5rem' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} found for 
              </span>
              <strong style={{ color: '#2c3e50', marginLeft: '0.25rem' }}>
                "{searchQuery}"
              </strong>
            </div>
            
            {/* Search Breakdown */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              fontSize: '0.8rem',
              flexWrap: 'wrap'
            }}>
              <span>📊 <strong>Searching in:</strong> ID + Name + Category</span>
              {products.some(p => p.id.toString() === searchQuery) && (
                <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                  ✅ Exact ID match found!
                </span>
              )}
            </div>
            
            {products.length === 0 && (
              <div style={{ marginTop: '0.5rem', color: '#666', textAlign: 'center' }}>
                No products found. Try different search terms.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-3">
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
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>
            {searchQuery ? 'No products found' : 'No products available'}
          </h3>
          <p>
            {searchQuery 
              ? `No results found for "${searchQuery}". Try different search terms.`
              : 'No products available in the database'
            }
          </p>
          <button 
            className="btn btn-primary"
            onClick={fetchBasicProducts}
            style={{ marginTop: '1rem' }}
          >
            🔄 Reload Products
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .grid {
            display: grid;
            gap: 1rem;
          }

          .grid-3 {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        `}
      </style>
    </div>
  );
};

export default AdminHome;