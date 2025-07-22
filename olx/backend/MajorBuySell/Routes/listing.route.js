const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");
const listingController = require("../Controllers/listing.controller");

// Create a new listing (requires authentication and image upload)
router.post("/", auth, upload.single("image"), listingController.createListing);

// Get all available listings (public)
router.get("/", listingController.getAllListings);

// Get all listings posted by the logged-in user
router.get("/my-ads", auth, listingController.getMyListings);

// Get a specific listing by ID (public)
router.get("/:id", listingController.getListingById);

// Delete a specific listing by ID (requires authentication)
router.delete("/:id", auth, listingController.deleteListing);

// Update a specific listing by ID (requires authentication)
router.put("/:id", auth, listingController.updateListing);

module.exports = router;
