import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  // Determine spinner size based on prop
  const getSize = () => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '80px';
      case 'medium':
      default:
        return '50px';
    }
  };

  return (
    <div className="loading-spinner" style={{ 
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Spinner animation */}
      <div 
        style={{
          width: getSize(),
          height: getSize(),
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}
      ></div>
      
      {/* Loading text */}
      <p style={{ color: '#666', margin: 0 }}>{text}</p>
      
      {/* CSS animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;