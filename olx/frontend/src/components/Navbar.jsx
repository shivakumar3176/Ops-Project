import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; 

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ads?search=${query}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>
        OPS
      </Link>

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

      <div className="nav-links">
        <Link to="/ads">All Products</Link>
        {token ? (
          <>
            <Link to="/create-ad" className="post-ad-btn">Post Ad</Link>
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
    </nav>
  );
}

export default Navbar;