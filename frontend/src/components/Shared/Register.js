// IMPORT SECTION - React, API, and styles
import React, { useState } from 'react';
import { authAPI } from '../../services/api';  // Authentication API calls
import './Register.css';  // Import component-specific styles

// REGISTER COMPONENT - User registration form with validation
const Register = ({ onSwitchToLogin }) => {
  // STATE MANAGEMENT - Form data and UI states
  const [formData, setFormData] = useState({
    name: '',                    // User's full name
    email: '',                   // User's email address
    password: '',                // User's password
    password_confirmation: '',   // Password confirmation
    phone: '',                   // User's phone number
    address: '',                 // User's physical address
    city: ''                     // User's city
  });
  const [loading, setLoading] = useState(false);              // Loading state during API call
  const [error, setError] = useState('');                     // Error message display
  const [showPassword, setShowPassword] = useState(false);    // Password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // Confirm password visibility

  // INPUT CHANGE HANDLER - Update form data on user input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value  // Dynamic property update
    });
    setError('');  // Clear errors when user starts typing
  };

  // PASSWORD VISIBILITY TOGGLES - Show/hide password fields
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // PASSWORD STRENGTH CALCULATOR - Evaluate password security
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: '', width: '0%' };
    if (password.length < 6) return { strength: 'weak', width: '33%' };
    if (password.length < 10) return { strength: 'medium', width: '66%' };
    return { strength: 'strong', width: '100%' };
  };

  // PASSWORD VALIDATION - Check if passwords match
  const passwordsMatch = formData.password === formData.password_confirmation;
  const passwordStrength = getPasswordStrength(formData.password);

  // FORM SUBMISSION HANDLER - Process registration request
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    setLoading(true);
    setError('');

    // CLIENT-SIDE VALIDATION - Check password requirements
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // API CALL - Send registration data to server
      const response = await authAPI.register(formData);
      
      // SUCCESS HANDLER - Redirect to login page
      onSwitchToLogin();
      console.log('Account created successfully! You can now login.');
      
    } catch (err) {
      // ERROR HANDLER - Display appropriate error message
      setError(err.response?.data?.message || 'Account creation failed. Please try again.');
    } finally {
      // CLEANUP - Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // COMPONENT RENDER - Registration form structure
  return (
    <div className="register-container">
      <div className="register-card">
        
        {/* HEADER SECTION - Welcome message */}
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">Join our e-store community today</p>
        
        {/* ERROR DISPLAY - Show validation/API errors */}
        {error && <div className="register-error">{error}</div>}
        
        {/* REGISTRATION FORM - Complete user information */}
        <form onSubmit={handleSubmit} className="register-form">
          
          {/* FULL NAME INPUT */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
              disabled={loading}
            />
          </div>
          
          {/* EMAIL INPUT */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="form-input"
              disabled={loading}
            />
          </div>
          
          {/* PASSWORD INPUT WITH STRENGTH INDICATOR */}
          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter your password (min. 6 characters)"
                className="form-input password-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* PASSWORD STRENGTH VISUALIZATION */}
            {formData.password && (
              <div className={`password-strength strength-${passwordStrength.strength}`}>
                <span>Strength: {passwordStrength.strength}</span>
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* CONFIRM PASSWORD INPUT WITH MATCH INDICATOR */}
          <div className="form-group">
            <label className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="form-input password-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* PASSWORD MATCH VISUALIZATION */}
            {formData.password_confirmation && (
              <div className={`password-match ${passwordsMatch ? 'matching' : 'not-matching'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>
          
          {/* PHONE NUMBER INPUT */}
          <div className="form-group">
            <label className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="form-input"
              disabled={loading}
            />
          </div>
          
          {/* ADDRESS TEXTAREA */}
          <div className="form-group">
            <label className="form-label">
              Address <span className="required">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your complete address"
              className="form-input form-textarea"
              rows="3"
              disabled={loading}
            />
          </div>
          
          {/* CITY INPUT */}
          <div className="form-group">
            <label className="form-label">
              City <span className="required">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
              className="form-input"
              disabled={loading}
            />
          </div>
          
          {/* SUBMIT BUTTON - Registration action */}
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {/* LOGIN LINK SECTION - Switch to login form */}
        <div className="login-section">
          <span className="login-text">Already have an account?</span>
          <a 
            href="#login" 
            onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToLogin(); 
            }}
            className="login-link"
          >
            Login Here
          </a>
        </div>
      </div>
    </div>
  );
};

// EXPORT COMPONENT - Default export
export default Register;