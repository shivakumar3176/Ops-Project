import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function EmptyState({ title, message, buttonText, buttonLink }) {
  return (
    <div className="empty-state-container">
      <h2>{title}</h2>
      <p>{message}</p>
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="browse-btn" style={{ textDecoration: 'none' }}>
          {buttonText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;