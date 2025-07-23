import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import API from '../api';
import '../App.css';

function MyAdsPage() {
  const [myListings, setMyListings] = useState([]);
  const [error, setError] = useState('');

  const fetchMyListings = async () => {
    try {
      const response = await API.get('/products/my-ads');
      setMyListings(response.data);
    } catch (err) {
      setError('Could not fetch your ads.');
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await API.delete(`/products/${listingId}`);
        fetchMyListings(); // Refetch the listings after one is deleted
      } catch (err) {
        setError('Failed to delete ad.');
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>My Products</h1>
      <div className="product-grid">
        {myListings.length > 0 ? (
          myListings.map(listing => (
            <div key={listing._id} className="product-card">
              <img src={listing.image} alt={listing.name} />
              <h3>{listing.name}</h3>
              <p className="product-price">₹{listing.price}</p>
              <p className="product-location">{listing.location}</p>
              
              {/* Container for Edit and Delete buttons */}
              <div className="card-buttons">
                <Link to={`/edit-ad/${listing._id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button onClick={() => handleDelete(listing._id)} className="delete-button">
                  Delete
                </button>
              </div>

            </div>
          ))
        ) : (
          <p style={{textAlign: 'center'}}>You haven't posted any items yet.</p>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default MyAdsPage;