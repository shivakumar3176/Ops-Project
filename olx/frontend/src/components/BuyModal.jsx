import React, { useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import '../App.css';

function BuyModal({ listingId, onClose }) {
  const [pickupAddress, setPickupAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupAddress.trim()) {
      toast.error('Please enter a pickup address.');
      return;
    }
    try {
      await API.post('/orders', { listingId, pickupAddress });
      toast.success('Purchase request sent to the seller!');
      onClose(); // Close the modal on success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Purchase Request</h2>
        <p>Enter your address for the seller to arrange pickup/delivery.</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter your full address..."
            required
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyModal;