import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import Loading from '../components/Loading';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', error);
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

    // Auto-generate slug from name
    if (name === 'name' && !editingCategory) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        alert('Category updated successfully!');
      } else {
        await categoriesAPI.create(formData);
        alert('Category created successfully!');
      }

      resetForm();
      fetchCategories(); // Refresh the list
    } catch (error) {
      setError('Failed to save category');
      console.error('Error saving category:', error);
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug
    });
    setShowForm(true);
  };

  // Delete category
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(categoryId);
        alert('Category deleted successfully!');
        fetchCategories(); // Refresh the list
      } catch (error) {
        setError('Failed to delete category');
        console.error('Error deleting category:', error);
      }
    }
  };

  // Count products in category (this would typically come from API)
  const getProductCount = (category) => {
    // This is a placeholder - in a real app, this would come from the API
    return category.products_count || Math.floor(Math.random() * 50);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-categories-page">
      <div className="admin-categories-container">
        {/* Page Header */}
        <div className="admin-categories-header">
          <h1>Manage Categories</h1>
          <button
            onClick={() => setShowForm(true)}
            className="add-category-btn"
          >
            + Add New Category
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

        {/* Category Form */}
        {(showForm || editingCategory) && (
          <div className="category-form-overlay">
            <div className="category-form">
              <div className="form-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button onClick={resetForm} className="close-form">×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Electronics, Clothing"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g., electronics, clothing"
                    required
                  />
                  <small className="slug-help">
                    URL-friendly version of the name (auto-generated from name)
                  </small>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-icon">
                  📁
                </div>
                
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-slug">/{category.slug}</p>
                  
                  <div className="category-stats">
                    <span className="product-count">
                      {getProductCount(category)} products
                    </span>
                    <span className="category-id">
                      ID: #{category.id}
                    </span>
                  </div>
                </div>

                <div className="category-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Empty Categories State */
            <div className="empty-categories">
              <div className="empty-categories-content">
                <h2>No categories found</h2>
                <p>Create your first category to organize your products.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="create-first-btn"
                >
                  Create First Category
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Info */}
        {categories.length > 0 && (
          <div className="categories-info">
            <div className="info-card">
              <h3>Categories Overview</h3>
              <div className="info-stats">
                <div className="stat">
                  <span className="stat-number">{categories.length}</span>
                  <span className="stat-label">Total Categories</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {categories.reduce((total, cat) => total + getProductCount(cat), 0)}
                  </span>
                  <span className="stat-label">Total Products</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;