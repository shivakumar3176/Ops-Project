const Review = require('../Models/review.model');
const Listing = require('../Models/listing.model');
const User = require('../Models/user.model');

const createReview = async (req, res) => {
  try {
    const { rating, comment, listingId } = req.body;
    const reviewerId = req.userId;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const revieweeId = listing.postedBy;

    if (reviewerId.toString() === revieweeId.toString()) {
      return res.status(400).json({ message: "You cannot review your own listing." });
    }

    const review = new Review({
      rating,
      comment,
      listing: listingId,
      reviewer: reviewerId,
      reviewee: revieweeId,
    });
    await review.save();

    // --- NEW LOGIC: Recalculate Average Rating ---
    const revieweeUser = await User.findById(revieweeId).populate('reviews');
    const reviews = revieweeUser.reviews;
    
    // Add the new review to the list for calculation
    reviews.push(review);

    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = totalRating / reviews.length;

    // Update the user with the new review and the new average rating
    revieweeUser.averageRating = averageRating;
    revieweeUser.reviews = reviews.map(r => r._id); // Make sure we're just saving IDs
    await revieweeUser.save();
    // --- END NEW LOGIC ---

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createReview };