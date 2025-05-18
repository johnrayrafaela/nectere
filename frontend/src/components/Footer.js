import React from 'react';
import "../styles/Footer.css"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content wide">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li><span>Our Story</span></li>
              <li><span>Our Team</span></li>
              <li><span>Testimonials</span></li>
              <li><span>Careers</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><span>Auto Maintenance</span></li>
              <li><span>Repair Services</span></li>
              <li><span>Diagnostics</span></li>
              <li><span>Premium Care</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><span>FAQs</span></li>
              <li><span>Contact Us</span></li>
              <li><span>Service Centers</span></li>
              <li><span>Schedule Service</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><span>Facebook</span></li>
              <li><span>Twitter</span></li>
              <li><span>Instagram</span></li>
              <li><span>YouTube</span></li>
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copy">&copy; {new Date().getFullYear()} NECTURE. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;