import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../App.css';

function HomePage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.get('/products');
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>All Products</h1>
      <div className="product-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <Link to={`/ads/${listing._id}`} key={listing._id} className="product-card-link">
              <div className="product-card">
                <img src={listing.image} alt={listing.name} />
                <h3>{listing.name}</h3>
                <p className="product-price">₹{listing.price}</p>
                <p className="product-location">{listing.location}</p>
              </div>
            </Link>
          ))
        ) : (
          <p style={{textAlign: 'center'}}>No products found. Post an ad to see it here!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;