import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import ReviewForm from '../components/ReviewForm'; // Import ReviewForm
import '../App.css';

function ListingDetailPage() {
  const { listingId } = useParams();
  const { user } = useAuth(); // Get the currently logged-in user
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // A new state to hide the form after submission
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
  
  const handleNewReview = (review) => {
    // This function is passed to the form to update the UI on success
    setHasReviewed(true);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!listing) return <p>Listing not found.</p>;
  
  // Check if the current user is the seller
  const isSeller = user && user.id === listing.postedBy._id;

  return (
    <>
      <div className="detail-container">
        <img src={listing.image} alt={listing.name} className="detail-image" />
        <div className="detail-info">
          <h1>{listing.name}</h1>
          <p className="detail-price">₹{listing.price}</p>
          <p><strong>Condition:</strong> {listing.condition}</p>
          <p><strong>Category:</strong> {listing.category}</p>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Seller:</strong> {listing.postedBy.name}</p>
          <hr />
          <h3>Description</h3>
          <p>{listing.description}</p>
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