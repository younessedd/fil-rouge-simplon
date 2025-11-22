// REACT IMPORT - Core React library for component creation
import React from 'react';
import './Footer.css';  // Import component-specific CSS styles

// FOOTER COMPONENT - Application footer with company information and links
const Footer = () => {
  return (
    <footer className="footer">
      
      {/* MAIN FOOTER CONTAINER - Centers and constrains content */}
      <div className="container">
        
        {/* COPYRIGHT SECTION - Legal and branding information */}
        <p>E‑Store © 2024</p>  {/* Current year copyright notice */}

        {/* ADDITIONAL INFORMATION GRID - Company details and support */}
        <div className="footer-info">
          
          {/* ABOUT US SECTION - Company description and mission */}
          <div className="info-section">
            <h4>About Us</h4>  {/* Section title */}
            <p>
              Your trusted online store for quality products and excellent service.
              {/* Company mission statement and value proposition */}
            </p>
          </div>

          {/* CUSTOMER SERVICE SECTION - Support contact information */}
          <div className="info-section">
            <h4>Customer Service</h4>  {/* Support section title */}
            <p>
              Email: support@estore.com<br />  {/* Customer support email address */}
              Phone: (555) 123‑4567           {/* Customer support phone number */}
            </p>
          </div>

         
          
        </div>
      </div>
    </footer>
  );
};

// DEFAULT EXPORT - Make component available for import in other files
export default Footer;