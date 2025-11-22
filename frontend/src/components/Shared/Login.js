// IMPORT SECTION - React, API, and styles
import React, { useState } from 'react';
//import { authAPI } from '../../services/api';  // Authentication API calls

import { authAPI } from '../../services/api/auth.api';
import './Login.css';  // Import component-specific styles

// LOGIN COMPONENT - User authentication form
const Login = ({ onLogin, onSwitchToRegister }) => {
  // STATE MANAGEMENT - Form data and UI states
  const [formData, setFormData] = useState({
    email: '',      // User email input
    password: ''    // User password input
  });
  const [loading, setLoading] = useState(false);      // Loading state during API call
  const [error, setError] = useState('');             // Error message display
  const [showPassword, setShowPassword] = useState(false);  // Password visibility toggle

  // INPUT CHANGE HANDLER - Update form data on user input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value  // Dynamic property update
    });
    setError('');  // Clear errors when user starts typing
  };

  // PASSWORD VISIBILITY TOGGLE - Show/hide password text
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // FORM SUBMISSION HANDLER - Process login request
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    setLoading(true);
    setError('');

    try {
      // API CALL - Send login credentials to server
      const response = await authAPI.login(formData);
      
      // SUCCESS HANDLER - Pass user data to parent component
      onLogin(response.data.user, response.data.token);
      
    } catch (err) {
      // ERROR HANDLER - Display appropriate error message
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      // CLEANUP - Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // COMPONENT RENDER - Login form structure
  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* HEADER SECTION - Welcome message */}
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to your account</p>
        
        {/* ERROR DISPLAY - Show validation/API errors */}
        {error && <div className="login-error">{error}</div>}
        
        {/* LOGIN FORM - Email and password inputs */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* EMAIL INPUT GROUP */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}  // Disable during loading
            />
          </div>
          
          {/* PASSWORD INPUT GROUP - With visibility toggle */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input password-input"
                disabled={loading}  // Disable during loading
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}  // Disable during loading
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          {/* SUBMIT BUTTON - Login action */}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
        
        {/* REGISTRATION LINK - Switch to register form */}
        <div className="register-section">
          <span className="register-text">Don't have an account?</span>
          <a 
            href="#register" 
            onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToRegister(); 
            }}
            className="register-link"
          >
            Create New Account
          </a>
        </div>
      </div>
    </div>
  );
};

// EXPORT COMPONENT - Default export
export default Login;