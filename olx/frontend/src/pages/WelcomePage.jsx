import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1>Welcome to OPS</h1>
      <p>Your Scrap, Someone’s Treasure.</p>
      <Link to="/ads">
        <button className="browse-btn">Browse Products</button>
      </Link>
    </div>
  );
}

export default WelcomePage;