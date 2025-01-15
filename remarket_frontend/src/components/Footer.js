// remarket_frontend/src/components/Footer.js
import React from 'react';
import Link from 'next/link';

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
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-service">Terms of Servic</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2023 My Application. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;