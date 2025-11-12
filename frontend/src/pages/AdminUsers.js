import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import Loading from '../components/Loading';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    city: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error fetching users:', error);
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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      address: '',
      city: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Remove password if not changing it
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await usersAPI.update(editingUser.id, updateData);
        alert('User updated successfully!');
      } else {
        await usersAPI.create(formData);
        alert('User created successfully!');
      }

      resetForm();
      fetchUsers(); // Refresh the list
    } catch (error) {
      setError('Failed to save user');
      console.error('Error saving user:', error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || ''
    });
    setShowForm(true);
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } catch (error) {
        setError('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">
        {/* Page Header */}
        <div className="admin-users-header">
          <h1>Manage Users</h1>
          <button
            onClick={() => setShowForm(true)}
            className="add-user-btn"
          >
            + Add New User
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

        {/* User Form */}
        {(showForm || editingUser) && (
          <div className="user-form-overlay">
            <div className="user-form">
              <div className="form-header">
                <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={resetForm} className="close-form">×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Password {!editingUser && '*'}
                    {editingUser && <span className="optional">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
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
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="users-table-container">
          {users.length > 0 ? (
            <div className="users-table">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Phone</span>
                <span>City</span>
                <span>Actions</span>
              </div>
              
              <div className="table-body">
                {users.map(user => (
                  <div key={user.id} className="table-row">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                    <span className={`user-role ${user.role}`}>
                      {user.role}
                    </span>
                    <span className="user-phone">{user.phone || 'N/A'}</span>
                    <span className="user-city">{user.city || 'N/A'}</span>
                    <div className="user-actions">
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete-btn"
                        disabled={user.role === 'admin'} // Prevent deleting admin users
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-users">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;