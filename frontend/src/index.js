// REACT CORE IMPORTS - Essential dependencies
import React from 'react';                    // Main React library for component creation
import ReactDOM from 'react-dom/client';      // DOM rendering for web browsers
import App from './App';                      // Root application component

// ROOT CONTAINER INITIALIZATION - Modern React 18 pattern
const root = ReactDOM.createRoot(document.getElementById('root'));
// Creates React root container for rendering
// Targets HTML element with id="root" from public/index.html
// Enables concurrent features and better performance

// APPLICATION RENDERING - Main render method
root.render(
  <React.StrictMode>    {/* Development tool for identifying potential problems */}
    <App />              {/* Renders the main App component as root */}
  </React.StrictMode>
);