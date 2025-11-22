// REACT IMPORTS
import React, { useState, useEffect } from 'react';
//import { usersAPI } from '../../services/api';
import { usersAPI } from '../../services/api/users.api';
import './UsersManagement.css';

// USERS MANAGEMENT COMPONENT - Administrative interface for user management
const UsersManagement = () => {
  // ===== STATE MANAGEMENT =====
  
  // User data states
  const [allUsers, setAllUsers] = useState([]);           // All users from API
  const [users, setUsers] = useState([]);                 // Currently displayed users (paginated)
  const [loading, setLoading] = useState(true);           // Initial data loading state
  
  // Modal visibility states
  const [showEditModal, setShowEditModal] = useState(false);      // Edit user modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // Delete confirmation modal
  
  // Selected user and form states
  const [selectedUser, setSelectedUser] = useState(null);         // User being edited/deleted
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
  const [totalUsers, setTotalUsers] = useState(0);        // Total users count
  const [perPage] = useState(9);                          // Users per page

  // Form data state for user creation/editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    city: ''
  });

  // ===== EFFECT HOOKS =====

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize); // Listen for resize events
    
    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

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
   * Fetch all users from API
   */
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll(1, 1000);
      const usersData = response.data.data || response.data;
      
      // Update state with fetched data
      setAllUsers(usersData);
      setTotalUsers(usersData.length);
      
      // Calculate pagination
      const calculatedLastPage = Math.ceil(usersData.length / perPage);
      setLastPage(calculatedLastPage);
      
      // Display first page of users
      updateDisplayedUsers(usersData, 1);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update displayed users based on pagination
   * @param {Array} usersData - Array of user objects
   * @param {number} page - Page number to display
   */
  const updateDisplayedUsers = (usersData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setUsers(usersData.slice(startIndex, endIndex));
  };

  // ===== SEARCH FUNCTIONALITY =====

  /**
   * Filter users based on search query
   */
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // Reset to show all users if search is empty
      updateDisplayedUsers(allUsers, 1);
      setCurrentPage(1);
      setTotalUsers(allUsers.length);
      setLastPage(Math.ceil(allUsers.length / perPage));
      showNotification('Showing all users', 'info');
      return;
    }

    // Filter users based on search criteria
    const filteredUsers = allUsers.filter(user => {
      const query = searchQuery.toLowerCase().trim();
      
      // Search by user ID
      if (!isNaN(query) && user.id.toString().includes(query)) {
        return true;
      }
      
      // Search by name
      if (user.name && user.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by email
      if (user.email && user.email.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by phone
      if (user.phone && user.phone.includes(query)) {
        return true;
      }
      
      return false; // No matches found
    });

    // Update state with search results
    setTotalUsers(filteredUsers.length);
    const calculatedLastPage = Math.ceil(filteredUsers.length / perPage) || 1;
    setLastPage(calculatedLastPage);
    updateDisplayedUsers(filteredUsers, 1);
    setCurrentPage(1);

    // Show appropriate notification
    if (filteredUsers.length > 0) {
      showNotification(`Found ${filteredUsers.length} user(s) for "${searchQuery}"`, 'success');
    } else {
      showNotification(`No users found for "${searchQuery}"`, 'info');
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
   * Handle form submission for creating/updating users
   * @param {Object} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const submitData = { ...formData };
      
      // Remove password field if empty during user update
      if (selectedUser && !submitData.password) {
        delete submitData.password;
      }

      // API call based on context (create or update)
      if (selectedUser && selectedUser.id) {
        await usersAPI.update(selectedUser.id, submitData);
        showNotification(`User "${formData.name}" updated successfully!`, 'success');
      } else {
        await usersAPI.create(submitData);
        showNotification(`User "${formData.name}" added successfully!`, 'success');
      }

      closeModals();
      fetchAllUsers(); // Refresh user list
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save user';
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
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    // Reset form data to default values
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      address: '',
      city: ''
    });
  };

  /**
   * Open edit modal with user data
   * @param {Object} user - User object to edit
   */
  const handleEdit = (user) => {
    setSelectedUser(user);
    // Pre-populate form with user data
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Empty for security
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || ''
    });
    setShowEditModal(true);
  };

  /**
   * Delete user from system
   */
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setFormLoading(true);
      await usersAPI.delete(selectedUser.id);
      showNotification(`User "${selectedUser.name}" deleted successfully!`, 'success');
      closeModals();
      fetchAllUsers(); // Refresh user list
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      showNotification(`${errorMessage}`, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Open delete confirmation modal
   * @param {Object} user - User object to delete
   */
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // ===== PAGINATION FUNCTIONS =====

  /**
   * Handle page change in pagination
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedUsers(allUsers, page);
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
          Showing {users.length} of {totalUsers} users | Page {currentPage} of {lastPage}
        </div>
      </div>
    );
  };

  // ===== REUSABLE COMPONENTS =====

  /**
   * Action buttons component for user operations
   * @param {Object} props - Component props
   * @param {Object} props.user - User object
   * @returns {JSX.Element} Action buttons
   */
  const ActionButtons = ({ user }) => (
    <div className="action-buttons">
      <button 
        className="management-btn btn-edit"
        onClick={() => handleEdit(user)}
      >
        Edit
      </button>
      <button 
        className="management-btn btn-delete" 
        onClick={() => openDeleteModal(user)}
        disabled={user.role === 'admin'} // Prevent deleting admin users
      >
        Delete
      </button>
    </div>
  );

  /**
   * Render user row based on screen size
   * @param {Object} user - User object
   * @returns {JSX.Element} User row component
   */
  const renderUserRow = (user) => {
    if (isMobile) {
      // Mobile card layout
      return (
        <div key={user.id} className="data-card-mobile">
          <div className="user-card-header">
            <div className="user-id-mobile">
              #{user.id}
            </div>
            <div className="user-name-mobile">
              {user.name}
            </div>
          </div>
          
          <div className="user-card-body">
            <div className="user-info-grid">
              <div className="user-info-item">
                <span className="info-label">Email</span>
                <div className="user-email-mobile">
                  {user.email}
                </div>
              </div>
              
              <div className="user-info-item">
                <span className="info-label">Phone</span>
                <div className="user-phone-mobile">
                  {user.phone || 'N/A'}
                </div>
              </div>
              
              <div className="user-info-item">
                <span className="info-label">Role</span>
                <span className={`role-badge-mobile ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              
              <div className="user-info-item">
                <span className="info-label">City</span>
                <span className="info-value">{user.city || 'N/A'}</span>
              </div>
              
              {user.address && (
                <div className="user-info-item">
                  <span className="info-label">Address</span>
                  <div className="user-address-mobile">
                    {user.address}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="user-card-actions">
            <ActionButtons user={user} />
          </div>
        </div>
      );
    }

    // Desktop table layout
    return (
      <tr key={user.id} className="user-row">
        <td className="user-id-cell">
          <strong>#{user.id}</strong>
        </td>
        <td className="user-name-cell">
          {user.name}
        </td>
        <td className="user-email-cell">
          {user.email}
        </td>
        <td>
          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </td>
        <td className="user-phone-cell">
          {user.phone || 'N/A'}
        </td>
        <td className="user-city-cell">
          {user.city || 'N/A'}
        </td>
        <td className="user-address-cell">
          {user.address || 'N/A'}
        </td>
        <td className="actions-cell">
          <ActionButtons user={user} />
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
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      {/* ===== FIXED ADD BUTTON ===== */}
      <button 
        className="fixed-add-button"
        onClick={() => {
          setSelectedUser(null);
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
            phone: '',
            address: '',
            city: ''
          });
          setShowEditModal(true);
        }}
        title="Add New User"
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
            <h1>Users Management</h1>
            <p className="header-subtitle">Manage your system users efficiently</p>
          </div>
        </div>

        {/* ===== SEARCH SECTION ===== */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by user ID, name, email, or phone..."
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
                fetchAllUsers();
              }}>
                Clear
              </button>
            </div>
          </div>
          <div className="search-tips">
            Search tips: Enter user ID, name, email, or phone number to find specific users
          </div>
        </div>
      </div>

      {/* ===== EDIT/ADD USER MODAL ===== */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedUser ? `Edit User #${selectedUser.id}` : 'Add New User'}</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="management-form">
              {/* Display user ID when editing */}
              {selectedUser && (
                <div className="form-group full-width">
                  <label>User ID</label>
                  <input
                    type="text"
                    value={selectedUser.id}
                    disabled
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-grid">
                {/* Full Name Field */}
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    className="form-input"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                    className="form-input"
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label>Password {selectedUser && '(leave empty to keep current)'} *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength="6"
                    required={!selectedUser}
                    placeholder="Enter password"
                    className="form-input"
                  />
                </div>

                {/* Role Selection */}
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Phone Field */}
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                    className="form-input"
                  />
                </div>

                {/* City Field */}
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full address"
                  className="form-input form-textarea"
                />
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
                    selectedUser ? 'Update User' : 'Add User'
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
              <h3>Delete User</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div className="delete-modal-content">
              <div className="delete-icon">⚠️</div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to delete user <strong>"{selectedUser?.name}"</strong> (ID: {selectedUser?.id})?
              </p>
              <div className="delete-warning">
                This action cannot be undone and all user data will be permanently lost!
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
                  disabled={formLoading || selectedUser?.role === 'admin'}
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
              {/* Warning for admin users */}
              {selectedUser?.role === 'admin' && (
                <p className="admin-warning">
                  Admin users cannot be deleted for security reasons
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== USERS LIST SECTION ===== */}
      <div className="management-card">
        <div className="section-header">
          <h3>Users List</h3>
          <div className="products-count">
            {totalUsers} user{totalUsers !== 1 ? 's' : ''} total
          </div>
        </div>
        
        {/* Empty state when no users found */}
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4>No Users Found</h4>
            <p>
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'There are no users in your system yet.'
              }
            </p>
            {/* Call to action for empty state */}
            {!searchQuery && (
              <button 
                className="management-btn btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                Add Your First User
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Responsive layout based on screen size */}
            {isMobile ? (
              // Mobile card layout
              <div className="data-grid-mobile">
                {users.map(user => renderUserRow(user))}
              </div>
            ) : (
              // Desktop table layout
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => renderUserRow(user))}
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

export default UsersManagement;