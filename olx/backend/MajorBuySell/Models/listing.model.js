const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Vehicles', 'Electronics', 'Smartphones', 'Laptops', 'Books', 'Gaming', 'Other'], required: true },
  condition: { type: String, enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
  brand: { type: String },
  dateOfPurchase: { type: Date },
  distanceCovered: { type: Number },
  sarValue: { type: String },
  isSwappable: { type: Boolean, default: false },
  isAuction: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;