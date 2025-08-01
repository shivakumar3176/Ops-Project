const Listing = require("../Models/listing.model");
const uploadOnCloudinary = require("../Utils/uploadOnCloudinary");

const createListing = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const {
      name, description, category, condition, price, location,
      brand, dateOfPurchase, distanceCovered, sarValue
    } = req.body;

    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const listing = new Listing({
      name, description, category, condition, price, location,
      brand, dateOfPurchase, distanceCovered, sarValue,
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
    // Start with a base query
    const query = { isAvailable: true };

    // Add filters from the request query if they exist
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    const listings = await Listing.find(query).populate("postedBy", "name");
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("postedBy", "name email phoneNo");

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
    if (listing.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "User not authorized to update this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
