import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send login request to API
      const response = await authAPI.login(formData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Call parent component's login handler
      onLogin(response.data.user);
      
      // Redirect to products page
      navigate('/products');
      
    } catch (error) {
      // Handle login errors
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to Your Account</h2>
        
        {/* Error Message Display */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
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
          <div className="login-form-group login-password-group">
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
              className="login-password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Registration Link */}
        <p className="login-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;