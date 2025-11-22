// REACT IMPORTS - Core React functionality and state management hooks
import React, { useState, useEffect } from 'react';
//import { usersAPI } from '../../services/api';  // API service for user operations
import './UserProfile.css';  // Component-specific styles
import { usersAPI } from '../../services/api/users.api';

// USER PROFILE COMPONENT - User profile management and editing interface
const UserProfile = ({ user, onViewChange, showNotification }) => {
  // STATE MANAGEMENT - Component state variables
  const [isEditing, setIsEditing] = useState(false);  // Edit mode toggle
  const [loading, setLoading] = useState(false);      // Loading state for API calls
  const [formData, setFormData] = useState({          // Form data state
    name: '',
    email: '',
    phone: '',
    city: '',
    address: ''
  });

  // EFFECT HOOK - Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',        // User's full name
        email: user.email || '',      // User's email address
        phone: user.phone || '',      // User's phone number
        city: user.city || '',        // User's city
        address: user.address || ''   // User's full address
      });
    }
  }, [user]);  // Dependency array - runs when user object changes

  // INPUT CHANGE HANDLER - Update form data on user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;  // Extract field name and value
    setFormData(prev => ({
      ...prev,        // Spread previous state
      [name]: value   // Update specific field
    }));
  };

  // SAVE PROFILE HANDLER - Validate and save profile changes
  const handleSave = async () => {
    try {
      setLoading(true);  // Start loading state
      
      // VALIDATION - Check required fields
      if (!formData.name.trim() || !formData.email.trim()) {
        showNotification('Name and email are required', 'error');
        return;
      }

      // EMAIL VALIDATION - Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // DATA PREPARATION - Clean and format data for API
      const updateData = {
        name: formData.name.trim(),        // Trim whitespace from name
        email: formData.email.trim(),      // Trim whitespace from email
        phone: formData.phone.trim() || '',      // Optional phone
        city: formData.city.trim() || '',        // Optional city
        address: formData.address.trim() || ''   // Optional address
      };

      // API CALL - Update user profile via usersAPI service
      const response = await usersAPI.updateProfile(updateData);
      
      // SUCCESS HANDLING - Process successful response
      if (response.data && response.data.user) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        showNotification('Profile updated successfully!', 'success');
        setIsEditing(false);  // Exit edit mode
        
        // Refresh application to reflect changes globally
        window.location.reload();
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      // ERROR HANDLING - Process different error types
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      // Specific error message handling
      if (error.message.includes('VALIDATION_ERROR')) {
        errorMessage = error.message.replace('VALIDATION_ERROR: ', '');
      } else if (error.message.includes('AUTH_REQUIRED')) {
        errorMessage = 'Please log in again to update your profile.';
      } else if (error.message.includes('NOT_FOUND')) {
        errorMessage = 'Profile endpoint not found. Please check the server.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);  // End loading state regardless of outcome
    }
  };

  // CANCEL EDIT HANDLER - Reset form and exit edit mode
  const handleCancel = () => {
    setFormData({
      name: user.name || '',        // Reset to original user data
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      address: user.address || ''
    });
    setIsEditing(false);  // Exit edit mode
  };

  // USER NOT FOUND STATE - Handle missing user data
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>User Not Found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // COMPONENT RENDER - Main profile interface
  return (
    <div className="profile-container">
      
      {/* PROFILE HEADER SECTION - Title and action buttons */}
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>  {/* Main profile title */}
          <p>Manage your personal information</p>  {/* Subtitle */}
        </div>
        <div className="header-actions">
          {/* CONDITIONAL BUTTONS - Edit mode vs view mode */}
          {!isEditing ? (
            <button 
              className="btn-primary"
              onClick={() => setIsEditing(true)}  // Enter edit mode
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn-secondary"
                onClick={handleCancel}  // Cancel editing
                disabled={loading}      // Disable during loading
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSave}    // Save changes
                disabled={loading}      // Disable during loading
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE INFORMATION CARD - Main content area */}
      <div className="profile-card">
        
        {/* PROFILE GRID LAYOUT - Two-column responsive grid */}
        <div className="profile-grid">
          
          {/* PERSONAL INFORMATION SECTION - User identity data */}
          <div className="profile-section">
            <h3 className="section-title personal-title">
              Personal Information
            </h3>
            <div className="form-grid">
              
              {/* FULL NAME FIELD */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                ) : (
                  <div className="form-display">
                    {user.name || 'Not provided'}
                  </div>
                )}
              </div>
              
              {/* EMAIL ADDRESS FIELD */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                  />
                ) : (
                  <div className="form-display">
                    {user.email}
                  </div>
                )}
              </div>
              
              {/* ACCOUNT ROLE DISPLAY - Read-only role information */}
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <div className={`role-display ${user.role}`}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION SECTION - User contact details */}
          <div className="profile-section">
            <h3 className="section-title contact-title">
              Contact Information
            </h3>
            <div className="form-grid">
              
              {/* PHONE NUMBER FIELD */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                ) : (
                  <div className="form-display">
                    {user.phone || 'Not provided'}
                  </div>
                )}
              </div>
              
              {/* CITY FIELD */}
              <div className="form-group">
                <label className="form-label">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your city"
                    disabled={loading}
                  />
                ) : (
                  <div className="form-display">
                    {user.city || 'Not provided'}
                  </div>
                )}
              </div>
              
              {/* REGISTRATION DATE DISPLAY - Read-only account creation date */}
              <div className="form-group">
                <label className="form-label">Registration Date</label>
                <div className="form-display">
                  {new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADDRESS SECTION - Full address text area */}
        <div className="profile-section">
          <h3 className="section-title address-title">
            Address
          </h3>
          <div className="form-group-full">
            <label className="form-label">Full Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter your full address"
                rows="3"
                disabled={loading}
              />
            ) : (
              <div className="form-display address-display">
                {user.address || 'No address provided'}
              </div>
            )}
          </div>
        </div>

        {/* EDIT MODE TIPS - Helpful information during editing */}
        {isEditing && (
          <div className="edit-tips">
            <p><strong>Note:</strong> Name and email fields are required.</p>
            <p>Your changes will be saved to the database.</p>
            {loading && (
              <p className="saving-indicator">
                Saving your changes...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default UserProfile;