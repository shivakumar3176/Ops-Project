import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; 

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ads?search=${query}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">OPS</Link>
        
        <form onSubmit={handleSearch} className="nav-search-form">
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search for items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="nav-search-button">Search</button>
        </form>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/ads">All Products</Link>
          {token ? (
            <>
              <Link to="/create-ad" className="post-ad-btn">Post Product</Link>
              <Link to="/my-ads">My Products</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-nav-links">
          <Link to="/ads" onClick={() => setIsMenuOpen(false)}>All Products</Link>
          {token ? (
            <>
              <Link to="/create-ad" onClick={() => setIsMenuOpen(false)}>Post Product</Link>
              <Link to="/my-ads" onClick={() => setIsMenuOpen(false)}>My Products</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;