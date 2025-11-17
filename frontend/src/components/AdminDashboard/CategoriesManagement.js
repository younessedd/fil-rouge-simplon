import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';

const CategoriesManagement = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [perPage] = useState(9);

  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll(1, 1000);
      const categoriesData = response.data.data || response.data;
      
      setAllCategories(categoriesData);
      setTotalCategories(categoriesData.length);
      
      const calculatedLastPage = Math.ceil(categoriesData.length / perPage);
      setLastPage(calculatedLastPage);
      
      updateDisplayedCategories(categoriesData, 1);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedCategories = (categoriesData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setCategories(categoriesData.slice(startIndex, endIndex));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedCategories(allCategories, 1);
      setCurrentPage(1);
      return;
    }

    // Search by Category ID (if query is number) or by name/slug
    const filteredCategories = allCategories.filter(category =>
      category.id.toString().includes(searchQuery) || // Search by Category ID
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTotalCategories(filteredCategories.length);
    const calculatedLastPage = Math.ceil(filteredCategories.length / perPage);
    setLastPage(calculatedLastPage);
    updateDisplayedCategories(filteredCategories, 1);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (selectedCategory && selectedCategory.id) {
        await categoriesAPI.update(selectedCategory.id, formData);
        alert('Category updated successfully');
      } else {
        await categoriesAPI.create(formData);
        alert('Category added successfully');
      }

      closeModals();
      fetchAllCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: ''
    });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await categoriesAPI.delete(selectedCategory.id);
      alert('Category deleted successfully');
      closeModals();
      fetchAllCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedCategories(allCategories, page);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {pages}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Showing {categories.length} of {totalCategories} categories | Page {currentPage} of {lastPage}
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
          <p style={{ color: '#666', margin: 0 }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>📁 Categories Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedCategory(null);
              setFormData({
                name: '',
                slug: ''
              });
              setShowEditModal(true);
            }}
          >
            + Add Category
          </button>
        </div>

        {/* Search Bar - Updated for ID search */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by category ID, name, or slug..."
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
              fetchAllCategories();
            }}>
              🔄 Show All
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 Search tip: You can search by Category ID, name, or slug
          </div>
        </div>
      </div>

      {/* Edit/Add Category Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCategory ? `✏️ Edit Category #${selectedCategory.id}` : '➕ Add New Category'}</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {selectedCategory && (
                <div className="form-group">
                  <label>Category ID:</label>
                  <input
                    type="text"
                    value={selectedCategory.id}
                    disabled
                    style={{ 
                      width: '100%',
                      backgroundColor: '#f8f9fa',
                      color: '#666'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category Name:</label>
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
                  <label>Slug:</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
                paddingTop: '1rem',
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
                    selectedCategory ? '💾 Update Category' : '➕ Add Category'
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
              <h3>🗑️ Delete Category</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete category <strong>"{selectedCategory?.name}"</strong> (ID: {selectedCategory?.id})?
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
        <h3>Categories List ({totalCategories})</h3>
        
        {categories.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            <p>No categories found</p>
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
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td><strong>#{category.id}</strong></td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{new Date(category.created_at).toLocaleDateString('en-US')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn"
                          onClick={() => handleEdit(category)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => openDeleteModal(category)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            max-width: 500px;
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

export default CategoriesManagement;