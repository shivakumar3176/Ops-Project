import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function ListingDetailPage() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New state to control visibility of contact info
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${listingId}`);
        setListing(response.data);
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!listing) return <p>Listing not found.</p>;

  // Check if the current logged-in user is the seller
  const isSeller = user && user.id === listing.postedBy._id;

  return (
    <div className="detail-container">
      <img src={listing.image} alt={listing.name} className="detail-image" />
      <div className="detail-info">
        <h1>{listing.name}</h1>
        <p className="detail-price">₹{listing.price}</p>
        <p><strong>Condition:</strong> {listing.condition}</p>
        <p><strong>Seller:</strong> {listing.postedBy.name}</p>
        <hr />
        <h3>Description</h3>
        <p>{listing.description}</p>

        {/* --- Contact Seller Button and Info --- */}
        {!isSeller && ( // Only show this section if you are NOT the seller
          <div className="contact-section">
            {!showContact ? (
              <button onClick={() => setShowContact(true)} className="contact-btn">
                Contact Seller
              </button>
            ) : (
              <div className="contact-details">
                <h4>Seller Information:</h4>
                <p><strong>Name:</strong> {listing.postedBy.name}</p>
                <p><strong>Email:</strong> {listing.postedBy.email}</p>
                <p><strong>Phone:</strong> {listing.postedBy.phoneNo || 'Not provided'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingDetailPage;