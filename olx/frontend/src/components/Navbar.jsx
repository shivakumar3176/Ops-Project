// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; 

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>
        OPS
      </Link>
      <div className="nav-links">
        <Link to="/ads">All Ads</Link>
        {token ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/create-ad" className="post-ad-btn">Post Ad</Link>
            <Link to="/my-ads">My Ads</Link>
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