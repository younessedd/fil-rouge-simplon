import React from 'react';
import './LoadingSpinner.css'; // Import CSS file

// LOADING SPINNER COMPONENT - Reusable loading indicators with multiple variants
const LoadingSpinner = ({ 
  size = 'medium',           // Size variant: 'small', 'medium', 'large'
  color = 'primary',         // Color variant: 'primary', 'secondary', 'success', 'warning', 'danger'
  text = 'Loading...',       // Loading text to display
  variant = 'spinner',       // Animation variant: 'spinner', 'dots', 'pulse'
  overlay = false           // Whether to show as overlay
}) => {
  // SPINNER CLASS GENERATOR - Create CSS classes based on props
  const getSpinnerClass = () => {
    return `spinner spinner-${size} spinner-${color}`;
  };

  // TEXT CLASS GENERATOR - Create text CSS classes based on size
  const getTextClass = () => {
    return `loading-text loading-text-${size}`;
  };

  // VARIANT RENDERER - Render different loading animation types
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        // Dots animation variant - animated text dots
        return (
          <div className="dots-loader">
            <span className={getTextClass()}>{text}</span>
          </div>
        );
      
      case 'pulse':
        // Pulse animation variant - fading animation
        return (
          <>
            <div className={`spinner-pulse spinner-${size} spinner-${color}`}></div>
            <p className={getTextClass()}>{text}</p>
          </>
        );
      
      case 'spinner':
      default:
        // Default spinner variant - rotating animation
        return (
          <>
            <div className={getSpinnerClass()}></div>
            <p className={getTextClass()}>{text}</p>
          </>
        );
    }
  };

  // CONTAINER CLASS GENERATOR - Determine main container styling
  const containerClass = overlay 
    ? `loading-overlay loading-overlay-${color}`
    : 'loading-spinner';

  // MAIN COMPONENT RENDER - Loading indicator interface
  return (
    <div 
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      {renderSpinner()}
    </div>
  );
};

export default LoadingSpinner;