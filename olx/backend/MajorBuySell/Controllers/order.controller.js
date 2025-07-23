const Order = require('../Models/order.model');
const Listing = require('../Models/listing.model');

const createOrder = async (req, res) => {
  try {
    const { listingId, pickupAddress } = req.body;
    const buyerId = req.userId; // from auth middleware

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.isAvailable) {
        return res.status(400).json({ message: 'This item is no longer available.' });
    }

    const sellerId = listing.postedBy;

    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: "You cannot buy your own item." });
    }

    const order = new Order({
      listing: listingId,
      buyer: buyerId,
      seller: sellerId,
      pickupAddress,
    });

    await order.save();

    // Mark the listing as no longer available
    listing.isAvailable = false;
    await listing.save();

    res.status(201).json({ message: 'Your purchase request has been sent to the seller.', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder };