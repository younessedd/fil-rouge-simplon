import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import Loading from '../components/Loading';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch products and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      setProducts(productsResponse.data.data || productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: null
    });
    setImagePreview('');
    setEditingProduct(null);
    setShowForm(false);
  };

  // Handle Add New Product button click
  const handleAddNewProduct = () => {
    setShowForm(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: null
    });
    setImagePreview('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // Append all form data
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      if (formData.category_id) {
        submitData.append('category_id', formData.category_id);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, submitData);
        alert('Product updated successfully!');
      } else {
        await productsAPI.create(submitData);
        alert('Product created successfully!');
      }

      resetForm();
      fetchData(); // Refresh the list
    } catch (error) {
      setError('Failed to save product: ' + (error.response?.data?.message || 'Please check your data'));
      console.error('Error saving product:', error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || '',
      image: null
    });
    setImagePreview(product.image_url || '');
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        alert('Product deleted successfully!');
        fetchData(); // Refresh the list
      } catch (error) {
        setError('Failed to delete product');
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-container">
        {/* Page Header */}
        <div className="admin-products-header">
          <h1>Manage Products</h1>
          <button
            onClick={handleAddNewProduct}
            className="add-product-btn"
          >
            + Add New Product
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="admin-error">
            {error}
            <button onClick={() => setError('')} className="error-close">
              ×
            </button>
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <div className="product-form-overlay">
            <div className="product-form">
              <div className="form-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={resetForm} className="close-form">×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <p>Image Preview</p>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="products-list">
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=No+Image'}
                      alt={product.name}
                    />
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="product-details">
                      <span className="product-price">${product.price}</span>
                      <span className="product-stock">Stock: {product.stock}</span>
                    </div>

                    {product.category && (
                      <span className="product-category">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h3>No Products Found</h3>
              <p>Start by adding your first product to the store.</p>
              <button
                onClick={handleAddNewProduct}
                className="create-first-btn"
              >
                + Create First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;