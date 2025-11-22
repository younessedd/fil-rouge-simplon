import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import './CategoriesManagement.css';

// CATEGORIES MANAGEMENT COMPONENT - Admin interface for category management
const CategoriesManagement = ({ showNotification }) => {
  // STATE MANAGEMENT - Application data and UI state
  const [allCategories, setAllCategories] = useState([]);           // Complete categories dataset
  const [categories, setCategories] = useState([]);                 // Currently displayed categories
  const [loading, setLoading] = useState(true);                     // Initial data loading state
  const [showEditModal, setShowEditModal] = useState(false);        // Add/Edit modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);    // Delete confirmation modal visibility
  const [selectedCategory, setSelectedCategory] = useState(null);   // Category selected for editing/deletion
  const [formLoading, setFormLoading] = useState(false);            // Form submission loading state
  const [searchQuery, setSearchQuery] = useState('');               // Search filter input
  const [isMobile, setIsMobile] = useState(false);                  // Responsive layout detection
  
  // PAGINATION STATE - Data pagination controls
  const [currentPage, setCurrentPage] = useState(1);                // Current page number
  const [lastPage, setLastPage] = useState(1);                      // Total number of pages
  const [totalCategories, setTotalCategories] = useState(0);        // Total categories count
  const [perPage] = useState(9);                                    // Items per page (constant)

  // FORM STATE - Category form data
  const [formData, setFormData] = useState({
    name: '',   // Category name input
    slug: ''    // Category slug input
  });

  // RESPONSIVE LAYOUT EFFECT - Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // INITIAL DATA LOADING - Fetch categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // FETCH ALL CATEGORIES - Retrieve complete categories dataset from API
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
      
      if (error.message.includes('AUTH_REQUIRED')) {
        showNotification('Please log in to access categories', 'error');
      } else {
        showNotification('Failed to load categories', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // UPDATE DISPLAYED CATEGORIES - Paginate and filter categories for display
  const updateDisplayedCategories = (categoriesData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setCategories(categoriesData.slice(startIndex, endIndex));
  };

  // SEARCH HANDLER - Filter categories based on search criteria
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedCategories(allCategories, 1);
      setCurrentPage(1);
      setTotalCategories(allCategories.length);
      setLastPage(Math.ceil(allCategories.length / perPage));
      showNotification('Showing all categories', 'info');
      return;
    }

    const filteredCategories = allCategories.filter(category =>
      category.id.toString().includes(searchQuery) ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.slug && category.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setTotalCategories(filteredCategories.length);
    const calculatedLastPage = Math.ceil(filteredCategories.length / perPage) || 1;
    setLastPage(calculatedLastPage);
    updateDisplayedCategories(filteredCategories, 1);
    setCurrentPage(1);

    if (filteredCategories.length > 0) {
      showNotification(`Found ${filteredCategories.length} categor${filteredCategories.length !== 1 ? 'ies' : 'y'} for "${searchQuery}"`, 'success');
    } else {
      showNotification(`No categories found for "${searchQuery}"`, 'info');
    }
  };

  // KEYBOARD NAVIGATION - Handle Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // FORM INPUT HANDLER - Update form data on input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FORM SUBMISSION HANDLER - Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (selectedCategory && selectedCategory.id) {
        // Update existing category
        await categoriesAPI.update(selectedCategory.id, formData);
        showNotification(`Category "${formData.name}" updated successfully!`, 'success');
      } else {
        // Create new category
        await categoriesAPI.create(formData);
        showNotification(`Category "${formData.name}" added successfully!`, 'success');
      }

      closeModals();
      fetchAllCategories();
      
    } catch (error) {
      console.error('Error saving category:', error);
      
      let errorMessage = 'Failed to save category';
      
      if (error.message.includes('AUTH_REQUIRED')) {
        errorMessage = 'Please log in to save categories';
      } else if (error.message.includes('No query results')) {
        errorMessage = 'Category not found. It may have been deleted.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      showNotification(`${errorMessage}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // MODAL CONTROLS - Close all modals and reset form
  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: ''
    });
  };

  // EDIT HANDLER - Open edit modal with category data
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || ''
    });
    setShowEditModal(true);
  };

  // DELETE MODAL HANDLER - Open confirmation dialog for category deletion
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // CATEGORY DELETION HANDLER - Remove category from system
  const handleDelete = async () => {
    if (!selectedCategory) return;

    const categoryIdToDelete = selectedCategory.id;
    const categoryName = selectedCategory.name;
    
    try {
      setFormLoading(true);
      
      await categoriesAPI.delete(categoryIdToDelete);
      
      // Update local state after successful deletion
      const updatedCategories = allCategories.filter(category => category.id !== categoryIdToDelete);
      setAllCategories(updatedCategories);
      setTotalCategories(updatedCategories.length);
      
      const calculatedLastPage = Math.ceil(updatedCategories.length / perPage) || 1;
      setLastPage(calculatedLastPage);
      
      // Update displayed categories
      const newCurrentPage = currentPage > calculatedLastPage ? Math.max(1, calculatedLastPage) : currentPage;
      setCurrentPage(newCurrentPage);
      updateDisplayedCategories(updatedCategories, newCurrentPage);
      
      showNotification(`Category "${categoryName}" deleted successfully!`, 'success');
      closeModals();
      
    } catch (error) {
      console.error('Delete error:', error);
      
      let errorMessage = 'Failed to delete category';
      
      if (error.message.includes('AUTH_REQUIRED')) {
        errorMessage = 'Please log in to delete categories';
      } else if (error.message.includes('NOT_FOUND') || error.message.includes('No query results')) {
        errorMessage = 'Category not found or already deleted';
        // Remove from local state anyway since it doesn't exist on server
        const updatedCategories = allCategories.filter(category => category.id !== categoryIdToDelete);
        setAllCategories(updatedCategories);
        setTotalCategories(updatedCategories.length);
        
        const calculatedLastPage = Math.ceil(updatedCategories.length / perPage) || 1;
        setLastPage(calculatedLastPage);
        
        const newCurrentPage = currentPage > calculatedLastPage ? Math.max(1, calculatedLastPage) : currentPage;
        setCurrentPage(newCurrentPage);
        updateDisplayedCategories(updatedCategories, newCurrentPage);
        
        showNotification('Category was already deleted from server', 'info');
        closeModals();
        return;
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      showNotification(`${errorMessage}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // PAGINATION HANDLER - Navigate between category pages
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedCategories(allCategories, page);
  };

  // PAGINATION RENDERER - Generate pagination controls
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          {isMobile ? 'First' : 'First'}
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)}>
          {isMobile ? 'Prev' : 'Previous'}
        </button>
      );
    }

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

    if (currentPage < lastPage) {
      pages.push(
        <button key="next" className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)}>
          {isMobile ? 'Next' : 'Next'}
        </button>
      );
    }

    if (endPage < lastPage) {
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(lastPage)}>
          {isMobile ? 'Last' : 'Last'}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          {pages}
        </div>
        <div className="pagination-info">
          Showing {categories.length} of {totalCategories} categories | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  // ACTION BUTTONS COMPONENT - Edit and Delete buttons for each category
  const ActionButtons = ({ category }) => (
    <div className="action-buttons">
      <button 
        className="management-btn btn-edit"
        onClick={() => handleEdit(category)}
      >
        Edit
      </button>
      <button 
        className="management-btn btn-delete" 
        onClick={() => openDeleteModal(category)}
      >
        Delete
      </button>
    </div>
  );

  // CATEGORY ROW RENDERER - Display category information based on screen size
  const renderCategoryRow = (category) => {
    // MOBILE LAYOUT - Card-based design for small screens
    if (isMobile) {
      return (
        <div key={category.id} className="data-card-mobile">
          <div className="category-card-header">
            <div className="category-id-mobile">
              #{category.id}
            </div>
          </div>
          
          <div className="category-card-body">
            <div className="category-info-grid">
              <div className="category-info-item">
                <span className="info-label">Category Name</span>
                <span className="info-value">{category.name}</span>
              </div>
              
              <div className="category-info-item">
                <span className="info-label">Slug</span>
                <div className="category-slug-mobile">
                  {category.slug || 'N/A'}
                </div>
              </div>
              
              <div className="category-info-item">
                <span className="info-label">Created Date</span>
                <div className="category-date-mobile">
                  {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="category-card-actions">
            <ActionButtons category={category} />
          </div>
        </div>
      );
    }

    // DESKTOP LAYOUT - Table-based design for large screens
    return (
      <tr key={category.id} className="category-row">
        <td className="category-id-cell">
          <strong>#{category.id}</strong>
        </td>
        <td className="category-name-cell">
          {category.name}
        </td>
        <td>
          <span className="category-slug-cell">
            {category.slug || 'N/A'}
          </span>
        </td>
        <td className="category-date-cell">
          {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US') : 'N/A'}
        </td>
        <td className="actions-cell">
          <ActionButtons category={category} />
        </td>
      </tr>
    );
  };

  // LOADING STATE - Display during initial data fetch
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading categories...</p>
      </div>
    );
  }

  // MAIN COMPONENT RENDER - Category management interface
  return (
    <div className="management-container">
      {/* FLOATING ACTION BUTTON - Quick access to add new category */}
      <button 
        className="fixed-add-button"
        onClick={() => {
          setSelectedCategory(null);
          setFormData({
            name: '',
            slug: ''
          });
          setShowEditModal(true);
        }}
        title="Add New Category"
      >
        +
      </button>

      {/* HEADER SECTION - Title and description */}
      <div className="management-card">
        <div className="management-header">
          <div className="header-title">
            <h1>Categories Management</h1>
            <p className="header-subtitle">Manage your product categories efficiently</p>
          </div>
        </div>

        {/* SEARCH SECTION - Category filtering interface */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by category ID, name, or slug..."
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
                fetchAllCategories();
              }}>
                Clear
              </button>
            </div>
          </div>
          <div className="search-tips">
            Search tips: Enter category ID, name, or slug to find specific categories
          </div>
        </div>
      </div>

      {/* EDIT/ADD CATEGORY MODAL - Form for creating/updating categories */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCategory ? `Edit Category #${selectedCategory.id}` : 'Add New Category'}</h3>
              <button className="modal-close" onClick={closeModals}>Close</button>
            </div>
            
            <form onSubmit={handleSubmit} className="management-form">
              {selectedCategory && (
                <div className="form-group full-width">
                  <label>Category ID</label>
                  <input
                    type="text"
                    value={selectedCategory.id}
                    disabled
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category slug"
                    className="form-input"
                  />
                </div>
              </div>

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
                    selectedCategory ? 'Update Category' : 'Add Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL - Category deletion safety check */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Category</h3>
              <button className="modal-close" onClick={closeModals}>Close</button>
            </div>
            
            <div className="delete-modal-content">
              <div className="delete-icon">Warning</div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to delete category <strong>"{selectedCategory?.name}"</strong> (ID: {selectedCategory?.id})?
              </p>
              <div className="delete-warning">
                This action cannot be undone and all category data will be permanently lost!
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

      {/* CATEGORIES LIST SECTION - Main categories display area */}
      <div className="management-card">
        <div className="section-header">
          <h3>Categories List</h3>
          <div className="products-count">
            {totalCategories} categor{totalCategories !== 1 ? 'ies' : 'y'} total
          </div>
        </div>
        
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">No Categories</div>
            <h4>No Categories Found</h4>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'There are no categories in your database yet.'
              }
            </p>
            {!searchQuery && (
              <button 
                className="management-btn btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                Add Your First Category
              </button>
            )}
          </div>
        ) : (
          <>
            {isMobile ? (
              // MOBILE LAYOUT - Card-based display
              <div className="data-grid-mobile">
                {categories.map(category => renderCategoryRow(category))}
              </div>
            ) : (
              // DESKTOP LAYOUT - Table-based display
              <div className="table-container">
                <table className="data-table">
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
                    {categories.map(category => renderCategoryRow(category))}
                  </tbody>
                </table>
              </div>
            )}
            
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;