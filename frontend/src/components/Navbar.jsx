import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="top-nav-landing">
      <div className="wrap-landing">
        <Link to="/" className="brand-landing">
          <span className="dot-landing"></span>FleetOps
        </Link>
        <div className="nav-links-landing">
          <a href="#features">Product</a>
          <a href="#how">How it works</a>
          <a href="#dashboard">Dashboard</a>
        </div>
        <div className="nav-cta-landing">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/login" className="btn btn-primary">Get started</Link>
        </div>
      </div>
    </nav>
  );
};
