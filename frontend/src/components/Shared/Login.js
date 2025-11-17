import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center">Login to Your Account</h2>
      
      {/* Error message display */}
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#ffeaea',
          border: '1px solid #ffcccc',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </form>
      
      <div className="text-center mt-2">
        <span>Don't have an account? </span>
        <a 
          href="#register" 
          onClick={(e) => { 
            e.preventDefault(); 
            onSwitchToRegister(); 
          }}
          style={{ color: '#3498db', textDecoration: 'none' }}
        >
          Create New Account
        </a>
      </div>
    </div>
  );
};

export default Login;