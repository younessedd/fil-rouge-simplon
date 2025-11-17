import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      {/* Profile Header */}
      <div className="card mb-2">
        <h2>👤 My Profile</h2>
        <p style={{ color: '#666', margin: 0 }}>Manage your personal information</p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {/* Personal Information */}
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #3498db' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>Full Name:</div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user.name}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>Email Address:</div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user.email}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>Account Role:</div>
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: user.role === 'admin' ? '#ffeaa7' : '#e8f4fd', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: user.role === 'admin' ? '#e67e22' : '#3498db'
                }}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #27ae60' }}>
              Contact Information
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>Phone Number:</div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user.phone || 'Not provided'}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>City:</div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user.city || 'Not provided'}
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '0.25rem' }}>Registration Date:</div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
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

        {/* Address Section */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e74c3c' }}>
            Address
          </h3>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', minHeight: '80px' }}>
            {user.address || 'No address provided'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;