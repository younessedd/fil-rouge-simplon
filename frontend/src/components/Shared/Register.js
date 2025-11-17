import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    city: ''
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
      const response = await authAPI.register(formData);
      onSwitchToLogin();
      alert('Account created successfully! You can now login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2 className="text-center">Create New Account</h2>
      
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
          <label>Full Name: *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address: *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />
        </div>
        
        <div className="form-group">
          <label>Password: *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Enter your password (min. 6 characters)"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password: *</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>
        
        <div className="form-group">
          <label>Phone Number: *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="form-group">
          <label>Address: *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your complete address"
            style={{ height: '80px' }}
          />
        </div>
        
        <div className="form-group">
          <label>City: *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Enter your city"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="text-center mt-2">
        <span>Already have an account? </span>
        <a 
          href="#login" 
          onClick={(e) => { 
            e.preventDefault(); 
            onSwitchToLogin(); 
          }}
          style={{ color: '#3498db', textDecoration: 'none' }}
        >
          Login Here
        </a>
      </div>
    </div>
  );
};

export default Register;