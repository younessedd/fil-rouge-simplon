import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

const UsersManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [perPage] = useState(9);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll(1, 1000);
      const usersData = response.data.data || response.data;
      
      setAllUsers(usersData);
      setTotalUsers(usersData.length);
      
      const calculatedLastPage = Math.ceil(usersData.length / perPage);
      setLastPage(calculatedLastPage);
      
      updateDisplayedUsers(usersData, 1);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedUsers = (usersData, page) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setUsers(usersData.slice(startIndex, endIndex));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      updateDisplayedUsers(allUsers, 1);
      setCurrentPage(1);
      return;
    }

    // Search by ID (if query is number) or by name/email/phone
    const filteredUsers = allUsers.filter(user =>
      user.id.toString().includes(searchQuery) || // Search by ID
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    );

    setTotalUsers(filteredUsers.length);
    const calculatedLastPage = Math.ceil(filteredUsers.length / perPage);
    setLastPage(calculatedLastPage);
    updateDisplayedUsers(filteredUsers, 1);
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
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      if (selectedUser && selectedUser.id) {
        await usersAPI.update(selectedUser.id, submitData);
        alert('User updated successfully');
      } else {
        await usersAPI.create(submitData);
        alert('User added successfully');
      }

      closeModals();
      fetchAllUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
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
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await usersAPI.delete(selectedUser.id);
      alert('User deleted successfully');
      closeModals();
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateDisplayedUsers(allUsers, page);
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
          style={{ minWidth: '40px', fontWeight: currentPage === i ? 'bold' : 'normal' }}
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
          Showing {users.length} of {totalUsers} users | Page {currentPage} of {lastPage}
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
          <p style={{ color: '#666', margin: 0 }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>👥 Users Management</h2>
          <button 
            className="btn btn-primary"
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
          >
            + Add User
          </button>
        </div>

        {/* Search Bar - Updated for ID search */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by user ID, name, email, or phone..."
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
              fetchAllUsers();
            }}>
              🔄 Show All
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            💡 Search tip: You can search by User ID, name, email, or phone number
          </div>
        </div>
      </div>

      {/* Edit/Add User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedUser ? `✏️ Edit User #${selectedUser.id}` : '➕ Add New User'}</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {selectedUser && (
                  <div className="form-group">
                    <label>User ID:</label>
                    <input
                      type="text"
                      value={selectedUser.id}
                      disabled
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        color: '#666'
                      }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Full Name: *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email: *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password {selectedUser && '(leave empty to keep current)'}:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength="6"
                    required={!selectedUser}
                  />
                </div>

                <div className="form-group">
                  <label>Role:</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone: *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City: *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address: *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{ height: '80px' }}
                />
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
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : (selectedUser ? 'Update User' : 'Add User')}
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
              <h3>🗑️ Delete User</h3>
              <button className="modal-close" onClick={closeModals}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete user <strong>"{selectedUser?.name}"</strong> (ID: {selectedUser?.id})?
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
        <h3>Users List ({totalUsers})</h3>
        
        {users.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            <p>No users found</p>
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
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>#{user.id}</strong></td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: user.role === 'admin' ? '#e74c3c' : '#3498db',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.city}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" onClick={() => handleEdit(user)}>Edit</button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => openDeleteModal(user)}
                          disabled={user.role === 'admin'}
                        >
                          Delete
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
            max-width: 600px;
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

export default UsersManagement;