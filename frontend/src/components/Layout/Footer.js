import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>E-Store © 2024</p>
        <div style={{ marginTop: '0.5rem' }}>
          <a href="#contact" style={{ color: 'white', margin: '0 0.5rem' }}>Contact Us</a>
          <a href="#terms" style={{ color: 'white', margin: '0 0.5rem' }}>Terms of Service</a>
          <a href="#privacy" style={{ color: 'white', margin: '0 0.5rem' }}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;