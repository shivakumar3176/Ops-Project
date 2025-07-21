import React, { useState } from 'react';
import API from '../api';

function ReviewForm({ listingId, onReviewSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await API.post('/reviews', {
        rating,
        comment,
        listingId,
      });
      setSuccess('Review submitted successfully!');
      if(onReviewSubmit) onReviewSubmit(response.data.review);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="form-container" style={{marginTop: '40px'}}>
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="rating">Rating (1-5)</label>
        <input 
          type="number" 
          id="rating"
          name="rating" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
          required 
        />
        <textarea 
          name="comment" 
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p style={{color: 'green', textAlign: 'center'}}>{success}</p>}
    </div>
  );
}

export default ReviewForm;