import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { productsAPI } from '../../services/api';

const ProductsList = ({ user, onViewChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      
      const response = await productsAPI.getAll(currentPage);
      console.log('Server response:', response);

      // Handle different response formats
      let productsData = [];
      let total = 0;
      let lastPage = 1;

      if (response.data && response.data.data) {
        // Response with pagination
        productsData = response.data.data;
        total = response.data.total || productsData.length;
        lastPage = response.data.last_page || 1;
      } else if (Array.isArray(response.data)) {
        // Response as direct array
        productsData = response.data;
        total = response.data.length;
        lastPage = 1;
      } else if (Array.isArray(response)) {
        // Response itself is array
        productsData = response;
        total = response.length;
        lastPage = 1;
      } else {
        // Different response format
        productsData = [];
        total = 0;
        lastPage = 1;
      }

      console.log('Extracted products:', productsData);
      
      setProducts(productsData);
      setLastPage(lastPage);
      setTotalProducts(total);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Show informative message instead of alert
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await productsAPI.search(searchQuery);
      
      let searchResults = [];
      if (response.data && response.data.data) {
        searchResults = response.data.data;
      } else if (Array.isArray(response.data)) {
        searchResults = response.data;
      } else {
        searchResults = [];
      }
      
      setProducts(searchResults);
      setTotalProducts(searchResults.length);
      setLastPage(1);
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" className="btn" onClick={() => handlePageChange(1)}>
          ⏮️ First
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="btn" onClick={() => handlePageChange(currentPage - 1)}>
          ◀️ Previous
        </button>
      );
    }

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

    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="btn" onClick={() => handlePageChange(currentPage + 1)}>
          Next ▶️
        </button>
      );
    }

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
      <div className="card mb-2">
        <h2>
          {user ? '🛍️ Products List' : '🛍️ Our Products'}
          {!user && (
            <span style={{ 
              fontSize: '1rem', 
              color: '#666', 
              marginLeft: '1rem',
              fontWeight: 'normal'
            }}>
              - Login to enable purchasing
            </span>
          )}
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          marginTop: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSearch}>
              🔍 Search
            </button>
            <button className="btn" onClick={() => {
              setSearchQuery('');
              setCurrentPage(1);
              fetchProducts();
            }}>
              🔄 Show All
            </button>
          </div>
        </div>

        {searchQuery && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <strong>Search Results:</strong> {totalProducts} products found for "{searchQuery}"
          </div>
        )}

        {/* Message for visitors */}
        {!user && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem',
            backgroundColor: '#e3f2fd',
            border: '1px solid #bbdefb',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#1565c0', fontWeight: 'bold' }}>
              🔒 To purchase and add products to cart, please{' '}
              <a 
                href="#login" 
                onClick={(e) => { e.preventDefault(); onViewChange('login'); }}
                style={{ color: '#d32f2f', textDecoration: 'underline' }}
              >
                login
              </a>{' '}
              or{' '}
              <a 
                href="#register" 
                onClick={(e) => { e.preventDefault(); onViewChange('register'); }}
                style={{ color: '#d32f2f', textDecoration: 'underline' }}
              >
                create new account
              </a>
            </p>
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-3">
            {products.map(product => (
              <ProductItem key={product.id} product={product} user={user} />
            ))}
          </div>
          
          {renderPagination()}
        </>
      ) : (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No products found</h3>
          <p>No products available in the database</p>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Please check:
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
              <li>Laravel server is running on port 8000</li>
              <li>There are products in the database</li>
              <li>The API endpoint is working correctly</li>
            </ul>
          </div>
          <button 
            className="btn btn-primary"
            onClick={fetchProducts}
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
        `}
      </style>
    </div>
  );
};

export default ProductsList;