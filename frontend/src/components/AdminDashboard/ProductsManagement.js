// REACT IMPORTS
import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, getProductImageUrl } from '../../services/api';
import './ProductsManagement.css';

// PRODUCTS MANAGEMENT COMPONENT - Administrative interface for product management
const ProductsManagement = () => {
  // ===== STATE MANAGEMENT =====
  
  // Product data states
  const [products, setProducts] = useState([]);           // Current displayed products
  const [categories, setCategories] = useState([]);       // Available categories
  const [loading, setLoading] = useState(true);           // Initial loading state
  
  // Modal visibility states
  const [showEditModal, setShowEditModal] = useState(false);      // Edit product modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // Delete confirmation modal
  
  // Selected product and form states
  const [selectedProduct, setSelectedProduct] = useState(null);   // Product being edited/deleted
  const [formLoading, setFormLoading] = useState(false);          // Form submission loading
  const [searchQuery, setSearchQuery] = useState('');             // Search input value
  
  // Notification state
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: '' 
  });
  
  // Responsive design state
  const [isMobile, setIsMobile] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);      // Current page number
  const [lastPage, setLastPage] = useState(1);            // Total number of pages
  const [totalProducts, setTotalProducts] = useState(0);  // Total products count
  const [perPage] = useState(10);                         // Products per page

  // Form data state for product creation/editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });

  // ===== UTILITY FUNCTIONS =====

  /**
   * Format price with DH Maroc currency
   * @param {number} price - Product price
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    return `${parseFloat(price).toFixed(2)} DH`;
  };

  // ===== EFFECT HOOKS =====

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize); // Listen for resize events
    
    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch products and categories when component mounts or page changes
  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  // ===== NOTIFICATION SYSTEM =====

  /**
   * Display toast notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info, warning)
   */
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // ===== DATA FETCHING FUNCTIONS =====

  /**
   * Fetch products from API with pagination
   * @param {number} page - Page number to fetch
   */
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page);
      
      // Update state with fetched data
      setProducts(response.data.data);
      setLastPage(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalProducts(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all categories from API
   */
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // ===== SEARCH FUNCTIONALITY =====

  /**
   * Search products by ID, name, or description
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Reset to show all products if search is empty
      fetchProducts(1);
      return;
    }

    try {
      setLoading(true);
      
      // If search query is a number, try to fetch by ID first
      if (!isNaN(searchQuery.trim())) {
        try {
          const response = await productsAPI.getById(parseInt(searchQuery.trim()));
          if (response.data) {
            setProducts([response.data]);
            setTotalProducts(1);
            setLastPage(1);
            setCurrentPage(1);
            showNotification(`Product found by ID: ${searchQuery}`, 'success');
            return;
          }
        } catch (idError) {
          console.log('Product not found by ID, searching by name...');
        }
      }

      // Search by name or description
      const response = await productsAPI.search(searchQuery.trim());
      
      let searchResults = [];
      
      // Handle different response structures
      if (response.data) {
        if (response.data.data) {
          searchResults = response.data.data;
        } else if (Array.isArray(response.data)) {
          searchResults = response.data;
        }
      } else if (Array.isArray(response)) {
        searchResults = response;
      }
      
      // Filter results for better accuracy
      const filteredResults = searchResults.filter(product => {
        const query = searchQuery.toLowerCase().trim();
        
        // Search in product name
        if (product.name && product.name.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search in product description
        if (product.description && product.description.toLowerCase().includes(query)) {
          return true;
        }
        
        return false; // No matches found
      });
      
      // Update state with search results
      setProducts(filteredResults);
      setTotalProducts(filteredResults.length);
      setLastPage(1);
      setCurrentPage(1);
      
      // Show appropriate notification
      if (filteredResults.length > 0) {
        showNotification(`Found ${filteredResults.length} product(s)`, 'success');
      } else {
        showNotification('No products found for your search', 'info');
      }
      
    } catch (error) {
      console.error('Error searching products:', error);
      showNotification('Search failed: ' + (error.response?.data?.message || error.message), 'error');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Enter key press in search input
   * @param {Object} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ===== FORM HANDLING =====

  /**
   * Handle input changes in form fields
   * @param {Object} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle file input changes for product images
   * @param {Object} e - File input change event
   */
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  /**
   * Handle form submission for creating/updating products
   * @param {Object} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append form data to FormData object
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || '');
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock || 0);
      
      if (formData.category_id) {
        submitData.append('category_id', formData.category_id);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // API call based on context (create or update)
      if (selectedProduct) {
        await productsAPI.update(selectedProduct.id, submitData);
        showNotification('Product updated successfully!', 'success');
      } else {
        await productsAPI.create(submitData);
        showNotification('Product added successfully!', 'success');
      }

      closeModals();
      fetchProducts(currentPage); // Refresh product list
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save product';
      showNotification(`${errorMessage}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ===== MODAL MANAGEMENT =====

  /**
   * Close all modals and reset form data
   */
  const closeModals = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: null
    });
    setSelectedProduct(null);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  /**
   * Open edit modal with product data
   * @param {Object} product - Product object to edit
   */
  const handleEdit = (product) => {
    setSelectedProduct(product);
    // Pre-populate form with product data
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || '',
      image: null // Don't pre-fill image for security
    });
    setShowEditModal(true);
  };

  /**
   * Open delete confirmation modal
   * @param {Object} product - Product object to delete
   */
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  /**
   * Delete product from system
   */
  const handleDelete = async () => {
    if (!selectedProduct) return;

    const productIdToDelete = selectedProduct.id;
    const productName = selectedProduct.name;
    
    try {
      setFormLoading(true);
      
      await productsAPI.delete(productIdToDelete);
      
      // Update local state immediately for better UX
      const updatedProducts = products.filter(product => product.id !== productIdToDelete);
      setProducts(updatedProducts);
      setTotalProducts(prev => prev - 1);
      
      showNotification(`"${productName}" deleted successfully!`, 'success');
      closeModals();
      
      // Adjust pagination if needed
      if (updatedProducts.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      
    } catch (error) {
      console.error('Delete error details:', error);
      
      // Verify if product was actually deleted
      try {
        await productsAPI.getById(productIdToDelete);
        
        // Product still exists - show error
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Failed to delete product. Please try again.';
        showNotification(`${errorMessage}`, 'error');
        
      } catch (getError) {
        // Product doesn't exist - consider deletion successful
        const updatedProducts = products.filter(product => product.id !== productIdToDelete);
        setProducts(updatedProducts);
        setTotalProducts(prev => prev - 1);
        
        showNotification(`"${productName}" deleted successfully!`, 'success');
        closeModals();
        
        if (updatedProducts.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  // ===== PAGINATION FUNCTIONS =====

  /**
   * Handle page change in pagination
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * Render pagination controls
   * @returns {JSX.Element} Pagination component
   */
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    // Adjust start page if needed
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page button
    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          {isMobile ? '⏮️' : '⏮️ First'}
        </button>
      );
    }

    // Previous page button
    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)}>
          {isMobile ? '◀️' : '◀️ Prev'}
        </button>
      );
    }

    // Page number buttons
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

    // Next page button
    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)}>
          {isMobile ? '▶️' : 'Next ▶️'}
        </button>
      );
    }

    // Last page button
    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(lastPage)}>
          {isMobile ? '⏭️' : 'Last ⏭️'}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}
        </div>
        <div className="pagination-info">
          Showing {products.length} of {totalProducts} products | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  // ===== REUSABLE COMPONENTS =====

  /**
   * Action buttons component for product operations
   * @param {Object} props - Component props
   * @param {Object} props.product - Product object
   * @returns {JSX.Element} Action buttons
   */
  const ActionButtons = ({ product }) => (
    <div className="action-buttons">
      <button 
        className="management-btn btn-edit"
        onClick={() => handleEdit(product)}
      >
        Edit
      </button>
      <button 
        className="management-btn btn-delete" 
        onClick={() => openDeleteModal(product)}
      >
        Delete
      </button>
    </div>
  );

  /**
   * Render product row based on screen size
   * @param {Object} product - Product object
   * @returns {JSX.Element} Product row component
   */
  const renderProductRow = (product) => {
    const imageUrl = getProductImageUrl(product.image);
    
    // Determine stock level for styling
    const stockClass = product.stock > 10 ? 'stock-high' : product.stock > 0 ? 'stock-medium' : 'stock-low';
    const stockText = product.stock > 10 ? 'High' : product.stock > 0 ? 'Medium' : 'Low';

    // Mobile card layout for small screens
    if (isMobile && window.innerWidth <= 640) {
      return (
        <div key={product.id} className="data-card-mobile">
          <div className="product-card-header">
            <div className="product-image-container">
              <img 
                src={imageUrl} 
                alt={product.name}
                className="product-image-mobile"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=No+Image';
                }}
              />
            </div>
            <div className="product-basic-info">
              <div className="product-name-mobile">{product.name}</div>
              <div className="product-price-mobile">{formatPrice(product.price)}</div>
            </div>
          </div>
          
          <div className="product-card-body">
            <div className="product-meta-row">
              <span className="product-id-mobile">#{product.id}</span>
              <span className={`stock-indicator ${stockClass}`}>
                {product.stock} ({stockText})
              </span>
            </div>
            
            {/* Product description */}
            {product.description && (
              <div className="product-description-mobile">
                {product.description.length > 80 
                  ? `${product.description.substring(0, 80)}...` 
                  : product.description
                }
              </div>
            )}
            
            {/* Category tag */}
            <div className="category-tag">
              {product.category?.name || 'No category'}
            </div>
          </div>
          
          <div className="product-card-actions">
            <ActionButtons product={product} />
          </div>
        </div>
      );
    }

    // Desktop table layout for larger screens
    return (
      <tr key={product.id} className="product-row">
        <td className="product-id-cell">
          <strong>#{product.id}</strong>
        </td>
        <td>
          <div className="product-image-container">
            <img 
              src={imageUrl} 
              alt={product.name}
              className="product-image-table"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=No+Image';
              }}
            />
          </div>
        </td>
        <td className="product-info-cell">
          <div className="product-name">{product.name}</div>
          {product.description && (
            <div className="product-description">
              {product.description.length > 60 
                ? `${product.description.substring(0, 60)}...` 
                : product.description
              }
            </div>
          )}
        </td>
        <td className="product-price-cell">
          <div className="product-price">{formatPrice(product.price)}</div>
        </td>
        <td className="stock-cell">
          <div className={`stock-indicator ${stockClass}`}>
            {product.stock} {!isMobile && `(${stockText})`}
          </div>
        </td>
        <td className="category-cell">
          <div className="category-tag">
            {product.category?.name || 'No category'}
          </div>
        </td>
        <td className="actions-cell">
          <ActionButtons product={product} />
        </td>
      </tr>
    );
  };

  // ===== RENDER COMPONENT =====

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      {/* ===== FIXED ADD BUTTON ===== */}
      <button 
        className="fixed-add-button"
        onClick={() => {
          setSelectedProduct(null);
          setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category_id: '',
            image: null
          });
          setShowEditModal(true);
        }}
        title="Add New Product"
      >
        +
      </button>

      {/* ===== NOTIFICATION SYSTEM ===== */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : 
             notification.type === 'error' ? '❌' : 
             notification.type === 'info' ? 'ℹ️' : '⚠️'}
          </span>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotification({ show: false, message: '', type: '' })}
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== HEADER SECTION ===== */}
      <div className="management-card">
        <div className="management-header">
          <div className="header-title">
            <h1>Products Management</h1>
            <p className="header-subtitle">Manage your product inventory efficiently</p>
          </div>
        </div>

        {/* ===== SEARCH SECTION ===== */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by product ID, name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <div className="search-actions">
              <button className="management-btn btn-primary btn-search" onClick={handleSearch}>
                Search
              </button>
              <button className="management-btn btn-secondary" onClick={() => {
                setSearchQuery('');
                fetchProducts(1);
              }}>
                Clear
              </button>
            </div>
          </div>
          <div className="search-tips">
            Search tips: Enter product ID, name, or description to find specific products
          </div>
        </div>
      </div>

      {/* ===== EDIT/ADD PRODUCT MODAL ===== */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedProduct ? `Edit Product #${selectedProduct.id}` : 'Add New Product'}</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="management-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  {/* Product ID display for editing */}
                  {selectedProduct && (
                    <div className="form-group">
                      <label>Product ID</label>
                      <input
                        type="text"
                        value={selectedProduct.id}
                        disabled
                        className="form-input"
                      />
                    </div>
                  )}

                  {/* Product Name Field */}
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product name"
                      className="form-input"
                    />
                  </div>

                  {/* Price Field */}
                  <div className="form-group">
                    <label>Price (DH) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="form-input"
                    />
                    <small className="price-hint">Price in Moroccan Dirham (DH)</small>
                  </div>

                  {/* Stock Field */}
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="0"
                      className="form-input"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} (ID: {category.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Field */}
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Product description (optional)"
                      rows="4"
                      className="form-input form-textarea"
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div className="form-group">
                    <label>Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-input"
                    />
                    {/* Show current image when editing */}
                    {selectedProduct && selectedProduct.image && (
                      <div className="current-image">
                        <p>Current Image:</p>
                        <img 
                          src={getProductImageUrl(selectedProduct.image)} 
                          alt="Current"
                          className="current-product-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="management-btn btn-secondary" 
                  onClick={closeModals}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="management-btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Saving...
                    </span>
                  ) : (
                    selectedProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Product</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div className="delete-modal-content">
              <div className="delete-icon">⚠️</div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to delete product <strong>"{selectedProduct?.name}"</strong> (ID: {selectedProduct?.id})?
              </p>
              <div className="delete-warning">
                This action cannot be undone and all product data will be permanently lost!
              </div>
              
              <div className="delete-actions">
                <button 
                  className="management-btn btn-secondary" 
                  onClick={closeModals}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button 
                  className="management-btn btn-danger" 
                  onClick={handleDelete}
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="loading-content">
                      <div className="loading-spinner-small"></div>
                      Deleting...
                    </span>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRODUCTS LIST SECTION ===== */}
      <div className="management-card">
        <div className="section-header">
          <h3>Products List</h3>
          <div className="products-count">
            {totalProducts} product{totalProducts !== 1 ? 's' : ''} total
          </div>
        </div>
        
        {/* Empty state when no products found */}
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4>No Products Found</h4>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'There are no products in your inventory yet.'
              }
            </p>
            {/* Call to action for empty state */}
            {!searchQuery && (
              <button 
                className="management-btn btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Responsive layout based on screen size */}
            {isMobile && window.innerWidth <= 640 ? (
              // Mobile card layout
              <div className="data-grid-mobile">
                {products.map(product => renderProductRow(product))}
              </div>
            ) : (
              // Desktop table layout
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price (DH)</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => renderProductRow(product))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination controls */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;