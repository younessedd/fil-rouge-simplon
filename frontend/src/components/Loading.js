import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      {/* Loading spinner animation */}
      <div className="loading-spinner"></div>
      {/* Loading text */}
      <p>Loading...</p>
    </div>
  );
};

export default Loading;