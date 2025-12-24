// IMPORT SECTION - React, API, and styles
import React, { useState, useRef } from 'react';
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
  const [fieldErrors, setFieldErrors] = useState({}); // Field-specific errors (email, password)
  const [showPassword, setShowPassword] = useState(false);  // Password visibility toggle
  // Refs to focus inputs when there are errors
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // INPUT CHANGE HANDLER - Update form data on user input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value  // Dynamic property update
    });
    setError('');  // Clear general errors when user starts typing
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' })); // Clear field error for this input
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
      const apiResponse = err.response?.data;
      const validationErrors = apiResponse?.errors;

      // Reset field errors
      setFieldErrors({});

      if (validationErrors) {
        // Map validation errors to fieldErrors state
        const mapped = Object.keys(validationErrors).reduce((acc, key) => {
          acc[key] = validationErrors[key][0];
          return acc;
        }, {});

        setFieldErrors(mapped);
        setError(mapped[Object.keys(mapped)[0]] || 'Please fix the highlighted fields');

        // Focus first invalid input
        const first = Object.keys(mapped)[0];
        if (first === 'email' && emailRef.current) emailRef.current.focus();
        if (first === 'password' && passwordRef.current) passwordRef.current.focus();
      } else if (apiResponse?.message) {
        // Specific server messages - normalize and map to friendly messages
        let msg = apiResponse.message || '';

        // Normalize common prefixes (e.g., "AUTH_REQUIRED: ...", "NOT_FOUND: ...", "VALIDATION_ERROR: ...")
        msg = msg.replace(/^\s*(AUTH_REQUIRED|NOT_FOUND|VALIDATION_ERROR)\s*[:\-]?\s*/i, '');

        // Map unauthenticated/authorization messages to a friendly message
        if (/unauthenticated|auth_required|please log in to access/i.test(apiResponse.message)) {
          msg = 'Please log in to access this resource.';
        }

        msg = msg.trim();

        // If the message clearly indicates the email is not registered, show the message, focus email and open register view
        if (/not registered|no account|does not exist|not found/i.test(msg) && /email/i.test(msg)) {
          setFieldErrors({ email: msg });
          setError(msg);
          if (emailRef.current) emailRef.current.focus();
          if (typeof onSwitchToRegister === 'function') {
            setTimeout(() => onSwitchToRegister(), 900);
          }

        } else if (/email/i.test(msg)) {
          setFieldErrors({ email: msg });
          setError(msg);
          if (emailRef.current) emailRef.current.focus();

        } else if (/password/i.test(msg)) {
          setFieldErrors({ password: msg });
          setError(msg);
          if (passwordRef.current) passwordRef.current.focus();

        } else {
          // Generic server message shown in subtitle
          setError(msg || 'Login failed. Please try again.');
        }
      } else if (err.message) {
        // Network or unexpected error
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
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
        <h2 className="login-title">Welcome to I Smell Shop</h2>
        {/* Subtitle shows instructions or inline error messages when login fails */}
        <p className={`login-subtitle ${error ? 'login-subtitle-error' : ''}`} aria-live="polite">{error || 'Sign in to your account'}</p>
        
        {/* LOGIN FORM - Email and password inputs */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* EMAIL INPUT GROUP */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}  // Disable during loading
            />
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>
          
          {/* PASSWORD INPUT GROUP - With visibility toggle */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                ref={passwordRef}
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
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>
          
          {/* SUBMIT BUTTON - Login action */}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login to I Smell Shop'}
          </button>
        </form>
        
        {/* REGISTRATION LINK - Switch to register form */}
        <div className="register-section">
          <span className="register-text">New to I Smell Shop?</span>
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