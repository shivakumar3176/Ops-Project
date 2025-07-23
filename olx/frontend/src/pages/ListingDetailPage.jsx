import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import '../App.css';

function ListingDetailPage() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

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
  
  const handleNewReview = () => {
    setHasReviewed(true);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!listing) return <p>Listing not found.</p>;
  
  const isSeller = user && listing.postedBy && user.id === listing.postedBy._id;

  return (
    <>
      <div className="detail-container">
        <img src={listing.image} alt={listing.name} className="detail-image" />
        <div className="detail-info">
          <h1>{listing.name}</h1>
          <p className="detail-price">₹{listing.price}</p>
          <p><strong>Brand:</strong> {listing.brand || 'N/A'}</p>
          <p><strong>Condition:</strong> {listing.condition}</p>
          <p><strong>Seller:</strong> {listing.postedBy ? listing.postedBy.name : 'Unknown'}</p>
          <hr />
          <h3>Description</h3>
          <p>{listing.description}</p>

          {/* Contact Seller Button and Info */}
          {user && !isSeller && (
            <div className="contact-section">
              {/* Add your contact seller logic/button here if you want */}
            </div>
          )}
        </div>
      </div>

      {/* --- Review Form Logic --- */}
      {user && !isSeller && !hasReviewed && (
        <ReviewForm listingId={listing._id} onReviewSubmit={handleNewReview} />
      )}
    </>
  );
}

export default ListingDetailPage;