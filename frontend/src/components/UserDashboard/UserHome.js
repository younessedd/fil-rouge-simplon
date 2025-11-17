import React, { useState, useEffect } from 'react';
import { productsAPI, getProductImageUrl } from '../../services/api';
import ProductItem from './ProductItem';

const UserHome = ({ currentView, onViewChange, user }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for search
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Fetch products from API with pagination
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page);
      
      const productsData = response.data.data || [];
      setProducts(productsData);
      setAllProducts(productsData); // Store all products for search functionality
      
      setLastPage(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalProducts(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, show all products with pagination
      fetchProducts(1);
      return;
    }

    setLoading(true);

    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Search across name and category fields
    const filteredProducts = allProducts.filter(product => {
      // Search by Product Name
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      
      // Search by Category Name
      const matchesCategory = product.category && 
        product.category.name.toLowerCase().includes(searchTerm);
      
      // Return true if ANY of the search criteria match
      return matchesName || matchesCategory;
    });

    // Update state with search results
    setProducts(filteredProducts);
    setTotalProducts(filteredProducts.length);
    setLastPage(1);
    setCurrentPage(1);
    
    setLoading(false);
  };

  // Clear search and show all products
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchProducts(1);
  };

  // Show product details modal
  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Close product details modal
  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render pagination component
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page button
    if (startPage > 1) {
      pages.push(
        <button key="first" className="btn" onClick={() => handlePageChange(1)}>
          ⏮️ First
        </button>
      );
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="btn" onClick={() => handlePageChange(currentPage - 1)}>
          ◀️ Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${currentPage === i ? 'btn-primary' : ''}`}
          onClick={() => handlePageChange(i)}
          style={{ minWidth: '40px' }}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="btn" onClick={() => handlePageChange(currentPage + 1)}>
          Next ▶️
        </button>
      );
    }

    // Last page button
    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="btn" onClick={() => handlePageChange(lastPage)}>
          Last ⏭️
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
          Showing {products.length} of {totalProducts} products | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
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
      {/* Header with Search Bar */}
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>🛍️ All Products</h2>
            <p style={{ color: '#666', margin: 0 }}>Browse our collection of {totalProducts} products</p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          
          {/* Search Tips */}
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 <strong>Search by:</strong>
            <span style={{ marginLeft: '0.5rem' }}>
              • <strong>Product Name</strong> (e.g., "laptop", "phone")
            </span>
            <span style={{ marginLeft: '0.5rem' }}>
              • <strong>Category</strong> (e.g., "electronics", "clothing")
            </span>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#e8f4fd',
            border: '1px solid #b6d7e8',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <strong>Search Results:</strong> 
            <span style={{ marginLeft: '0.5rem' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found for 
            </span>
            <strong style={{ color: '#2c3e50', marginLeft: '0.25rem' }}>
              "{searchQuery}"
            </strong>
            
            {products.length === 0 && (
              <div style={{ marginTop: '0.5rem', color: '#666' }}>
                No products found. Try different search terms.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="card">
        {products.length > 0 ? (
          <>
            <div className="grid grid-3">
              {products.map(product => (
                <ProductItem 
                  key={product.id} 
                  product={product} 
                  onViewDetails={handleShowDetails}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center" style={{ padding: '2rem' }}>
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
              onClick={() => fetchProducts(1)}
              style={{ marginTop: '1rem' }}
            >
              🔄 Reload Products
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Product Image */}
                <div>
                  <img 
                    src={getProductImageUrl(selectedProduct.image)} 
                    alt={selectedProduct.name}
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Information */}
                <div>
                  <h2 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
                    {selectedProduct.name}
                  </h2>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: '#e74c3c',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {selectedProduct.price} SAR
                    </p>
                    
                    <p style={{ 
                      color: selectedProduct.stock > 0 ? '#27ae60' : '#e74c3c',
                      fontWeight: 'bold',
                      margin: '0 0 1rem 0'
                    }}>
                      {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} available)` : 'Out of Stock'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#34495e' }}>Description:</h4>
                    <p style={{ color: '#666', lineHeight: '1.5' }}>
                      {selectedProduct.description || 'No description available for this product.'}
                    </p>
                  </div>

                  {selectedProduct.category && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ margin: '0', color: '#666' }}>
                        <strong>Category:</strong> {selectedProduct.category.name}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn"
                      onClick={handleCloseModal}
                      style={{ flex: 1 }}
                    >
                      Close
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        alert(`Added ${selectedProduct.name} to cart!`);
                        handleCloseModal();
                      }}
                      disabled={selectedProduct.stock < 1}
                      style={{ flex: 1 }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            color: #000;
          }
        `}
      </style>
    </div>
  );
};

export default UserHome;