const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  listing: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing', 
    required: true 
  },
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pickupAddress: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'requested'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;