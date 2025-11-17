import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, getProductImageUrl } from '../../services/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page);
      
      setProducts(response.data.data);
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

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts(1);
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
      
      // Filter by ID if search query is a number
      if (!isNaN(searchQuery)) {
        const idSearchResults = searchResults.filter(product => 
          product.id.toString().includes(searchQuery)
        );
        setProducts(idSearchResults);
        setTotalProducts(idSearchResults.length);
      } else {
        setProducts(searchResults);
        setTotalProducts(searchResults.length);
      }
      
      setLastPage(1);
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const submitData = new FormData();
      
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

      if (selectedProduct) {
        await productsAPI.update(selectedProduct.id, submitData);
        alert('Product updated successfully');
      } else {
        await productsAPI.create(submitData);
        alert('Product added successfully');
      }

      closeModals();
      fetchProducts(currentPage);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || '',
      image: null
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productsAPI.delete(selectedProduct.id);
      alert('Product deleted successfully');
      closeModals();
      fetchProducts(currentPage);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>🛍️ Products Management</h2>
          <button 
            className="btn btn-primary"
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
          >
            + Add Product
          </button>
        </div>

        {/* Search Bar - Updated to include ID search */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by product ID, name or description..."
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
            <button className="btn" onClick={() => {
              setSearchQuery('');
              fetchProducts(1);
            }}>
              🔄 Show All
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 Search tip: You can search by Product ID, name, or description
          </div>
        </div>
      </div>

      {/* Edit/Add Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>{selectedProduct ? `✏️ Edit Product #${selectedProduct.id}` : '➕ Add New Product'}</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem' }}>
                {/* Column 1 */}
                <div>
                  {selectedProduct && (
                    <div className="form-group">
                      <label>Product ID:</label>
                      <input
                        type="text"
                        value={selectedProduct.id}
                        disabled
                        style={{ 
                          width: '100%', 
                          backgroundColor: '#f8f9fa',
                          color: '#666'
                        }}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Product Name: *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price: *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      style={{ width: '100%' }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} (ID: {category.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Product description (optional)"
                      style={{ 
                        width: '100%', 
                        height: '120px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Product Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ width: '100%' }}
                    />
                    {selectedProduct && selectedProduct.image && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                          Current Image:
                        </p>
                        <img 
                          src={getProductImageUrl(selectedProduct.image)} 
                          alt="Current"
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover', 
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
                padding: '1.5rem',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={closeModals}
                  disabled={formLoading}
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={formLoading}
                  style={{ minWidth: '120px' }}
                >
                  {formLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></div>
                      Saving...
                    </span>
                  ) : (
                    selectedProduct ? '💾 Update Product' : '➕ Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Delete Product</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete product <strong>"{selectedProduct?.name}"</strong> (ID: {selectedProduct?.id})?
              </p>
              <p style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>
                This action cannot be undone!
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn" 
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Products List ({totalProducts})</h3>
        
        {products.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            <p>No products found</p>
            {searchQuery && (
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                No results for "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const imageUrl = getProductImageUrl(product.image);
                  
                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>#{product.id}</strong>
                      </td>
                      <td>
                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50/CCCCCC/FFFFFF?text=No+Image';
                            }}
                          />
                        </div>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.price} SAR</td>
                      <td>
                        <span style={{
                          color: product.stock > 10 ? '#27ae60' : product.stock > 0 ? '#f39c12' : '#e74c3c',
                          fontWeight: 'bold'
                        }}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{product.category?.name || 'No category'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn"
                            onClick={() => handleEdit(product)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => openDeleteModal(product)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {renderPagination()}
          </>
        )}
      </div>

      <style>
        {`
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

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductsManagement;