// remarket_frontend/src/components/NavBar.js
import React from 'react';
import Link from 'next/link';

const NavBar = () => (
  <nav className="navbar">
    <ul>
      <li><Link href="/"><a>Home</a></Link></li>
      <li><Link href="/about"><a>About</a></Link></li>
      <li><Link href="/contact"><a>Contact</a></Link></li>
    </ul>
  </nav>
);

export default NavBar;