// remarket_frontend/src/components/NavBar.js
import React from 'react';
import Link from 'next/link';

const NavBar = () => (
  <nav className="navbar">
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/about">About</Link></li>
      <li><Link href="/contact">Contact</Link></li>
    </ul>
  </nav>
);

export default NavBar;