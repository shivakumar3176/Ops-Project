const Listing = require("../Models/listing.model");
const uploadOnCloudinary = require("../Utils/uploadOnCloudinary");

// In listing.controller.js

const createListing = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Get all possible fields from the request body
    const { 
      name, description, category, condition, price, location, 
      brand, dateOfPurchase, distanceCovered, sarValue 
    } = req.body;
    
    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const listing = new Listing({
      name,
      description,
      category,
      condition,
      price,
      location,
      brand,
      dateOfPurchase,
      distanceCovered, // Add new optional field
      sarValue,        // Add new optional field
      image: uploadResult.secure_url,
      postedBy: req.userId,
    });

    await listing.save();
    res.status(201).json({ message: "Listing created", listing });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ isAvailable: true }).populate("postedBy", "name");
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("postedBy", "name");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ postedBy: req.userId });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    // Ensure the person updating is the person who posted it
    if (listing.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "User not authorized to update this listing" });
    }
    // Update the listing with new data from the request body
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.status(200).json({ message: "Listing updated successfully", listing: updatedListing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  deleteListing,
  updateListing,
};