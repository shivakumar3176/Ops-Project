import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner.jsx';
import ReviewForm from '../components/ReviewForm';
import BuyModal from '../components/BuyModal'; // Import the new modal
import '../App.css';

function ListingDetailPage() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

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
  };

  if (loading) return <Spinner />;
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

          {/* --- Buy Now Button --- */}
          {user && !isSeller && listing.isAvailable && (
            <button onClick={() => setIsModalOpen(true)} className="buy-now-btn">
              Buy Now
            </button>
          )}
          {!listing.isAvailable && <p className="sold-out-message">This item is no longer available.</p>}
        </div>
      </div>

      {/* --- Review Form Logic --- */}
      {user && !isSeller && !hasReviewed && (
        <ReviewForm listingId={listing._id} onReviewSubmit={handleNewReview} />
      )}

      {/* --- Render the Modal --- */}
      {isModalOpen && (
        <BuyModal listingId={listing._id} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default ListingDetailPage;