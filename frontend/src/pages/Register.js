import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    city: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if passwords match
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Send registration request to API
      const response = await authAPI.register(formData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Call parent component's login handler
      onLogin(response.data.user);
      
      // Redirect to products page
      navigate('/products');
      
    } catch (error) {
      // Handle registration errors
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create New Account</h2>
        
        {/* Error Message Display */}
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="register-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          {/* Password Field with Show/Hide Toggle */}
          <div className="register-form-group register-password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button 
              type="button"
              className="register-password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          {/* Confirm Password Field with Show/Hide Toggle */}
          <div className="register-form-group register-password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button 
              type="button"
              className="register-password-toggle"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <div className="register-form-group">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="register-form-group">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="register-form-group">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="register-button"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        {/* Login Link */}
        <p className="register-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;