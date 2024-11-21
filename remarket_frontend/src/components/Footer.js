// remarket_frontend/src/components/Footer.js
import React from 'react';
import Link from 'next/link';
import './globals.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>Contact Us</h4>
        <p>Email: contact@example.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
      <div className="footer-section">
        <h4>Follow Us</h4>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <div className="footer-section">
        <h4>Quick Links</h4>
        <Link href="/about"><a>About</a></Link>
        <Link href="/contact"><a>Contact</a></Link>
        <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
        <Link href="/terms-of-service"><a>Terms of Service</a></Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2023 My Application. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;